import { PulseCard } from "@/components/pulse-card";
import { SummaryCard } from "@/components/summary-card";
import { RunViewModel } from "@/lib/types";

interface RunSummaryShellProps {
  view: RunViewModel;
}

export function RunSummaryShell({ view }: RunSummaryShellProps) {
  return (
    <section className="summary-dock">
      <div className="summary-dock-copy">
        <div>
          <p className="eyebrow">Recovered relics</p>
          <h2 className="status-heading">Pulse first, synthesis second, evidence always attached.</h2>
        </div>
        <p className="muted">
          These codex panes stay anchored to the atlas instead of replacing it, so the user can keep exploring while the conclusions finish landing.
        </p>
      </div>

      <div className="card-grid relic-grid">
        <PulseCard card={view.pulseCard} />
        <SummaryCard card={view.brutalTruthCard} />
        <SummaryCard card={view.opportunityCard} />
      </div>

      {view.sources.length > 0 ? (
        <section className="surface summary-card source-card source-card--ledger">
          <div className="summary-card-top">
            <p className="eyebrow">Evidence ledger</p>
            <span className="card-pill ready">persisted</span>
          </div>
          <p className="muted">The current run kept these links alongside the atlas for future provider-backed deepening.</p>
          <ul className="detail-list source-list">
            {view.sources.map((source) => (
              <li key={source}>
                <a href={source} rel="noreferrer" target="_blank">
                  {source}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </section>
  );
}
