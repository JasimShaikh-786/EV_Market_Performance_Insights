"""
Electric Vehicle Market Performance & Insights
Flask Web Application — Embeds Tableau Dashboard + Story
Production & Serverless Ready (Works Locally and on Vercel)
"""

from flask import Flask, render_template, jsonify, request
import sqlite3
import csv
import json
import os

BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR  = os.path.abspath(os.path.join(BASE_DIR, '..'))
DB_PATH   = os.path.join(ROOT_DIR, 'data', 'ev_market.db')
RAW_CSV   = os.path.join(ROOT_DIR, 'data', 'raw', 'ev_market_data.csv')
DATA_DIR  = os.path.join(ROOT_DIR, 'data', 'processed')

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, 'templates'),
    static_folder=os.path.join(BASE_DIR, 'static')
)

_shared_mem_db = None


# ────────────────────────────────────────────────
# ROBUST DATABASE CONNECTION & ZERO-CRASH QUERIES
# ────────────────────────────────────────────────

def get_db_connection():
    global _shared_mem_db
    if _shared_mem_db is not None:
        return _shared_mem_db

    # 1. Attempt connection to SQLite DB on disk
    if os.path.exists(DB_PATH):
        try:
            conn = sqlite3.connect(f"file:{os.path.abspath(DB_PATH)}?mode=ro", uri=True)
            conn.row_factory = sqlite3.Row
            conn.execute("SELECT 1 FROM ev_vehicles LIMIT 1")
            return conn
        except Exception:
            try:
                conn = sqlite3.connect(DB_PATH)
                conn.row_factory = sqlite3.Row
                conn.execute("SELECT 1 FROM ev_vehicles LIMIT 1")
                return conn
            except Exception:
                pass

    # 2. Build in-memory SQLite database from CSV (Fail-safe for Vercel Serverless)
    mem_conn = sqlite3.connect(':memory:', check_same_thread=False)
    mem_conn.row_factory = sqlite3.Row
    mem_conn.execute('''CREATE TABLE IF NOT EXISTS ev_vehicles (
        Vehicle_ID TEXT PRIMARY KEY,
        Brand TEXT, Model TEXT, Category TEXT, Year INTEGER,
        Battery_Tech TEXT, Battery_Capacity_kWh REAL, Driving_Range_km INTEGER,
        Charging_Speed_kW INTEGER, Price_USD REAL, Annual_Sales INTEGER,
        Market_Share_Percent REAL, Manufacturing_Country TEXT,
        Customer_Rating REAL, Lifespan_Years INTEGER, CO2_Saved_kg_per_year INTEGER
    )''')

    if os.path.exists(RAW_CSV):
        with open(RAW_CSV, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for r in reader:
                mem_conn.execute('''INSERT OR REPLACE INTO ev_vehicles VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)''', (
                    r['Vehicle_ID'], r['Brand'], r['Model'], r['Category'], int(r['Year']),
                    r['Battery_Tech'], float(r['Battery_Capacity_kWh']), int(r['Driving_Range_km']),
                    int(r['Charging_Speed_kW']), float(r['Price_USD']), int(r['Annual_Sales']),
                    float(r['Market_Share_Percent']), r['Manufacturing_Country'],
                    float(r['Customer_Rating']), int(r['Lifespan_Years']), int(r['CO2_Saved_kg_per_year'])
                ))
        mem_conn.commit()

    _shared_mem_db = mem_conn
    return _shared_mem_db


def query_db(sql, params=(), one=False):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(sql, params)
    rv = cur.fetchall()
    cur.close()
    if conn != _shared_mem_db:
        conn.close()
    return (rv[0] if rv else None) if one else rv


def load_json_data(filename):
    path = os.path.join(DATA_DIR, filename)
    if os.path.exists(path):
        with open(path, encoding='utf-8') as f:
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
    """Executive Dashboard page."""
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
    rows = query_db("""
        SELECT Brand,
               SUM(Annual_Sales)           AS Total_Sales,
               ROUND(AVG(Customer_Rating), 2) AS Avg_Rating,
               ROUND(AVG(Driving_Range_km), 1) AS Avg_Range,
               ROUND(SUM(Market_Share_Percent), 2) AS Market_Share
        FROM ev_vehicles
        GROUP BY Brand
        ORDER BY Total_Sales DESC
    """)
    return jsonify([dict(r) for r in rows])


@app.route('/api/categories')
def api_categories():
    rows = query_db("""
        SELECT Category,
               COUNT(*) AS Model_Count,
               SUM(Annual_Sales) AS Total_Sales,
               ROUND(AVG(Price_USD), 0) AS Avg_Price,
               ROUND(AVG(Driving_Range_km), 1) AS Avg_Range,
               ROUND(AVG(Customer_Rating), 2) AS Avg_Rating
        FROM ev_vehicles
        GROUP BY Category
        ORDER BY Total_Sales DESC
    """)
    return jsonify([dict(r) for r in rows])


@app.route('/api/battery-tech')
def api_battery_tech():
    rows = query_db("""
        SELECT Battery_Tech,
               COUNT(*) AS Model_Count,
               SUM(Annual_Sales) AS Total_Sales,
               ROUND(AVG(Driving_Range_km), 1) AS Avg_Range,
               ROUND(AVG(Battery_Capacity_kWh), 1) AS Avg_Capacity,
               ROUND(AVG(Charging_Speed_kW), 1) AS Avg_Charging_Speed
        FROM ev_vehicles
        GROUP BY Battery_Tech
        ORDER BY Total_Sales DESC
    """)
    return jsonify([dict(r) for r in rows])


@app.route('/api/countries')
def api_countries():
    rows = query_db("""
        SELECT Manufacturing_Country,
               COUNT(*) AS Model_Count,
               SUM(Annual_Sales) AS Total_Sales,
               ROUND(AVG(Customer_Rating), 2) AS Avg_Rating
        FROM ev_vehicles
        GROUP BY Manufacturing_Country
        ORDER BY Total_Sales DESC
    """)
    return jsonify([dict(r) for r in rows])


@app.route('/api/top-models')
def api_top_models():
    limit = request.args.get('limit', 10, type=int)
    rows = query_db("""
        SELECT Brand, Model, Category, Annual_Sales,
               Customer_Rating, Driving_Range_km, Price_USD,
               Battery_Tech, Market_Share_Percent
        FROM ev_vehicles
        ORDER BY Annual_Sales DESC
        LIMIT ?
    """, (limit,))
    return jsonify([dict(r) for r in rows])


@app.route('/api/kpis')
def api_kpis():
    row = query_db("""
        SELECT
            COUNT(*) AS Total_Models,
            COUNT(DISTINCT Brand) AS Total_Brands,
            SUM(Annual_Sales) AS Total_Sales,
            ROUND(AVG(Customer_Rating), 2) AS Avg_Rating,
            MAX(Driving_Range_km) AS Max_Range_km,
            ROUND(AVG(Price_USD), 0) AS Avg_Price_USD,
            SUM(Annual_Sales * CO2_Saved_kg_per_year) AS Total_CO2_Saved_kg
        FROM ev_vehicles
    """, one=True)
    return jsonify(dict(row) if row else {})


@app.route('/api/vehicles')
def api_vehicles():
    """Full dataset endpoint with optional filtering."""
    brand    = request.args.get('brand', '')
    category = request.args.get('category', '')
    sql = "SELECT * FROM ev_vehicles WHERE 1=1"
    params = []
    if brand:
        sql += " AND Brand LIKE ?"
        params.append(f'%{brand}%')
    if category:
        sql += " AND Category = ?"
        params.append(category)
    sql += " ORDER BY Annual_Sales DESC"
    rows = query_db(sql, params)
    return jsonify([dict(r) for r in rows])


# ────────────────────────────────────────────────
# MAIN
# ────────────────────────────────────────────────

if __name__ == '__main__':
    print("\n  EV Market Performance & Insights — Flask Server")
    print("  Running at: http://localhost:5000\n")
    app.run(debug=True, host='0.0.0.0', port=5000)
