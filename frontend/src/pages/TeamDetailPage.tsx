import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { positionLimits } from "@/constants/constants";
import { formatMoney } from "@/utils/formatMoney";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

import { fetchFromApi } from "@/utils/apiUtils";


// Função para importar logo pelo teamId
const getTeamLogo = (teamId: string) => {
  try {
    return new URL(`/src/assets/logos/${teamId}.png`, import.meta.url).href;
  } catch {
    /* @vite-ignore */
    return new URL(`/src/assets/logos/genericlogo.png`, import.meta.url).href;
  }
};

const TeamDetailPage = () => {
  const { teamId } = useParams();
  const [team, setTeam] = useState<any>(null);
  const [roster, setRoster] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true);
      try {
        const [teams, players] = await Promise.all([
          fetchFromApi<any[]>("/teams"),
          fetchFromApi<any[]>("/players"),
        ]);
        if (!teams || !players) {
          setTeam(null);
          setRoster([]);
          setLoading(false);
          return;
        }

        // Função para normalizar slugs (caso-insensível, underscore)
        const norm = (str: string) =>
          (str || "")
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, "");

        // Busca time pelo id OU slug/parte do nome
        const teamData = teams.find(
          (t: any) =>
            norm(t.id) === norm(teamId as string) ||
            norm(t.name).includes(norm(teamId as string)) ||
            norm(t.id).includes(norm(teamId as string))
        );

        setTeam(teamData);

        if (!teamData) {
          setRoster([]);
          setLoading(false);
          return;
        }

        // Filtra jogadores cujo fantasyTeam === nome do time
        const teamRoster = players.filter(
          (p: any) =>
            (p.fantasyTeam || "").toUpperCase().trim() === teamData.name.toUpperCase().trim()
        );
        setRoster(teamRoster);
      } catch (err) {
        setTeam(null);
        setRoster([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId]);

  // Conta jogadores por posição
  const positionCounts: Record<string, number> = {};
  roster.forEach((p) => {
    positionCounts[p.position] = (positionCounts[p.position] || 0) + 1;
  });

  const allPositions = Object.keys(positionLimits);

  // --- Salary by Position (2025) ---
  const salaryByPosition: Record<string, number> = {};
  roster.forEach((p) => {
    salaryByPosition[p.position] = (salaryByPosition[p.position] || 0) + (p.salary || 0);
  });
  const sortedPositionLabels = Object.keys(salaryByPosition).sort(
    (a, b) => salaryByPosition[b] - salaryByPosition[a]
  );

  // --- Salary by Player (2025) ---
  const sortedPlayers = roster.slice().sort((a, b) => b.salary - a.salary);

  if (loading) return <div className="text-center p-8">Carregando…</div>;
  if (!team) return <div className="text-center p-8">Team not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={getTeamLogo(team.id)}
            alt={team.name}
            className="w-12 h-12 rounded-full border border-gray-300 object-contain bg-white"
            style={{ background: "#fff" }}
          />
          <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Cap Space</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(team.capSpace)}</div>
            <p className="text-xs text-muted-foreground">2025 Season</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cap Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(team.capUsed)}</div>
            <p className="text-xs text-muted-foreground">2025 Season</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roster.length}</div>
            <p className="text-xs text-muted-foreground">Total on Roster</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="roster">
        <TabsList>
          <TabsTrigger value="roster">Roster</TabsTrigger>
          <TabsTrigger value="positions">Position Limits</TabsTrigger>
          <TabsTrigger value="salaries">Salary Overview</TabsTrigger>
        </TabsList>

        {/* ROSTER */}
        <TabsContent value="roster" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="text-right">Salary</TableHead>
                    <TableHead>Contract</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roster.map((player, i) => (
                    <TableRow key={player.id || i}>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell>{player.position}</TableCell>
                      <TableCell className="text-right">{formatMoney(player.salary)}</TableCell>
                      <TableCell>{player.contractType}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* POSITION LIMITS */}
        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead className="text-right">Current</TableHead>
                    <TableHead className="text-right">Limit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPositions.map(position => (
                    <TableRow key={position}>
                      <TableCell className="font-medium">{position}</TableCell>
                      <TableCell className="text-right">{positionCounts[position] || 0}</TableCell>
                      <TableCell className="text-right">{positionLimits[position]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SALARY OVERVIEW (2 GRÁFICOS) */}
        <TabsContent value="salaries" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-6">
                <h3 className="text-xl font-semibold">Salary Distribution by Position (2025)</h3>
                <div className="h-[320px] bg-gray-50 rounded-md flex items-center justify-center">
                  {roster.length === 0 ? (
                    <p className="text-gray-500">No data</p>
                  ) : (
                    <Bar
                      data={{
                        labels: sortedPositionLabels,
                        datasets: [
                          {
                            label: "Total Salary (2025)",
                            data: sortedPositionLabels.map((pos) => salaryByPosition[pos]),
                            backgroundColor: "#22d3ee", // cyan
                          },
                        ],
                      }}
                      options={{
                        indexAxis: "y",
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            callbacks: {
                              label: function (context) {
                                const val = context.parsed.x || context.raw;
                                return ` $${(val / 1_000_000).toFixed(1)}M`;
                              },
                            },
                          },
                        },
                        scales: {
                          x: {
                            ticks: {
                              callback: (value) =>
                                `$${(+value / 1_000_000).toFixed(1)}M`,
                            },
                          },
                          y: {
                            ticks: { font: { size: 12 } },
                          },
                        },
                      }}
                      height={300}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">Salary Distribution by Player (2025)</h3>
                <div className="h-[320px] bg-gray-50 rounded-md flex items-center justify-center">
                  {roster.length === 0 ? (
                    <p className="text-gray-500">No data</p>
                  ) : (
                    <Bar
                      data={{
                        labels: sortedPlayers.map((p) => p.name),
                        datasets: [
                          {
                            label: "Salary (2025)",
                            data: sortedPlayers.map((p) => p.salary),
                            backgroundColor: "#2563eb", // azul
                          },
                        ],
                      }}
                      options={{
                        indexAxis: "y",
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            callbacks: {
                              label: function (context) {
                                const val = context.parsed.x || context.raw;
                                return ` $${(val / 1_000_000).toFixed(1)}M`;
                              },
                            },
                          },
                        },
                        scales: {
                          x: {
                            ticks: {
                              callback: (value) =>
                                `$${(+value / 1_000_000).toFixed(1)}M`,
                            },
                          },
                          y: {
                            ticks: { font: { size: 12 } },
                          },
                        },
                      }}
                      height={300}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamDetailPage;

