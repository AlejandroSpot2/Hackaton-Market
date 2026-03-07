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
  queued: "Run accepted and waiting to start",
  running: "Scanning the market and assembling the first map",
  pulse_ready: "Pulse is live and the atlas is already usable",
  complete: "Final synthesis landed on top of the atlas",
  failed: "The run stopped before the final synthesis finished"
};

export const STATUS_COPY: Record<RunStatus, string> = {
  queued: "Queued locally. The backend will move this run into active analysis next.",
  running: "Research is underway. Expect the first pulse before the final cards.",
  pulse_ready: "The pulse snapshot is ready. Brutal Truth and Opportunity are still generating.",
  complete: "Atlas, pulse, and synthesis cards are complete.",
  failed: "The run failed. Keep the saved run id and retry after checking the API logs."
};

export const NODE_TYPE_META: Record<NodeType, { label: string; eyebrow: string; description: string }> = {
  idea: {
    label: "Idea thesis",
    eyebrow: "Thesis",
    description: "The root concept the rest of the market map is reacting to."
  },
  competitor: {
    label: "Competitor",
    eyebrow: "Competitor",
    description: "A company or product already shaping buyer expectations in this space."
  },
  segment: {
    label: "Market segment",
    eyebrow: "Segment",
    description: "A cluster of buyers or workflows that compress the market into a clearer wedge."
  },
  adjacent_category: {
    label: "Adjacent category",
    eyebrow: "Adjacent",
    description: "A nearby category that can steal budget, habits, or product expectations."
  },
  opportunity: {
    label: "Opportunity wedge",
    eyebrow: "Opportunity",
    description: "A potential entry angle that looks more realistic than attacking the whole market."
  }
};

export const NODE_TONE_MAP: Record<NodeType, { border: string; background: string; chip: string }> = {
  idea: { border: "#f59e0b", background: "rgba(245, 158, 11, 0.16)", chip: "Idea" },
  competitor: { border: "#22c55e", background: "rgba(34, 197, 94, 0.14)", chip: "Competitor" },
  segment: { border: "#38bdf8", background: "rgba(56, 189, 248, 0.14)", chip: "Segment" },
  adjacent_category: { border: "#fb923c", background: "rgba(251, 146, 60, 0.16)", chip: "Adjacent" },
  opportunity: { border: "#facc15", background: "rgba(250, 204, 21, 0.16)", chip: "Opportunity" }
};
