// Shared data for StatsPage tabs
 export const statsData = {
   QB: [
     { id: 1, name: "Drake Maye", team: "Dallas Cowboys", passYards: 4200, passTD: 35, int: 10, rushYards: 350, rushTD: 3 },
     { id: 2, name: "Jalen Hurts", team: "Philadelphia Eagles", passYards: 3800, passTD: 28, int: 8, rushYards: 650, rushTD: 12 },
     { id: 3, name: "Daniel Jones", team: "New York Giants", passYards: 3200, passTD: 22, int: 14, rushYards: 450, rushTD: 5 },
     { id: 4, name: "Caleb Williams", team: "Chicago Bears", passYards: 4100, passTD: 33, int: 9, rushYards: 420, rushTD: 4 },
     { id: 5, name: "Dak Prescott", team: "Dallas Cowboys", passYards: 3900, passTD: 30, int: 11, rushYards: 280, rushTD: 3 },
   ],
   RB: [
     { id: 1, name: "Saquon Barkley", team: "Philadelphia Eagles", rushYards: 1350, rushTD: 12, recYards: 450, recTD: 3 },
     { id: 2, name: "Jahmyr Gibbs", team: "Detroit Lions", rushYards: 1200, rushTD: 9, recYards: 650, recTD: 5 },
     { id: 3, name: "Bijan Robinson", team: "Atlanta Falcons", rushYards: 1450, rushTD: 14, recYards: 380, recTD: 2 },
     { id: 4, name: "Josh Jacobs", team: "Green Bay Packers", rushYards: 1100, rushTD: 11, recYards: 270, recTD: 1 },
     { id: 5, name: "De\"Von Achane", team: "Miami Dolphins", rushYards: 950, rushTD: 8, recYards: 580, recTD: 4 },
   ],
   WR: [
     { id: 1, name: "CeeDee Lamb", team: "Dallas Cowboys", receptions: 110, recYards: 1550, recTD: 12 },
     { id: 2, name: "Justin Jefferson", team: "Minnesota Vikings", receptions: 118, recYards: 1720, recTD: 10 },
     { id: 3, name: "A.J. Brown", team: "Philadelphia Eagles", receptions: 103, recYards: 1640, recTD: 14 },
     { id: 4, name: "Ja\"Marr Chase", team: "Dallas Cowboys", receptions: 98, recYards: 1480, recTD: 11 },
     { id: 5, name: "DeVonta Smith", team: "Philadelphia Eagles", receptions: 90, recYards: 1250, recTD: 8 },
   ],
   TE: [
     { id: 1, name: "Travis Kelce", team: "Kansas City Chiefs", receptions: 105, recYards: 1300, recTD: 12 },
     { id: 2, name: "George Kittle", team: "San Francisco 49ers", receptions: 85, recYards: 1000, recTD: 8 },
     { id: 3, name: "Mark Andrews", team: "Baltimore Ravens", receptions: 75, recYards: 900, recTD: 7 },
   ],
   DL: [
     { id: 1, name: "Aaron Donald", team: "Los Angeles Rams", tackles: 50, sacks: 10, interceptions: 1 },
     { id: 2, name: "T.J. Watt", team: "Pittsburgh Steelers", tackles: 60, sacks: 12, interceptions: 2 },
   ],
   LB: [
     { id: 1, name: "Bobby Wagner", team: "Seattle Seahawks", tackles: 120, sacks: 5, interceptions: 3 },
     { id: 2, name: "Darius Leonard", team: "Indianapolis Colts", tackles: 110, sacks: 4, interceptions: 2 },
   ],
   DB: [
     { id: 1, name: "Jamal Adams", team: "Seattle Seahawks", tackles: 80, interceptions: 4, passDeflections: 10 },
     { id: 2, name: "Minkah Fitzpatrick", team: "Pittsburgh Steelers", tackles: 75, interceptions: 5, passDeflections: 8 },
   ],
   IDP: [
     { id: 1, name: "Devin White", team: "Tampa Bay Buccaneers", tackles: 100, sacks: 6, interceptions: 2 },
     { id: 2, name: "Roquan Smith", team: "Chicago Bears", tackles: 95, sacks: 5, interceptions: 1 },
   ],
 };
 
 // Options for selecting the season
 export const seasons = [
   { value: "2025", label: "2025 Season" },
   { value: "2024", label: "2024 Season" },
   { value: "2023", label: "2023 Season" },
 ];
