"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchRunResult, fetchRunStatus } from "@/lib/api";
import { RunRecord, RunStatusResponse } from "@/lib/types";
import { AtlasCanvas } from "@/components/atlas-canvas";
import { DetailPanel } from "@/components/detail-panel";
import { AgentConsole } from "@/components/agent-console";
import { PipelineGraph } from "@/components/pipeline-graph";
import { RadarChart, SentimentGauge, MarketBubbleChart } from "@/components/market-charts";
import { CompetitorCards } from "@/components/competitor-cards";
import { SummaryCard } from "@/components/summary-card";

interface RunWorkspaceProps { runId: string; }

/* shared styles */
const S = {
  page: { fontFamily: "'Inter','Segoe UI',sans-serif", color: "#eef2ff", display: "flex", flexDirection: "column" as const, gap: 16 },
  card: { borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(7,15,28,0.97)" },
  eyebrow: { fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" as const, fontWeight: 600 },
  muted: { color: "#7e90b8" },
} as const;

export function RunWorkspace({ runId }: RunWorkspaceProps) {
  const [statusData, setStatusData] = useState<RunStatusResponse | null>(null);
  const [record, setRecord] = useState<RunRecord | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* Polling */
  useEffect(() => {
    let mounted = true; let iv: number | undefined;
    async function poll() {
      try {
        const [st, rec] = await Promise.all([fetchRunStatus(runId), fetchRunResult(runId)]);
        if (!mounted) return;
        setStatusData(st); setRecord(rec); setError(null);
        const nodes = rec.result?.atlas?.nodes ?? [];
        if (nodes.length) setSelectedNodeId((c) => (c && nodes.some((n) => n.id === c) ? c : nodes[0].id));
        if (st.status === "complete" || st.status === "failed") window.clearInterval(iv);
      } catch (e) { if (mounted) setError(e instanceof Error ? e.message : "Poll error."); }
    }
    void poll();
    iv = window.setInterval(poll, 2500);
    return () => { mounted = false; if (iv) window.clearInterval(iv); };
  }, [runId]);

  const result = record?.result ?? null;
  const status = statusData?.status ?? record?.status ?? "queued";
  const progressMessage = statusData?.progress_message ?? null;
  const atlas = result?.atlas ?? null;
  const competitors = result?.competitor_details ?? {};
  const pulse = result?.pulse ?? null;
  const selectedNode = atlas?.nodes.find((n) => n.id === selectedNodeId) ?? null;
  const selectedDetail = selectedNode ? competitors[selectedNode.id] ?? null : null;
  const isLoading = status === "queued" || status === "running";
  const competitorNames = Object.values(competitors).map((c) => c.name);

  return (
    <div style={S.page}>
      {/* ── Header ── */}
      <div style={{ ...S.card, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div>
          <p style={{ ...S.eyebrow, color: "rgba(245,158,11,0.7)", margin: "0 0 4px" }}>RealityCheck AI</p>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: "#eef2ff" }}>
            {record?.idea ?? "Preparing analysis…"}
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {record?.data_source && (
            <span style={{ fontSize: 10, fontWeight: 600, padding: "4px 12px", borderRadius: 999, border: "1px solid rgba(56,189,248,0.25)", background: "rgba(56,189,248,0.08)", color: "#38bdf8" }}>
              {record.data_source === "demo" ? "📦 Demo" : record.data_source === "live" ? "🌐 Live" : "🔄 Fallback"}
            </span>
          )}
          <Link href="/" style={{ fontSize: 11, padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "#c8d7f0", textDecoration: "none" }}>
            ← New idea
          </Link>
        </div>
      </div>

      {error && <p style={{ fontSize: 13, color: "#fca5a5", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 12, padding: "10px 14px", background: "rgba(248,113,113,0.06)", margin: 0 }}>{error}</p>}

      {/* ── Two columns ── */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 280px", gap: 16 }}>
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          {/* Pipeline */}
          <div style={S.card}><PipelineGraph status={status} /></div>

          {/* Atlas + Detail */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 260px", gap: 16 }}>
            <div style={{ ...S.card, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <div>
                  <p style={{ ...S.eyebrow, color: "rgba(245,158,11,0.7)", margin: 0 }}>Market Atlas</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#eef2ff", margin: "4px 0 0" }}>Competitive landscape</p>
                </div>
                <p style={{ fontSize: 10, ...S.muted, margin: 0 }}>Click node · Drag to rearrange</p>
              </div>
              <AtlasCanvas atlas={atlas} selectedNodeId={selectedNodeId} onSelectNode={setSelectedNodeId} isLoading={isLoading} />
            </div>
            <DetailPanel node={selectedNode} detail={selectedDetail} />
          </div>

          {/* Charts */}
          {pulse && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {/* Pulse */}
                <div style={{ ...S.card, padding: 20 }}>
                  <p style={{ ...S.eyebrow, color: "rgba(245,158,11,0.7)", margin: "0 0 4px" }}>Market Pulse</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.5, margin: "8px 0 0" }}>{pulse.summary}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12, padding: 12, borderRadius: 12, background: "rgba(0,0,0,0.2)" }}>
                    <div>
                      <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", ...S.muted, margin: 0 }}>Temperature</p>
                      <p style={{ fontSize: 14, fontWeight: 700, margin: "4px 0 0", color: pulse.market_temperature === "heated" ? "#f97316" : pulse.market_temperature === "warm" ? "#f59e0b" : "#38bdf8" }}>
                        {pulse.market_temperature}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", ...S.muted, margin: 0 }}>Competition</p>
                      <p style={{ fontSize: 14, fontWeight: 700, margin: "4px 0 0", color: pulse.competition_level === "high" ? "#f87171" : pulse.competition_level === "medium" ? "#f59e0b" : "#22c55e" }}>
                        {pulse.competition_level}
                      </p>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#38bdf8", margin: "0 0 4px" }}>Whitespace</p>
                    <p style={{ fontSize: 11, ...S.muted, lineHeight: 1.5, margin: 0 }}>{pulse.whitespace}</p>
                  </div>
                </div>
                <SentimentGauge temperature={pulse.market_temperature} competitionLevel={pulse.competition_level} />
                <RadarChart pulse={pulse} competitorNames={competitorNames} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <MarketBubbleChart competitors={competitors} />
                {/* Metrics */}
                <div style={{ ...S.card, padding: 20 }}>
                  <p style={{ ...S.eyebrow, ...S.muted, margin: "0 0 16px" }}>Atlas Metrics</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {[
                      { label: "Atlas Nodes", val: atlas?.nodes.length ?? 0, col: "#38bdf8" },
                      { label: "Competitors", val: Object.keys(competitors).length, col: "#22c55e" },
                      { label: "Atlas Edges", val: atlas?.edges.length ?? 0, col: "#a78bfa" },
                      { label: "Sources", val: result?.sources?.length ?? 0, col: "#f59e0b" },
                    ].map(({ label, val, col }) => (
                      <div key={label} style={{ background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: 12 }}>
                        <p style={{ fontSize: 28, fontWeight: 800, color: col, margin: 0 }}>{val}</p>
                        <p style={{ fontSize: 10, ...S.muted, margin: "4px 0 0" }}>{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <CompetitorCards competitors={competitors} onSelect={setSelectedNodeId} selectedId={selectedNodeId} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <SummaryCard title="Brutal Truth" card={result?.brutal_truth ?? null} fallback="Synthesis available at completion." variant="brutal" />
                <SummaryCard title="Opportunity" card={result?.opportunity ?? null} fallback="Opportunity framing available at completion." variant="opportunity" />
              </div>

              {/* Sources */}
              {(result?.sources?.length ?? 0) > 0 && (
                <div style={{ ...S.card, padding: 20 }}>
                  <p style={{ ...S.eyebrow, ...S.muted, margin: "0 0 12px" }}>Research Sources</p>
                  <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <th style={{ textAlign: "left", ...S.muted, paddingBottom: 8, width: 32 }}>#</th>
                        <th style={{ textAlign: "left", ...S.muted, paddingBottom: 8 }}>URL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(result?.sources ?? []).map((s, i) => (
                        <tr key={s} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                          <td style={{ padding: "8px 0", ...S.muted }}>{i + 1}</td>
                          <td style={{ padding: "8px 0" }}>
                            <a href={s} target="_blank" rel="noreferrer" style={{ color: "#38bdf8", textDecoration: "none", wordBreak: "break-all" }}>{s}</a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Final banner */}
              {status === "complete" && (
                <div style={{
                  ...S.card, padding: 24,
                  borderColor: "rgba(245,158,11,0.2)",
                  background: "linear-gradient(135deg, rgba(120,80,0,0.08), rgba(7,15,28,0.97))",
                }}>
                  <p style={{ ...S.eyebrow, color: "#f59e0b", margin: "0 0 8px" }}>🏁 Final Summary</p>
                  <h2 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 800, color: "#eef2ff" }}>{pulse?.idea ?? record?.idea ?? ""}</h2>
                  <p style={{ fontSize: 13, ...S.muted, lineHeight: 1.65, margin: 0 }}>{pulse?.summary ?? ""}</p>
                  <p style={{ fontSize: 13, ...S.muted, lineHeight: 1.65, margin: "8px 0 0" }}>{pulse?.whitespace ?? ""}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                    {[
                      { label: `🌡️ ${pulse?.market_temperature ?? ""} market`, bc: "rgba(245,158,11,0.15)", tc: "#f59e0b" },
                      { label: `⚔️ ${pulse?.competition_level ?? ""} competition`, bc: "rgba(248,113,113,0.12)", tc: "#f87171" },
                      { label: `${Object.keys(competitors).length} competitors`, bc: "rgba(34,197,94,0.12)", tc: "#22c55e" },
                      { label: `${atlas?.nodes.length ?? 0} atlas nodes`, bc: "rgba(56,189,248,0.12)", tc: "#38bdf8" },
                    ].map(({ label, bc, tc }) => (
                      <span key={label} style={{ fontSize: 10, fontWeight: 600, padding: "4px 12px", borderRadius: 999, background: bc, color: tc }}>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT: Agent Console */}
        <AgentConsole status={status} progressMessage={progressMessage} />
      </div>
    </div>
  );
}