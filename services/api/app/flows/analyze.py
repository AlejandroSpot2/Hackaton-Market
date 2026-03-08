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


def _inject_title(card):
    if card is None:
        return None
    if "title" not in card:
        card["title"] = card.get("headline", "")
    return card


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
        run_store.update(
            run_id,
            status="running",
            progress_message="Scanning market landscape...",
        )

        logger.info("[live flow] searching competitors for: %s", idea)
        exa_results = exa_provider.search_competitors(idea)
        logger.info("[live flow] got %d exa results", len(exa_results))

        run_store.update(run_id, progress_message="Generating market pulse...")

        logger.info("[live flow] calling generate_pulse")
        pulse_dict = llm_provider.generate_pulse(idea, exa_results)

        pulse_dict["atlas"]["nodes"] = assign_positions(pulse_dict["atlas"]["nodes"])
        pulse_dict["brutal_truth"] = _inject_title(pulse_dict.get("brutal_truth"))
        pulse_dict["opportunity"] = _inject_title(pulse_dict.get("opportunity"))

        pulse_result = RunResult.model_validate(pulse_dict)

        run_store.update(
            run_id,
            status="pulse_ready",
            progress_message="Market Pulse ready. Building deep atlas...",
            result=pulse_result,
        )

        run_store.update(run_id, progress_message="Synthesizing deep insights...")

        logger.info("[live flow] calling generate_deep_insights")
        complete_dict = llm_provider.generate_deep_insights(idea, pulse_dict, exa_results)

        complete_dict["atlas"]["nodes"] = assign_positions(complete_dict["atlas"]["nodes"])
        complete_dict["brutal_truth"] = _inject_title(complete_dict.get("brutal_truth"))
        complete_dict["opportunity"] = _inject_title(complete_dict.get("opportunity"))

        complete_result = RunResult.model_validate(complete_dict)

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