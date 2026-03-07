from __future__ import annotations

import os
import threading
import time
from typing import Any, Callable, TypeVar

from ..config import settings
from ..providers.fixtures import select_fixture_bundle
from ..providers.exa import search_competitors
from ..providers.gemini import generate_pulse, generate_deep_insights
from ..storage.runs import run_store
from ..models import RunResult

os.environ.setdefault("PREFECT_HOME", str(settings.repo_root / ".prefect"))

try:
    from prefect import flow, task
except ImportError:
    FuncT = TypeVar("FuncT", bound=Callable[..., Any])

    def _passthrough(*_args: Any, **_kwargs: Any):
        def decorator(func: FuncT) -> FuncT:
            return func

        return decorator

    flow = _passthrough
    task = _passthrough


@task(name="mark-running")
def mark_running(run_id: str) -> None:
    run_store.update(
        run_id,
        status="running",
        progress_message="Scanning the market surface and clustering the first competitors.",
    )


@task(name="select-fixture")
def select_fixture(idea: str):
    return select_fixture_bundle(idea)


@task(name="write-pulse")
def write_pulse(run_id: str, pulse_result) -> None:
    run_store.update(
        run_id,
        status="pulse_ready",
        progress_message="Market Pulse ready. Expanding the atlas and summary cards.",
        result=pulse_result,
    )


@task(name="write-complete")
def write_complete(run_id: str, final_result) -> None:
    run_store.update(
        run_id,
        status="complete",
        progress_message="Market Atlas complete.",
        result=final_result,
    )


@flow(name="realitycheck-analysis", log_prints=True)
def analyze_run_flow(run_id: str, idea: str, demo_mode: bool = True) -> None:
    _invoke(mark_running, run_id)
    
    # 1. Demo Mode Branch
    if demo_mode:
        fixture_bundle = _invoke(select_fixture, idea)
        time.sleep(1.5)
        _invoke(write_pulse, run_id, fixture_bundle.pulse_result)
        time.sleep(2.0)
        _invoke(write_complete, run_id, fixture_bundle.final_result)
        return

    # 2. Live Provider Branch
    try:
        # Phase 1: Exa Search and Gemini Pulse
        matches = search_competitors(idea)
        phase1_data = generate_pulse(idea, matches)
        
        if not phase1_data:
            raise ValueError("Failed to generate Phase 1 Pulse from Gemini")
            
        pulse_result = RunResult(
            idea=idea,
            pulse=phase1_data.pulse,
            atlas=phase1_data.atlas,
            competitor_details={},
            sources=[doc.get("url") for doc in matches if doc.get("url")]
        )
        
        _invoke(write_pulse, run_id, pulse_result)
        
        # Phase 2: Gemini Deep Insights
        phase2_data = generate_deep_insights(idea, phase1_data.atlas, matches)
        
        if not phase2_data:
            raise ValueError("Failed to generate Phase 2 Insights from Gemini")
            
        final_result = pulse_result.model_copy(deep=True)
        final_result.competitor_details = phase2_data.competitor_details
        final_result.brutal_truth = phase2_data.brutal_truth
        final_result.opportunity = phase2_data.opportunity
        
        _invoke(write_complete, run_id, final_result)
        
    except Exception as exc:
        print(f"Live flow failed, falling back to demo fixture: {exc}")
        # Graceful fallback to fixtures so UI never breaks
        fixture_bundle = _invoke(select_fixture, idea)
        _invoke(write_pulse, run_id, fixture_bundle.pulse_result)
        # We write complete immediately because we are already delayed by the failure
        _invoke(write_complete, run_id, fixture_bundle.final_result)


def start_analysis_flow(run_id: str, idea: str, demo_mode: bool = True) -> None:
    worker = threading.Thread(
        target=_run_flow_safely,
        args=(run_id, idea, demo_mode),
        daemon=True,
        name=f"analysis-{run_id}",
    )
    worker.start()


def _run_flow_safely(run_id: str, idea: str, demo_mode: bool) -> None:
    try:
        _invoke(analyze_run_flow, run_id, idea, demo_mode)
    except Exception as exc:
        run_store.update(
            run_id,
            status="failed",
            progress_message="Analysis failed.",
            error_message=str(exc),
        )


def _invoke(callable_obj, *args, **kwargs):
    raw = getattr(callable_obj, "fn", None)
    if callable(raw):
        return raw(*args, **kwargs)
    return callable_obj(*args, **kwargs)