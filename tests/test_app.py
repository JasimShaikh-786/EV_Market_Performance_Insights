"""
Tests for EV Market Performance & Insights Flask App
Run: python -m pytest tests/ -v
"""

import pytest
import sys
import os

# Make flask_app importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'flask_app'))

from app import app


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


# ── Page route tests ─────────────────────────────────────────

def test_index_loads(client):
    res = client.get('/')
    assert res.status_code == 200
    assert b'Electric Vehicle' in res.data or b'EV' in res.data


def test_dashboard_loads(client):
    res = client.get('/dashboard')
    assert res.status_code == 200


def test_story_loads(client):
    res = client.get('/story')
    assert res.status_code == 200


def test_analytics_loads(client):
    res = client.get('/analytics')
    assert res.status_code == 200


def test_docs_loads(client):
    res = client.get('/docs')
    assert res.status_code == 200


# ── API endpoint tests ───────────────────────────────────────

def test_api_brands_returns_json(client):
    res = client.get('/api/brands')
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
    if data:
        assert 'Brand' in data[0]
        assert 'Total_Sales' in data[0]


def test_api_categories_returns_json(client):
    res = client.get('/api/categories')
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)


def test_api_battery_tech_returns_json(client):
    res = client.get('/api/battery-tech')
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)


def test_api_countries_returns_json(client):
    res = client.get('/api/countries')
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)


def test_api_top_models_default_limit(client):
    res = client.get('/api/top-models')
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
    assert len(data) <= 10


def test_api_top_models_custom_limit(client):
    res = client.get('/api/top-models?limit=5')
    assert res.status_code == 200
    data = res.get_json()
    assert len(data) <= 5


def test_api_kpis_structure(client):
    res = client.get('/api/kpis')
    assert res.status_code == 200
    data = res.get_json()
    expected_keys = ['Total_Models', 'Total_Brands', 'Total_Sales', 'Avg_Rating']
    for key in expected_keys:
        assert key in data, f"Missing KPI key: {key}"


def test_api_vehicles_no_filter(client):
    res = client.get('/api/vehicles')
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)


def test_api_vehicles_brand_filter(client):
    res = client.get('/api/vehicles?brand=Tesla')
    assert res.status_code == 200
    data = res.get_json()
    if data:
        for v in data:
            assert 'Tesla' in v['Brand']


def test_api_vehicles_category_filter(client):
    res = client.get('/api/vehicles?category=SUV')
    assert res.status_code == 200
    data = res.get_json()
    if data:
        for v in data:
            assert v['Category'] == 'SUV'


def test_404_not_found(client):
    res = client.get('/nonexistent-route')
    assert res.status_code == 404
