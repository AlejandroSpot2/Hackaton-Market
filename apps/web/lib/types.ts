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

export interface SummaryCardData {
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
  pulse?: PulseSummary | null;
  atlas?: MarketAtlas | null;
  competitor_details?: Record<string, CompetitorDetail> | null;
  brutal_truth?: SummaryCardData | null;
  opportunity?: SummaryCardData | null;
  sources?: string[] | null;
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

export interface AnalyzeRequest {
  idea: string;
  demo_mode: boolean;
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

export interface StatusStepViewModel {
  id: RunStatus;
  label: string;
  state: "done" | "active" | "upcoming" | "failed";
}

export interface StatusShellViewModel {
  status: RunStatus;
  label: string;
  headline: string;
  description: string;
  progressMessage: string | null;
  steps: StatusStepViewModel[];
  isTerminal: boolean;
}

export interface PulseCardViewModel {
  state: "waiting" | "ready";
  headline: string;
  note: string;
  marketTemperature: string;
  competitionLevel: string;
  whitespace: string;
  topSignals: string[];
}

export interface SummaryCardViewModel {
  title: string;
  eyebrow: string;
  state: "waiting" | "ready";
  headline: string;
  body: string;
  bullets: string[];
  fallback: string;
}

export interface RunViewModel {
  runId: string;
  idea: string;
  status: RunStatus;
  createdAt: string | null;
  updatedAt: string | null;
  progressMessage: string | null;
  errorMessage: string | null;
  statusShell: StatusShellViewModel;
  pulseCard: PulseCardViewModel;
  brutalTruthCard: SummaryCardViewModel;
  opportunityCard: SummaryCardViewModel;
  atlas: MarketAtlas | null;
  competitorDetails: Record<string, CompetitorDetail>;
  sources: string[];
}
