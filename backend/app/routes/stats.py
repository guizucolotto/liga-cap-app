# routes/stats.py

from flask import Blueprint, jsonify
import os
import json

stats_bp = Blueprint("stats", __name__)

# Caminho absoluto ao arquivo
STATS_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "stats_processed.json")

@stats_bp.route("/stats", methods=["GET"])
def get_stats():
    if not os.path.exists(STATS_FILE):
        return jsonify({"error": "Arquivo stats_processed.json não encontrado"}), 404

    with open(STATS_FILE, "r") as f:
        data = json.load(f)

    return jsonify(data)
