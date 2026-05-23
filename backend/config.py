"""
Central configuration — all environment variables live here.
Import from here everywhere; never call os.getenv() in other modules.
"""
import os
from dotenv import load_dotenv

load_dotenv()

# ── AI ──────────────────────────────────────────────────────────────────────
OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o")

# ── App ──────────────────────────────────────────────────────────────────────
APP_ENV: str = os.getenv("APP_ENV", "development")
ALLOWED_ORIGINS: list[str] = os.getenv("ALLOWED_ORIGINS", "*").split(",")

# ── Storage ───────────────────────────────────────────────────────────────────
STORAGE_DIR: str = os.path.join(
    os.path.dirname(__file__), "storage"
)

