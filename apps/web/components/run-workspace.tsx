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

export function RunWorkspace({ runId }: RunWorkspaceProps) {
  const [statusData, setStatusData] = useState<RunStatusResponse | null>(null);
  const [record, setRecord] = useState<RunRecord | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* ── Polling ── */
  useEffect(() => {
    let mounted = true;
    let intervalId: number | undefined;

    async function poll() {
      try {
        const [st, rec] = await Promise.all([fetchRunStatus(runId), fetchRunResult(runId)]);
        if (!mounted) return;
        setStatusData(st); setRecord(rec); setError(null);
        const nodes = rec.result?.atlas.nodes ?? [];
        if (nodes.length > 0)
          setSelectedNodeId((cur) => (cur && nodes.some((n) => n.id === cur) ? cur : nodes[0].id));
        if (st.status === "complete" || st.status === "failed") window.clearInterval(intervalId);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : "Poll error.");
      }
    }

    void poll();
    intervalId = window.setInterval(poll, 2500);
    return () => { mounted = false; if (intervalId) window.clearInterval(intervalId); };
  }, [runId]);

  /* ── Scroll reveal ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("opacity-100", "translate-y-0"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [record]);

  const result = record?.result ?? null;
  const status = statusData?.status ?? record?.status ?? "queued";
  const progressMessage = statusData?.progress_message ?? null;
  const selectedNode = result?.atlas.nodes.find((n) => n.id === selectedNodeId) ?? null;
  const selectedDetail = selectedNode ? result?.competitor_details[selectedNode.id] ?? null : null;
  const isLoading = status === "queued" || status === "running";
  const competitorNames = Object.values(result?.competitor_details ?? {}).map((c) => c.name);

  return (
    <div className="flex flex-col gap-4">
      {/* ── Header ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-[rgba(7,15,28,0.97)] px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-amber-400/80 font-semibold mb-1">RealityCheck AI</p>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-100 leading-tight">
            {record?.idea ?? "Preparing analysis…"}
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {record?.data_source && (
            <span className="text-[10px] font-semibold px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400">
              {record.data_source === "demo" ? "📦 Demo" : record.data_source === "live" ? "🌐 Live" : "🔄 Fallback"}
            </span>
          )}
          <Link href="/"
            className="text-[11px] px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/8 text-slate-300 hover:border-amber-500/40 transition-all">
            ← New idea
          </Link>
        </div>
      </div>

      {error && (
        <p className="text-sm text-rose-300 border border-rose-500/30 bg-rose-500/10 rounded-xl px-4 py-3">{error}</p>
      )}

      {/* ── Two-column layout: main | agent console ── */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "minmax(0,1fr) 280px" }}>

        {/* ── Left: everything ── */}
        <div className="flex flex-col gap-4 min-w-0">
          {/* Pipeline */}
          <div className="rounded-2xl border border-white/[0.08] bg-[rgba(7,15,28,0.97)]">
            <PipelineGraph status={status} />
          </div>

          {/* Atlas + Detail */}
          <div className="grid gap-4" style={{ gridTemplateColumns: "minmax(0,1fr) 260px" }}>
            <div className="rounded-2xl border border-white/[0.08] bg-[rgba(7,15,28,0.97)] p-4">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-amber-400/80 font-semibold">Market Atlas</p>
                  <p className="text-sm font-bold text-slate-100 mt-0.5">Competitive landscape</p>
                </div>
                <p className="text-[10px] text-muted">Click node · Drag to rearrange</p>
              </div>
              <AtlasCanvas
                atlas={result?.atlas ?? null}
                selectedNodeId={selectedNodeId}
                onSelectNode={setSelectedNodeId}
                isLoading={isLoading}
              />
            </div>
            <DetailPanel node={selectedNode} detail={selectedDetail} />
          </div>

          {/* Charts row */}
          {result && (
            <>
              <div className="grid grid-cols-3 gap-4 reveal opacity-0 translate-y-4 transition-all duration-500">
                {/* Pulse stats */}
                <div className="rounded-2xl border border-white/[0.08] bg-[rgba(7,15,28,0.97)] p-5 col-span-1">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-amber-400/80 font-semibold mb-1">Market Pulse</p>
                  <p className="text-[13px] font-semibold text-slate-200 leading-snug mt-2">{result.pulse.summary}</p>
                  <div className="grid grid-cols-2 gap-3 mt-3 p-3 rounded-xl bg-black/20">
                    <div>
                      <p className="text-[9px] uppercase tracking-wide text-muted">Temperature</p>
                      <p className={`text-sm font-bold mt-0.5 ${result.pulse.market_temperature === "heated" ? "text-orange-400" : result.pulse.market_temperature === "warm" ? "text-amber-400" : "text-sky-400"}`}>
                        {result.pulse.market_temperature}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wide text-muted">Competition</p>
                      <p className={`text-sm font-bold mt-0.5 ${result.pulse.competition_level === "high" ? "text-rose-400" : result.pulse.competition_level === "medium" ? "text-amber-400" : "text-emerald-400"}`}>
                        {result.pulse.competition_level}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-[9px] uppercase tracking-wider text-sky-400 mb-1">Whitespace</p>
                    <p className="text-[11px] text-muted leading-snug">{result.pulse.whitespace}</p>
                  </div>
                  <div className="mt-3">
                    <p className="text-[9px] uppercase tracking-wider text-sky-400 mb-1.5">Top Signals</p>
                    <ul className="space-y-1">
                      {result.pulse.top_signals.map((s) => (
                        <li key={s} className="flex gap-1.5 text-[11px] text-muted">
                          <span className="text-amber-500 mt-0.5 flex-shrink-0">▸</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <SentimentGauge temperature={result.pulse.market_temperature} competitionLevel={result.pulse.competition_level} />
                <RadarChart pulse={result.pulse} competitorNames={competitorNames} />
              </div>

              {/* Bubble chart + extra stats */}
              <div className="grid grid-cols-2 gap-4 reveal opacity-0 translate-y-4 transition-all duration-500 delay-75">
                <MarketBubbleChart competitors={result.competitor_details} />
                {/* Key metrics */}
                <div className="rounded-2xl border border-white/[0.08] bg-[rgba(7,15,28,0.97)] p-5">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted font-semibold mb-4">Atlas Metrics</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Atlas Nodes", val: result.atlas.nodes.length, color: "text-sky-400" },
                      { label: "Competitors", val: Object.keys(result.competitor_details).length, color: "text-emerald-400" },
                      { label: "Atlas Edges", val: result.atlas.edges.length, color: "text-violet-400" },
                      { label: "Sources", val: result.sources?.length ?? 0, color: "text-amber-400" },
                    ].map(({ label, val, color }) => (
                      <div key={label} className="bg-black/20 rounded-xl p-3">
                        <p className={`text-3xl font-extrabold tracking-tight ${color}`}>{val}</p>
                        <p className="text-[10px] text-muted mt-1">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Competitor cards */}
              <div className="reveal opacity-0 translate-y-4 transition-all duration-500 delay-100">
                <CompetitorCards competitors={result.competitor_details} onSelect={setSelectedNodeId} selectedId={selectedNodeId} />
              </div>

              {/* Brutal Truth + Opportunity */}
              <div className="grid grid-cols-2 gap-4 reveal opacity-0 translate-y-4 transition-all duration-500 delay-150">
                <SummaryCard title="Brutal Truth" card={result.brutal_truth} fallback="Synthesis available at completion." variant="brutal" />
                <SummaryCard title="Opportunity" card={result.opportunity} fallback="Opportunity framing available at completion." variant="opportunity" />
              </div>

              {/* Sources */}
              {result.sources?.length > 0 && (
                <div className="rounded-2xl border border-white/[0.08] bg-[rgba(7,15,28,0.97)] p-5 reveal opacity-0 translate-y-4 transition-all duration-500 delay-200">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted font-semibold mb-3">Research Sources</p>
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="border-b border-white/[0.07]">
                        <th className="text-left text-muted pb-2 pr-4 w-8">#</th>
                        <th className="text-left text-muted pb-2">URL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.sources.map((s, i) => (
                        <tr key={s} className="border-b border-white/[0.04]">
                          <td className="py-2 pr-4 text-muted">{i + 1}</td>
                          <td className="py-2"><a href={s} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline break-all">{s}</a></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Final Summary */}
              {status === "complete" && (
                <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-900/10 to-[rgba(7,15,28,0.97)] p-6 reveal opacity-0 translate-y-4 transition-all duration-500 delay-200">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-amber-400 font-semibold mb-2">🏁 Final Summary</p>
                  <h2 className="text-lg font-extrabold text-slate-100 mb-3">{result.pulse.idea}</h2>
                  <p className="text-[13px] text-muted leading-relaxed">{result.pulse.summary}</p>
                  <p className="text-[13px] text-muted leading-relaxed mt-2">{result.pulse.whitespace}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {[
                      { label: `🌡️ ${result.pulse.market_temperature} market`, c: "border-amber-500/30 bg-amber-500/10 text-amber-400" },
                      { label: `⚔️ ${result.pulse.competition_level} competition`, c: "border-rose-500/30 bg-rose-500/10 text-rose-400" },
                      { label: `${Object.keys(result.competitor_details).length} competitors`, c: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
                      { label: `${result.atlas.nodes.length} atlas nodes`, c: "border-sky-500/30 bg-sky-500/10 text-sky-400" },
                    ].map(({ label, c }) => (
                      <span key={label} className={`text-[10px] font-semibold px-3 py-1 rounded-full border ${c}`}>{label}</span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Right: Agent Console ── */}
        <AgentConsole status={status} progressMessage={progressMessage} />
      </div>
    </div>
  );
}