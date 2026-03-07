import { SummaryCardData } from "@/lib/types";

interface SummaryCardProps {
  title: string;
  card: SummaryCardData | null;
  fallback: string;
}

export function SummaryCard({ title, card, fallback }: SummaryCardProps) {
  if (!card) {
    return (
      <section className="surface summary-card">
        <p className="eyebrow">{title}</p>
        <p className="muted">{fallback}</p>
      </section>
    );
  }

  return (
    <section className="surface summary-card">
      <p className="eyebrow">{title}</p>
      <h3>{card.headline}</h3>
      <p className="muted">{card.body}</p>
      <ul className="summary-list">
        {card.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </section>
  );
}