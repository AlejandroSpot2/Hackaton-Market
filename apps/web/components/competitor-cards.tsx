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

export function CompetitorCards({ competitors, onSelect, selectedId }: CompetitorCardsProps) {
    const entries = Object.entries(competitors);
    if (entries.length === 0) return null;

    return (
        <section className="rounded-2xl border border-white/[0.08] bg-[rgba(7,15,28,0.97)] p-5">
            <p className="text-[10px] uppercase tracking-[0.12em] font-semibold text-muted mb-1">Competitor Landscape</p>
            <p className="text-base font-bold text-slate-100 mb-4">Who you&apos;re up against</p>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {entries.map(([id, d], i) => {
                    const pct = Math.round(strength(d) * 100);
                    const isSel = id === selectedId;
                    const colors = ["border-emerald-500/40", "border-sky-500/40", "border-violet-500/40", "border-amber-500/40", "border-rose-500/40"];
                    const barColors = ["bg-emerald-400", "bg-sky-400", "bg-violet-400", "bg-amber-400", "bg-rose-400"];
                    return (
                        <div
                            key={id}
                            onClick={() => onSelect(id)}
                            className={[
                                "flex-shrink-0 w-52 rounded-xl border p-4 cursor-pointer transition-all duration-200 animate-fade-up",
                                isSel
                                    ? `${colors[i % colors.length]} bg-white/[0.04] -translate-y-1 shadow-lg`
                                    : "border-white/[0.08] bg-transparent hover:border-white/20 hover:bg-white/[0.02] hover:-translate-y-0.5",
                            ].join(" ")}
                            style={{ animationDelay: `${i * 70}ms` }}
                        >
                            <p className="font-bold text-sm text-slate-100">{d.name}</p>
                            <p className="text-[11px] text-muted mt-1 leading-snug line-clamp-2">{d.tagline}</p>

                            {/* Strength bar */}
                            <div className="mt-3">
                                <div className="flex justify-between text-[9px] text-muted mb-1">
                                    <span>Strength</span><span>{pct}%</span>
                                </div>
                                <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-1000 ${barColors[i % barColors.length]}`}
                                        style={{ width: `${pct}%` }} />
                                </div>
                            </div>

                            {/* Why it wins */}
                            <div className="mt-3 pt-3 border-t border-white/[0.06]">
                                <p className="text-[9px] uppercase tracking-wider text-emerald-400 mb-1">Why it wins</p>
                                <p className="text-[11px] text-emerald-300/80 leading-snug line-clamp-3">{d.why_it_wins}</p>
                            </div>

                            {/* Risks */}
                            {d.risks?.length > 0 && (
                                <div className="mt-2.5">
                                    <p className="text-[9px] uppercase tracking-wider text-rose-400 mb-1">Key risk</p>
                                    <p className="text-[11px] text-rose-300/80 leading-snug line-clamp-2">{d.risks[0]}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
