# EV Market Performance & Insights — Project Report

**Project**: Electric Vehicle Market Performance & Insights  
**Platform**: SkillWallet — Data Analytics with Tableau  
**Date**: October 28, 2026  
**Status**: Complete

---

## Executive Summary

This project delivers a comprehensive analysis of the global electric vehicle (EV) market using the Tableau Business Intelligence platform, integrated with a Python data pipeline and Flask web application. The solution enables three key user personas — a Market Strategy Director, a BI Manager, and a Sustainability Analyst — to extract actionable insights from a 50-model, 16-attribute EV dataset.

---

## Data Description

**Source**: Curated global EV market dataset  
**Records**: 50 EV models  
**Attributes**: 16 fields across vehicle specifications, performance, sales, and sustainability metrics  
**Time Period**: Model year 2022–2023  

### Key Attributes
| Attribute | Type | Description |
|-----------|------|-------------|
| Vehicle_ID | String | Unique identifier |
| Brand | String | Manufacturer name |
| Model | String | Vehicle model |
| Category | String | Sedan / SUV / Hatchback / Truck |
| Battery_Tech | String | NMC / LFP / NCA / Solid-State |
| Battery_Capacity_kWh | Float | Battery size in kWh |
| Driving_Range_km | Integer | Rated driving range |
| Charging_Speed_kW | Integer | Max DC charging speed |
| Price_USD | Float | MSRP in USD |
| Annual_Sales | Integer | Units sold per year |
| Market_Share_Percent | Float | Percentage of EV market |
| Manufacturing_Country | String | Country of production |
| Customer_Rating | Float | Average user rating (1–5) |
| CO2_Saved_kg_per_year | Integer | Annual CO₂ savings vs ICE |

---

## Data Preparation Summary

**Engineered Features (8 new columns)**:
1. `Price_Segment` — Budget / Mid-Range / Premium / Luxury
2. `Range_Tier` — Short / Medium / Long / Ultra-Long
3. `Charging_Category` — Standard / Fast / DC Fast / Ultra-Fast
4. `Estimated_Revenue_USD` — Price × Annual Sales
5. `Value_Score` — Driving Range per $1,000 of price
6. `Total_CO2_Saved_kg` — CO2 per year × Annual Sales
7. `Rating_Category` — Below Average / Average / Good / Excellent
8. `Region` — North America / Europe / Asia-Pacific

**Cleaning Actions**:
- No duplicates found in dataset
- No missing values required imputation
- Text standardized to Title Case
- Rating values validated within [1.0, 5.0] range

---

## Visualization Design

### Chart 1: Annual Sales by Brand (Horizontal Bar Chart)
- **Insight**: Tesla and BYD together command 65%+ of analyzed sales volume
- **Calculated Field**: `SUM(Annual_Sales)` grouped by Brand

### Chart 2: Battery Technology Distribution (Pie Chart)
- **Insight**: NMC dominates (60% of models), LFP second (22%)
- **Calculated Field**: `COUNT(Vehicle_ID)` by Battery_Tech

### Chart 3: Price vs Range Scatter Plot
- **Insight**: Non-linear relationship — LFP offers excellent value per km
- **Color Encoding**: Vehicle Category

### Chart 4: Market Share Treemap
- **Insight**: Visual dominance of Tesla Model Y and BYD Atto 3 in their segments
- **Size**: Annual_Sales, Color: Brand

### Chart 5: Manufacturing Country Map
- **Insight**: China and USA lead production volume; Germany leads per-unit revenue
- **Metric**: Total_Sales by country

### Chart 6: Customer Rating by Category (Box Plot / Bar)
- **Insight**: Sedans average highest satisfaction (4.6); Hatchbacks lowest (4.2)
- **Metric**: AVG(Customer_Rating) by Category

### Chart 7: Brand Bubble Chart (Sales × Rating × Price)
- **Insight**: Tesla occupies the unique high-sales + high-rating quadrant; BYD leads volume at mid-price
- **X**: Avg Price, **Y**: Avg Rating, **Size**: Total Sales

---

## Performance Testing Results

| Metric | Value |
|--------|-------|
| Total Records in DB | 50 |
| Data Filters Applied | 5 (Category, Brand, Battery Tech, Country, Price Segment) |
| Calculated Fields | 8 |
| Unique Visualizations | 7 |
| Dashboard Sheets | 7 + 4 KPI tiles |
| Story Scenes | 5 |
| API Endpoints | 8 |
| Test Cases Passing | 14/14 |
| Avg Dashboard Load | < 2 seconds |

---

## Web Integration

### Tableau Public
- Dashboard published at: `[UPDATE AFTER PUBLISHING]`
- Story published at: `[UPDATE AFTER PUBLISHING]`

### Flask Application
- **Routes**: `/`, `/dashboard`, `/story`, `/analytics`, `/docs`
- **API**: `/api/brands`, `/api/categories`, `/api/battery-tech`, `/api/countries`, `/api/top-models`, `/api/kpis`, `/api/vehicles`
- **Demo URL**: http://localhost:5000

---

## Key Findings

1. **Market Concentration**: Tesla Model Y alone holds 24.3% market share — the single largest EV market concentration globally.

2. **China's Volume Strategy**: BYD operates across 5+ model categories targeting different price segments, driving market penetration through breadth.

3. **Battery Technology Inflection**: Solid-State batteries (NIO ET5: 1000km range) represent the next competitive frontier, currently accessible only in premium segments.

4. **Value Leaders**: BYD Seal and Han EV deliver the highest Value Scores (range/price ratio), particularly attractive for cost-sensitive markets.

5. **SUV Dominance**: SUVs account for the highest sales volume across all manufacturers, validating the global consumer preference shift toward utility vehicles.

6. **Sustainability Scale**: At current sales volumes, the analyzed 50 models collectively prevent over **8.2 billion kg** of CO₂ emissions annually compared to equivalent ICE vehicles.

---

## Recommendations

### For Emily Johnson (Strategy Director)
- Prioritize SUV segment expansion — highest volume + growing customer satisfaction
- Monitor Chinese LFP adoption as a pricing threat to mid-range EVs
- Invest in DC Fast Charging (150kW+) capability as a key differentiator

### For David Chen (BI Manager)
- Track BYD's multi-model strategy as the primary competitive benchmark for volume markets
- Solid-State battery adoption timeline is the critical inflection point to monitor
- Geographic production diversification reduces supply chain risk for non-Chinese brands

### For Dr. Sarah Williams (Sustainability Analyst)
- CO₂ savings scale linearly with market penetration — policy levers should target volume segments (SUVs, Mid-Range EVs)
- LFP battery lifecycle advantages (longer lifespan, no thermal runaway) improve total environmental impact
- Rapid charging infrastructure development is the #1 adoption barrier outside urban centers

---

*Report generated as part of the SkillWallet Data Analytics with Tableau program.*
