"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Compass, RefreshCcw, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { AtlasCanvas } from "@/components/atlas-canvas";
import { DetailPanel } from "@/components/detail-panel";
import { ExperimentalPrefabShell } from "@/components/experimental-prefab-shell";
import { RunStatusShell } from "@/components/run-status-shell";
import { RunSummaryShell } from "@/components/run-summary-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { fetchRunSnapshot, RunSnapshot } from "@/lib/api";
import { buildRunViewModel } from "@/lib/run-view-model";
import { cn } from "@/lib/utils";

interface RunWorkspaceProps {
  runId: string;
}

const HERO_SIGILS = ["Atlas-first workspace", "Pulse before synthesis", "Persisted run state"];

function badgeVariant(status: string) {
  switch (status) {
    case "complete":
      return "success" as const;
    case "failed":
      return "destructive" as const;
    case "running":
    case "pulse_ready":
      return "warning" as const;
    default:
      return "secondary" as const;
  }
}

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

        setError(pollError instanceof Error ? pollError.message : "Could not reach the analysis workspace.");
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
  const selectedDetail = view.competitorDetails[selectedNode?.id ?? ""] ?? null;

  return (
    <div className="app-shell space-y-5">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass-panel glass-panel-strong p-7 sm:p-9"
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className="glass-chip">RealityCheck AI</span>
              <span className="glass-chip">Run ID {runId.slice(-8)}</span>
            </div>

            <div className="space-y-4">
              <p className="section-kicker">Live market workspace</p>
              <h1 className="font-serif text-4xl tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">{view.idea}</h1>
              <p className="hero-body max-w-[72ch]">
                This saved run keeps the atlas in view while the backend updates the pulse and synthesis surfaces around it.
                The graph is still the center of the product, not a supporting diagram.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {HERO_SIGILS.map((sigil) => (
                <span key={sigil} className="glass-chip">
                  {sigil}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 xl:items-end">
            <Badge variant={badgeVariant(view.status)}>{view.statusShell.label}</Badge>
            <Link className={cn(buttonVariants({ variant: "secondary" }), "no-underline")} href="/">
              Analyze another idea
            </Link>
          </div>
        </div>
      </motion.section>

      <ExperimentalPrefabShell section="status" view={view} error={error} fallback={<RunStatusShell error={error} view={view} />} />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
        className="glass-panel glass-panel-strong p-4 sm:p-5 lg:p-6"
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_380px]">
          <section className="space-y-4">
            <div className="flex flex-col gap-4 rounded-[1.8rem] border border-white/75 bg-white/44 p-5 backdrop-blur-xl lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2.5">
                <p className="section-kicker">Market atlas</p>
                <h2 className="font-serif text-3xl tracking-[-0.03em] text-foreground">Explore the graph while the synthesis keeps updating.</h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Focus a node to inspect supporting detail without losing the structure of the market around it.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="glass-chip">
                <Compass className="h-3.5 w-3.5" />
                Pan and zoom enabled
              </div>
              <div className="glass-chip">
                <Sparkles className="h-3.5 w-3.5" />
                Progressive states preserved
              </div>
              <div className="glass-chip">
                <RefreshCcw className="h-3.5 w-3.5" />
                Polling every 2.5 seconds
              </div>
            </div>

            <AtlasCanvas atlas={view.atlas} selectedNodeId={selectedNodeId} onSelectNode={setSelectedNodeId} />
          </section>

          <DetailPanel node={selectedNode} detail={selectedDetail} />
        </div>
      </motion.section>

      <ExperimentalPrefabShell section="summary" view={view} fallback={<RunSummaryShell view={view} />} />
    </div>
  );
}
