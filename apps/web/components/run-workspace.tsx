"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AtlasCanvas } from "@/components/atlas-canvas";
import { DetailPanel } from "@/components/detail-panel";
import { ExperimentalPrefabShell } from "@/components/experimental-prefab-shell";
import { RunStatusShell } from "@/components/run-status-shell";
import { RunSummaryShell } from "@/components/run-summary-shell";
import { fetchRunSnapshot, RunSnapshot } from "@/lib/api";
import { buildRunViewModel } from "@/lib/run-view-model";

interface RunWorkspaceProps {
  runId: string;
}

const HERO_SIGILS = ["Atlas-first", "Pulse before synthesis", "Persistent run state"];

export function RunWorkspace({ runId }: RunWorkspaceProps) {
  const [snapshot, setSnapshot] = useState<RunSnapshot | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let intervalId: number | undefined;

    async function pollRun() {
      try {
        const nextSnapshot = await fetchRunSnapshot(runId);

        if (!mounted) {
          return;
        }

        setSnapshot(nextSnapshot);
        setError(null);

        const nextNodes = nextSnapshot.view.atlas?.nodes ?? [];
        setSelectedNodeId((current) => {
          if (nextNodes.length === 0) {
            return null;
          }

          if (current && nextNodes.some((node) => node.id === current)) {
            return current;
          }

          return nextNodes[0].id;
        });

        if ((nextSnapshot.statusData.status === "complete" || nextSnapshot.statusData.status === "failed") && intervalId) {
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

  const view = snapshot?.view ?? buildRunViewModel({ runId, statusData: null, record: null });
  const atlasNodes = view.atlas?.nodes ?? [];
  const selectedNode = atlasNodes.find((node) => node.id === selectedNodeId) ?? null;
  const selectedDetail = selectedNode ? view.competitorDetails[selectedNode.id] ?? null : null;

  return (
    <div className="run-layout run-layout--observatory">
      <section className="surface hero-card run-header observatory-hero">
        <div className="observatory-hero-copy">
          <p className="eyebrow">RealityCheck AI</p>
          <h1>{view.idea}</h1>
          <p className="hero-copy compact">
            The observatory stays atlas-first. The market pulse appears early, the codex keeps updating, and the explorable terrain remains the main event for <span className="mono">{runId}</span>.
          </p>
          <div className="hero-sigils" aria-label="Product traits">
            {HERO_SIGILS.map((sigil) => (
              <span key={sigil} className="scene-pill">
                {sigil}
              </span>
            ))}
          </div>
        </div>

        <div className="run-header-actions">
          <span className={`status-badge ${view.status}`}>{view.statusShell.label}</span>
          <Link className="back-link" href="/">
            Analyze another idea
          </Link>
        </div>
      </section>

      <section className="surface observatory-shell">
        <ExperimentalPrefabShell
          section="status"
          view={view}
          error={error}
          fallback={<RunStatusShell error={error} view={view} />}
        />

        <div className="workspace-grid observatory-grid">
          <section className="atlas-panel observatory-atlas">
            <div className="panel-header atlas-header">
              <div>
                <p className="eyebrow">Explorable space</p>
                <h2>The atlas is staged as floating territory, not a static diagram.</h2>
              </div>
              <p className="muted">Pan, zoom, and select islands to pull their field notes into the codex without losing the wider market shape.</p>
            </div>
            <AtlasCanvas atlas={view.atlas} selectedNodeId={selectedNodeId} onSelectNode={setSelectedNodeId} />
          </section>

          <DetailPanel node={selectedNode} detail={selectedDetail} />
        </div>

        <ExperimentalPrefabShell section="summary" view={view} fallback={<RunSummaryShell view={view} />} />
      </section>
    </div>
  );
}
