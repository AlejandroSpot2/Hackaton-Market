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
    { id: "exa_search", label: "Web Search", icon: "🔍", badge: "EXA" },
    { id: "extract", label: "Page Extract", icon: "📄", badge: "EXA" },
    { id: "identify", label: "Identify", icon: "🏷️", badge: "GEMINI" },
    { id: "validate", label: "Validate", icon: "✅", badge: "GEMINI" },
    { id: "atlas", label: "Atlas Build", icon: "🗺️", badge: "GEMINI" },
    { id: "analysis", label: "Analysis", icon: "🧠", badge: "GEMINI" },
    { id: "synthesis", label: "Synthesis", icon: "⚔️", badge: "GEMINI" },
    { id: "deploy", label: "Render", icon: "🚀", badge: "SYSTEM" },
];

const STATUS_PROGRESS: Record<RunStatus, number> = {
    queued: 1,
    running: 3,
    pulse_ready: 6,
    complete: 9,
    failed: 2,
};

interface PipelineGraphProps {
    status: RunStatus;
}

function getStepState(index: number, activeIndex: number): "done" | "active" | "idle" {
    if (index < activeIndex - 1) return "done";
    if (index === activeIndex - 1) return "active";
    return "idle";
}

export function PipelineGraph({ status }: PipelineGraphProps) {
    const progress = STATUS_PROGRESS[status];

    return (
        <div className="pipeline-wrapper">
            <p className="pipeline-label">Data Pipeline</p>
            <div className="pipeline-scroll">
                <div className="pipeline-track">
                    {STEPS.map((step, index) => {
                        const state = getStepState(index, progress);
                        return (
                            <div key={step.id} style={{ display: "flex", alignItems: "flex-start" }}>
                                <div className="pipeline-node-wrap">
                                    <div className={`pipeline-node ${state}`}>
                                        {state === "done" ? "✓" : step.icon}
                                    </div>
                                    <span className="pipeline-node-label">{step.label}</span>
                                    <span className="pipeline-node-badge">{step.badge}</span>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div className="pipeline-connector">
                                        <div className={`pipeline-line ${state === "done" ? "done" : state === "active" ? "active" : ""}`} />
                                        <svg width="8" height="8" viewBox="0 0 8 8" style={{ marginLeft: -1, marginTop: -1 }}>
                                            <polyline
                                                points="0,4 8,4 5,1"
                                                fill="none"
                                                stroke={state === "done" ? "rgba(34,197,94,0.5)" : state === "active" ? "rgba(56,189,248,0.6)" : "rgba(99,120,170,0.2)"}
                                                strokeWidth="1.5"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* SVG Flowing Lines for active step */}
            <svg width="100%" height="2" style={{ marginTop: 8, display: "block", opacity: 0.4 }}>
                <line x1="0" y1="1" x2="100%" y2="1"
                    stroke="rgba(56,189,248,0.3)"
                    strokeWidth="1"
                    strokeDasharray="6 8"
                    className="flow-svg-line"
                />
            </svg>
        </div>
    );
}
