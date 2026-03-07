import { NodeType, RunStatus } from "@/lib/types";

export const DEMO_IDEAS = [
  "AI assistant that applies to jobs automatically",
  "AI mobile coding copilot for React Native teams",
  "AI travel planner that coordinates bookings and itinerary changes"
];

export const STATUS_ORDER: Exclude<RunStatus, "failed">[] = ["queued", "running", "pulse_ready", "complete"];

export const STATUS_LABELS: Record<RunStatus, string> = {
  queued: "Queued",
  running: "Running",
  pulse_ready: "Pulse ready",
  complete: "Complete",
  failed: "Failed"
};

export const STATUS_HEADLINES: Record<RunStatus, string> = {
  queued: "Analysis queued and ready to start",
  running: "Assembling the first read on the market",
  pulse_ready: "The market pulse is live and the atlas is explorable",
  complete: "The full market atlas and synthesis are ready",
  failed: "This run stopped before the atlas was fully assembled"
};

export const STATUS_COPY: Record<RunStatus, string> = {
  queued: "Your idea is in line. The run record is saved and the analysis will begin shortly.",
  running: "The backend is shaping the first market view, pulling the atlas structure together, and preparing the early pulse.",
  pulse_ready: "The first pass is ready. You can inspect the atlas now while the final synthesis finishes in the background.",
  complete: "The atlas, competitive read, and summary cards are all available in one persisted run workspace.",
  failed: "The run failed before it reached a usable result. Keep the idea, refresh the page, or start another run."
};

export const NODE_TYPE_META: Record<NodeType, { label: string; eyebrow: string; description: string }> = {
  idea: {
    label: "Core thesis",
    eyebrow: "Core",
    description: "The originating product claim that every other market surface gets compared against."
  },
  competitor: {
    label: "Competitor",
    eyebrow: "Competitor",
    description: "An existing product shaping buyer expectations, pricing anchors, or workflow defaults."
  },
  segment: {
    label: "Segment",
    eyebrow: "Segment",
    description: "A broader bucket of shared buyers, use cases, or workflow language in the market."
  },
  adjacent_category: {
    label: "Adjacent category",
    eyebrow: "Adjacent",
    description: "A neighboring product category that can absorb budget or influence evaluation criteria."
  },
  opportunity: {
    label: "Opportunity wedge",
    eyebrow: "Opportunity",
    description: "A realistic point of entry that looks more open than the rest of the category map."
  }
};

export const NODE_TONE_MAP: Record<NodeType, { border: string; background: string; chip: string; glow: string }> = {
  idea: {
    border: "#8f2553",
    background: "rgba(246, 220, 231, 0.72)",
    chip: "Core thesis",
    glow: "rgba(143, 37, 83, 0.20)"
  },
  competitor: {
    border: "#6888a8",
    background: "rgba(227, 238, 249, 0.72)",
    chip: "Competitor",
    glow: "rgba(104, 136, 168, 0.20)"
  },
  segment: {
    border: "#cc8e73",
    background: "rgba(249, 227, 216, 0.72)",
    chip: "Segment",
    glow: "rgba(204, 142, 115, 0.18)"
  },
  adjacent_category: {
    border: "#a26597",
    background: "rgba(244, 226, 239, 0.74)",
    chip: "Adjacent",
    glow: "rgba(162, 101, 151, 0.16)"
  },
  opportunity: {
    border: "#7d64b8",
    background: "rgba(236, 228, 251, 0.72)",
    chip: "Opportunity",
    glow: "rgba(125, 100, 184, 0.18)"
  }
};
