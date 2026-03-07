import { SummaryCardViewModel } from "@/lib/types";

interface SummaryCardProps {
  card: SummaryCardViewModel;
}

export function SummaryCard({ card }: SummaryCardProps) {
  return (
    <section className={`surface summary-card relic-card ${card.state === "waiting" ? "is-waiting" : "is-ready"}`}>
      <div className="summary-card-top">
        <p className="eyebrow">{card.eyebrow}</p>
        <span className={`card-pill ${card.state}`}>{card.state === "ready" ? "revealed" : "sealed"}</span>
      </div>

      <div className="relic-title-block">
        <h3>{card.title}</h3>
        <p className="summary-headline">{card.headline}</p>
      </div>

      <p className="muted">{card.state === "ready" ? card.body : card.fallback}</p>

      {card.state === "ready" && card.bullets.length > 0 ? (
        <ul className="summary-list">
          {card.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : (
        <div className="summary-placeholder">This codex leaf stays reserved until the final synthesis lands.</div>
      )}
    </section>
  );
}
