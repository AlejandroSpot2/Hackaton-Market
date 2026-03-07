export type RunStatus = "queued" | "running" | "pulse_ready" | "complete" | "failed";
export type NodeType = "idea" | "competitor" | "segment" | "adjacent_category" | "opportunity";
export type EdgeType = "competes_with" | "belongs_to_segment" | "adjacent_to" | "opportunity_in";

export interface AtlasPosition {
  x: number;
  y: number;
}

export interface AtlasNode {
  id: string;
  type: NodeType;
  label: string;
  summary: string;
  market_signal: string;
  position: AtlasPosition;
}

export interface AtlasEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label: string;
}

export interface MarketAtlas {
  nodes: AtlasNode[];
  edges: AtlasEdge[];
}

export interface CompetitorDetail {
  node_id: string;
  name: string;
  website: string;
  tagline: string;
  why_it_wins: string;
  risks: string[];
  pricing_hint: string;
  signals: string[];
  sources: string[];
}

export interface SummaryCard {
  title: string;
  headline: string;
  body: string;
  bullets: string[];
}

export interface PulseSummary {
  idea: string;
  summary: string;
  market_temperature: "cold" | "warm" | "heated";
  competition_level: "low" | "medium" | "high";
  whitespace: string;
  top_signals: string[];
}

export interface RunResult {
  idea: string;
  pulse: PulseSummary;
  atlas: MarketAtlas;
  competitor_details: Record<string, CompetitorDetail>;
  brutal_truth: SummaryCard | null;
  opportunity: SummaryCard | null;
  sources: string[];
}

export interface RunRecord {
  run_id: string;
  idea: string;
  status: RunStatus;
  created_at: string;
  updated_at: string;
  progress_message: string | null;
  error_message: string | null;
  result: RunResult | null;
  data_source: "demo" | "live" | "fallback" | null;
}

export interface AnalyzeResponse {
  run_id: string;
  status: RunStatus;
}

export interface RunStatusResponse {
  run_id: string;
  status: RunStatus;
  created_at: string;
  updated_at: string;
  progress_message: string | null;
  error_message: string | null;
  data_source: "demo" | "live" | "fallback" | null;
}

export interface AnalyzeRequest {
  idea: string;
  demo_mode: boolean;
}