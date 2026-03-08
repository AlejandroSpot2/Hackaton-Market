from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

RunStatus = Literal["queued", "running", "pulse_ready", "complete", "failed"]
NodeType = Literal["idea", "competitor", "segment", "adjacent_category", "opportunity"]
EdgeType = Literal["competes_with", "belongs_to_segment", "adjacent_to", "opportunity_in"]
DataSource = Literal["demo", "live", "fallback"]


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

    @field_validator("type", mode="before")
    @classmethod
    def coerce_node_type(cls, v: str) -> str:
        allowed = {"idea", "competitor", "segment", "adjacent_category", "opportunity"}
        return v if v in allowed else "competitor"


class AtlasEdge(BaseModel):
    id: str
    source: str
    target: str
    type: EdgeType
    label: str

    @field_validator("type", mode="before")
    @classmethod
    def coerce_edge_type(cls, v: str) -> str:
        allowed = {"competes_with", "belongs_to_segment", "adjacent_to", "opportunity_in"}
        return v if v in allowed else "competes_with"


class MarketAtlas(BaseModel):
    nodes: list[AtlasNode] = Field(default_factory=list)
    edges: list[AtlasEdge] = Field(default_factory=list)

    @model_validator(mode="after")
    def check_edge_referential_integrity(self) -> MarketAtlas:
        node_ids = {n.id for n in self.nodes}
        bad = []
        for edge in self.edges:
            if edge.source not in node_ids:
                bad.append(f"edge {edge.id} source={edge.source}")
            if edge.target not in node_ids:
                bad.append(f"edge {edge.id} target={edge.target}")
        if bad:
            raise ValueError(f"Invalid edge references: {', '.join(bad)}")
        return self


class CompetitorDetail(BaseModel):
    node_id: str
    name: str
    website: str = ""
    tagline: str = ""
    why_it_wins: str = ""
    risks: list[str] = Field(default_factory=list)
    pricing_hint: str = ""
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

    @field_validator("market_temperature", mode="before")
    @classmethod
    def coerce_market_temperature(cls, v: str) -> str:
        return v if v in ("cold", "warm", "heated") else "warm"

    @field_validator("competition_level", mode="before")
    @classmethod
    def coerce_competition_level(cls, v: str) -> str:
        return v if v in ("low", "medium", "high") else "medium"


class RunResult(BaseModel):
    idea: str
    pulse: PulseSummary
    atlas: MarketAtlas
    competitor_details: dict[str, CompetitorDetail] = Field(default_factory=dict)
    brutal_truth: SummaryCard | None = None
    opportunity: SummaryCard | None = None
    sources: list[str] = Field(default_factory=list)

    @model_validator(mode="after")
    def check_competitor_details_keys(self) -> RunResult:
        node_ids = {n.id for n in self.atlas.nodes}
        orphaned = [k for k in self.competitor_details if k not in node_ids]
        if orphaned:
            raise ValueError(f"Orphaned competitor_details keys: {', '.join(orphaned)}")
        return self


class RunRecord(BaseModel):
    model_config = ConfigDict(validate_assignment=True)

    run_id: str
    idea: str
    status: RunStatus
    created_at: datetime
    updated_at: datetime
    progress_message: str | None = None
    error_message: str | None = None
    result: RunResult | None = None
    data_source: DataSource | None = None


class AnalyzeRequest(BaseModel):
    idea: str = Field(min_length=10, max_length=400)
    demo_mode: bool = False


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
    data_source: DataSource | None = None


class FixtureBundle(BaseModel):
    slug: str
    keywords: list[str] = Field(default_factory=list)
    pulse_result: RunResult
    final_result: RunResult
