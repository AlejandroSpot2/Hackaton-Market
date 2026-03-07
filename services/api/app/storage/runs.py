from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from ..config import settings
from ..models import RunRecord, RunResult, RunStatus


class RunStore:
    def __init__(self, runs_dir: Path) -> None:
        self.runs_dir = runs_dir
        self.runs_dir.mkdir(parents=True, exist_ok=True)

    def create(self, idea: str) -> RunRecord:
        now = self._utc_now()
        run_id = f"run_{now.strftime('%Y%m%d%H%M%S')}_{uuid4().hex[:8]}"
        record = RunRecord(
            run_id=run_id,
            idea=idea,
            status="queued",
            created_at=now,
            updated_at=now,
            progress_message="Run queued. Preparing market scan.",
        )
        self.save(record)
        return record

    def get(self, run_id: str) -> RunRecord:
        path = self._path_for(run_id)
        if not path.exists():
            raise FileNotFoundError(run_id)

        data = json.loads(path.read_text(encoding="utf-8"))
        return RunRecord.model_validate(data)

    def save(self, record: RunRecord) -> RunRecord:
        payload = json.dumps(record.model_dump(mode="json"), indent=2)
        path = self._path_for(record.run_id)
        temp_path = path.with_suffix(".tmp")
        temp_path.write_text(payload, encoding="utf-8")
        temp_path.replace(path)
        return record

    def update(
        self,
        run_id: str,
        *,
        status: RunStatus | None = None,
        progress_message: str | None = None,
        error_message: str | None = None,
        result: RunResult | None = None,
    ) -> RunRecord:
        record = self.get(run_id)

        if status is not None:
            record.status = status
        if progress_message is not None:
            record.progress_message = progress_message
        if error_message is not None:
            record.error_message = error_message
        if result is not None:
            record.result = result

        record.updated_at = self._utc_now()
        return self.save(record)

    def _path_for(self, run_id: str) -> Path:
        return self.runs_dir / f"{run_id}.json"

    @staticmethod
    def _utc_now() -> datetime:
        return datetime.now(timezone.utc)


run_store = RunStore(settings.runs_dir)