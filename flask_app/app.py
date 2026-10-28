"""
Electric Vehicle Market Performance & Insights
Flask Web Application — Embeds Tableau Dashboard + Story
"""

from flask import Flask, render_template, jsonify, request
import sqlite3
import json
import os

app = Flask(__name__)

BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
DB_PATH   = os.path.join(BASE_DIR, '..', 'data', 'ev_market.db')
DATA_DIR  = os.path.join(BASE_DIR, '..', 'data', 'processed')


# ────────────────────────────────────────────────
# HELPERS
# ────────────────────────────────────────────────

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def load_json_data(filename):
    path = os.path.join(DATA_DIR, filename)
    if os.path.exists(path):
        with open(path) as f:
            return json.load(f)
    return {}


# ────────────────────────────────────────────────
# ROUTES — PAGES
# ────────────────────────────────────────────────

@app.route('/')
def index():
    """Landing page with project overview."""
    return render_template('index.html')


@app.route('/dashboard')
def dashboard():
    """Tableau Dashboard embed page."""
    return render_template('dashboard.html')


@app.route('/story')
def story():
    """Tableau Story embed page."""
    return render_template('story.html')


@app.route('/analytics')
def analytics():
    """Live analytics page using processed data."""
    profile = load_json_data('data_profile.json')
    return render_template('analytics.html', profile=profile)


@app.route('/docs')
def docs():
    """Project documentation page."""
    return render_template('docs.html')


# ────────────────────────────────────────────────
# API ENDPOINTS
# ────────────────────────────────────────────────

@app.route('/api/brands')
def api_brands():
    conn = get_db_connection()
    rows = conn.execute("""
        SELECT Brand,
               SUM(Annual_Sales)           AS Total_Sales,
               ROUND(AVG(Customer_Rating), 2) AS Avg_Rating,
               ROUND(AVG(Driving_Range_km), 1) AS Avg_Range,
               ROUND(SUM(Market_Share_Percent), 2) AS Market_Share
        FROM ev_vehicles
        GROUP BY Brand
        ORDER BY Total_Sales DESC
    """).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route('/api/categories')
def api_categories():
    conn = get_db_connection()
    rows = conn.execute("""
        SELECT Category,
               COUNT(*) AS Model_Count,
               SUM(Annual_Sales) AS Total_Sales,
               ROUND(AVG(Price_USD), 0) AS Avg_Price,
               ROUND(AVG(Driving_Range_km), 1) AS Avg_Range,
               ROUND(AVG(Customer_Rating), 2) AS Avg_Rating
        FROM ev_vehicles
        GROUP BY Category
        ORDER BY Total_Sales DESC
    """).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route('/api/battery-tech')
def api_battery_tech():
    conn = get_db_connection()
    rows = conn.execute("""
        SELECT Battery_Tech,
               COUNT(*) AS Model_Count,
               SUM(Annual_Sales) AS Total_Sales,
               ROUND(AVG(Driving_Range_km), 1) AS Avg_Range,
               ROUND(AVG(Battery_Capacity_kWh), 1) AS Avg_Capacity,
               ROUND(AVG(Charging_Speed_kW), 1) AS Avg_Charging_Speed
        FROM ev_vehicles
        GROUP BY Battery_Tech
        ORDER BY Total_Sales DESC
    """).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route('/api/countries')
def api_countries():
    conn = get_db_connection()
    rows = conn.execute("""
        SELECT Manufacturing_Country,
               COUNT(*) AS Model_Count,
               SUM(Annual_Sales) AS Total_Sales,
               ROUND(AVG(Customer_Rating), 2) AS Avg_Rating
        FROM ev_vehicles
        GROUP BY Manufacturing_Country
        ORDER BY Total_Sales DESC
    """).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route('/api/top-models')
def api_top_models():
    limit = request.args.get('limit', 10, type=int)
    conn = get_db_connection()
    rows = conn.execute(f"""
        SELECT Brand, Model, Category, Annual_Sales,
               Customer_Rating, Driving_Range_km, Price_USD,
               Battery_Tech, Market_Share_Percent
        FROM ev_vehicles
        ORDER BY Annual_Sales DESC
        LIMIT {limit}
    """).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route('/api/kpis')
def api_kpis():
    conn = get_db_connection()
    row = conn.execute("""
        SELECT
            COUNT(*) AS Total_Models,
            COUNT(DISTINCT Brand) AS Total_Brands,
            SUM(Annual_Sales) AS Total_Sales,
            ROUND(AVG(Customer_Rating), 2) AS Avg_Rating,
            MAX(Driving_Range_km) AS Max_Range_km,
            ROUND(AVG(Price_USD), 0) AS Avg_Price_USD,
            SUM(Annual_Sales * CO2_Saved_kg_per_year) AS Total_CO2_Saved_kg
        FROM ev_vehicles
    """).fetchone()
    conn.close()
    return jsonify(dict(row))


@app.route('/api/vehicles')
def api_vehicles():
    """Full dataset endpoint with optional filtering."""
    brand    = request.args.get('brand', '')
    category = request.args.get('category', '')
    conn     = get_db_connection()
    query    = "SELECT * FROM ev_vehicles WHERE 1=1"
    params   = []
    if brand:
        query += " AND Brand LIKE ?"
        params.append(f'%{brand}%')
    if category:
        query += " AND Category = ?"
        params.append(category)
    query += " ORDER BY Annual_Sales DESC"
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


# ────────────────────────────────────────────────
# MAIN
# ────────────────────────────────────────────────

if __name__ == '__main__':
    print("\n  EV Market Performance & Insights — Flask Server")
    print("  Running at: http://localhost:5000\n")
    app.run(debug=True, host='0.0.0.0', port=5000)
