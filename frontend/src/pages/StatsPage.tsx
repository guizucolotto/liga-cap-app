import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import {
  statPositions,
  statsFieldsByPosition,
  seasons,
} from "@/constants/constants";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const StatsPage = () => {
  const [season, setSeason] = useState("2025");
  const [statsData, setStatsData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/stats`);
        const data = await res.json();
        setStatsData(data);
      } catch (err) {
        console.error("Erro ao buscar estatísticas do backend:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getUniqueTeams = (position: string): string[] => {
    const data = statsData[position] || [];
    const teams = [...new Set(data.map((p) => p.team))].filter(Boolean);
    return teams.sort();
  };

  const renderTable = (position: string) => {
    const fields = statsFieldsByPosition[position] || [];
    let rows = statsData[position] || [];

    rows = rows.filter((p) => {
      const matchName = p.player_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTeam = teamFilter === "all" || p.team === teamFilter;
      return matchName && matchTeam;
    });

    if (rows.length === 0) {
      return <p className="text-muted-foreground">Sem dados disponíveis.</p>;
    }

    return (
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle>{position} Stats</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            <div style={{ minWidth: "1000px", maxHeight: "500px", overflowY: "auto" }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    {fields.map((key) => (
                      <TableHead key={key} className="text-right">
                        {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((player, i) => (
                    <TableRow key={`${player.player_id}-${i}`}>
                      {fields.map((key) => (
                        <TableCell key={key} className="text-right">
                          {typeof player[key] === "number"
                            ? player[key].toFixed(1)
                            : player[key] || "-"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const availablePositions = statPositions.filter(
    (pos) => (statsData[pos] || []).length > 0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Player Statistics</h1>
        <div className="w-[180px]">
          <Select value={season} onValueChange={setSeason}>
            <SelectTrigger>
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue={availablePositions[0]} className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="flex flex-wrap gap-2 min-w-[600px]">
            {availablePositions.map((pos) => (
              <TabsTrigger key={pos} value={pos}>
                {pos}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {availablePositions.map((pos) => (
          <TabsContent key={pos} value={pos} className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <Input
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-1/3"
              />
              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filtrar por time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os times</SelectItem>
                  {getUniqueTeams(pos).map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <p>Carregando...</p>
            ) : (
              renderTable(pos)
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default StatsPage;
