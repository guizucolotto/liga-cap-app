import React, { useEffect, useMemo, useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { positions, teams } from "@/constants/constants";
import { API_URL } from "@/utils/apiUtils";

const StatsAll = () => {
  const [allStats, setAllStats] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/stats`);
        const data = await res.json();
        setAllStats(data.ALL || []);
      } catch (err) {
        console.error("Erro ao carregar stats ALL:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => setSearchTerm(e.target.value));
  };

  const handlePositionChange = (value: string) => {
    startTransition(() => setPositionFilter(value));
  };

  const handleTeamChange = (value: string) => {
    startTransition(() => setTeamFilter(value));
  };

  

  const filtered = useMemo(() => {
    return allStats.filter((player) => {
      const matchName = player.player_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchPos =
        positionFilter === "all" || player.position === positionFilter;
      const matchTeam =
        teamFilter === "all" || player.team === teamFilter;
      return matchName && matchPos && matchTeam;
    });
  }, [allStats, searchTerm, positionFilter, teamFilter]);

  const metricKeys = useMemo(() => {
    if (filtered.length === 0) return [];
    return Object.keys(filtered[0]).filter(
      (k) => !["player_id", "player_name", "position", "team"].includes(k)
    );
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-sm font-medium">Buscar jogador</label>
          <Input
            placeholder="Nome..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Posição</label>
          <Select value={positionFilter} onValueChange={handlePositionChange}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecionar posição" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {positions.map((pos) => (
                <SelectItem key={pos.value} value={pos.value}>
                  {pos.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Time</label>
          <Select value={teamFilter} onValueChange={handleTeamChange}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecionar time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team.value} value={team.value}>
                  {team.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os jogadores</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto p-0">
          {loading ? (
            <p className="p-4 text-muted-foreground">Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Posição</TableHead>
                  {metricKeys.map((key) => (
                    <TableHead key={key} className="text-right">
                      {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((player) => (
                  <TableRow key={player.player_id}>
                    <TableCell className="font-medium">{player.player_name}</TableCell>
                    <TableCell>{player.team}</TableCell>
                    <TableCell>{player.position}</TableCell>
                    {metricKeys.map((key) => (
                      <TableCell key={key} className="text-right">
                        {typeof player[key] === "number"
                          ? Number(player[key].toFixed(1))
                          : player[key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsAll;
