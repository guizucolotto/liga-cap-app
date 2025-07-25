import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { API_URL } from "@/utils/apiUtils";
import { teamLogos } from "@/utils/teamLogos";
import GenericLogo from "@/assets/logos/genericlogo.jpeg"; // Uma logo padrão
import SalaryOverview from "@/components/SalaryOverview";

interface UserTeam {
  name: string;
  acr: string;
  nick: string;
  conference: string;
  division: string;
  id: string;
}


const ProfilePage = () => {
  const { user } = useAuth();
  const [selectedTeamType, setSelectedTeamType] = useState<"AFC" | "NFC">("AFC");
  const [capDataByConf, setCapDataByConf] = useState<{
    afc?: any;
    nfc?: any;
  }>({});
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Adapte os anos conforme o seu capData e playerData
  const years = [2025, 2026, 2027, 2028, 2029, 2030];
  const rawTeam = user?.teams?.[
    selectedTeamType.toLowerCase() as "afc" | "nfc"
  ];
  const selectedTeam =
    typeof rawTeam === "string" ? { name: rawTeam } : (rawTeam as UserTeam);
  const teamName = selectedTeam?.name || "";

  const fetchData = async () => {
    setLoading(true);
    try {
      const confs: ("afc" | "nfc")[] = ["afc", "nfc"];
      const capPromises = confs.map((conf) => {
        const t = user?.teams?.[conf];
        const name = typeof t === "string" ? t : (t as UserTeam)?.name;
        return fetch(`${API_URL}/profile/cap-summary/${name}`).then((r) =>
          r.json()
        );
      });
      const playersPromise = fetch(`${API_URL}/profile/players/${teamName}`).then(
        (r) => r.json()
      );

      const [capAfc, capNfc, playerJson] = await Promise.all([
        capPromises[0],
        capPromises[1],
        playersPromise,
      ]);

      console.log("CAP DATA", { afc: capAfc, nfc: capNfc });
      console.log("PLAYERS", playerJson);

      setCapDataByConf({ afc: capAfc, nfc: capNfc });
      setPlayers(playerJson);
    } catch (error) {
      console.error("Erro ao carregar dados do perfil:", error);
      setCapDataByConf({});
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && teamName) fetchData();
    // eslint-disable-next-line
  }, [selectedTeamType, user]);

  const formatMoney = (value) =>
    value && !isNaN(value) ? `$${(value / 1_000_000).toFixed(1)}M` : "-";

  if (!user) return <div className="text-center mt-10">Unauthorized</div>;

  // Utilitário para pegar valor dos anos mesmo se vier como "2025" ou "2025.0"
  const getPlayerCapForYear = (p, year) => {
    if (p[year]) return p[year];
    if (p[year + ".0"]) return p[year + ".0"];
    return null;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Olá, {user.username}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["afc", "nfc"].map((conf) => {
          const raw = user.teams[conf];
          const team = typeof raw === "string" ? { name: raw } : (raw as UserTeam);
          const logoKey = team.nick || team.name?.split(" ").pop() || "";
          return (
            <Card key={conf}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <img
                    src={teamLogos[logoKey] || GenericLogo}
                    alt={team.name}
                    className="w-10 h-10 object-contain"
                  />
                  <CardTitle>
                    {conf.toUpperCase()}: {team.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                CAP 2025: {capDataByConf[conf as "afc" | "nfc"]?.["2025"]
                  ? formatMoney(capDataByConf[conf as "afc" | "nfc"]["2025"].salary)
                  : "-"}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ToggleGroup
        type="single"
        value={selectedTeamType}
        onValueChange={(v) => v && setSelectedTeamType(v as "AFC" | "NFC")}
      >
        <ToggleGroupItem value="AFC">Ver AFC</ToggleGroupItem>
        <ToggleGroupItem value="NFC">Ver NFC</ToggleGroupItem>
      </ToggleGroup>

      {loading ? (
        <p className="text-center mt-10">Carregando dados...</p>
      ) : (
        <>
          {/* Tabela de Resumo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <img
                  src={teamLogos[selectedTeam?.nick || teamName.split(" ").pop() || ""] || GenericLogo}
                  alt={teamName}
                  className="w-6 h-6 object-contain"
                />
                Resumo de CAP - {teamName}
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ano</TableHead>
                    <TableHead>Salary Cap</TableHead>
                    <TableHead>Dead Cap</TableHead>
                    <TableHead>League Cap</TableHead>
                    <TableHead>Remaining Cap</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {years.map((year) => {
                    const currentCap =
                      capDataByConf[
                        selectedTeamType.toLowerCase() as "afc" | "nfc"
                      ];
                    const cap =
                      currentCap?.[year.toString()] || currentCap?.[year];
                    if (!cap) return null;
                    const remaining = cap.league - cap.salary - cap.dead;
                    return (
                      <TableRow key={year}>
                        <TableCell>{year}</TableCell>
                        <TableCell>{formatMoney(cap.salary)}</TableCell>
                        <TableCell>{formatMoney(cap.dead)}</TableCell>
                        <TableCell>{formatMoney(cap.league)}</TableCell>
                        <TableCell>{formatMoney(remaining)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Tabela de Jogadores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <img
                  src={teamLogos[selectedTeam?.nick || teamName.split(" ").pop() || ""] || GenericLogo}
                  alt={teamName}
                  className="w-6 h-6 object-contain"
                />
                Jogadores - {teamName}
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Posição</TableHead>
                    {/* <TableHead>Idade</TableHead> // Se não tem idade, pode remover */}
                    <TableHead>Contrato</TableHead>
                    {years.map((year) => (
                      <TableHead key={year} className="text-right">
                        CAP {year}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell>{p["Player"]}</TableCell>
                      <TableCell>{p["Position"]}</TableCell>
                      {/* <TableCell>{p["Age"]}</TableCell> // Se não tem, remova */}
                      <TableCell>{p["Contract Type"]}</TableCell>
                      {years.map((year) => (
                        <TableCell key={year} className="text-right">
                          {getPlayerCapForYear(p, year)
                            ? formatMoney(getPlayerCapForYear(p, year))
                            : "-"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </CardContent>
        </Card>

        <SalaryOverview players={players} />
      </>
    )}
  </div>
  );
};

export default ProfilePage;
