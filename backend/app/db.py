# db.py
import pandas as pd
from collections import defaultdict

# -------------------- Variaveis --------------------

SPREADSHEET_ID = '129Y7tOCiQV7LkMIO7D4Z2jVqXB0Mm7fkm1pyKojYfV8'
SHEET_NFC = 'NFC_Player_DB'
SHEET_AFC = 'AFC_Player_DB'



# -------------------- Funções auxiliares --------------------
def clean_columns(df, column):
        df[column] = (
            df[column]
            .astype(str)
            .str.replace(".", "", regex=False)
            .str.replace(r"$", "", regex=False)
            .str.replace(",", "", regex=False)
            .replace('', '0')
            .astype(float)
        )
        
def carregar_sheet(sheet_id: str, aba: str) -> pd.DataFrame:
    url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?tqx=out:csv&sheet={aba}"
    df = pd.read_csv(url)
    df = df.iloc[:, :20]
    df.columns = df.iloc[1]  # terceira linha como header
    df = df.iloc[3:].reset_index(drop=True)
    df = df.loc[:, ~df.columns.isna()]
    return df

# -------------------- Usuários --------------------
users_db = {
    "guilherme": {
        "password": "123456",
        "teams": {
            "afc": "NEW YORK JETS",
            "nfc": "PHILADELPHIA EAGLES"
        }
    }
}
# -------------------- Jogadores por time --------------------
# Colunas relevantes
colunas_planilha = [
    'Player', 'Position', 'NFL Team', 'Fantasy Team',
    'Conference','Contract Type', '2025', '2026', '2027', '2028'
]

try:
    df_nfc = carregar_sheet(SPREADSHEET_ID, SHEET_NFC)
    df_nfc['Conference'] = 'AFC'
    df_afc = carregar_sheet(SPREADSHEET_ID, SHEET_AFC)
    df_afc['Conference'] = 'NFC'
    df_players = pd.concat([df_nfc, df_afc])

    df_players = df_players[df_players['Fantasy Team'].notna()]
    df_players = df_players[colunas_planilha]


    # Limpa valores numéricos
    for col in ['2025', '2026', '2027', '2028']:
        clean_columns(df_players, col)
        # Monta o dicionário team_players
        
    df_players["id"] = df_players["Player"].str.lower().str.replace(" ", "_", regex=False)
        

        
    team_players = df_players.fillna(0).to_dict(orient="records")


except Exception as e:
    print("❌ Erro ao carregar jogadores da planilha:", e)
    team_players = {}


# -------------------- Google Sheets - Cap dos times --------------------
SPREADSHEET_ID = '129Y7tOCiQV7LkMIO7D4Z2jVqXB0Mm7fkm1pyKojYfV8'
SHEET_NAME = 'Cap_Summary'
SHEET_URL = f'https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet={SHEET_NAME}'

try:
    df = pd.read_csv(SHEET_URL)

    # Corrigir colunas de valores monetários

    # Seleciona colunas e corrige nomes
    df = df.iloc[:, :12]
    df.columns = df.iloc[1]
    df = df.iloc[3:].reset_index(drop=True)
    df = df[["Team", "Division", "2025", "2026", "2027", "2028"]]

    for col in ["2025", "2026", "2027", "2028"]:
        clean_columns(df, col)

    # Carrega CAP total da liga para 2025
    cap_summary = pd.read_csv(SHEET_URL,header=None)
    cap_summary = cap_summary[[2,3]].rename(columns=({2:"Type",3:"Value"}))
    cap = cap_summary[cap_summary["Type"] == f"Salary CAP | 2025"]
    cap = float(cap.Value.replace(r'[\$,]', '', regex=True)[0].replace(' ', '').replace('.', ''))

    df["cap_used"] = cap - df["2025"]
    df["cap_space"] = df["2025"]

    df = df.rename(columns={
        "Team": "name",
        "Division": "division",
        "cap_used": "cap_used",
        "cap_space": "cap_space",
        "2026": "cap_y1",
        "2027": "cap_y2",
        "2028": "cap_y3",
    })

    df["conference"] = df["division"].str.strip().str[:3]
    df["id"] = df["name"].str.lower().str.replace(" ", "_", regex=False)
    df["players"] = 53

    team_data = df.to_dict(orient="records")

except Exception as e:
    import traceback
    print("❌ Erro ao carregar dados dos times via Google Sheets:")
    traceback.print_exc()
    team_data = []

# Gera cap_summary a partir do team_data
cap_summary = {}
for item in team_data:
    # padroniza o nome do time (exatamente igual ao que chega no endpoint)
    team_name = item["name"].strip().upper()  # Garante maiúsculo/sem espaço extra
    cap_summary[team_name] = {
        "2025": {
            "salary": float(item["cap_used"]),
            "dead": 0,  # Se tiver dead cap em outra coluna, coloque aqui
            "league": float(item["cap_used"]) + float(item["cap_space"])
        },
        "2026": {
            "salary": float(item["cap_y1"]),
            "dead": 0,
            "league": float(item["cap_y1"]) + float(item["cap_space"])
        },
        "2027": {
            "salary": float(item["cap_y2"]),
            "dead": 0,
            "league": float(item["cap_y2"]) + float(item["cap_space"])
        },
        "2028": {
            "salary": float(item["cap_y3"]),
            "dead": 0,
            "league": float(item["cap_y3"]) + float(item["cap_space"])
        }
        # Adicione anos conforme a planilha
    }
