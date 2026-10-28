"""
Electric Vehicle Market Performance & Insights
Data Preparation Script
Cleans, transforms, and prepares EV dataset for Tableau visualization
"""

import pandas as pd
import numpy as np
import sqlite3
import os
import json
import warnings
warnings.filterwarnings('ignore')

# ─────────────────────────────────────────────
# CONFIGURATION
# ─────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DATA = os.path.join(BASE_DIR, '..', 'data', 'raw', 'ev_market_data.csv')
PROCESSED_DIR = os.path.join(BASE_DIR, '..', 'data', 'processed')
DB_PATH = os.path.join(BASE_DIR, '..', 'data', 'ev_market.db')

os.makedirs(PROCESSED_DIR, exist_ok=True)


def load_raw_data(path):
    """Load the raw CSV dataset."""
    df = pd.read_csv(path)
    print(f"[OK] Loaded {len(df)} records from raw dataset")
    return df


def clean_data(df):
    """
    Clean and validate the EV dataset:
    - Handle missing values
    - Remove duplicates
    - Standardize formats
    - Validate numeric ranges
    """
    original_count = len(df)

    # Drop duplicates
    df = df.drop_duplicates(subset='Vehicle_ID')

    # Handle missing values
    numeric_cols = ['Battery_Capacity_kWh', 'Driving_Range_km', 'Charging_Speed_kW',
                    'Price_USD', 'Annual_Sales', 'Market_Share_Percent',
                    'Customer_Rating', 'Lifespan_Years', 'CO2_Saved_kg_per_year']
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
            df[col].fillna(df[col].median(), inplace=True)

    # Standardize text fields
    for col in ['Brand', 'Model', 'Category', 'Battery_Tech', 'Manufacturing_Country']:
        df[col] = df[col].str.strip().str.title()

    # Clip Customer_Rating to valid range
    df['Customer_Rating'] = df['Customer_Rating'].clip(1.0, 5.0)

    # Clip Market Share
    df['Market_Share_Percent'] = df['Market_Share_Percent'].clip(0, 100)

    cleaned_count = len(df)
    print(f"[OK] Cleaned data: {original_count} → {cleaned_count} records "
          f"({original_count - cleaned_count} duplicates removed)")
    return df


def engineer_features(df):
    """
    Create derived metrics for richer Tableau visualizations.
    """
    # Price Segment
    df['Price_Segment'] = pd.cut(
        df['Price_USD'],
        bins=[0, 35000, 55000, 90000, float('inf')],
        labels=['Budget (<$35K)', 'Mid-Range ($35K-$55K)',
                'Premium ($55K-$90K)', 'Luxury (>$90K)']
    )

    # Range Tier
    df['Range_Tier'] = pd.cut(
        df['Driving_Range_km'],
        bins=[0, 350, 500, 650, float('inf')],
        labels=['Short (<350km)', 'Medium (350-500km)',
                'Long (500-650km)', 'Ultra-Long (>650km)']
    )

    # Charging Speed Category
    df['Charging_Category'] = pd.cut(
        df['Charging_Speed_kW'],
        bins=[0, 80, 150, 250, float('inf')],
        labels=['Standard (<80kW)', 'Fast (80-150kW)',
                'DC Fast (150-250kW)', 'Ultra-Fast (>250kW)']
    )

    # Revenue Estimate (Price × Sales)
    df['Estimated_Revenue_USD'] = df['Price_USD'] * df['Annual_Sales']

    # Value Score: Range per $1000 of price
    df['Value_Score'] = (df['Driving_Range_km'] / (df['Price_USD'] / 1000)).round(2)

    # Total CO2 Impact
    df['Total_CO2_Saved_kg'] = df['CO2_Saved_kg_per_year'] * df['Annual_Sales']

    # Rating Category
    df['Rating_Category'] = pd.cut(
        df['Customer_Rating'],
        bins=[0, 3.5, 4.0, 4.5, 5.0],
        labels=['Below Average', 'Average', 'Good', 'Excellent']
    )

    # Region mapping
    region_map = {
        'Usa': 'North America', 'China': 'Asia-Pacific',
        'Germany': 'Europe', 'Sweden': 'Europe',
        'South Korea': 'Asia-Pacific', 'Japan': 'Asia-Pacific',
        'France': 'Europe', 'Italy': 'Europe'
    }
    df['Region'] = df['Manufacturing_Country'].map(region_map).fillna('Other')

    print("[OK] Feature engineering complete — 8 new columns added")
    return df


def generate_aggregated_tables(df):
    """
    Generate pre-aggregated summary tables for Tableau performance.
    """
    # Brand-level summary
    brand_summary = df.groupby('Brand').agg(
        Total_Models=('Vehicle_ID', 'count'),
        Total_Sales=('Annual_Sales', 'sum'),
        Total_Market_Share=('Market_Share_Percent', 'sum'),
        Avg_Price=('Price_USD', 'mean'),
        Avg_Range=('Driving_Range_km', 'mean'),
        Avg_Rating=('Customer_Rating', 'mean'),
        Total_Revenue=('Estimated_Revenue_USD', 'sum'),
        Total_CO2_Saved=('Total_CO2_Saved_kg', 'sum')
    ).reset_index().round(2)
    brand_summary.sort_values('Total_Sales', ascending=False, inplace=True)

    # Category-level summary
    category_summary = df.groupby('Category').agg(
        Model_Count=('Vehicle_ID', 'count'),
        Total_Sales=('Annual_Sales', 'sum'),
        Avg_Price=('Price_USD', 'mean'),
        Avg_Range=('Driving_Range_km', 'mean'),
        Avg_Rating=('Customer_Rating', 'mean'),
        Avg_Battery=('Battery_Capacity_kWh', 'mean'),
        Total_CO2_Saved=('Total_CO2_Saved_kg', 'sum')
    ).reset_index().round(2)

    # Battery tech summary
    battery_summary = df.groupby('Battery_Tech').agg(
        Model_Count=('Vehicle_ID', 'count'),
        Total_Sales=('Annual_Sales', 'sum'),
        Avg_Range=('Driving_Range_km', 'mean'),
        Avg_Capacity=('Battery_Capacity_kWh', 'mean'),
        Avg_Charging_Speed=('Charging_Speed_kW', 'mean'),
        Avg_Rating=('Customer_Rating', 'mean')
    ).reset_index().round(2)

    # Country summary
    country_summary = df.groupby('Manufacturing_Country').agg(
        Model_Count=('Vehicle_ID', 'count'),
        Total_Sales=('Annual_Sales', 'sum'),
        Avg_Rating=('Customer_Rating', 'mean'),
        Total_Revenue=('Estimated_Revenue_USD', 'sum')
    ).reset_index().round(2)

    return {
        'brand_summary': brand_summary,
        'category_summary': category_summary,
        'battery_summary': battery_summary,
        'country_summary': country_summary
    }


def save_to_sqlite(df, summaries, db_path):
    """Store cleaned data and summaries in SQLite for Tableau connection."""
    conn = sqlite3.connect(db_path)
    df.to_sql('ev_vehicles', conn, if_exists='replace', index=False)
    for table_name, table_df in summaries.items():
        table_df.to_sql(table_name, conn, if_exists='replace', index=False)
    conn.close()
    print(f"[OK] SQLite database saved → {db_path}")


def save_processed_csvs(df, summaries, output_dir):
    """Save processed CSVs for Tableau Public / direct import."""
    df.to_csv(os.path.join(output_dir, 'ev_cleaned.csv'), index=False)
    for name, table in summaries.items():
        table.to_csv(os.path.join(output_dir, f'{name}.csv'), index=False)
    print(f"[OK] Processed CSVs saved → {output_dir}")


def generate_data_profile(df):
    """Generate a JSON data quality report."""
    profile = {
        'total_records': int(len(df)),
        'total_brands': int(df['Brand'].nunique()),
        'total_categories': int(df['Category'].nunique()),
        'battery_technologies': df['Battery_Tech'].value_counts().to_dict(),
        'countries': df['Manufacturing_Country'].value_counts().to_dict(),
        'price_range': {
            'min': float(df['Price_USD'].min()),
            'max': float(df['Price_USD'].max()),
            'mean': float(df['Price_USD'].mean().round(2))
        },
        'range_km': {
            'min': int(df['Driving_Range_km'].min()),
            'max': int(df['Driving_Range_km'].max()),
            'mean': float(df['Driving_Range_km'].mean().round(1))
        },
        'total_annual_sales': int(df['Annual_Sales'].sum()),
        'avg_customer_rating': float(df['Customer_Rating'].mean().round(2)),
        'total_co2_saved_kg': int(df['Total_CO2_Saved_kg'].sum())
    }
    profile_path = os.path.join(PROCESSED_DIR, 'data_profile.json')
    with open(profile_path, 'w') as f:
        json.dump(profile, f, indent=2)
    print(f"[OK] Data profile saved → {profile_path}")
    return profile


def main():
    print("\n" + "="*55)
    print("  EV Market Performance & Insights — Data Prep")
    print("="*55 + "\n")

    df = load_raw_data(RAW_DATA)
    df = clean_data(df)
    df = engineer_features(df)
    summaries = generate_aggregated_tables(df)
    save_to_sqlite(df, summaries, DB_PATH)
    save_processed_csvs(df, summaries, PROCESSED_DIR)
    profile = generate_data_profile(df)

    print("\n── Data Profile Summary ──")
    print(f"  Total Records    : {profile['total_records']}")
    print(f"  Total Brands     : {profile['total_brands']}")
    print(f"  Total Sales      : {profile['total_annual_sales']:,}")
    print(f"  Avg Rating       : {profile['avg_customer_rating']}")
    print(f"  CO2 Saved (kg)   : {profile['total_co2_saved_kg']:,}")
    print("\n[OK] Data preparation complete!\n")


if __name__ == '__main__':
    main()
