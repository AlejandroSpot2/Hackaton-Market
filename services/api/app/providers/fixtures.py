from __future__ import annotations

import json
from functools import lru_cache

from ..config import settings
from ..models import FixtureBundle, RunResult


@lru_cache(maxsize=1)
def load_fixture_catalog() -> list[FixtureBundle]:
    bundles: list[FixtureBundle] = []
    for path in sorted(settings.fixtures_dir.glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        bundles.append(FixtureBundle.model_validate(data))

    if not bundles:
        raise RuntimeError(f"No fixture bundles found in {settings.fixtures_dir}")

    return bundles


def select_fixture_bundle(idea: str) -> FixtureBundle:
    normalized = idea.lower()
    catalog = load_fixture_catalog()

    for bundle in catalog:
        if any(keyword in normalized for keyword in bundle.keywords):
            return _personalize_bundle(bundle, idea)

    return _personalize_bundle(catalog[0], idea)


def _personalize_bundle(bundle: FixtureBundle, idea: str) -> FixtureBundle:
    return FixtureBundle(
        slug=bundle.slug,
        keywords=bundle.keywords,
        pulse_result=_personalize_result(bundle.pulse_result, idea),
        final_result=_personalize_result(bundle.final_result, idea),
    )


def _personalize_result(result: RunResult, idea: str) -> RunResult:
    personalized = result.model_copy(deep=True)
    personalized.idea = idea
    personalized.pulse.idea = idea

    for node in personalized.atlas.nodes:
        if node.type == "idea":
            node.label = _short_label(idea)
            node.summary = f"Submitted idea: {idea}"
            node.market_signal = "User-defined concept"

    return personalized


def _short_label(idea: str) -> str:
    if len(idea) <= 36:
        return idea
    return idea[:33].rstrip() + "..."