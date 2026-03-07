"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { fetchRunResult, fetchRunStatus } from "@/lib/api";
import { RunRecord, RunStatusResponse } from "@/lib/types";
import { AtlasCanvas } from "@/components/atlas-canvas";
import { DetailPanel } from "@/components/detail-panel";
import { AgentConsole } from "@/components/agent-console";
import { PipelineGraph } from "@/components/pipeline-graph";
import { RadarChart, SentimentGauge } from "@/components/market-charts";
import { CompetitorCards } from "@/components/competitor-cards";
import { SummaryCard } from "@/components/summary-card";

interface RunWorkspaceProps { runId: string; }

export function RunWorkspace({ runId }: RunWorkspaceProps) {
  const [statusData, setStatusData] = useState<RunStatusResponse | null>(null);
  const [record, setRecord] = useState<RunRecord | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRefs = useRef<HTMLElement[]>([]);

  /* ── Polling ──────────────────────────── */
  useEffect(() => {
    let mounted = true;
    let intervalId: number | undefined;

    async function pollRun() {
      try {
        const [nextStatus, nextRecord] = await Promise.all([
          fetchRunStatus(runId),
          fetchRunResult(runId),
        ]);
        if (!mounted) return;
        setStatusData(nextStatus);
        setRecord(nextRecord);
        setError(null);

        const nodes = nextRecord.result?.atlas.nodes ?? [];
        if (nodes.length > 0) {
          setSelectedNodeId((cur) =>
            cur && nodes.some((n) => n.id === cur) ? cur : nodes[0].id
          );
        }
        if ((nextStatus.status === "complete" || nextStatus.status === "failed") && intervalId) {
          window.clearInterval(intervalId);
        }
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : "Could not load run.");
      }
    }

    void pollRun();
    intervalId = window.setInterval(pollRun, 2500);
    return () => { mounted = false; if (intervalId) window.clearInterval(intervalId); };
  }, [runId]);

  /* ── Scroll-reveal ────────────────────── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".anim-on-scroll").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [record]);

  const result = record?.result ?? null;
  const status = statusData?.status ?? record?.status ?? "queued";
  const progressMessage = statusData?.progress_message ?? null;
  const selectedNode = result?.atlas.nodes.find((n) => n.id === selectedNodeId) ?? null;
  const selectedDetail = selectedNode ? result?.competitor_details[selectedNode.id] ?? null : null;
  const isLoading = status === "queued" || status === "running";

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* ── Header ─────────────────────────── */}
      <section className="surface run-header">
        <div>
          <p className="eyebrow">RealityCheck AI</p>
          <h1>{record?.idea ?? "Preparing analysis..."}</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          {record?.data_source && (
            <span className="data-source-badge">
              {record.data_source === "demo" ? "📦 Demo" : record.data_source === "live" ? "🌐 Live" : "🔄 Fallback"}
            </span>
          )}
          <Link className="back-link" href="/">← New idea</Link>
        </div>
      </section>

      {error ? <p className="alert">{error}</p> : null}

      {/* ── Main: Pipeline + Atlas (left) | AgentConsole (right) ── */}
      <div className="run-outer">
        <div className="run-main">
          {/* Pipeline */}
          <section className="surface">
            <PipelineGraph status={status} />
          </section>

          {/* Atlas + Detail Panel */}
          <div className="workspace-grid">
            <section className="surface atlas-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Market Atlas</p>
                  <h2 style={{ fontSize: "1rem", fontWeight: 700, marginTop: 2 }}>Competitive landscape</h2>
                </div>
                <p className="muted" style={{ fontSize: "0.78rem" }}>Click a node · Drag to rearrange</p>
              </div>
              <AtlasCanvas
                atlas={result?.atlas ?? null}
                selectedNodeId={selectedNodeId}
                onSelectNode={setSelectedNodeId}
                isLoading={isLoading}
              />
            </section>
            <DetailPanel node={selectedNode} detail={selectedDetail} />
          </div>

          {/* Pulse + Charts */}
          {result ? (
            <>
              {/* Pulse Summary */}
              <div className="card-grid anim-on-scroll">
                <section className="surface pulse-card">
                  <p className="eyebrow">Market Pulse</p>
                  <h3>{result.pulse.summary}</h3>
                  <div className="pulse-grid">
                    <div>
                      <p className="pulse-stat-label">Temperature</p>
                      <p className={`pulse-stat-val temp-${result.pulse.market_temperature}`}>
                        {result.pulse.market_temperature}
                      </p>
                    </div>
                    <div>
                      <p className="pulse-stat-label">Competition</p>
                      <p className={`pulse-stat-val comp-${result.pulse.competition_level}`}>
                        {result.pulse.competition_level}
                      </p>
                    </div>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <span className="detail-label">Whitespace</span>
                    <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: 4 }}>{result.pulse.whitespace}</p>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <span className="detail-label">Top signals</span>
                    <ul className="detail-list" style={{ marginTop: 4 }}>
                      {result.pulse.top_signals.map((s) => <li key={s}>{s}</li>)}
                    </ul>
                  </div>
                </section>

                <SentimentGauge temperature={result.pulse.market_temperature} competitionLevel={result.pulse.competition_level} />

                <RadarChart pulse={result.pulse} competitors={Object.keys(result.competitor_details)} />
              </div>

              {/* Competitor Cards Row */}
              <div className="anim-on-scroll anim-delay-1">
                <CompetitorCards
                  competitors={result.competitor_details}
                  onSelect={setSelectedNodeId}
                  selectedId={selectedNodeId}
                />
              </div>

              {/* Brutal Truth + Opportunity */}
              <div className="card-grid-2 anim-on-scroll anim-delay-2">
                <SummaryCard title="Brutal Truth" card={result.brutal_truth} fallback="Synthesis available at completion." cardClass="brutal-card" />
                <SummaryCard title="Opportunity" card={result.opportunity} fallback="Opportunity framing available at completion." cardClass="opportunity-card" />
              </div>

              {/* Sources Table */}
              {result.sources?.length > 0 && (
                <section className="surface sources-section anim-on-scroll anim-delay-3">
                  <p className="eyebrow">Sources</p>
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>URL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.sources.map((s, i) => (
                        <tr key={s}>
                          <td>{i + 1}</td>
                          <td><a href={s} target="_blank" rel="noreferrer">{s}</a></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )}

              {/* Final Summary Banner */}
              {status === "complete" && (
                <section className="surface anim-on-scroll anim-delay-3" style={{ padding: "28px", borderColor: "rgba(250,204,21,0.3)", background: "linear-gradient(160deg, rgba(92,58,0,0.14) 0%, rgba(7,13,26,0.97) 100%)" }}>
                  <p className="eyebrow" style={{ color: "var(--amber)", marginBottom: 8 }}>🏁 Final Summary</p>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 12 }}>{result.pulse.idea}</h2>
                  <p style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.7 }}>{result.pulse.summary}</p>
                  <p style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.7, marginTop: 10 }}>{result.pulse.whitespace}</p>
                  <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
                    <span className="data-source-badge" style={{ background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)", color: "var(--amber)" }}>
                      🌡️ {result.pulse.market_temperature} market
                    </span>
                    <span className="data-source-badge" style={{ background: "rgba(248,113,113,0.1)", borderColor: "rgba(248,113,113,0.3)", color: "var(--red)" }}>
                      ⚔️ {result.pulse.competition_level} competition
                    </span>
                    <span className="data-source-badge" style={{ background: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.3)", color: "var(--green)" }}>
                      {Object.keys(result.competitor_details).length} competitors mapped
                    </span>
                    <span className="data-source-badge" style={{ background: "rgba(56,189,248,0.1)", borderColor: "rgba(56,189,248,0.3)", color: "var(--blue)" }}>
                      {result.atlas.nodes.length} atlas nodes
                    </span>
                  </div>
                </section>
              )}
            </>
          ) : null}
        </div>

        {/* Right Sidebar: Agent Console */}
        <AgentConsole status={status} progressMessage={progressMessage} />
      </div>
    </div>
  );
}