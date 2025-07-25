from flask import Blueprint, request, jsonify
from urllib.parse import unquote
from db import users_db, team_players, cap_summary
import numpy as np

auth_bp = Blueprint("auth", __name__)

# Função utilitária para garantir serialização correta
def pythonize(obj):
    if isinstance(obj, list):
        return [pythonize(i) for i in obj]
    if isinstance(obj, dict):
        out = {}
        for k, v in obj.items():
            key = str(k)
            if isinstance(v, float) and (v is None or np.isnan(v)):
                out[key] = 0
            elif hasattr(v, 'item'):  # numpy types
                out[key] = v.item()
            else:
                out[key] = pythonize(v)
        return out
    return obj

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = users_db.get(username)
    if not user or user["password"] != password:
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({
        "user": {
            "username": username,
            "alias": user.get("alias", username),
            "teams": user["teams"]
        },
        "token": "fake-jwt-token"
    })

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if username in users_db:
        return jsonify({"error": "User already exists"}), 400

    # SUGESTÃO: coloque os nomes completos dos times para que batam com o resto do sistema!
    users_db[username] = {
        "password": password,
        "teams": {
            "afc": "NEW YORK JETS",
            "nfc": "PHILADELPHIA EAGLES"
        }
    }

    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route("/profile/cap-summary/<team>", methods=["GET"])
def get_cap_summary(team):
    team = unquote(team).strip().upper()
    if team not in cap_summary:
        return jsonify({"error": f"Team '{team}' not found"}), 404
    return jsonify(pythonize(cap_summary[team]))

@auth_bp.route("/profile/players/<fantasy_team>", methods=["GET"])
def get_team_players(fantasy_team):
    fantasy_team = unquote(fantasy_team)
    # "Fantasy Team" deve estar padronizado na sua base!
    filtered = [p for p in team_players if p.get("Fantasy Team") == fantasy_team]
    return jsonify(pythonize(filtered))
