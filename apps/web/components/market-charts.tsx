"use client";

import { PulseSummary } from "@/lib/types";

interface RadarChartProps {
    pulse: PulseSummary;
    competitors: string[];
}

function polarToXY(angle: number, radius: number, cx: number, cy: number) {
    const rad = (angle - 90) * (Math.PI / 180);
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

const AXES = [
    "Market Size",
    "Competition",
    "Growth Rate",
    "Moat Depth",
    "Innovation Gap",
    "Timing",
];

function fakeSignal(name: string, idx: number): number {
    // deterministic seed from name string to give consistent values
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (Math.imul(31, h) + name.charCodeAt(i)) | 0;
    return 0.4 + (Math.abs(h % 100) / 100) * 0.55;
}

export function RadarChart({ pulse }: RadarChartProps) {
    const cx = 110; const cy = 110; const maxR = 80; const n = AXES.length;

    const scores = AXES.map((axis, i) => {
        if (axis === "Competition") return pulse.competition_level === "high" ? 0.85 : pulse.competition_level === "medium" ? 0.55 : 0.25;
        if (axis === "Market Size") return pulse.market_temperature === "heated" ? 0.9 : pulse.market_temperature === "warm" ? 0.65 : 0.4;
        return fakeSignal(axis, i);
    });

    const gridRings = [0.25, 0.5, 0.75, 1.0];
    const gridPts = (r: number) => AXES.map((_, i) => {
        const pt = polarToXY((360 / n) * i, maxR * r, cx, cy);
        return `${pt.x},${pt.y}`;
    }).join(" ");

    const dataPts = scores.map((s, i) => {
        const pt = polarToXY((360 / n) * i, maxR * s, cx, cy);
        return `${pt.x},${pt.y}`;
    }).join(" ");

    return (
        <div className="radar-wrap surface">
            <p className="radar-title">Market Positioning Radar</p>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <svg width="220" height="220" className="gauge-svg">
                    {/* Grid rings */}
                    {gridRings.map((r) => (
                        <polygon key={r} points={gridPts(r)}
                            fill="none" stroke="rgba(99,120,170,0.15)" strokeWidth="1" />
                    ))}
                    {/* Axis lines */}
                    {AXES.map((_, i) => {
                        const end = polarToXY((360 / n) * i, maxR, cx, cy);
                        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(99,120,170,0.2)" strokeWidth="1" />;
                    })}
                    {/* Data polygon */}
                    <polygon points={dataPts}
                        fill="rgba(56,189,248,0.15)" stroke="rgba(56,189,248,0.7)" strokeWidth="1.5" />
                    {/* Data points */}
                    {scores.map((s, i) => {
                        const pt = polarToXY((360 / n) * i, maxR * s, cx, cy);
                        return <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill="#38bdf8" />;
                    })}
                    {/* Labels */}
                    {AXES.map((label, i) => {
                        const pt = polarToXY((360 / n) * i, maxR + 18, cx, cy);
                        return (
                            <text key={i} x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="middle"
                                fontSize="9" fill="rgba(126,144,184,0.9)" fontFamily="Inter, sans-serif">
                                {label}
                            </text>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}


interface SentimentGaugeProps {
    temperature: "cold" | "warm" | "heated";
    competitionLevel: "low" | "medium" | "high";
}

export function SentimentGauge({ temperature, competitionLevel }: SentimentGaugeProps) {
    const tempMap = { cold: 0.15, warm: 0.5, heated: 0.85 };
    const val = tempMap[temperature];
    const colorMap = { cold: "#38bdf8", warm: "#f59e0b", heated: "#f97316" };
    const color = colorMap[temperature];

    const R = 52; const cx = 70; const cy = 70;
    const circumference = Math.PI * R;
    const fillLen = circumference * val;

    return (
        <div className="surface metric-card" style={{ textAlign: "center" }}>
            <p className="eyebrow" style={{ marginBottom: 6 }}>Market Temperature</p>
            <div className="gauge-wrap">
                <svg width="140" height="80" className="gauge-svg">
                    {/* Background arc */}
                    <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
                        fill="none" stroke="rgba(99,120,170,0.15)" strokeWidth="10" strokeLinecap="round" />
                    {/* Value arc */}
                    <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
                        fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
                        strokeDasharray={`${fillLen} ${circumference}`}
                        style={{ transition: "stroke-dasharray 1s cubic-bezier(0.34,1.56,0.64,1)" }}
                    />
                    <text x={cx} y={cy - 8} textAnchor="middle" fontSize="13" fontWeight="700"
                        fill={color} fontFamily="Inter, sans-serif">
                        {temperature.toUpperCase()}
                    </text>
                    <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill="rgba(126,144,184,0.8)"
                        fontFamily="Inter, sans-serif">{competitionLevel} competition</text>
                </svg>
            </div>
        </div>
    );
}
