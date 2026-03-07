"use client";

import { RunStatus } from "@/lib/types";

interface PipelineStep {
    id: string;
    label: string;
    icon: string;
    badge: string;
}

const STEPS: PipelineStep[] = [
    { id: "ingest", label: "Idea Ingest", icon: "💡", badge: "SYSTEM" },
    { id: "search", label: "Web Search", icon: "🔍", badge: "EXA" },
    { id: "extract", label: "Extract", icon: "📄", badge: "EXA" },
    { id: "identify", label: "Identify", icon: "🏷️", badge: "GEMINI" },
    { id: "validate", label: "Validate", icon: "🔬", badge: "GEMINI" },
    { id: "atlas", label: "Atlas Build", icon: "🗺️", badge: "GEMINI" },
    { id: "analysis", label: "Analysis", icon: "🧠", badge: "GEMINI" },
    { id: "synthesis", label: "Synthesis", icon: "⚔️", badge: "GEMINI" },
    { id: "render", label: "Render", icon: "🚀", badge: "SYSTEM" },
];

const STATUS_PROGRESS: Record<RunStatus, number> = {
    queued: 1, running: 3, pulse_ready: 6, complete: 9, failed: 2,
};

const BADGE_COLORS: Record<string, string> = {
    SYSTEM: "bg-slate-700/40 text-slate-400",
    EXA: "bg-sky-500/15 text-sky-400",
    GEMINI: "bg-violet-500/15 text-violet-400",
};

interface PipelineGraphProps { status: RunStatus; }

type StepState = "done" | "active" | "idle";

function getState(index: number, progress: number): StepState {
    if (index < progress - 1) return "done";
    if (index === progress - 1) return "active";
    return "idle";
}

export function PipelineGraph({ status }: PipelineGraphProps) {
    const progress = STATUS_PROGRESS[status];

    return (
        <div className="px-5 py-4 border-b border-white/5">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted mb-4 font-semibold">Data Pipeline</p>
            <div className="overflow-x-auto pb-1">
                <div className="flex items-start min-w-max">
                    {STEPS.map((step, i) => {
                        const state = getState(i, progress);
                        return (
                            <div key={step.id} className="flex items-start">
                                {/* Node */}
                                <div className="flex flex-col items-center gap-1.5" style={{ width: 68 }}>
                                    <div
                                        className={[
                                            "w-11 h-11 rounded-[13px] border flex items-center justify-center text-lg transition-all duration-300",
                                            state === "done" ? "border-violet-500/60 bg-violet-500/10 text-violet-300" : "",
                                            state === "active" ? "border-sky-400/60 bg-sky-400/10 animate-pulse-ring" : "",
                                            state === "idle" ? "border-white/10 bg-white/[0.03] opacity-45" : "",
                                        ].join(" ")}
                                    >
                                        {state === "done" ? (
                                            <span className="text-violet-400 font-bold text-base">◆</span>
                                        ) : step.icon}
                                    </div>
                                    <span className="text-[10px] text-muted text-center leading-tight max-w-[64px]">{step.label}</span>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${BADGE_COLORS[step.badge]}`}>
                                        {step.badge}
                                    </span>
                                </div>

                                {/* Connector + Flowing dashed SVG line */}
                                {i < STEPS.length - 1 && (
                                    <div className="flex items-center pt-[14px] mx-0.5">
                                        <svg width="32" height="12" overflow="visible">
                                            {/* Static background line */}
                                            <line x1="0" y1="6" x2="24" y2="6"
                                                stroke={state === "done" ? "rgba(167,139,250,0.5)" : state === "active" ? "rgba(56,189,248,0.3)" : "rgba(99,120,170,0.15)"}
                                                strokeWidth="1.5"
                                            />
                                            {/* Animated dashed flow line on active */}
                                            {state === "active" && (
                                                <line x1="0" y1="6" x2="24" y2="6"
                                                    stroke="rgba(56,189,248,0.85)"
                                                    strokeWidth="1.5"
                                                    className="svg-flow-line"
                                                />
                                            )}
                                            {/* Arrow head */}
                                            <polyline
                                                points="20,3 24,6 20,9"
                                                fill="none"
                                                stroke={state === "done" ? "rgba(167,139,250,0.6)" : state === "active" ? "rgba(56,189,248,0.7)" : "rgba(99,120,170,0.2)"}
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
