from fastapi import APIRouter, BackgroundTasks, HTTPException, status
from pydantic import ValidationError

from ..flows.analyze import start_analysis_flow
from ..models import AnalyzeRequest, AnalyzeResponse, RunRecord, RunStatusResponse
from ..storage.runs import run_store

router = APIRouter(tags=["runs"])


@router.post("/analyze", response_model=AnalyzeResponse, status_code=status.HTTP_202_ACCEPTED)
async def analyze(request: AnalyzeRequest, background_tasks: BackgroundTasks) -> AnalyzeResponse:
    record = run_store.create(request.idea)
    background_tasks.add_task(start_analysis_flow, record.run_id, request.idea, request.demo_mode)
    return AnalyzeResponse(run_id=record.run_id, status=record.status)


@router.get("/runs/{run_id}/status", response_model=RunStatusResponse)
async def get_run_status(run_id: str) -> RunStatusResponse:
    record = _get_run_or_404(run_id)
    return RunStatusResponse(
        run_id=record.run_id,
        status=record.status,
        created_at=record.created_at,
        updated_at=record.updated_at,
        progress_message=record.progress_message,
        error_message=record.error_message,
        data_source=record.data_source,
    )


@router.get("/runs/{run_id}/result", response_model=RunRecord)
async def get_run_result(run_id: str) -> RunRecord:
    return _get_run_or_404(run_id)


def _get_run_or_404(run_id: str) -> RunRecord:
    try:
        return run_store.get(run_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=f"Run {run_id} was not found") from exc
    except ValidationError as exc:
        raise HTTPException(status_code=500, detail=f"Run {run_id} has corrupted data") from exc