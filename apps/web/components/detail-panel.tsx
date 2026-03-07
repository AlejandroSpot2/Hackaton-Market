import { AtlasNode, CompetitorDetail } from "@/lib/types";

const TYPE_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  idea: { label: "Core Idea", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  competitor: { label: "Competitor", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  segment: { label: "Market Segment", color: "text-sky-400", bg: "bg-sky-400/10 border-sky-400/20" },
  adjacent_category: { label: "Adjacent Market", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
  opportunity: { label: "Opportunity", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
};

interface DetailPanelProps {
  node: AtlasNode | null;
  detail: CompetitorDetail | null;
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <span className="text-[9px] uppercase tracking-[0.14em] text-sky-400 font-semibold">{label}</span>
      {children}
    </div>
  );
}

export function DetailPanel({ node, detail }: DetailPanelProps) {
  if (!node) {
    return (
      <aside className="rounded-2xl border border-white/[0.08] bg-[rgba(7,15,28,0.97)] p-5 flex flex-col gap-3">
        <p className="text-[10px] uppercase tracking-[0.12em] text-amber-400/80 font-semibold">Node Detail</p>
        <p className="text-sm text-muted">Select any node in the atlas to inspect its market role.</p>
      </aside>
    );
  }

  const s = TYPE_STYLES[node.type] ?? TYPE_STYLES.idea;

  return (
    <aside className="rounded-2xl border border-white/[0.08] bg-[rgba(7,15,28,0.97)] p-5 flex flex-col gap-4 overflow-y-auto max-h-[600px] animate-slide-in">
      <div>
        <p className="text-[10px] uppercase tracking-[0.12em] text-amber-400/80 font-semibold mb-2">Node Detail</p>
        <span className={`inline-block text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${s.bg} ${s.color}`}>
          {s.label}
        </span>
        <h2 className="text-base font-bold text-slate-100 mt-2 leading-snug">{node.label}</h2>
      </div>

      <Section label="Summary">
        <p className="text-[12px] text-muted leading-relaxed">{node.summary}</p>
      </Section>

      <Section label="Market Signal">
        <p className="text-[12px] text-slate-300 leading-relaxed">{node.market_signal}</p>
      </Section>

      {detail && (
        <>
          <Section label="Positioning">
            <p className="text-[12px] text-muted leading-relaxed">{detail.tagline}</p>
          </Section>

          <Section label="Why It Wins">
            <p className="text-[12px] text-emerald-300/80 leading-relaxed">{detail.why_it_wins}</p>
          </Section>

          {detail.pricing_hint && (
            <Section label="Pricing Hint">
              <p className="text-[12px] text-muted">{detail.pricing_hint}</p>
            </Section>
          )}

          {detail.risks?.length > 0 && (
            <Section label="Risks">
              <ul className="space-y-1">
                {detail.risks.map((r) => (
                  <li key={r} className="text-[12px] text-rose-300/80 flex gap-1.5">
                    <span className="text-rose-500 mt-0.5 flex-shrink-0">▸</span>{r}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {detail.signals?.length > 0 && (
            <Section label="Signals">
              <ul className="space-y-1">
                {detail.signals.map((sig) => (
                  <li key={sig} className="text-[12px] text-sky-300/80 flex gap-1.5">
                    <span className="text-sky-500 mt-0.5 flex-shrink-0">▸</span>{sig}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {detail.sources?.length > 0 && (
            <Section label="Sources">
              <ul className="space-y-1">
                {detail.sources.map((src) => (
                  <li key={src}>
                    <a href={src} target="_blank" rel="noreferrer"
                      className="text-[11px] text-sky-400 hover:underline break-all">
                      {src}
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </>
      )}
    </aside>
  );
}