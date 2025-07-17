import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_URL } from "@/utils/apiUtils";
type Team = {
  id: string;
  name: string;
  conference: string;
  division: string;
  capSpace: number;
  capUsed: number;
  capY1: number;
  capY2: number;
  capY3: number;
  totalPlayers: number;
};

const TeamsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [conference, setConference] = useState("NFC");

  useEffect(() => {
    const fetchTeams = async () => {
      const res = await fetch(`${API_URL}/teams`);
      const data = await res.json();
      setTeams(data);
    };

    fetchTeams();
  }, []);

  const filtered = teams.filter(t => t.conference.trim().toUpperCase() === conference);

  const grouped = filtered.reduce((acc, team) => {
    if (!acc[team.division]) acc[team.division] = [];
    acc[team.division].push(team);
    return acc;
  }, {} as Record<string, Team[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
        <Select value={conference} onValueChange={setConference}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Conference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AFC">AFC</SelectItem>
            <SelectItem value="NFC">NFC</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([division, divisionTeams]) => (
          <Card key={division} className="overflow-hidden">
            <div className="bg-nfl-navy text-white px-6 py-3">
              <h2 className="text-xl font-semibold">{division}</h2>
            </div>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team</TableHead>
                    <TableHead className="text-right">Cap 2025</TableHead>
                    <TableHead className="text-right">Cap Remaining</TableHead>
                    <TableHead className="text-right">Cap 2026</TableHead>
                    <TableHead className="text-right">Cap 2027</TableHead>
                    <TableHead className="text-right">Cap 2028</TableHead>
                    <TableHead className="text-right">Players</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {divisionTeams.map((team) => {
                    const remainingClass =
                      team.capSpace < 10000000
                        ? "text-red-600"
                        : team.capSpace < 30000000
                        ? "text-yellow-600"
                        : "text-green-600";

                    return (
                      <TableRow key={team.id}>
                        <TableCell>
                          <Link
                            to={`/teams/${team.id}`}
                            className="font-medium hover:underline flex items-center"
                          >
                            {team.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right bg-muted/50 font-semibold">
                          {Number(team.capUsed).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </TableCell>
                        <TableCell className={`text-right font-bold ${remainingClass}`}>
                          {Number(team.capSpace).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          {Number(team.capY1).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          {Number(team.capY2).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          {Number(team.capY3).toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </TableCell>
                        <TableCell className="text-right">{team.totalPlayers}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default TeamsPage;

