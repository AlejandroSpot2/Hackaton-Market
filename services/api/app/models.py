from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

RunStatus = Literal["queued", "running", "pulse_ready", "complete", "failed"]
NodeType = Literal["idea", "competitor", "segment", "adjacent_category", "opportunity"]
EdgeType = Literal["competes_with", "belongs_to_segment", "adjacent_to", "opportunity_in"]


class AtlasPosition(BaseModel):
    x: float
    y: float


class AtlasNode(BaseModel):
    id: str
    type: NodeType
    label: str
    summary: str
    market_signal: str
    position: AtlasPosition


class AtlasEdge(BaseModel):
    id: str
    source: str
    target: str
    type: EdgeType
    label: str


class MarketAtlas(BaseModel):
    nodes: list[AtlasNode] = Field(default_factory=list)
    edges: list[AtlasEdge] = Field(default_factory=list)


class CompetitorDetail(BaseModel):
    node_id: str
    name: str
    website: str
    tagline: str
    why_it_wins: str
    risks: list[str] = Field(default_factory=list)
    pricing_hint: str
    signals: list[str] = Field(default_factory=list)
    sources: list[str] = Field(default_factory=list)


class SummaryCard(BaseModel):
    title: str
    headline: str
    body: str
    bullets: list[str] = Field(default_factory=list)


class PulseSummary(BaseModel):
    idea: str
    summary: str
    market_temperature: Literal["cold", "warm", "heated"]
    competition_level: Literal["low", "medium", "high"]
    whitespace: str
    top_signals: list[str] = Field(default_factory=list)


class RunResult(BaseModel):
    idea: str
    pulse: PulseSummary
    atlas: MarketAtlas
    competitor_details: dict[str, CompetitorDetail] = Field(default_factory=dict)
    brutal_truth: SummaryCard | None = None
    opportunity: SummaryCard | None = None
    sources: list[str] = Field(default_factory=list)


class RunRecord(BaseModel):
    run_id: str
    idea: str
    status: RunStatus
    created_at: datetime
    updated_at: datetime
    progress_message: str | None = None
    error_message: str | None = None
    result: RunResult | None = None


class AnalyzeRequest(BaseModel):
    idea: str = Field(min_length=10, max_length=400)
    demo_mode: bool = True


class AnalyzeResponse(BaseModel):
    run_id: str
    status: RunStatus


class RunStatusResponse(BaseModel):
    run_id: str
    status: RunStatus
    created_at: datetime
    updated_at: datetime
    progress_message: str | None = None
    error_message: str | None = None


class FixtureBundle(BaseModel):
    slug: str
    keywords: list[str] = Field(default_factory=list)
    pulse_result: RunResult
    final_result: RunResult