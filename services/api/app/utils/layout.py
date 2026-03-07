from __future__ import annotations
import math

def assign_positions(nodes: list[dict]) -> list[dict]:
    by_type: dict[str, list[dict]] = {}
    for node in nodes:
        by_type.setdefault(node.get("type", ""), []).append(node)

    # idea — center
    for node in by_type.get("idea", []):
        node["position"] = {"x": 0, "y": 0}

    # competitors — ring, radius 320, start at -90° (top), clockwise
    competitors = by_type.get("competitor", [])
    count = len(competitors)
    for i, node in enumerate(competitors):
        if count == 0:
            continue
        angle = math.radians(-90 + (360 / count) * i)
        node["position"] = {
            "x": round(320 * math.cos(angle)),
            "y": round(320 * math.sin(angle)),
        }

    # segments — y=420, horizontally centered
    segments = by_type.get("segment", [])
    _SEG_XS = {1: [0], 2: [-200, 200], 3: [-300, 0, 300]}
    xs = _SEG_XS.get(
        len(segments),
        [round(-300 + (600 / max(len(segments) - 1, 1)) * i)
         for i in range(len(segments))],
    )
    for i, node in enumerate(segments):
        node["position"] = {"x": xs[i] if i < len(xs) else 0, "y": 420}

    # adjacent_category — x=500, stacked vertically from y=-100
    for i, node in enumerate(by_type.get("adjacent_category", [])):
        node["position"] = {"x": 500, "y": -100 + 180 * i}

    # opportunity — above center
    for i, node in enumerate(by_type.get("opportunity", [])):
        node["position"] = {"x": 0, "y": -420}

    return nodes
