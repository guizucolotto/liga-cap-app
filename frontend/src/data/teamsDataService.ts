
import { fetchFromApi } from "@/utils/apiUtils";
import { parseCSV, loadCSVFromUrl } from "@/utils/csvUtils";

export interface Team {
  id: string;
  name: string;
  conference: string;
  division: string;
  capSpace: string;
  capUsed: string;
  totalPlayers: number;
}

export interface TeamDetail extends Team {
  color: string;
  roster: {
    id: number;
    name: string;
    position: string;
    salary: string;
    contract: string;
    years: number;
  }[];
  positionLimits: Record<string, { total: number; limit: number }>;
}

// Default teams data (will be replaced/supplemented by API or CSV data)
const defaultTeams: Team[] = [
  { id: "cowboys", name: "Dallas Cowboys", conference: "NFC", division: "East", capSpace: "$119,548,296", capUsed: "$159,651,704", totalPlayers: 43 },
  { id: "eagles", name: "Philadelphia Eagles", conference: "NFC", division: "East", capSpace: "$130,290,953", capUsed: "$148,909,047", totalPlayers: 40 },
];

// API functions
export async function fetchTeams(): Promise<Team[]> {
  // Replace with your actual API endpoint
  const apiTeams = await fetchFromApi<Team[]>("/api/teams");
  return apiTeams || defaultTeams;
}

export async function fetchTeamById(teamId: string): Promise<TeamDetail | null> {
  // Replace with your actual API endpoint
  return await fetchFromApi<TeamDetail>(`/api/teams/${teamId}`);
}

// CSV functions
export async function loadTeamsFromCSV(csvData: string): Promise<Team[]> {
  return parseCSV<Team>(csvData);
}

export async function loadTeamsFromCSVUrl(url: string): Promise<Team[] | null> {
  const csvData = await loadCSVFromUrl(url);
  return csvData ? parseCSV<Team>(csvData) : null;
}

// Local storage helper functions
export function saveTeamsToLocalStorage(teams: Team[]): void {
  localStorage.setItem("football-teams", JSON.stringify(teams));
}

export function getTeamsFromLocalStorage(): Team[] | null {
  const storedTeams = localStorage.getItem("football-teams");
  return storedTeams ? JSON.parse(storedTeams) : null;
}
