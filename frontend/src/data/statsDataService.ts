
import { fetchFromApi } from "@/utils/apiUtils";
import { parseCSV, loadCSVFromUrl } from "@/utils/csvUtils";

export interface QBStats {
  id: number;
  name: string;
  team: string;
  passYards: number;
  passTD: number;
  int: number;
  rushYards: number;
  rushTD: number;
}

export interface RBStats {
  id: number;
  name: string;
  team: string;
  rushYards: number;
  rushTD: number;
  recYards: number;
  recTD: number;
}

export interface WRStats {
  id: number;
  name: string;
  team: string;
  receptions: number;
  recYards: number;
  recTD: number;
}

export interface Stats {
  QB: QBStats[];
  RB: RBStats[];
  WR: WRStats[];
}

// API functions
export async function fetchStats(season: string): Promise<Stats | null> {
  // Replace with your actual API endpoint
  return await fetchFromApi<Stats>(`/api/stats?season=${season}`);
}

// CSV functions
export async function loadStatsFromCSV(
  qbCsvData: string,
  rbCsvData: string,
  wrCsvData: string
): Promise<Stats> {
  return {
    QB: parseCSV<QBStats>(qbCsvData),
    RB: parseCSV<RBStats>(rbCsvData),
    WR: parseCSV<WRStats>(wrCsvData),
  };
}

export async function loadQBStatsFromCSV(csvData: string): Promise<QBStats[]> {
  return parseCSV<QBStats>(csvData);
}

export async function loadRBStatsFromCSV(csvData: string): Promise<RBStats[]> {
  return parseCSV<RBStats>(csvData);
}

export async function loadWRStatsFromCSV(csvData: string): Promise<WRStats[]> {
  return parseCSV<WRStats>(csvData);
}

// Local storage helper functions
export function saveStatsToLocalStorage(stats: Stats): void {
  localStorage.setItem("football-stats", JSON.stringify(stats));
}

export function getStatsFromLocalStorage(): Stats | null {
  const storedStats = localStorage.getItem("football-stats");
  return storedStats ? JSON.parse(storedStats) : null;
}
