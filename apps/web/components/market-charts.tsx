"use client";

import { useState, useCallback } from "react";
import { PulseSummary } from "@/lib/types";

/* ── helpers ── */
function polarXY(deg: number, r: number, cx: number, cy: number) {
    const rad = (deg - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function hash(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0; return Math.abs(h); }

const AXES = ["Market Size", "Competition", "Growth", "Moat", "Innovation", "Timing"];
const card: React.CSSProperties = { borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(7,15,28,0.97)", padding: 20 };
const eyebrow: React.CSSProperties = { fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, color: "#7e90b8", margin: "0 0 4px" };

/* ── Radar ────────────────────────────────────────── */
interface RadarChartProps { pulse: PulseSummary; competitorNames: string[]; onFocusCompetitor?: (name: string | null) => void; }

export function RadarChart({ pulse, competitorNames, onFocusCompetitor }: RadarChartProps) {
    const [focused, setFocused] = useState<number | null>(null);
    const cx = 110, cy = 115, R = 82, n = AXES.length;

    const my = AXES.map((ax) => {
        if (ax === "Competition") return pulse.competition_level === "high" ? 0.3 : pulse.competition_level === "medium" ? 0.55 : 0.8;
        if (ax === "Market Size") return pulse.market_temperature === "heated" ? 0.88 : pulse.market_temperature === "warm" ? 0.65 : 0.42;
        return 0.45 + (hash(ax + pulse.summary) % 40) / 100;
    });

    const comps = competitorNames.slice(0, 3).map((name) => AXES.map((ax) => 0.38 + (hash(name + ax) % 50) / 100));
    const gridPts = (r: number) => AXES.map((_, i) => { const p = polarXY((360 / n) * i, R * r, cx, cy); return `${p.x},${p.y}`; }).join(" ");
    const dataPts = (sc: number[]) => sc.map((s, i) => { const p = polarXY((360 / n) * i, R * s, cx, cy); return `${p.x},${p.y}`; }).join(" ");

    const COMP_COLORS = [
        { stroke: "rgba(34,197,94,0.7)", fill: "rgba(34,197,94,0.08)", dot: "#22c55e" },
        { stroke: "rgba(248,113,113,0.7)", fill: "rgba(248,113,113,0.08)", dot: "#f87171" },
        { stroke: "rgba(249,115,22,0.7)", fill: "rgba(249,115,22,0.08)", dot: "#f97316" },
    ];
    const MY_COLOR = { stroke: "rgba(56,189,248,0.8)", fill: "rgba(56,189,248,0.12)", dot: "#38bdf8" };

    const handleClick = useCallback((idx: number | null) => {
        setFocused((prev) => prev === idx ? null : idx);
        if (onFocusCompetitor) {
            onFocusCompetitor(idx !== null ? competitorNames[idx] : null);
        }
    }, [onFocusCompetitor, competitorNames]);

    const isFocused = (idx: number | null) => focused === null || focused === idx;

    return (
        <div style={card}>
            <p style={eyebrow}>Market Positioning Radar</p>
            <p style={{ fontSize: 9, color: "rgba(126,144,184,0.5)", margin: "0 0 8px" }}>Click legend or polygon to focus</p>

            {/* Legend — clickable */}
            <div style={{ display: "flex", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
                <button onClick={() => handleClick(null)} type="button" style={{
                    all: "unset", display: "flex", alignItems: "center", gap: 6, fontSize: 10, cursor: "pointer",
                    color: isFocused(null) && focused === null ? MY_COLOR.dot : "rgba(56,189,248,0.5)",
                    opacity: isFocused(null) ? 1 : 0.4, transition: "opacity 0.2s",
                }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: MY_COLOR.dot, display: "inline-block" }} />
                    Your idea
                </button>
                {competitorNames.slice(0, 3).map((name, i) => (
                    <button key={name} onClick={() => handleClick(i)} type="button" style={{
                        all: "unset", display: "flex", alignItems: "center", gap: 6, fontSize: 10, cursor: "pointer",
                        color: isFocused(i) ? COMP_COLORS[i].dot : `${COMP_COLORS[i].dot}80`,
                        opacity: isFocused(i) ? 1 : 0.35, transition: "opacity 0.2s",
                        fontWeight: focused === i ? 700 : 400,
                        textDecoration: focused === i ? "underline" : "none",
                        textUnderlineOffset: "3px",
                    }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", display: "inline-block", background: COMP_COLORS[i].dot }} />
                        {name}
                    </button>
                ))}
            </div>

            {/* Chart */}
            <div style={{ display: "flex", justifyContent: "center" }}>
                <svg width="220" height="230" overflow="visible">
                    {/* Grid rings */}
                    {[0.25, 0.5, 0.75, 1].map((r) => <polygon key={r} points={gridPts(r)} fill="none" stroke="rgba(99,120,170,0.1)" strokeWidth="0.8" />)}
                    {/* Axis lines */}
                    {AXES.map((_, i) => { const e = polarXY((360 / n) * i, R, cx, cy); return <line key={i} x1={cx} y1={cy} x2={e.x} y2={e.y} stroke="rgba(99,120,170,0.14)" strokeWidth="0.8" />; })}

                    {/* Competitor polygons — clickable */}
                    {comps.map((sc, ci) => {
                        const c = COMP_COLORS[ci];
                        const vis = isFocused(ci);
                        return (
                            <g key={ci} onClick={() => handleClick(ci)} style={{ cursor: "pointer" }}>
                                <polygon points={dataPts(sc)}
                                    fill={vis ? c.fill : "transparent"}
                                    stroke={vis ? c.stroke : `${c.stroke.slice(0, -4)}0.15)`}
                                    strokeWidth={focused === ci ? "2" : "1.2"}
                                    strokeDasharray={focused === ci ? "none" : "5 3"}
                                    style={{ transition: "all 0.3s" }}
                                />
                                {vis && sc.map((s, si) => {
                                    const p = polarXY((360 / n) * si, R * s, cx, cy);
                                    return <circle key={si} cx={p.x} cy={p.y} r="2.5" fill={c.dot} opacity={vis ? 0.8 : 0.2} />;
                                })}
                            </g>
                        );
                    })}

                    {/* Your idea polygon — always on top */}
                    <g onClick={() => handleClick(null)} style={{ cursor: "pointer" }}>
                        <polygon points={dataPts(my)}
                            fill={isFocused(null) ? MY_COLOR.fill : "rgba(56,189,248,0.04)"}
                            stroke={isFocused(null) ? MY_COLOR.stroke : "rgba(56,189,248,0.25)"}
                            strokeWidth={focused === null ? "2" : "1.5"}
                            style={{ transition: "all 0.3s" }}
                        />
                        {my.map((s, i) => {
                            const p = polarXY((360 / n) * i, R * s, cx, cy);
                            return <circle key={i} cx={p.x} cy={p.y} r={focused === null ? "4" : "3"} fill={MY_COLOR.dot}
                                style={{ transition: "r 0.2s" }} />;
                        })}
                    </g>

                    {/* Axis labels */}
                    {AXES.map((lbl, i) => {
                        const p = polarXY((360 / n) * i, R + 20, cx, cy);
                        return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="rgba(126,144,184,0.85)" fontFamily="Inter,sans-serif">{lbl}</text>;
                    })}
                </svg>
            </div>
        </div>
    );
}

/* ── Sentiment Gauge ────────────────────────────── */
interface SentimentGaugeProps { temperature: "cold" | "warm" | "heated"; competitionLevel: "low" | "medium" | "high"; }

export function SentimentGauge({ temperature, competitionLevel }: SentimentGaugeProps) {
    const vals = { cold: 0.15, warm: 0.5, heated: 0.9 };
    const cols = { cold: "#38bdf8", warm: "#f59e0b", heated: "#f97316" };
    const v = vals[temperature], c = cols[temperature], R = 52, cxc = 70, cyc = 68, arc = Math.PI * R, fill = arc * v;

    return (
        <div style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p style={{ ...eyebrow, alignSelf: "flex-start" }}>Market Temperature</p>
            <svg width="140" height="82" overflow="visible">
                <path d={`M ${cxc - R} ${cyc} A ${R} ${R} 0 0 1 ${cxc + R} ${cyc}`} fill="none" stroke="rgba(99,120,170,0.12)" strokeWidth="11" strokeLinecap="round" />
                <path d={`M ${cxc - R} ${cyc} A ${R} ${R} 0 0 1 ${cxc + R} ${cyc}`} fill="none" stroke={c} strokeWidth="11" strokeLinecap="round"
                    strokeDasharray={`${fill} ${arc}`} style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)", filter: `drop-shadow(0 0 6px ${c})` }} />
                <text x={cxc} y={cyc - 10} textAnchor="middle" fontSize="14" fontWeight="800" fill={c} fontFamily="Inter,sans-serif">{temperature.toUpperCase()}</text>
                <text x={cxc} y={cyc + 8} textAnchor="middle" fontSize="9" fill="rgba(126,144,184,0.75)" fontFamily="Inter,sans-serif">{competitionLevel} competition</text>
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginTop: 8, fontSize: 9, color: "#7e90b8" }}>
                <span>Cold</span><span>Warm</span><span>Heated</span>
            </div>
        </div>
    );
}

/* ── Bubble Chart ────────────────────────────────── */
interface BubbleChartProps { competitors: Record<string, { name: string; signals?: string[]; why_it_wins?: string }>; }

function sigStr(c: { signals?: string[]; why_it_wins?: string }) { return Math.min(1, 0.35 + (c.signals?.length ?? 0) * 0.1 + (c.why_it_wins?.length ?? 0) / 350); }

export function MarketBubbleChart({ competitors }: BubbleChartProps) {
    const entries = Object.values(competitors);
    if (!entries.length) return null;
    const W = 280, H = 140, cx = W / 2, cy = H / 2;
    const angles = entries.map((_, i) => (360 / entries.length) * i);
    const BUBBLE_COLORS = ["#f87171", "#22c55e", "#f97316", "#a78bfa", "#38bdf8"];

    return (
        <div style={card}>
            <p style={eyebrow}>Competitive Density</p>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <svg width={W} height={H} overflow="visible">
                    <circle cx={cx} cy={cy} r="22" fill="rgba(56,189,248,0.12)" stroke="rgba(56,189,248,0.5)" strokeWidth="1.5" />
                    <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#38bdf8" fontFamily="Inter,sans-serif" fontWeight="600">YOUR IDEA</text>
                    {entries.map((c, i) => {
                        const rad = (angles[i] - 90) * (Math.PI / 180);
                        const r = 56 + (i % 2) * 12;
                        const bx = cx + r * Math.cos(rad), by = cy + r * Math.sin(rad);
                        const bs = 14 + sigStr(c) * 16;
                        const col = BUBBLE_COLORS[i % BUBBLE_COLORS.length];
                        return (
                            <g key={c.name}>
                                <line x1={cx} y1={cy} x2={bx} y2={by} stroke="rgba(99,120,170,0.2)" strokeWidth="1" strokeDasharray="3 3" />
                                <circle cx={bx} cy={by} r={bs} fill={`${col}18`} stroke={`${col}88`} strokeWidth="1.2" />
                                <text x={bx} y={by} textAnchor="middle" dominantBaseline="middle" fontSize="7.5" fill="rgba(200,215,240,0.85)" fontFamily="Inter,sans-serif" fontWeight="600">{c.name.split(" ")[0]}</text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
