import { RunStatus } from "@/lib/types";

export const STATUS_ORDER: RunStatus[] = ["queued", "running", "pulse_ready", "complete"];

export const STATUS_COPY: Record<RunStatus, string> = {
  queued: "Queued and waiting to start.",
  running: "Scanning the market and assembling the first competitor set.",
  pulse_ready: "Pulse is ready. Expanding the atlas and synthesis.",
  complete: "Atlas complete.",
  failed: "The run failed before the atlas finished."
};