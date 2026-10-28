"""
Vercel Serverless Entrypoint for EV Market Performance & Insights
"""
import sys
import os

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, '..'))
FLASK_DIR = os.path.join(PROJECT_ROOT, 'flask_app')

if FLASK_DIR not in sys.path:
    sys.path.insert(0, FLASK_DIR)
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from app import app

# Vercel WSGI entry point
# 'app' instance is exported directly
