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
        { id: "r4", icon: "📊", title: "Gemini reasoning", detail: "Building market atlas...", tag: "GEMINI", state: "active" },
    ],
    pulse_ready: [
        { id: "p1", icon: "⚡", title: "Analysis started", detail: "Pipeline initialized", tag: "SYSTEM", state: "done" },
        { id: "p2", icon: "🔍", title: "Web scan complete", detail: "Extracted 8 competitor signals", tag: "EXA", state: "done" },
        { id: "p3", icon: "📊", title: "Pulse generated", detail: "Phase 1 market atlas ready", tag: "GEMINI", state: "done" },
        { id: "p4", icon: "🗺️", title: "Deep mapping", detail: "Expanding topology...", tag: "GEMINI", state: "active" },
        { id: "p5", icon: "⚔️", title: "Competitor deep-dive", detail: "Analyzing strengths and gaps", tag: "GEMINI", state: "active" },
    ],
    complete: [
        { id: "c1", icon: "⚡", title: "Analysis started", detail: "Pipeline initialized", tag: "SYSTEM", state: "done" },
        { id: "c2", icon: "🔍", title: "Web scan complete", detail: "Found competitor landscape", tag: "EXA", state: "done" },
        { id: "c3", icon: "📊", title: "Pulse generated", detail: "Phase 1 atlas ready", tag: "GEMINI", state: "done" },
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

/* Provider-themed colors for done entries */
const TAG_COLORS: Record<string, { bg: string; text: string; border: string; doneBg: string; doneText: string }> = {
    SYSTEM: { bg: "rgba(100,116,139,0.2)", text: "#94a3b8", border: "rgba(100,116,139,0.25)", doneBg: "rgba(100,116,139,0.06)", doneText: "#94a3b8" },
    EXA: { bg: "rgba(56,189,248,0.12)", text: "#38bdf8", border: "rgba(56,189,248,0.2)", doneBg: "rgba(56,189,248,0.04)", doneText: "#67cff5" },
    GEMINI: { bg: "rgba(167,139,250,0.12)", text: "#a78bfa", border: "rgba(167,139,250,0.2)", doneBg: "rgba(167,139,250,0.04)", doneText: "#b8a4fb" },
};

interface AgentConsoleProps { status: RunStatus; progressMessage: string | null; }

export function AgentConsole({ status, progressMessage }: AgentConsoleProps) {
    const logs = PHASE_LOGS[status] ?? PHASE_LOGS.queued;
    const [count, setCount] = useState(1);

    useEffect(() => {
        setCount(1);
        const t = setInterval(() => setCount((c) => { if (c >= logs.length) { clearInterval(t); return c; } return c + 1; }), 380);
        return () => clearInterval(t);
    }, [status, logs.length]);

    const panel: React.CSSProperties = {
        borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(7,15,28,0.97)",
        display: "flex", flexDirection: "column", overflow: "hidden",
    };

    return (
        <aside style={panel}>
            {/* Header */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7e90b8", fontWeight: 600 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                    Live Activity
                </div>
                <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", padding: "2px 8px", borderRadius: 999,
                    background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e",
                }}>LIVE</span>
            </div>

            {/* Entries — colored by provider */}
            <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 4, maxHeight: 480, overflowY: "auto" }}>
                {logs.slice(0, count).map((entry) => {
                    const tc = TAG_COLORS[entry.tag] ?? TAG_COLORS.SYSTEM;
                    const isDone = entry.state === "done";
                    const isActive = entry.state === "active";

                    return (
                        <div key={entry.id} style={{
                            display: "grid", gridTemplateColumns: "24px 1fr", gap: 10, padding: "10px 10px",
                            borderRadius: 10, transition: "all 0.2s",
                            border: isActive ? `1px solid ${tc.border}` : "1px solid transparent",
                            background: isActive ? tc.doneBg : "transparent",
                        }}>
                            {/* Icon circle — use emoji always, no tick overlay */}
                            <div style={{
                                width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 12, flexShrink: 0,
                                border: isDone
                                    ? `1.5px solid ${tc.text}50`
                                    : isActive
                                        ? `1.5px solid ${tc.text}60`
                                        : "1px solid rgba(255,255,255,0.08)",
                                background: isDone ? tc.doneBg : isActive ? `${tc.text}10` : "rgba(255,255,255,0.02)",
                            }}>
                                {entry.icon}
                            </div>
                            <div>
                                <div style={{
                                    fontSize: 12, fontWeight: 600, lineHeight: 1.3,
                                    color: isDone ? tc.doneText : isActive ? tc.text : "#e2e8f0",
                                }}>
                                    {entry.title}
                                    {isDone && <span style={{ marginLeft: 6, fontSize: 10, color: tc.doneText, opacity: 0.7 }}>✓</span>}
                                </div>
                                <div style={{ fontSize: 11, color: "#7e90b8", marginTop: 2, lineHeight: 1.4 }}>
                                    {isActive && progressMessage ? progressMessage : entry.detail}
                                </div>
                                <div style={{ marginTop: 5 }}>
                                    <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}>
                                        {entry.tag}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}
