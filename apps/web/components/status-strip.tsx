import { STATUS_COPY, STATUS_ORDER } from "@/lib/constants";
import { RunStatus } from "@/lib/types";

interface StatusStripProps {
  status: RunStatus;
  progressMessage: string | null;
}

export function StatusStrip({ status, progressMessage }: StatusStripProps) {
  const activeIndex = STATUS_ORDER.indexOf(status);

  return (
    <section className="surface status-shell">
      <div className="status-strip">
        {STATUS_ORDER.map((step, index) => {
          const stateClass = index < activeIndex ? "done" : index === activeIndex ? "active" : "idle";
          return (
            <div key={step} className={`status-pill ${stateClass}`}>
              {step.replace("_", " ")}
            </div>
          );
        })}
        {status === "failed" ? <div className="status-pill failed">failed</div> : null}
      </div>
      <p className="muted">{progressMessage ?? STATUS_COPY[status]}</p>
    </section>
  );
}