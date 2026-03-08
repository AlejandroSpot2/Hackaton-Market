import { AtlasNode, CompetitorDetail } from "@/lib/types";

const TYPE_META: Record<string, { label: string; color: string; bg: string }> = {
  idea: { label: "Core Idea", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  competitor: { label: "Competitor", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  segment: { label: "Market Segment", color: "#38bdf8", bg: "rgba(56,189,248,0.1)" },
  adjacent_category: { label: "Adjacent Market", color: "#f97316", bg: "rgba(249,115,22,0.1)" },
  opportunity: { label: "Opportunity", color: "#facc15", bg: "rgba(250,204,21,0.1)" },
};

interface DetailPanelProps { node: AtlasNode | null; detail: CompetitorDetail | null; }

const card: React.CSSProperties = { borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(7,15,28,0.97)", padding: 20, display: "flex", flexDirection: "column", gap: 16 };
const secLabel: React.CSSProperties = { fontSize: 9, textTransform: "uppercase", letterSpacing: "0.14em", color: "#38bdf8", fontWeight: 600, margin: "0 0 4px" };
const bodyText: React.CSSProperties = { fontSize: 12, color: "#7e90b8", lineHeight: 1.6, margin: 0 };

export function DetailPanel({ node, detail }: DetailPanelProps) {
  if (!node) {
    return (
      <aside style={card}>
        <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(245,158,11,0.7)", fontWeight: 600, margin: 0 }}>Node Detail</p>
        <p style={{ fontSize: 13, color: "#7e90b8", margin: 0 }}>Select any node in the atlas to inspect its market role.</p>
      </aside>
    );
  }

  const t = TYPE_META[node.type] ?? TYPE_META.idea;

  return (
    <aside style={{ ...card, overflow: "auto", maxHeight: 600 }}>
      <div>
        <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(245,158,11,0.7)", fontWeight: 600, margin: "0 0 8px" }}>Node Detail</p>
        <span style={{ display: "inline-block", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: t.bg, color: t.color, border: `1px solid ${t.color}30` }}>
          {t.label}
        </span>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#eef2ff", margin: "8px 0 0", lineHeight: 1.3 }}>{node.label}</h2>
      </div>

      <div><p style={secLabel}>Summary</p><p style={bodyText}>{node.summary}</p></div>
      <div><p style={secLabel}>Market Signal</p><p style={{ ...bodyText, color: "#c8d7f0" }}>{node.market_signal}</p></div>

      {detail && (
        <>
          <div><p style={secLabel}>Positioning</p><p style={bodyText}>{detail.tagline}</p></div>
          <div><p style={secLabel}>Why It Wins</p><p style={{ ...bodyText, color: "rgba(34,197,94,0.75)" }}>{detail.why_it_wins}</p></div>
          {detail.pricing_hint && <div><p style={secLabel}>Pricing</p><p style={bodyText}>{detail.pricing_hint}</p></div>}
          {detail.risks?.length > 0 && (
            <div>
              <p style={secLabel}>Risks</p>
              {detail.risks.map((r) => (
                <p key={r} style={{ ...bodyText, color: "rgba(248,113,113,0.75)", display: "flex", gap: 6 }}>
                  <span style={{ color: "#f87171", flexShrink: 0 }}>▸</span>{r}
                </p>
              ))}
            </div>
          )}
          {detail.signals?.length > 0 && (
            <div>
              <p style={secLabel}>Signals</p>
              {detail.signals.map((s) => (
                <p key={s} style={{ ...bodyText, color: "rgba(56,189,248,0.75)", display: "flex", gap: 6 }}>
                  <span style={{ color: "#38bdf8", flexShrink: 0 }}>▸</span>{s}
                </p>
              ))}
            </div>
          )}
          {detail.sources?.length > 0 && (
            <div>
              <p style={secLabel}>Sources</p>
              {detail.sources.map((src) => (
                <p key={src} style={{ margin: "2px 0" }}>
                  <a href={src} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#38bdf8", textDecoration: "none", wordBreak: "break-all" }}>{src}</a>
                </p>
              ))}
            </div>
          )}
        </>
      )}
    </aside>
  );
}