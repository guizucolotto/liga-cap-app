import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_URL } from "@/utils/apiUtils";

const Dashboard = () => {
  const [teamsData, setTeamsData] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<{ AFC: any[]; NFC: any[] }>({ AFC: [], NFC: [] });
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ajuste os endpoints conforme sua API real
        const [teamsRes, scheduleRes] = await Promise.all([
          fetch(`${API_URL}/teams`),
          fetch(`${API_URL}/schedule`)
        ]);
        const teams = await teamsRes.json();
        const schedule = await scheduleRes.json();

        setTeamsData(teams);
        setSchedule(schedule);
      } catch (err) {
        console.error("Erro ao buscar dados do Dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper para pegar as semanas disponíveis
  const weekNumbers = schedule.AFC?.map((w: any) => w.week) || [];
  const maxWeek = Math.max(...(weekNumbers.length ? weekNumbers : [1]));

  // Helper para pegar a semana selecionada por conference
  const getWeek = (conference: "AFC" | "NFC") => {
    return schedule[conference]?.find((w: any) => w.week === selectedWeek);
  };

  // Formata valores para milhões (ex: $123.4M)
  const formatMillions = (value: number) =>
    value >= 1e6 ? `$${(value / 1e6).toFixed(1)}M` : value?.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">2025 Season</span>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salary Cap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$279.2M</div>
            <p className="text-xs text-muted-foreground">2025 NFL Season</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamsData.length > 0 ? teamsData.length : "--"}</div>
            <p className="text-xs text-muted-foreground">NFL Teams</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamsData.length > 0 ? teamsData.length * 53 : "--"}
            </div>
            <p className="text-xs text-muted-foreground">53-man rosters</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Teams by Salary Cap Used */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Teams by Salary Cap Used</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Conference</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead className="text-right">Salary Cap Used</TableHead>
                  <TableHead className="text-right">Cap Space</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...teamsData]
                  .filter(team => team.capUsed !== undefined)
                  .sort((a, b) => b.capUsed - a.capUsed) // Maior para menor
                  .slice(0, 5)
                  .map((team, idx) => (
                    <TableRow key={team.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <Link to={`/teams/${team.id}`} className="font-medium hover:underline">
                          {team.name}
                        </Link>
                      </TableCell>
                      <TableCell>{team.conference}</TableCell>
                      <TableCell>{team.division}</TableCell>
                      <TableCell className="text-right">
                        {formatMillions(team.capUsed)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatMillions(team.capSpace)}
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 text-center">
              <Link to="/teams" className="text-blue-600 hover:underline text-sm">
                View all teams
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming Schedule - AFC/NFC */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
            <div className="mt-2">
              <Select value={String(selectedWeek)} onValueChange={v => setSelectedWeek(Number(v))}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select week" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: maxWeek }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      Week {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["AFC", "NFC"].map((conf) => {
                const weekData = getWeek(conf as "AFC" | "NFC");
                return (
                  <div key={conf}>
                    <h4 className="font-semibold mb-2">{conf}</h4>
                    {weekData && weekData.matchups && weekData.matchups.length > 0 ? (
                      <div className="space-y-2">
                        {weekData.matchups.slice(0, 4).map((matchup: any, idx: number) => (
                          <div key={idx} className="bg-muted p-2 rounded-md text-sm flex items-center justify-between">
                            <span className="font-medium">{matchup.away}</span>
                            <span className="mx-2 font-bold text-nfl-navy">@</span>
                            <span className="font-medium">{matchup.home}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No matchups.</div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-center">
              <Link to="/schedule" className="text-blue-600 hover:underline text-sm">
                View full schedule
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

