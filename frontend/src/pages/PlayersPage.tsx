import React, { useEffect, useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp } from "lucide-react";
import { years } from "@/constants/constants";

type Player = {
  id: string;
  name: string;
  position: string;
  contractType: string;
  salary: number;
  fantasyTeam: string;
  nflTeam: string;
  conference: string;
  deadCap: number[];
};

type RawPlayer = Omit<Player, 'deadCap'> & {
  deadCap2026?: number;
  deadCap2027?: number;
  deadCap2028?: number;
  deadCap2029?: number;
};

const columns = [
  { key: "name", label: "Nome" },
  { key: "position", label: "Posição" },
  { key: "contractType", label: "Contrato" },
  { key: "fantasyTeam", label: "Fantasy" },
  { key: "nflTeam", label: "NFL" },
  { key: "conference", label: "Conferência" },
  { key: "salary", label: "Salary" },
];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const formatMoney = (val: number) =>
  isNaN(val) || val === 0 ? "-" : `$${(val / 1_000_000).toFixed(1)}M`;

const PlayersPage = () => {
  const [playersData, setPlayersData] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [nflTeamFilter, setNflTeamFilter] = useState("all");
  const [fantasyTeamFilter, setFantasyTeamFilter] = useState("all");
  const [conferenceTab, setConferenceTab] = useState("AFC");

  // Para ordenação
  const [sortColumn, setSortColumn] = useState<string>(""); // coluna ordenada
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch(`${API_URL}/players`);
        const data = await res.json();
        const normalized = (data as RawPlayer[]).map((p) => ({
          ...p,
          position: p.position || "",
          fantasyTeam: p.fantasyTeam || "",
          nflTeam: p.nflTeam || "",
          conference: p.conference || "",
          deadCap: [
            Number(p.deadCap2026) || 0,
            Number(p.deadCap2027) || 0,
            Number(p.deadCap2028) || 0,
            Number(p.deadCap2029) || 0,
          ],
          salary: Number(p.salary) || 0,
        }));
        setPlayersData(normalized);
      } catch (err) {
        console.error("Erro ao buscar jogadores:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const conferenceOptions = Array.from(new Set(playersData.map((p) => p.conference).filter(Boolean))).sort();
  const positionOptions = Array.from(new Set(playersData.map((p) => p.position).filter(Boolean))).sort();
  const nflTeamOptions = Array.from(new Set(playersData.map((p) => p.nflTeam).filter(Boolean))).sort();
  const fantasyTeamOptions = Array.from(new Set(playersData.map((p) => p.fantasyTeam).filter(Boolean))).sort();

  // Filtra pela Conference
  const filteredByConference = playersData.filter(
    (p) => p.conference === conferenceTab
  );

  // Restante dos filtros
  let filteredRows = filteredByConference.filter((p) => {
    const name = (p.name || "").toLowerCase();
    const matchName = name.includes(searchTerm.toLowerCase());
    const matchPosition = String(positionFilter) === "all" || String(p.position) === String(positionFilter);
    const matchNfl = String(nflTeamFilter) === "all" || String(p.nflTeam) === String(nflTeamFilter);
    const matchFantasy = String(fantasyTeamFilter) === "all" || String(p.fantasyTeam) === String(fantasyTeamFilter);
    return matchName && matchPosition && matchNfl && matchFantasy;
  });

  // Ordenação dinâmica
  if (sortColumn) {
    filteredRows = [...filteredRows].sort((a, b) => {
      let valA: any = a[sortColumn as keyof Player];
      let valB: any = b[sortColumn as keyof Player];

      // salary/deadCap ordenam por número, resto por string
      if (sortColumn === "salary") {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else {
        valA = (valA || "").toString().toLowerCase();
        valB = (valB || "").toString().toLowerCase();
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Ordenação para DeadCap (para cada ano)
  const handleSortDeadCap = (yearIdx: number) => {
    if (sortColumn === `deadCap${yearIdx}`) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(`deadCap${yearIdx}`);
      setSortDirection("desc");
    }
  };

  const sortDeadCap = (rows: Player[], yearIdx: number) => {
    return [...rows].sort((a, b) => {
      const valA = a.deadCap[yearIdx] || 0;
      const valB = b.deadCap[yearIdx] || 0;
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Ordenação se for uma coluna de DeadCap
  let rowsToRender = filteredRows;
  if (sortColumn.startsWith("deadCap")) {
    const idx = parseInt(sortColumn.replace("deadCap", ""), 10);
    if (!isNaN(idx)) {
      rowsToRender = sortDeadCap(filteredRows, idx);
    }
  }

  // Handler para colunas gerais
  const handleSort = (colKey: string) => {
    if (sortColumn === colKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(colKey);
      setSortDirection("desc");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Players</h1>
        <div className="text-sm text-muted-foreground">Temporada 2025</div>
      </div>

      {/* Seletor de Conference via Tabs */}
      <Tabs value={conferenceTab} onValueChange={setConferenceTab} className="space-y-4">
        <TabsList className="flex gap-2">
          {conferenceOptions.map((conf) => (
            <TabsTrigger key={conf} value={conf}>
              {conf}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Conteúdo para cada aba de conference */}
        {conferenceOptions.map((conf) => (
          <TabsContent key={conf} value={conf} className="space-y-4">
            <Card className="w-full overflow-hidden">
              <CardHeader>
                <CardTitle>Jogadores ({conf})</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <Input
                    placeholder="Buscar por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/5"
                  />

                  <Select value={positionFilter} onValueChange={value => setPositionFilter(value || "all")}>
                    <SelectTrigger className="w-full md:w-[130px]">
                      <SelectValue placeholder="Todas posições" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas posições</SelectItem>
                      {positionOptions.map((pos) => (
                        <SelectItem key={String(pos)} value={String(pos)}>
                          {pos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={nflTeamFilter} onValueChange={value => setNflTeamFilter(value || "all")}>
                    <SelectTrigger className="w-full md:w-[130px]">
                      <SelectValue placeholder="Todos os times NFL" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os times</SelectItem>
                      {nflTeamOptions.map((team) => (
                        <SelectItem key={String(team)} value={String(team)}>
                          {team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={fantasyTeamFilter} onValueChange={value => setFantasyTeamFilter(value || "all")}>
                    <SelectTrigger className="w-full md:w-[160px]">
                      <SelectValue placeholder="Todos os times Fantasy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os times</SelectItem>
                      {fantasyTeamOptions.map((team) => (
                        <SelectItem key={String(team)} value={String(team)}>
                          {team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="overflow-x-auto w-full">
                  <div style={{ minWidth: "1100px", maxHeight: "500px", overflowY: "auto" }}>
                    {loading ? (
                      <p>Carregando...</p>
                    ) : rowsToRender.length === 0 ? (
                      <p className="text-muted-foreground">Nenhum jogador encontrado com os filtros aplicados.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {columns.map((col) => (
                              <TableHead
                                key={col.key}
                                className="cursor-pointer select-none text-right"
                                onClick={() => handleSort(col.key)}
                              >
                                <div className="flex items-center justify-end gap-1">
                                  {col.label}
                                  {sortColumn === col.key && (
                                    sortDirection === "asc" ? (
                                      <ChevronUp className="inline w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="inline w-4 h-4" />
                                    )
                                  )}
                                </div>
                              </TableHead>
                            ))}
                            {years.slice(1).map((year, i) => (
                              <TableHead
                                key={year}
                                className="cursor-pointer select-none text-right"
                                onClick={() => handleSortDeadCap(i)}
                              >
                                <div className="flex items-center justify-end gap-1">
                                  Dead Cap {year}
                                  {sortColumn === `deadCap${i}` && (
                                    sortDirection === "asc" ? (
                                      <ChevronUp className="inline w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="inline w-4 h-4" />
                                    )
                                  )}
                                </div>
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rowsToRender.map((player) => (
                            <TableRow key={player.id}>
                              <TableCell className="font-medium">{player.name}</TableCell>
                              <TableCell>{player.position}</TableCell>
                              <TableCell>{player.contractType}</TableCell>
                              <TableCell>{player.fantasyTeam}</TableCell>
                              <TableCell>{player.nflTeam}</TableCell>
                              <TableCell>{player.conference}</TableCell>
                              <TableCell className="text-right">{formatMoney(player.salary)}</TableCell>
                              {player.deadCap.map((cap, i) => (
                                <TableCell key={i} className="text-right">
                                  {cap > 0 ? formatMoney(cap) : "-"}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PlayersPage;
