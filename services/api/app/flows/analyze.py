from __future__ import annotations

import os
import threading
import time
from typing import Any, Callable, TypeVar

from ..config import settings
from ..providers.fixtures import select_fixture_bundle
from ..storage.runs import run_store

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
    fixture_bundle = _invoke(select_fixture, idea)

    time.sleep(1.5 if demo_mode else 0.75)
    _invoke(write_pulse, run_id, fixture_bundle.pulse_result)

    time.sleep(2.0 if demo_mode else 1.0)
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