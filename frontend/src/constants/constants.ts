// src/constants/constants.ts

export const years = [2025, 2026, 2027, 2028, 2029];

export const statPositions = [
   'QB', 'TE', 'DB', 'RB', 'WR', 'DL', 'LB', 'IDP'
];

export const positions = [
  { label: "Todas", value: "all" },
  { label: "QB", value: "QB" },
  { label: "RB", value: "RB" },
  { label: "WR", value: "WR" },
  { label: "TE", value: "TE" },
  { label: "DL", value: "DL" },
  { label: "LB", value: "LB" },
  { label: "DB", value: "DB" },
];

export const teams = [
  { label: "All", value: "all" },
  { label: "Jets", value: "Jets" },
  { label: "Eagles", value: "Eagles" },
  // Adicione mais times conforme necessário
];

export const seasons = [
  { label: "2025", value: "2025" },
  { label: "2024", value: "2024" },
];


export const statsFieldsByPosition: Record<string, string[]> = {
  QB: [
    "player_name", "team", "position",
    "completions_sum", "attempts_sum", "passing_yards_sum", "passing_tds_sum", "interceptions_sum",
    "sacks_sum", "passing_first_downs_sum", "passing_epa_sum", "fantasy_points_ppr_sum"
  ],
  RB: [
    "player_name", "team", "position",
    "targets_sum", "carries_sum", "rushing_yards_sum", "rushing_tds_sum", "rushing_epa_sum",
    "receptions_sum", "receiving_yards_sum", "air_yards_share_sum", "receiving_tds_sum",
    "receiving_epa_sum", "fantasy_points_ppr_sum"
  ],
  WR: [
    "player_name", "team", "position",
    "targets_sum", "carries_sum", "rushing_yards_sum", "rushing_tds_sum", "rushing_epa_sum",
    "receptions_sum", "receiving_yards_sum", "air_yards_share_sum", "receiving_tds_sum",
    "receiving_epa_sum", "fantasy_points_ppr_sum"
  ],
  TE: [
    "player_name", "team", "position",
    "targets_sum", "carries_sum", "rushing_yards_sum", "rushing_tds_sum", "rushing_epa_sum",
    "receptions_sum", "receiving_yards_sum", "air_yards_share_sum", "receiving_tds_sum",
    "receiving_epa_sum", "fantasy_points_ppr_sum"
  ],
  DL: [
    "player_name", "team", "position",
    "sacks_sum", "sack_yards_sum", "sack_fumbles_sum", "fantasy_points_ppr_sum"
  ],
  LB: [
    "player_name", "team", "position",
    "sacks_sum", "sack_yards_sum", "sack_fumbles_sum", "fantasy_points_ppr_sum"
  ],
  DB: [
    "player_name", "team", "position",
    "sacks_sum", "sack_yards_sum", "sack_fumbles_sum", "fantasy_points_ppr_sum"
  ],
  IDP: [
    "player_name", "team", "position",
    "sacks_sum", "sack_yards_sum", "sack_fumbles_sum", "fantasy_points_ppr_sum"
  ]
};

export const positionLimits: Record<string, number> = {
  QB: 2,
  RB: 6,
  WR: 6,
  TE: 3,
  OL: 8,
  DL: 8,
  LB: 6,
  DB: 8,
};