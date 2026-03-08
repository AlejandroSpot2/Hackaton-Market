import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatusShellViewModel } from "@/lib/types";

interface StatusStripProps {
  shell: StatusShellViewModel;
}

function shellVariant(status: StatusShellViewModel["status"]) {
  switch (status) {
    case "complete":
      return "success" as const;
    case "failed":
      return "destructive" as const;
    case "running":
    case "pulse_ready":
      return "warning" as const;
    default:
      return "secondary" as const;
  }
}

function stepStyles(state: StatusShellViewModel["steps"][number]["state"]) {
  switch (state) {
    case "done":
      return "border-emerald-200/90 bg-emerald-50/80 text-emerald-700";
    case "active":
      return "border-primary/15 bg-primary/8 text-primary";
    case "failed":
      return "border-rose-200/90 bg-rose-50/90 text-rose-700";
    default:
      return "border-white/70 bg-white/40 text-muted-foreground";
  }
}

export function StatusStrip({ shell }: StatusStripProps) {
  const completedSteps = shell.steps.filter((step) => step.state === "done" || step.state === "active").length;
  const progress = Math.max(16, Math.round((completedSteps / shell.steps.length) * 100));

  return (
    <section className="glass-panel glass-panel-strong p-6 sm:p-7">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="section-kicker">Run status</p>
            <div className="space-y-2">
              <h2 className="font-serif text-3xl tracking-[-0.03em] text-foreground">{shell.headline}</h2>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{shell.description}</p>
            </div>
          </div>
          <Badge variant={shellVariant(shell.status)}>{shell.label}</Badge>
        </div>

        <div className="space-y-4">
          <Progress value={progress} />
          <div className="grid gap-2 md:grid-cols-4">
            {shell.steps.map((step) => (
              <div key={step.id} className={`rounded-[1.2rem] border px-3 py-3 text-sm font-medium shadow-[0_12px_28px_-22px_rgba(99,3,48,0.2)] backdrop-blur-xl ${stepStyles(step.state)}`}>
                <div className="flex items-center justify-between gap-3">
                  <span>{step.label}</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-current opacity-80" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
