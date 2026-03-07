import { SummaryCard as SummaryCardType } from "@/lib/types";

interface SummaryCardProps {
  title: string;
  card: SummaryCardType | null;
  fallback: string;
  cardClass?: string;
}

export function SummaryCard({ title, card, fallback, cardClass }: SummaryCardProps) {
  if (!card) {
    return (
      <section className={`surface summary-card ${cardClass ?? ""}`}>
        <p className="eyebrow">{title}</p>
        <p className="muted">{fallback}</p>
      </section>
    );
  }

  return (
    <section className={`surface summary-card ${cardClass ?? ""}`}>
      <p className="eyebrow">{title}</p>
      <h3>{card.headline}</h3>
      <p>{card.body}</p>
      <ul className="summary-list">
        {card.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </section>
  );
}