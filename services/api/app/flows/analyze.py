from __future__ import annotations

import logging
import threading
import time

from ..models import RunResult
from ..providers import exa as exa_provider
from ..providers import llm as llm_provider
from ..providers.fixtures import select_fixture_bundle
from ..storage.runs import run_store
from ..utils.layout import assign_positions

logger = logging.getLogger(__name__)


def start_analysis_flow(run_id: str, idea: str, demo_mode: bool) -> None:
    """Entry point called by routes/runs.py. Spawns thread, returns immediately."""
    target = _run_demo if demo_mode else _run_live
    threading.Thread(
        target=target,
        args=(run_id, idea),
        daemon=True,
        name=f"analysis-{run_id}",
    ).start()


def _run_demo(run_id: str, idea: str) -> None:
    try:
        run_store.update(
            run_id,
            status="running",
            progress_message="Scanning the market surface and clustering the first competitors.",
        )
        time.sleep(2)
        bundle = select_fixture_bundle(idea)
        run_store.update(
            run_id,
            status="pulse_ready",
            progress_message="Market Pulse ready. Expanding the atlas and summary cards.",
            result=bundle.pulse_result,
        )
        time.sleep(3)
        run_store.update(
            run_id,
            status="complete",
            progress_message="Market Atlas complete.",
            result=bundle.final_result,
        )
    except Exception as exc:
        logger.exception("[demo flow] run %s failed", run_id)
        run_store.update(run_id, status="failed", error_message=str(exc))


def _run_live(run_id: str, idea: str) -> None:
    try:
        # Step 1: mark running
        run_store.update(
            run_id,
            status="running",
            progress_message="Scanning market landscape...",
        )

        # Step 2: Exa search
        logger.info("[live flow] searching competitors for: %s", idea)
        exa_results = exa_provider.search_competitors(idea)
        logger.info("[live flow] got %d exa results", len(exa_results))

        # Step 3: pulse progress update
        run_store.update(run_id, progress_message="Generating market pulse...")

        # Step 4: LLM pulse
        logger.info("[live flow] calling generate_pulse")
        pulse_dict = llm_provider.generate_pulse(idea, exa_results)

        # Step 5: assign positions to pulse atlas nodes
        pulse_dict["atlas"]["nodes"] = assign_positions(pulse_dict["atlas"]["nodes"])

        # Step 6: validate against Pydantic model
        pulse_result = RunResult.model_validate(pulse_dict)

        # Step 7: write pulse_ready
        run_store.update(
            run_id,
            status="pulse_ready",
            progress_message="Market Pulse ready. Building deep atlas...",
            result=pulse_result,
        )

        # Step 8: deep insights progress update
        run_store.update(run_id, progress_message="Synthesizing deep insights...")

        # Step 9: LLM deep insights
        logger.info("[live flow] calling generate_deep_insights")
        complete_dict = llm_provider.generate_deep_insights(idea, pulse_dict, exa_results)

        # Step 10: assign positions to final atlas nodes
        complete_dict["atlas"]["nodes"] = assign_positions(complete_dict["atlas"]["nodes"])

        # Step 11: validate
        complete_result = RunResult.model_validate(complete_dict)

        # Step 12: write complete
        run_store.update(
            run_id,
            status="complete",
            progress_message="Market Atlas complete.",
            result=complete_result,
        )
        logger.info("[live flow] run %s complete", run_id)

    except Exception as exc:
        logger.exception("[live flow] run %s failed: %s", run_id, exc)
        run_store.update(run_id, status="failed", error_message=str(exc))
