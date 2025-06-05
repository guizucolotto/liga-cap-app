
import { fetchFromApi } from "@/utils/apiUtils";
import { parseCSV, loadCSVFromUrl } from "@/utils/csvUtils";

export interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  salary: string;
}

// Default players data (will be replaced/supplemented by API or CSV data)
const defaultPlayers: Player[] = [
  { id: 1, name: "Drake Maye", team: "Dallas Cowboys", position: "QB", salary: "$42,966,243" },
  { id: 2, name: "CeeDee Lamb", team: "Dallas Cowboys", position: "WR", salary: "$30,145,250" },
];

// API functions
export async function fetchPlayers(): Promise<Player[]> {
  // Replace with your actual API endpoint
  const apiPlayers = await fetchFromApi<Player[]>("/api/players");
  return apiPlayers || defaultPlayers;
}

export async function fetchPlayersByPosition(position: string): Promise<Player[]> {
  // Replace with your actual API endpoint
  return await fetchFromApi<Player[]>(`/api/players?position=${position}`) || [];
}

// CSV functions
export async function loadPlayersFromCSV(csvData: string): Promise<Player[]> {
  return parseCSV<Player>(csvData);
}

export async function loadPlayersFromCSVUrl(url: string): Promise<Player[] | null> {
  const csvData = await loadCSVFromUrl(url);
  return csvData ? parseCSV<Player>(csvData) : null;
}

// Local storage helper functions
export function savePlayersToLocalStorage(players: Player[]): void {
  localStorage.setItem("football-players", JSON.stringify(players));
}

export function getPlayersFromLocalStorage(): Player[] | null {
  const storedPlayers = localStorage.getItem("football-players");
  return storedPlayers ? JSON.parse(storedPlayers) : null;
}
