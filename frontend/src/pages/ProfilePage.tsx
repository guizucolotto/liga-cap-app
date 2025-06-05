import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { teamLogos } from "@/constants/teamLogos";
// import GenericLogo from "@/assets/logos/genericlogo.jpeg"; // Uma logo padrão

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ProfilePage = () => {
  const { user } = useAuth();
  const [selectedTeamType, setSelectedTeamType] = useState<"AFC" | "NFC">("AFC");
  const [capData, setCapData] = useState({});
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Adapte os anos conforme o seu capData e playerData
  const years = [2025, 2026, 2027, 2028, 2029, 2030];
  const teamName = user?.teams?.[selectedTeamType.toLowerCase()] || "";

  const fetchData = async () => {
    setLoading(true);
    try {
      const [capRes, playerRes] = await Promise.all([
        fetch(`${API_URL}profile/cap-summary/${teamName}`),
        fetch(`${API_URL}/profile/players/${teamName}`)
      ]);
      const capJson = await capRes.json();
      const playerJson = await playerRes.json();
  
      // 👇 Estes logs DEVEM aparecer no console ao recarregar a página
      console.log("CAP DATA", capJson);
      console.log("PLAYERS", playerJson);
  
      setCapData(capJson);
      setPlayers(playerJson);
    } catch (error) {
      console.error("Erro ao carregar dados do perfil:", error);
      setCapData({});
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
        {["afc", "nfc"].map(conf => {
          const team = user.teams[conf];
          return (
            <Card key={conf}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <img
                    // src={teamLogos[team] || GenericLogo}
                    // alt={team}
                    // className="w-10 h-10 object-contain"
                  />
                  <CardTitle>
                    {conf.toUpperCase()}: {team}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                CAP 2025: {capData && capData["2025"] && formatMoney(capData["2025"].salary)}
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
              <CardTitle>Resumo de CAP - {teamName}</CardTitle>
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
                    const cap = capData?.[year.toString()] || capData?.[year];
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
              <CardTitle>Jogadores - {teamName}</CardTitle>
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
        </>
      )}
    </div>
  );
};

export default ProfilePage;
