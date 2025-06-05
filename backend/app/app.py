from flask import Flask, jsonify, request
from flask_cors import CORS
import json
from auth import auth_bp
from routes.stats import stats_bp



app = Flask(__name__)

CORS(app)  # Enable CORS for the Flask app

app.register_blueprint(stats_bp)
app.register_blueprint(auth_bp)

def pythonize(obj):
    # Converte numpy/pandas para tipos Python puros
    import numpy as np
    if isinstance(obj, list):
        return [pythonize(i) for i in obj]
    if isinstance(obj, dict):
        out = {}
        for k, v in obj.items():
            key = str(k)
            if isinstance(v, float) and (np.isnan(v) or v is None):
                out[key] = 0
            elif hasattr(v, 'item'):
                out[key] = v.item()
            else:
                out[key] = pythonize(v)
        return out
    return obj

# Placeholder for the import_weekly_data function
def import_weekly_data(year):
    # This function should contain the logic to fetch NFL data for the specified year
    # For now, returning a mock response
    return [{"name": "Player 1", "team": "Team A", "rushYards": 100, "rushTD": 1, "receptions": 5, "recYards": 50},
            {"name": "Player 2", "team": "Team B", "rushYards": 200, "rushTD": 2, "receptions": 3, "recYards": 30}]

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/api/import_weekly_data/<int:year>', methods=['GET'])
def fetch_weekly_data(year):
    data = import_weekly_data(year)
    return jsonify(data)

@app.route('/players')
def get_players():
    from db import team_players

    players = []
    for item in team_players:
        players.append({
            "id": item.get("id") or item["name"].lower().replace(" ", "_"),
            "name": item["Player"],
            "position": item["Position"],
            "fantasyTeam": item["Fantasy Team"],
            "nflTeam": item["NFL Team"],
            "conference": item["Conference"],
            "contractType": item["Contract Type"],
            "salary": item["2025"],
            "deadCap2026": item[2026],
            "deadCap2027": item[2027],
            "deadCap2028": item[2028],
        })

    return jsonify(pythonize(players))

@app.route("/teams")
def get_teams():
    from db import team_data  # supondo que o Google Sheets já foi lido e transformado aqui

    teams = []
    for item in team_data:
        teams.append({
            "id": item.get("id") or item["name"].lower().replace(" ", "_"),
            "name": item["name"],
            "conference": item["conference"],
            "division": item["division"],
            "capSpace": item["cap_space"],
            "capUsed": item["cap_used"],
            "capY1": item["cap_y1"],
            "capY2": item["cap_y2"],
            "capY3": item["cap_y3"],
            "totalPlayers": item.get("players", 0)
        })

    return jsonify(pythonize(teams))

@app.route('/schedule')
def get_schedule():
    with open('data/schedule.json', 'r', encoding='utf-8') as f:
        schedule = json.load(f)
    return jsonify(schedule)


if __name__ == "__main__":
    app.run(debug=True)