"use client";

import { CompetitorDetail } from "@/lib/types";

interface CompetitorCardsProps {
    competitors: Record<string, CompetitorDetail>;
    onSelect: (id: string) => void;
    selectedId: string | null;
}

function strength(d: CompetitorDetail) {
    return Math.min(1, 0.38 + (d.signals?.length ?? 0) * 0.1 + (d.why_it_wins?.length ?? 0) / 320);
}

const COLORS = ["#22c55e", "#38bdf8", "#a78bfa", "#f59e0b", "#f87171"];

export function CompetitorCards({ competitors, onSelect, selectedId }: CompetitorCardsProps) {
    const entries = Object.entries(competitors);
    if (!entries.length) return null;

    const card: React.CSSProperties = { borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(7,15,28,0.97)", padding: 20 };

    return (
        <section style={card}>
            <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7e90b8", fontWeight: 600, margin: "0 0 4px" }}>Competitor Landscape</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#eef2ff", margin: "0 0 16px" }}>Who you&apos;re up against</p>
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
                {entries.map(([id, d], i) => {
                    const pct = Math.round(strength(d) * 100);
                    const isSel = id === selectedId;
                    const col = COLORS[i % COLORS.length];
                    return (
                        <div key={id} onClick={() => onSelect(id)} style={{
                            flexShrink: 0, width: 208, borderRadius: 12, padding: 16, cursor: "pointer",
                            transition: "all 0.2s",
                            border: isSel ? `1.5px solid ${col}40` : "1px solid rgba(255,255,255,0.07)",
                            background: isSel ? "rgba(255,255,255,0.03)" : "transparent",
                            transform: isSel ? "translateY(-4px)" : "none",
                            boxShadow: isSel ? "0 8px 24px rgba(0,0,0,0.3)" : "none",
                        }}>
                            <p style={{ fontWeight: 700, fontSize: 14, color: "#eef2ff", margin: 0 }}>{d.name}</p>
                            <p style={{ fontSize: 11, color: "#7e90b8", marginTop: 4, lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{d.tagline}</p>
                            {/* Strength bar */}
                            <div style={{ marginTop: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#7e90b8", marginBottom: 4 }}>
                                    <span>Strength</span><span>{pct}%</span>
                                </div>
                                <div style={{ height: 4, borderRadius: 999, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                                    <div style={{ height: "100%", borderRadius: 999, background: col, width: `${pct}%`, transition: "width 1s" }} />
                                </div>
                            </div>
                            {/* Why it wins */}
                            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#22c55e", margin: "0 0 4px" }}>Why it wins</p>
                                <p style={{ fontSize: 11, color: "rgba(34,197,94,0.75)", lineHeight: 1.4, margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>{d.why_it_wins}</p>
                            </div>
                            {d.risks?.length > 0 && (
                                <div style={{ marginTop: 10 }}>
                                    <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#f87171", margin: "0 0 4px" }}>Key risk</p>
                                    <p style={{ fontSize: 11, color: "rgba(248,113,113,0.75)", lineHeight: 1.4, margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{d.risks[0]}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
