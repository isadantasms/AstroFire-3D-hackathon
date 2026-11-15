# SI-assisted: generated with Gemini, reviewed and edited by Elias & Pina
"""Vercel Serverless ASGI entrypoint for AstroFire 3D FastAPI backend."""
from pathlib import Path
import sys

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.app.main import app

__all__ = ["app"]
