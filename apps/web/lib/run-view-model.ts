import { STATUS_COPY, STATUS_HEADLINES, STATUS_LABELS, STATUS_ORDER } from "@/lib/constants";
import {
  MarketAtlas,
  RunRecord,
  RunStatus,
  RunStatusResponse,
  RunViewModel,
  StatusStepViewModel,
  SummaryCardData,
  SummaryCardViewModel
} from "@/lib/types";

interface BuildRunViewModelInput {
  runId: string;
  statusData: RunStatusResponse | null;
  record: RunRecord | null;
}

function titleCase(value: string): string {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((chunk) => chunk[0].toUpperCase() + chunk.slice(1))
    .join(" ");
}

function normalizeAtlas(atlas: MarketAtlas | null | undefined): MarketAtlas | null {
  if (!atlas) {
    return null;
  }

  return {
    nodes: Array.isArray(atlas.nodes) ? atlas.nodes : [],
    edges: Array.isArray(atlas.edges) ? atlas.edges : []
  };
}

function normalizeSummaryCard(
  title: string,
  eyebrow: string,
  status: RunStatus,
  card: SummaryCardData | null | undefined,
  waitingMessage: string
): SummaryCardViewModel {
  if (!card) {
    const isComplete = status === "complete";
    return {
      title,
      eyebrow,
      state: "waiting",
      headline: isComplete ? `${title} unavailable` : `${title} still generating`,
      body: isComplete ? "The backend returned a complete run without this card." : waitingMessage,
      bullets: [],
      fallback: waitingMessage
    };
  }

  return {
    title,
    eyebrow,
    state: "ready",
    headline: card.headline || title,
    body: card.body || "No supporting body was returned for this card.",
    bullets: Array.isArray(card.bullets) ? card.bullets : [],
    fallback: waitingMessage
  };
}

function getReachedStep(status: RunStatus, hasPulse: boolean, hasFinalCards: boolean): number {
  if (status === "complete" || hasFinalCards) {
    return 3;
  }

  if (status === "pulse_ready" || hasPulse) {
    return 2;
  }

  if (status === "running") {
    return 1;
  }

  return 0;
}

function buildStatusSteps(status: RunStatus, hasPulse: boolean, hasFinalCards: boolean): StatusStepViewModel[] {
  const reachedStep = getReachedStep(status, hasPulse, hasFinalCards);
  const failedStep = status === "failed" ? Math.min(reachedStep + 1, STATUS_ORDER.length - 1) : -1;

  return STATUS_ORDER.map((step, index) => {
    const label = STATUS_LABELS[step];

    if (status === "failed") {
      if (index < failedStep) {
        return { id: step, label, state: "done" };
      }

      if (index === failedStep) {
        return { id: step, label, state: "failed" };
      }

      return { id: step, label, state: "upcoming" };
    }

    if (index < reachedStep) {
      return { id: step, label, state: "done" };
    }

    if (index === reachedStep) {
      return { id: step, label, state: "active" };
    }

    return { id: step, label, state: "upcoming" };
  });
}

export function buildRunViewModel({ runId, statusData, record }: BuildRunViewModelInput): RunViewModel {
  const status = statusData?.status ?? record?.status ?? "queued";
  const progressMessage = statusData?.progress_message ?? record?.progress_message ?? null;
  const errorMessage = statusData?.error_message ?? record?.error_message ?? null;
  const result = record?.result ?? null;
  const atlas = normalizeAtlas(result?.atlas);
  const pulse = result?.pulse ?? null;
  const sources = Array.isArray(result?.sources) ? result.sources.filter(Boolean) : [];
  const competitorDetails = result?.competitor_details ?? {};
  const hasPulse = Boolean(pulse && atlas);
  const hasFinalCards = Boolean(result?.brutal_truth || result?.opportunity);
  const description = errorMessage ?? progressMessage ?? STATUS_COPY[status];

  return {
    runId,
    idea: record?.idea ?? result?.idea ?? "Preparing analysis...",
    status,
    createdAt: statusData?.created_at ?? record?.created_at ?? null,
    updatedAt: statusData?.updated_at ?? record?.updated_at ?? null,
    progressMessage,
    errorMessage,
    statusShell: {
      status,
      label: STATUS_LABELS[status],
      headline: STATUS_HEADLINES[status],
      description,
      progressMessage,
      steps: buildStatusSteps(status, hasPulse, hasFinalCards),
      isTerminal: status === "complete" || status === "failed"
    },
    pulseCard: pulse
      ? {
          state: "ready",
          headline: pulse.summary || "Pulse snapshot ready",
          note:
            status === "complete"
              ? "The final synthesis has landed. Use the atlas and cards together."
              : "Pulse arrived first so the atlas can be explored before the synthesis finishes.",
          marketTemperature: titleCase(pulse.market_temperature),
          competitionLevel: titleCase(pulse.competition_level),
          whitespace: pulse.whitespace || "Whitespace is still being synthesized.",
          topSignals: Array.isArray(pulse.top_signals) ? pulse.top_signals : []
        }
      : {
          state: "waiting",
          headline: "Market pulse is still assembling",
          note: "Queued and running states reserve this space before the first pulse snapshot lands.",
          marketTemperature: "Pending",
          competitionLevel: "Pending",
          whitespace: "Whitespace will appear when the run reaches pulse_ready.",
          topSignals: []
        },
    brutalTruthCard: normalizeSummaryCard(
      "Brutal Truth",
      "Hard signal",
      status,
      result?.brutal_truth,
      status === "pulse_ready"
        ? "The pulse is ready. Final synthesis is still generating."
        : "Brutal Truth is reserved until the run completes."
    ),
    opportunityCard: normalizeSummaryCard(
      "Opportunity",
      "Entry angle",
      status,
      result?.opportunity,
      status === "pulse_ready"
        ? "The pulse is ready. Opportunity framing is still generating."
        : "Opportunity is reserved until the run completes."
    ),
    atlas,
    competitorDetails,
    sources
  };
}
