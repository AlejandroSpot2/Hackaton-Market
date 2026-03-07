from __future__ import annotations

import os
from pathlib import Path


class Settings:
    def __init__(self) -> None:
        from dotenv import load_dotenv
        load_dotenv(Path(__file__).resolve().parents[1] / ".env")
        
        self.service_root = Path(__file__).resolve().parents[1]
        self.repo_root = Path(__file__).resolve().parents[3]
        self.runs_dir = self._resolve_path(
            os.getenv("RUNS_DIR"),
            self.repo_root / "data" / "runs",
        )
        self.fixtures_dir = self._resolve_path(
            os.getenv("FIXTURES_DIR"),
            self.repo_root / "data" / "fixtures",
        )
        origins = os.getenv("CORS_ORIGINS", "http://localhost:3000")
        self.cors_origins = [origin.strip() for origin in origins.split(",") if origin.strip()]
        self.gmi_api_key: str | None = os.getenv("GMI_API_KEY") or None
        self.exa_api_key: str | None = os.getenv("EXA_API_KEY") or None

    def _resolve_path(self, raw: str | None, fallback: Path) -> Path:
        if not raw:
            return fallback

        path = Path(raw)
        if path.is_absolute():
            return path

        return (self.service_root / path).resolve()


settings = Settings()