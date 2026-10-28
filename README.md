# Electric Vehicle Market Performance & Insights

A complete **Data Analytics with Tableau** project built for the SkillWallet platform.

## 🚀 Project Overview

This project analyzes the global electric vehicle (EV) market across 50 models from 22 brands in 8 manufacturing countries. It delivers interactive Tableau dashboards, a narrative data story, and a Flask web application for end-to-end data storytelling.

### 🎯 User Scenarios
- **Emily Johnson** — EV Market Strategy Director: executive-level market insights
- **David Chen** — Automotive BI Manager: competitive intelligence & market positioning  
- **Dr. Sarah Williams** — Sustainable Mobility Analyst: battery tech & CO₂ impact research

---

## 📁 Project Structure

```
EV_Market_Performance_Insights/
├── data/
│   ├── raw/               # Source CSV dataset (50 EV models)
│   ├── processed/         # Cleaned CSVs + aggregated summaries
│   ├── sql/               # MySQL schema + analytical queries
│   └── ev_market.db       # SQLite database (Tableau-ready)
├── notebooks/
│   └── data_preparation.py  # Data cleaning + feature engineering
├── flask_app/
│   ├── app.py             # Flask web server + REST API
│   ├── templates/         # HTML pages (index, dashboard, story, analytics, docs)
│   └── static/            # CSS + JS assets
├── tests/
│   └── test_app.py        # Pytest test suite
├── docs/
│   └── project_report.md
├── requirements.txt
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Data Storage | SQLite / MySQL |
| Data Processing | Python (pandas, numpy) |
| Visualization | Tableau Public |
| Web Framework | Flask 3.x |
| Frontend | HTML5, CSS3, Chart.js |
| Version Control | Git / GitHub |

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Prepare the Data
```bash
python notebooks/data_preparation.py
```

### 3. Run the Web App
```bash
cd flask_app
python app.py
```

Visit **http://localhost:5000**

### 4. Run Tests
```bash
python -m pytest tests/ -v
```

---

## 📊 Project Epics (8 Total)

| # | Epic | Key Tasks |
|---|------|-----------|
| 1 | Data Collection & Extraction | Download dataset, SQL setup, Tableau connect |
| 2 | Data Preparation | Clean, transform, engineer features |
| 3 | Data Visualizations | 7 unique chart types |
| 4 | Dashboard | Interactive responsive dashboard |
| 5 | Story | 5-scene narrative presentation |
| 6 | Performance Testing | Filters, calculated fields, optimization |
| 7 | Web Integration | Tableau Public publish + Flask embed |
| 8 | Demonstration & Documentation | Project report + walkthrough |

---

## 📈 Key Insights

- **Market Leader**: Tesla Model Y — 24.3% market share, 604,000 annual sales
- **Battery Trend**: NMC powers 60% of models; LFP growing for affordability
- **Top Range**: Mercedes EQS achieves 857km; NIO ET5 reaches 1000km with Solid-State
- **CO₂ Impact**: Combined fleet saves **8.2 billion kg** CO₂ per year
- **Manufacturing**: China leads volume; Germany leads premium quality

---

## 🔗 Links

- **Live Local Demo**: [http://localhost:5000](http://localhost:5000)
- **GitHub Repository**: [https://github.com/JasimShaikh-786/EV_Market_Performance_Insights](https://github.com/JasimShaikh-786/EV_Market_Performance_Insights)

---

## 📄 Skills Required

`Dashboard` · `Data Visualization` · `Data Visualization (Tableau)` · `Data Analysis` · `Tableau (Business Intelligence Software)`

---

## 👤 Author

**Jasim Shaikh** ([@JasimShaikh-786](https://github.com/JasimShaikh-786))  
Program: **SkillWallet — Data Analytics with Tableau**  
Project: **Electric Vehicle Market Performance & Insights**  
Date: October 2026
