import { SummaryCard as SummaryCardType } from "@/lib/types";

interface SummaryCardProps {
  title: string;
  card: SummaryCardType | null;
  fallback: string;
  variant?: "brutal" | "opportunity";
}

const VARS = {
  brutal: { eyebrow: "#f87171", border: "rgba(248,113,113,0.2)", grad: "linear-gradient(135deg,rgba(120,30,30,0.08),rgba(7,15,28,0.97))", bullet: "#f87171" },
  opportunity: { eyebrow: "#f59e0b", border: "rgba(245,158,11,0.2)", grad: "linear-gradient(135deg,rgba(120,80,0,0.08),rgba(7,15,28,0.97))", bullet: "#f59e0b" },
};

export function SummaryCard({ title, card, fallback, variant }: SummaryCardProps) {
  const v = variant ? VARS[variant] : { eyebrow: "rgba(245,158,11,0.65)", border: "rgba(255,255,255,0.07)", grad: "", bullet: "#f59e0b" };

  const base: React.CSSProperties = {
    borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 12,
    border: `1px solid ${v.border}`,
    background: v.grad || "rgba(7,15,28,0.97)",
  };

  if (!card) {
    return (
      <section style={base}>
        <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, color: v.eyebrow, margin: 0 }}>{title}</p>
        <p style={{ fontSize: 13, color: "#7e90b8", margin: 0 }}>{fallback}</p>
      </section>
    );
  }

  return (
    <section style={base}>
      <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, color: v.eyebrow, margin: 0 }}>{title}</p>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#eef2ff", lineHeight: 1.3, margin: 0 }}>{card.headline}</h3>
      <p style={{ fontSize: 12, color: "#7e90b8", lineHeight: 1.6, margin: 0 }}>{card.body}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {card.bullets.map((b) => (
          <div key={b} style={{ display: "flex", gap: 8, fontSize: 12, color: "#7e90b8" }}>
            <span style={{ color: v.bullet, flexShrink: 0, marginTop: 2 }}>▸</span>
            {b}
          </div>
        ))}
      </div>
    </section>
  );
}