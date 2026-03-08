import { SummaryCardData, SummaryCardViewModel } from "@/lib/types";

/*
 * Accepts EITHER:
 *   A) The view-model shape  { card: SummaryCardViewModel }          (used by run-summary-shell)
 *   B) The legacy prop shape { title, card: SummaryCardData | null, fallback, variant } (used by run-workspace)
 */
type ViewModelProps = { card: SummaryCardViewModel };
type LegacyProps = { title: string; card: SummaryCardData | null; fallback: string; variant?: "brutal" | "opportunity" };
type SummaryCardProps = ViewModelProps | LegacyProps;

function isViewModel(p: SummaryCardProps): p is ViewModelProps {
  return "state" in (p.card ?? {});
}

const VARS = {
  brutal: { eyebrow: "#f87171", border: "rgba(248,113,113,0.2)", grad: "linear-gradient(135deg,rgba(120,30,30,0.08),rgba(7,15,28,0.97))", bullet: "#f87171" },
  opportunity: { eyebrow: "#f59e0b", border: "rgba(245,158,11,0.2)", grad: "linear-gradient(135deg,rgba(120,80,0,0.08),rgba(7,15,28,0.97))", bullet: "#f59e0b" },
  default: { eyebrow: "rgba(245,158,11,0.65)", border: "rgba(255,255,255,0.07)", grad: "", bullet: "#f59e0b" },
};

export function SummaryCard(props: SummaryCardProps) {
  let title: string, headline: string, body: string, bullets: string[], variant: "brutal" | "opportunity" | undefined;

  if (isViewModel(props)) {
    const vm = props.card;
    title = vm.title;
    headline = vm.headline;
    body = vm.body;
    bullets = vm.bullets;
    variant = vm.eyebrow === "Hard signal" ? "brutal" : vm.eyebrow === "Entry angle" ? "opportunity" : undefined;
  } else {
    title = props.title;
    variant = props.variant;
    if (!props.card) {
      const v = variant ? VARS[variant] : VARS.default;
      return (
        <section style={{
          borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 12,
          border: `1px solid ${v.border}`,
          background: v.grad || "rgba(7,15,28,0.97)",
        }}>
          <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, color: v.eyebrow, margin: 0 }}>{title}</p>
          <p style={{ fontSize: 13, color: "#7e90b8", margin: 0 }}>{props.fallback}</p>
        </section>
      );
    }
    headline = props.card.headline;
    body = props.card.body;
    bullets = props.card.bullets;
  }

  const v = variant ? VARS[variant] : VARS.default;

  return (
    <section style={{
      borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", gap: 12,
      border: `1px solid ${v.border}`,
      background: v.grad || "rgba(7,15,28,0.97)",
    }}>
      <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, color: v.eyebrow, margin: 0 }}>{title}</p>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#eef2ff", lineHeight: 1.3, margin: 0 }}>{headline}</h3>
      <p style={{ fontSize: 12, color: "#7e90b8", lineHeight: 1.6, margin: 0 }}>{body}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {bullets.map((b) => (
          <div key={b} style={{ display: "flex", gap: 8, fontSize: 12, color: "#7e90b8" }}>
            <span style={{ color: v.bullet, flexShrink: 0, marginTop: 2 }}>▸</span>
            {b}
          </div>
        ))}
      </div>
    </section>
  );
}