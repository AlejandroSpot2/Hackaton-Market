"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchRunResult, fetchRunStatus } from "@/lib/api";
import { RunRecord, RunStatusResponse } from "@/lib/types";
import { AtlasCanvas } from "@/components/atlas-canvas";
import { DetailPanel } from "@/components/detail-panel";
import { StatusStrip } from "@/components/status-strip";
import { SummaryCard } from "@/components/summary-card";

interface RunWorkspaceProps {
  runId: string;
}

export function RunWorkspace({ runId }: RunWorkspaceProps) {
  const [statusData, setStatusData] = useState<RunStatusResponse | null>(null);
  const [record, setRecord] = useState<RunRecord | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let intervalId: number | undefined;

    async function pollRun() {
      try {
        const [nextStatus, nextRecord] = await Promise.all([fetchRunStatus(runId), fetchRunResult(runId)]);
        if (!mounted) {
          return;
        }

        setStatusData(nextStatus);
        setRecord(nextRecord);
        setError(null);

        const nextNodes = nextRecord.result?.atlas.nodes ?? [];
        if (nextNodes.length > 0) {
          setSelectedNodeId((current) => {
            if (current && nextNodes.some((node) => node.id === current)) {
              return current;
            }
            return nextNodes[0].id;
          });
        }

        if ((nextStatus.status === "complete" || nextStatus.status === "failed") && intervalId) {
          window.clearInterval(intervalId);
        }
      } catch (pollError) {
        if (!mounted) {
          return;
        }
        setError(pollError instanceof Error ? pollError.message : "Could not load the run.");
      }
    }

    void pollRun();
    intervalId = window.setInterval(() => {
      void pollRun();
    }, 2500);

    return () => {
      mounted = false;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [runId]);

  const result = record?.result ?? null;
  const selectedNode = result?.atlas.nodes.find((node) => node.id === selectedNodeId) ?? null;
  const selectedDetail = selectedNode ? result?.competitor_details[selectedNode.id] ?? null : null;
  const status = statusData?.status ?? record?.status ?? "queued";
  const progressMessage = statusData?.progress_message ?? record?.progress_message ?? null;

  return (
    <div className="run-layout">
      <section className="surface hero-card run-header">
        <div>
          <p className="eyebrow">RealityCheck AI</p>
          <h1>{record?.idea ?? "Preparing analysis..."}</h1>
          <p className="muted">
            Polling local run data for <span className="mono">{runId}</span>
          </p>
        </div>
        <Link className="back-link" href="/">
          Analyze another idea
        </Link>
      </section>

      <StatusStrip status={status} progressMessage={progressMessage} />

      {error ? <p className="alert">{error}</p> : null}

      <div className="workspace-grid">
        <section className="surface atlas-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Market Atlas</p>
              <h2>Competitive landscape</h2>
            </div>
            <p className="muted">Click a node to inspect its detail panel.</p>
          </div>
          <AtlasCanvas atlas={result?.atlas ?? null} selectedNodeId={selectedNodeId} onSelectNode={setSelectedNodeId} />
        </section>

        <DetailPanel node={selectedNode} detail={selectedDetail} />
      </div>

      <div className="card-grid">
        <section className="surface summary-card pulse-card">
          <p className="eyebrow">Market Pulse</p>
          {result ? (
            <>
              <h3>{result.pulse.summary}</h3>
              <div className="pulse-grid">
                <div>
                  <span className="detail-label">Temperature</span>
                  <p>{result.pulse.market_temperature}</p>
                </div>
                <div>
                  <span className="detail-label">Competition</span>
                  <p>{result.pulse.competition_level}</p>
                </div>
              </div>
              <div className="detail-section">
                <span className="detail-label">Whitespace</span>
                <p>{result.pulse.whitespace}</p>
              </div>
              <div className="detail-section">
                <span className="detail-label">Top signals</span>
                <ul className="detail-list">
                  {result.pulse.top_signals.map((signal) => (
                    <li key={signal}>{signal}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="muted">Waiting for the first pulse snapshot from the API.</p>
          )}
        </section>

        <SummaryCard
          title="Brutal Truth"
          card={result?.brutal_truth ?? null}
          fallback="Final synthesis appears when the run reaches complete."
        />
        <SummaryCard
          title="Opportunity"
          card={result?.opportunity ?? null}
          fallback="Opportunity framing appears when the run reaches complete."
        />
      </div>

      {result?.sources?.length ? (
        <section className="surface summary-card">
          <p className="eyebrow">Sources</p>
          <ul className="detail-list">
            {result.sources.map((source) => (
              <li key={source}>
                <a href={source} rel="noreferrer" target="_blank">
                  {source}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}