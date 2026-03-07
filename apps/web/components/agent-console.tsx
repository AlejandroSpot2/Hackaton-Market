"use client";

import { useEffect, useState } from "react";
import { RunStatus } from "@/lib/types";

interface LogEntry {
    id: string;
    icon: string;
    title: string;
    detail: string;
    tag: string;
    state: "done" | "active" | "pending";
}

const PHASE_LOGS: Record<RunStatus, LogEntry[]> = {
    queued: [
        { id: "q1", icon: "⚡", title: "Analysis queued", detail: "Preparing pipeline", tag: "SYSTEM", state: "active" },
    ],
    running: [
        { id: "r1", icon: "⚡", title: "Analysis started", detail: "Pipeline initialized", tag: "SYSTEM", state: "done" },
        { id: "r2", icon: "🔍", title: "Searching the web", detail: "Finding competitors and pricing data", tag: "EXA", state: "done" },
        { id: "r3", icon: "📄", title: "Extracting pages", detail: "Reading competitor websites", tag: "EXA", state: "active" },
        { id: "r4", icon: "🧠", title: "Gemini reasoning", detail: "Building market atlas...", tag: "GEMINI", state: "active" },
    ],
    pulse_ready: [
        { id: "p1", icon: "⚡", title: "Analysis started", detail: "Pipeline initialized", tag: "SYSTEM", state: "done" },
        { id: "p2", icon: "🔍", title: "Web scan complete", detail: "Extracted 8 competitor signals", tag: "EXA", state: "done" },
        { id: "p3", icon: "🧠", title: "Pulse generated", detail: "Phase 1 market atlas ready", tag: "GEMINI", state: "done" },
        { id: "p4", icon: "🗺️", title: "Deep mapping", detail: "Expanding topology...", tag: "GEMINI", state: "active" },
        { id: "p5", icon: "⚔️", title: "Competitor deep-dive", detail: "Analyzing strengths and gaps", tag: "GEMINI", state: "active" },
    ],
    complete: [
        { id: "c1", icon: "⚡", title: "Analysis started", detail: "Pipeline initialized", tag: "SYSTEM", state: "done" },
        { id: "c2", icon: "🔍", title: "Web scan complete", detail: "Found competitor landscape", tag: "EXA", state: "done" },
        { id: "c3", icon: "🧠", title: "Pulse generated", detail: "Phase 1 atlas ready", tag: "GEMINI", state: "done" },
        { id: "c4", icon: "🗺️", title: "Atlas mapped", detail: "Nodes and edges finalized", tag: "GEMINI", state: "done" },
        { id: "c5", icon: "⚔️", title: "Brutal truth synthesized", detail: "VC-grade analysis complete", tag: "GEMINI", state: "done" },
        { id: "c6", icon: "💡", title: "Opportunities found", detail: "Whitespace analysis done", tag: "GEMINI", state: "done" },
        { id: "c7", icon: "✅", title: "Atlas complete", detail: "Full market map ready", tag: "SYSTEM", state: "done" },
    ],
    failed: [
        { id: "f1", icon: "⚡", title: "Analysis started", detail: "Pipeline initialized", tag: "SYSTEM", state: "done" },
        { id: "f2", icon: "❌", title: "Pipeline error", detail: "Falling back to fixture data", tag: "SYSTEM", state: "active" },
    ],
};

const TAG_CLASS: Record<string, string> = {
    SYSTEM: "bg-slate-700/40 text-slate-400 border-slate-600/30",
    EXA: "bg-sky-500/15 text-sky-400 border-sky-500/25",
    GEMINI: "bg-violet-500/15 text-violet-400 border-violet-500/25",
};

interface AgentConsoleProps {
    status: RunStatus;
    progressMessage: string | null;
}

export function AgentConsole({ status, progressMessage }: AgentConsoleProps) {
    const logs = PHASE_LOGS[status] ?? PHASE_LOGS.queued;
    const [count, setCount] = useState(1);

    useEffect(() => {
        setCount(1);
        const t = setInterval(() => setCount((c) => { if (c >= logs.length) { clearInterval(t); return c; } return c + 1; }), 380);
        return () => clearInterval(t);
    }, [status, logs.length]);

    return (
        <aside className="rounded-2xl border border-white/[0.08] bg-[rgba(7,15,28,0.97)] flex flex-col overflow-hidden h-fit">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] font-semibold text-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-glow-pulse" />
                    Live Activity
                </div>
                <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    LIVE
                </span>
            </div>

            {/* Log entries */}
            <div className="p-2 flex flex-col gap-1.5 max-h-[480px] overflow-y-auto">
                {logs.slice(0, count).map((entry) => (
                    <div
                        key={entry.id}
                        className={[
                            "grid gap-2.5 p-2.5 rounded-xl border transition-all duration-300 animate-fade-up",
                            entry.state === "active" ? "border-sky-500/20 bg-sky-500/[0.04]" : "border-transparent",
                            entry.state === "done" ? "opacity-65" : "",
                        ].join(" ")}
                        style={{ gridTemplateColumns: "22px 1fr" }}
                    >
                        {/* Icon */}
                        <div className={[
                            "w-[22px] h-[22px] rounded-full border flex items-center justify-center text-[11px] flex-shrink-0",
                            entry.state === "done" ? "border-emerald-500/40 bg-emerald-500/10" : "",
                            entry.state === "active" ? "border-sky-400/50 bg-sky-400/10 animate-pulse-ring" : "",
                            entry.state === "pending" ? "border-white/10 bg-white/[0.03]" : "",
                        ].join(" ")}>
                            {entry.state === "done" ? "✓" : entry.icon}
                        </div>

                        <div>
                            <div className="text-[12px] font-semibold text-slate-200 leading-tight">
                                {entry.title}
                            </div>
                            <div className="text-[11px] text-muted mt-0.5 leading-snug">
                                {entry.state === "active" && progressMessage ? progressMessage : entry.detail}
                            </div>
                            <div className="mt-1.5">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${TAG_CLASS[entry.tag]}`}>
                                    {entry.tag}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}
