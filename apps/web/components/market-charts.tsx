"use client";

import { PulseSummary } from "@/lib/types";

// ── Radar Chart ───────────────────────────────────────────────
function polarToXY(angleDeg: number, r: number, cx: number, cy: number) {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

const AXES = ["Market Size", "Competition", "Growth", "Moat", "Innovation", "Timing"];

function hashSeed(s: string) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    return Math.abs(h);
}

interface RadarChartProps {
    pulse: PulseSummary;
    competitorNames: string[];
}

export function RadarChart({ pulse, competitorNames }: RadarChartProps) {
    const cx = 110; const cy = 115; const R = 82; const n = AXES.length;

    // My idea scores
    const myScores = AXES.map((ax) => {
        if (ax === "Competition") return pulse.competition_level === "high" ? 0.3 : pulse.competition_level === "medium" ? 0.55 : 0.8;
        if (ax === "Market Size") return pulse.market_temperature === "heated" ? 0.88 : pulse.market_temperature === "warm" ? 0.65 : 0.42;
        return 0.45 + (hashSeed(ax + pulse.summary) % 40) / 100;
    });

    // Competitor overlays (up to 2)
    const compOverlays = competitorNames.slice(0, 2).map((name) =>
        AXES.map((ax) => 0.38 + (hashSeed(name + ax) % 50) / 100)
    );

    const gridPts = (r: number) => AXES.map((_, i) => {
        const p = polarToXY((360 / n) * i, R * r, cx, cy);
        return `${p.x},${p.y}`;
    }).join(" ");

    const dataPts = (scores: number[]) => scores.map((s, i) => {
        const p = polarToXY((360 / n) * i, R * s, cx, cy);
        return `${p.x},${p.y}`;
    }).join(" ");

    const compColors = ["rgba(34,197,94,0.55)", "rgba(248,113,113,0.55)"];
    const compFills = ["rgba(34,197,94,0.07)", "rgba(248,113,113,0.07)"];

    return (
        <div className="rounded-2xl border border-white/[0.08] bg-[rgba(7,15,28,0.97)] p-5">
            <p className="text-[10px] uppercase tracking-[0.12em] font-semibold text-muted mb-1">Market Positioning Radar</p>
            {competitorNames.length > 0 && (
                <div className="flex gap-3 mb-3 flex-wrap">
                    <div className="flex items-center gap-1.5 text-[10px] text-sky-400">
                        <span className="w-2 h-2 rounded-full bg-sky-400/70 inline-block" />Your idea
                    </div>
                    {competitorNames.slice(0, 2).map((name, i) => (
                        <div key={name} className="flex items-center gap-1.5 text-[10px]" style={{ color: i === 0 ? "#22c55e" : "#f87171" }}>
                            <span className="w-2 h-2 rounded-full inline-block" style={{ background: i === 0 ? "#22c55e" : "#f87171", opacity: 0.8 }} />
                            {name}
                        </div>
                    ))}
                </div>
            )}
            <div className="flex justify-center">
                <svg width="220" height="230" overflow="visible">
                    {/* Grid rings */}
                    {[0.25, 0.5, 0.75, 1.0].map((r) => (
                        <polygon key={r} points={gridPts(r)} fill="none" stroke="rgba(99,120,170,0.12)" strokeWidth="1" />
                    ))}
                    {/* Axis lines */}
                    {AXES.map((_, i) => {
                        const end = polarToXY((360 / n) * i, R, cx, cy);
                        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(99,120,170,0.18)" strokeWidth="1" />;
                    })}
                    {/* Competitor overlays */}
                    {compOverlays.map((scores, ci) => (
                        <polygon key={ci} points={dataPts(scores)} fill={compFills[ci]} stroke={compColors[ci]} strokeWidth="1.2" strokeDasharray="4 3" />
                    ))}
                    {/* My idea polygon */}
                    <polygon points={dataPts(myScores)} fill="rgba(56,189,248,0.12)" stroke="rgba(56,189,248,0.75)" strokeWidth="1.8" />
                    {/* Data points */}
                    {myScores.map((s, i) => {
                        const p = polarToXY((360 / n) * i, R * s, cx, cy);
                        return <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#38bdf8" />;
                    })}
                    {/* Labels */}
                    {AXES.map((label, i) => {
                        const p = polarToXY((360 / n) * i, R + 20, cx, cy);
                        return (
                            <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
                                fontSize="9" fill="rgba(126,144,184,0.85)" fontFamily="Inter,sans-serif">
                                {label}
                            </text>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}

// ── Sentiment Gauge ────────────────────────────────────────────
interface SentimentGaugeProps {
    temperature: "cold" | "warm" | "heated";
    competitionLevel: "low" | "medium" | "high";
}

export function SentimentGauge({ temperature, competitionLevel }: SentimentGaugeProps) {
    const vals = { cold: 0.15, warm: 0.5, heated: 0.9 };
    const colors = { cold: "#38bdf8", warm: "#f59e0b", heated: "#f97316" };
    const val = vals[temperature]; const color = colors[temperature];
    const R = 52; const cx = 70; const cy = 68;
    const circ = Math.PI * R;
    const fillLen = circ * val;

    return (
        <div className="rounded-2xl border border-white/[0.08] bg-[rgba(7,15,28,0.97)] p-5 flex flex-col items-center">
            <p className="text-[10px] uppercase tracking-[0.12em] font-semibold text-muted mb-3 self-start">Market Temperature</p>
            <svg width="140" height="82" overflow="visible">
                <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
                    fill="none" stroke="rgba(99,120,170,0.12)" strokeWidth="11" strokeLinecap="round" />
                <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
                    fill="none" stroke={color} strokeWidth="11" strokeLinecap="round"
                    strokeDasharray={`${fillLen} ${circ}`}
                    style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)", filter: `drop-shadow(0 0 6px ${color})` }}
                />
                <text x={cx} y={cy - 10} textAnchor="middle" fontSize="14" fontWeight="800" fill={color} fontFamily="Inter,sans-serif">
                    {temperature.toUpperCase()}
                </text>
                <text x={cx} y={cy + 8} textAnchor="middle" fontSize="9" fill="rgba(126,144,184,0.75)" fontFamily="Inter,sans-serif">
                    {competitionLevel} competition
                </text>
            </svg>
            {/* Meter ticks */}
            <div className="flex justify-between w-full mt-2 text-[9px] text-muted">
                <span>Cold</span><span>Warm</span><span>Heated</span>
            </div>
        </div>
    );
}

// ── Market Bubble Chart ────────────────────────────────────────
interface BubbleChartProps {
    competitors: Record<string, { name: string; signals?: string[]; why_it_wins?: string }>;
}

function sigStrength(c: { signals?: string[]; why_it_wins?: string }) {
    return Math.min(1, 0.35 + (c.signals?.length ?? 0) * 0.1 + (c.why_it_wins?.length ?? 0) / 350);
}

export function MarketBubbleChart({ competitors }: BubbleChartProps) {
    const entries = Object.values(competitors);
    if (entries.length === 0) return null;

    const W = 280; const H = 140; const cx = W / 2; const cy = H / 2;
    const angles = entries.map((_, i) => (360 / entries.length) * i);

    return (
        <div className="rounded-2xl border border-white/[0.08] bg-[rgba(7,15,28,0.97)] p-5">
            <p className="text-[10px] uppercase tracking-[0.12em] font-semibold text-muted mb-3">Competitive Density</p>
            <div className="flex justify-center">
                <svg width={W} height={H} overflow="visible">
                    {/* Center idea bubble */}
                    <circle cx={cx} cy={cy} r="22" fill="rgba(56,189,248,0.12)" stroke="rgba(56,189,248,0.5)" strokeWidth="1.5" />
                    <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#38bdf8" fontFamily="Inter,sans-serif" fontWeight="600">YOUR IDEA</text>

                    {entries.map((c, i) => {
                        const rad = (angles[i] - 90) * (Math.PI / 180);
                        const r = 56 + (i % 2) * 12;
                        const bx = cx + r * Math.cos(rad);
                        const by = cy + r * Math.sin(rad);
                        const bsize = 14 + sigStrength(c) * 16;
                        const colors = ["rgba(248,113,113", "rgba(34,197,94", "rgba(249,115,22", "rgba(167,139,250"];
                        const cc = colors[i % colors.length];
                        return (
                            <g key={c.name}>
                                <line x1={cx} y1={cy} x2={bx} y2={by} stroke="rgba(99,120,170,0.2)" strokeWidth="1" strokeDasharray="3 3" />
                                <circle cx={bx} cy={by} r={bsize} fill={`${cc},0.1)`} stroke={`${cc},0.5)`} strokeWidth="1.2" />
                                <text x={bx} y={by} textAnchor="middle" dominantBaseline="middle"
                                    fontSize="7.5" fill="rgba(200,215,240,0.85)" fontFamily="Inter,sans-serif" fontWeight="600">
                                    {c.name.split(" ")[0]}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
