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
    { id: "analysis", label: "Analysis", icon: "📊", badge: "GEMINI" },
    { id: "synthesis", label: "Synthesis", icon: "⚔️", badge: "GEMINI" },
    { id: "render", label: "Render", icon: "🚀", badge: "SYSTEM" },
];

const STATUS_PROGRESS: Record<RunStatus, number> = {
    queued: 1, running: 3, pulse_ready: 6, complete: 9, failed: 2,
};

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
    SYSTEM: { bg: "rgba(100,116,139,0.2)", text: "#94a3b8" },
    EXA: { bg: "rgba(56,189,248,0.12)", text: "#38bdf8" },
    GEMINI: { bg: "rgba(167,139,250,0.12)", text: "#a78bfa" },
};

type StepState = "done" | "active" | "idle";

function getState(index: number, progress: number): StepState {
    if (index < progress - 1) return "done";
    if (index === progress - 1) return "active";
    return "idle";
}

interface PipelineGraphProps { status: RunStatus; }

export function PipelineGraph({ status }: PipelineGraphProps) {
    const progress = STATUS_PROGRESS[status];

    const nodeStyle = (state: StepState): React.CSSProperties => ({
        width: 44, height: 44, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, transition: "all 0.3s",
        /* done = purple outline, active = blue glow, idle = subtle gray */
        border: state === "done"
            ? "2px solid rgba(167,139,250,0.6)"
            : state === "active"
                ? "1.5px solid rgba(56,189,248,0.5)"
                : "1px solid rgba(255,255,255,0.06)",
        background: state === "done"
            ? "rgba(167,139,250,0.08)"
            : state === "active"
                ? "rgba(56,189,248,0.06)"
                : "rgba(255,255,255,0.015)",
        opacity: state === "idle" ? 0.35 : 1,
        boxShadow: state === "active"
            ? "0 0 0 4px rgba(56,189,248,0.12), 0 0 12px rgba(56,189,248,0.08)"
            : state === "done"
                ? "0 0 0 3px rgba(167,139,250,0.08)"
                : "none",
    });

    return (
        <div style={{
            padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)",
            background: "rgba(7,15,28,0.97)", borderRadius: "16px 16px 0 0",
        }}>
            <p style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7e90b8", marginBottom: 16, fontWeight: 600 }}>
                Data Pipeline
            </p>
            <div style={{ overflowX: "auto", paddingBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "flex-start", minWidth: "max-content" }}>
                    {STEPS.map((step, i) => {
                        const state = getState(i, progress);
                        const bc = BADGE_COLORS[step.badge];
                        return (
                            <div key={step.id} style={{ display: "flex", alignItems: "flex-start" }}>
                                {/* Node — keeps original emoji even when done */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 68 }}>
                                    <div style={nodeStyle(state)}>
                                        {step.icon}
                                    </div>
                                    <span style={{
                                        fontSize: 10, textAlign: "center", lineHeight: 1.3, maxWidth: 64,
                                        color: state === "done" ? "#a78bfa" : state === "active" ? "#38bdf8" : "#7e90b8",
                                        fontWeight: state === "done" || state === "active" ? 600 : 400,
                                    }}>
                                        {step.label}
                                    </span>
                                    <span style={{
                                        fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                                        background: bc.bg, color: bc.text,
                                    }}>
                                        {step.badge}
                                    </span>
                                </div>

                                {/* Connector — slower, sleeker flow */}
                                {i < STEPS.length - 1 && (
                                    <div style={{ display: "flex", alignItems: "center", paddingTop: 14, margin: "0 2px" }}>
                                        <svg width="32" height="12" overflow="visible">
                                            {/* Base line */}
                                            <line x1="0" y1="6" x2="26" y2="6"
                                                stroke={
                                                    state === "done" ? "rgba(167,139,250,0.35)"
                                                        : state === "active" ? "rgba(56,189,248,0.15)"
                                                            : "rgba(99,120,170,0.08)"
                                                }
                                                strokeWidth="1.5"
                                            />
                                            {/* Animated flowing dash — slow & sleek (1.8s) */}
                                            {state === "active" && (
                                                <line x1="0" y1="6" x2="26" y2="6"
                                                    stroke="rgba(56,189,248,0.7)" strokeWidth="1.5"
                                                    strokeDasharray="4 8"
                                                    style={{ animation: "flow-dash 1.8s linear infinite" }}
                                                />
                                            )}
                                            {/* Done: solid thin purple */}
                                            {state === "done" && (
                                                <line x1="0" y1="6" x2="26" y2="6"
                                                    stroke="rgba(167,139,250,0.55)" strokeWidth="1.5"
                                                />
                                            )}
                                            {/* Arrow head */}
                                            <polyline points="22,3 26,6 22,9" fill="none"
                                                stroke={
                                                    state === "done" ? "rgba(167,139,250,0.5)"
                                                        : state === "active" ? "rgba(56,189,248,0.6)"
                                                            : "rgba(99,120,170,0.12)"
                                                }
                                                strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
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
