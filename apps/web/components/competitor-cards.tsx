"use client";

import { useState } from "react";
import { CompetitorDetail } from "@/lib/types";

interface CompetitorCardsProps {
    competitors: Record<string, CompetitorDetail>;
    onSelect: (id: string) => void;
    selectedId: string | null;
}

function strengthScore(detail: CompetitorDetail): number {
    return Math.min(1, 0.4 + (detail.signals?.length ?? 0) * 0.1 + (detail.why_it_wins?.length ?? 0) / 300);
}

export function CompetitorCards({ competitors, onSelect, selectedId }: CompetitorCardsProps) {
    const entries = Object.entries(competitors);
    if (entries.length === 0) return null;

    return (
        <section className="surface competitor-row-wrap">
            <p className="eyebrow" style={{ marginBottom: 4 }}>Competitor Landscape</p>
            <p className="competitor-row-title">Who you&apos;re up against</p>
            <div className="competitor-scroll">
                {entries.map(([id, detail], i) => {
                    const score = strengthScore(detail);
                    const isSelected = id === selectedId;
                    return (
                        <div
                            key={id}
                            className="comp-card"
                            style={{
                                animationDelay: `${i * 80}ms`,
                                borderColor: isSelected ? "rgba(56,189,248,0.5)" : undefined,
                                background: isSelected ? "rgba(14,24,50,0.99)" : undefined,
                            }}
                            onClick={() => onSelect(id)}
                        >
                            <div className="comp-name">{detail.name}</div>
                            <div className="comp-tagline">{detail.tagline}</div>
                            <div className="comp-strength-bar">
                                <div className="comp-strength-fill" style={{ width: `${Math.round(score * 100)}%` }} />
                            </div>
                            <div style={{ fontSize: "0.65rem", color: "var(--muted)", marginTop: 4 }}>
                                Strength: {Math.round(score * 100)}%
                            </div>
                            <div className="comp-win">
                                <div className="comp-win-label">Why it wins</div>
                                {detail.why_it_wins}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
