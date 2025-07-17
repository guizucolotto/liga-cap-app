import React, { useEffect, useState, useTransition, useMemo } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { API_URL } from "@/utils/apiUtils";

const StatsAll = () => {
  const [allStats, setAllStats] = useState([]);
  const [filteredStats, setFilteredStats] = useState([]);
  const [positionFilter, setPositionFilter] = useState("All");
  const [teamFilter, setTeamFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/stats`);
        const data = response.data;
        const players = data.ALL || [];
        setAllStats(players);
        setFilteredStats(players);
      } catch (error) {
        console.error("Erro ao buscar stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    let result = [...allStats];
    if (positionFilter !== "All") result = result.filter((p) => p.position === positionFilter);
    if (teamFilter !== "All") result = result.filter((p) => p.team === teamFilter);
    setFilteredStats(result);
  }, [positionFilter, teamFilter, allStats]);

  const uniquePositions = useMemo(() => [...new Set(allStats.map((p) => p.position))].filter(Boolean), [allStats]);
  const uniqueTeams = useMemo(() => [...new Set(allStats.map((p) => p.team))].filter(Boolean), [allStats]);

  const statKeys = useMemo(() => {
    if (!filteredStats.length) return [];
    return Object.keys(filteredStats[0]).filter(
      (k) => !["player_id", "player_name", "team", "position"].includes(k)
    );
  }, [filteredStats]);

  if (loading) return <div>Loading...</div>;

  return (
    <Card className="w-fit min-w-[1200px]">
      <CardHeader>
        <CardTitle>All Player Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Select value={positionFilter} onValueChange={(val) => startTransition(() => setPositionFilter(val))}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Positions</SelectItem>
              {uniquePositions.map((pos) => (
                <SelectItem key={pos} value={pos}>{pos}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={teamFilter} onValueChange={(val) => startTransition(() => setTeamFilter(val))}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by Team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Teams</SelectItem>
              {uniqueTeams.map((team) => (
                <SelectItem key={team} value={team}>{team}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Posição</TableHead>
              {statKeys.map((k) => (
                <TableHead key={k} className="text-right">
                  {k.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStats.map((player) => (
              <TableRow key={`${player.player_id}-${player.player_name}`}>
                <TableCell>{player.player_name}</TableCell>
                <TableCell>{player.team || "-"}</TableCell>
                <TableCell>{player.position || "-"}</TableCell>
                {statKeys.map((k) => (
                  <TableCell key={k} className="text-right">
                    {typeof player[k] === "number" ? player[k].toFixed(1) : player[k]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StatsAll;
