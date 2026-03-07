import { StatusShellViewModel } from "@/lib/types";

interface StatusStripProps {
  shell: StatusShellViewModel;
}

export function StatusStrip({ shell }: StatusStripProps) {
  const completedSteps = shell.steps.filter((step) => step.state === "done" || step.state === "active").length;
  const progress = Math.max(18, Math.round((completedSteps / shell.steps.length) * 100));

  return (
    <section className="surface status-shell observatory-status">
      <div className="status-shell-copy">
        <div>
          <p className="eyebrow">Ritual phase</p>
          <h2 className="status-heading">{shell.headline}</h2>
        </div>
        <span className={`status-badge ${shell.status}`}>{shell.label}</span>
      </div>

      <div className="status-track-shell" aria-label="Run progress">
        <div className="status-track">
          <span className="status-track-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="status-strip">
          {shell.steps.map((step) => (
            <div key={step.id} className={`status-pill ${step.state}`}>
              <span className="status-pill-dot" />
              <span>{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="muted status-copy">{shell.description}</p>
    </section>
  );
}
