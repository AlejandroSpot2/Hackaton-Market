import { PulseCardViewModel } from "@/lib/types";

interface PulseCardProps {
  card: PulseCardViewModel;
}

export function PulseCard({ card }: PulseCardProps) {
  return (
    <section className={`surface summary-card pulse-card relic-card ${card.state === "waiting" ? "is-waiting" : "is-ready"}`}>
      <div className="summary-card-top">
        <p className="eyebrow">Market pulse</p>
        <span className={`card-pill ${card.state}`}>{card.state === "ready" ? "live" : "forming"}</span>
      </div>

      <div className="relic-title-block">
        <h3>Pulse snapshot</h3>
        <p className="summary-headline">{card.headline}</p>
      </div>

      <p className="muted">{card.note}</p>

      <div className="pulse-grid">
        <div className="metric-tile">
          <span className="detail-label">Temperature</span>
          <p>{card.marketTemperature}</p>
        </div>
        <div className="metric-tile">
          <span className="detail-label">Competition</span>
          <p>{card.competitionLevel}</p>
        </div>
      </div>

      <div className="detail-section relic-section">
        <span className="detail-label">Whitespace omen</span>
        <p>{card.whitespace}</p>
      </div>

      <div className="detail-section relic-section">
        <span className="detail-label">Top signals</span>
        {card.topSignals.length > 0 ? (
          <ul className="detail-list">
            {card.topSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        ) : (
          <div className="summary-placeholder">Signals will illuminate this chamber when the pulse arrives.</div>
        )}
      </div>
    </section>
  );
}
