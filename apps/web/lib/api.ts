import { buildRunViewModel } from "@/lib/run-view-model";
import { AnalyzeResponse, RunRecord, RunStatusResponse, RunViewModel } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export interface RunSnapshot {
  statusData: RunStatusResponse;
  record: RunRecord;
  view: RunViewModel;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      }
    });
  } catch {
    throw new Error(
      `Could not reach the API at ${API_BASE_URL}. Make sure FastAPI is running on port 8000 and that your current web origin is allowed by CORS.`
    );
  }

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const payload = (await response.json()) as { detail?: string };
      detail = payload.detail ?? detail;
    } catch {
      detail = await response.text();
    }
    throw new Error(detail || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export function createRun(idea: string, demoMode = false): Promise<AnalyzeResponse> {
  return request<AnalyzeResponse>("/analyze", {
    method: "POST",
    body: JSON.stringify({ idea, demo_mode: demoMode })
  });
}

export function fetchRunStatus(runId: string): Promise<RunStatusResponse> {
  return request<RunStatusResponse>(`/runs/${runId}/status`);
}

export function fetchRunResult(runId: string): Promise<RunRecord> {
  return request<RunRecord>(`/runs/${runId}/result`);
}

export async function fetchRunSnapshot(runId: string): Promise<RunSnapshot> {
  const [statusData, record] = await Promise.all([fetchRunStatus(runId), fetchRunResult(runId)]);

  return {
    statusData,
    record,
    view: buildRunViewModel({ runId, statusData, record })
  };
}
