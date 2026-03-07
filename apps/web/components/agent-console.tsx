"use client";

import { useEffect, useState } from "react";
import { RunStatus } from "@/lib/types";

interface LogEntry {
    id: string;
    icon: string;
    title: string;
    detail: string;
    tag: string;
    status: "done" | "active" | "pending";
}

const PHASE_LOGS: Record<RunStatus, LogEntry[]> = {
    queued: [
        { id: "q1", icon: "⚡", title: "Analysis started", detail: "Scanning idea for market signals", tag: "SYSTEM", status: "done" },
    ],
    running: [
        { id: "r1", icon: "⚡", title: "Analysis started", detail: "Scanning idea for market signals", tag: "SYSTEM", status: "done" },
        { id: "r2", icon: "🔍", title: "Scanning the web...", detail: "Searching for competitors and pricing", tag: "EXA", status: "done" },
        { id: "r3", icon: "🕸️", title: "Web scan complete", detail: "Extracted competitor context", tag: "EXA", status: "active" },
        { id: "r4", icon: "🧠", title: "LLM reasoning...", detail: "Gemini building the market atlas", tag: "GEMINI", status: "active" },
    ],
    pulse_ready: [
        { id: "p1", icon: "⚡", title: "Analysis started", detail: "Scanning idea for market signals", tag: "SYSTEM", status: "done" },
        { id: "p2", icon: "🔍", title: "Web scan complete", detail: "Extracted 8 competitor signals", tag: "EXA", status: "done" },
        { id: "p3", icon: "🧠", title: "Pulse generated", detail: "Phase 1 market atlas is ready", tag: "GEMINI", status: "done" },
        { id: "p4", icon: "🗺️", title: "Mapping topology...", detail: "Deep synthesis underway", tag: "GEMINI", status: "active" },
        { id: "p5", icon: "🔬", title: "Competitor deep-dive", detail: "Analyzing strengths and vulnerabilities", tag: "GEMINI", status: "active" },
    ],
    complete: [
        { id: "c1", icon: "⚡", title: "Analysis started", detail: "Scanned idea for market signals", tag: "SYSTEM", status: "done" },
        { id: "c2", icon: "🔍", title: "Web scan complete", detail: "Extracted competitor context", tag: "EXA", status: "done" },
        { id: "c3", icon: "🧠", title: "Pulse generated", detail: "Phase 1 atlas ready", tag: "GEMINI", status: "done" },
        { id: "c4", icon: "🗺️", title: "Market atlas mapped", detail: "Nodes and edges finalized", tag: "GEMINI", status: "done" },
        { id: "c5", icon: "⚔️", title: "Brutal truth synthesized", detail: "VC-grade analysis complete", tag: "GEMINI", status: "done" },
        { id: "c6", icon: "💡", title: "Opportunities found", detail: "Whitespace analysis complete", tag: "GEMINI", status: "done" },
        { id: "c7", icon: "✅", title: "Atlas complete", detail: "Full market map ready", tag: "SYSTEM", status: "done" },
    ],
    failed: [
        { id: "f1", icon: "⚡", title: "Analysis started", detail: "Pipeline initialized", tag: "SYSTEM", status: "done" },
        { id: "f2", icon: "❌", title: "Pipeline failed", detail: "Falling back to fixture data", tag: "SYSTEM", status: "active" },
    ],
};

const TAG_COLORS: Record<string, string> = {
    SYSTEM: "rgba(99,120,170,0.3)",
    EXA: "rgba(56,189,248,0.2)",
    GEMINI: "rgba(167,139,250,0.2)",
};

interface AgentConsoleProps {
    status: RunStatus;
    progressMessage: string | null;
}

export function AgentConsole({ status, progressMessage }: AgentConsoleProps) {
    const [visibleCount, setVisibleCount] = useState(1);
    const logs = PHASE_LOGS[status] ?? PHASE_LOGS.queued;

    useEffect(() => {
        setVisibleCount(1);
        const t = setInterval(() => {
            setVisibleCount((c) => {
                if (c >= logs.length) { clearInterval(t); return c; }
                return c + 1;
            });
        }, 400);
        return () => clearInterval(t);
    }, [status, logs.length]);

    const visibleLogs = logs.slice(0, visibleCount);

    return (
        <aside className="surface agent-console">
            <div className="console-header">
                <div className="console-title">
                    <span className="live-dot" />
                    Live Activity
                </div>
                <span className="live-badge">LIVE</span>
            </div>
            <div className="console-body">
                {visibleLogs.map((entry) => (
                    <div key={entry.id} className={`log-entry ${entry.status}`}>
                        <div className={`log-icon ${entry.status}`}>{entry.icon}</div>
                        <div>
                            <div className="log-title">
                                {entry.title}
                                {entry.status === "done" && <span style={{ color: "var(--green)", fontSize: "11px" }}>✓</span>}
                            </div>
                            <div className="log-sub">{progressMessage && entry.status === "active" ? progressMessage : entry.detail}</div>
                            <div style={{ marginTop: 5 }}>
                                <span
                                    className="log-tag"
                                    style={{ background: TAG_COLORS[entry.tag] ?? TAG_COLORS.SYSTEM, borderColor: "transparent" }}
                                >
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
