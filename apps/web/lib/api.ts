import { AnalyzeResponse, RunRecord, RunStatusResponse } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

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

export function createRun(idea: string, demoMode = true): Promise<AnalyzeResponse> {
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