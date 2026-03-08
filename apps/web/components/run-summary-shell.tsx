import { FileText, Link2 } from "lucide-react";

import { PulseCard } from "@/components/pulse-card";
import { SummaryCard } from "@/components/summary-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RunViewModel } from "@/lib/types";

interface RunSummaryShellProps {
  view: RunViewModel;
}

export function RunSummaryShell({ view }: RunSummaryShellProps) {
  return (
    <section className="space-y-5">
      <div className="glass-panel glass-panel-soft p-6 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="section-kicker">Summary layer</p>
            <h2 className="font-serif text-3xl tracking-[-0.03em] text-foreground">Pulse first, synthesis second, atlas always visible.</h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            These panels stay outside the graph so the user can keep exploring nodes while the narrative read catches up.
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <PulseCard card={view.pulseCard} />
        <SummaryCard card={view.brutalTruthCard} />
        <SummaryCard card={view.opportunityCard} />
      </div>

      {view.sources.length > 0 ? (
        <Card className="p-6">
          <CardHeader className="gap-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="section-kicker">Sources</p>
                <CardTitle>Persisted evidence from this run</CardTitle>
              </div>
              <div className="rounded-full bg-primary/10 p-2.5 text-primary ring-1 ring-primary/10">
                <FileText className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="gap-4">
            <p className="panel-copy">These links are carried alongside the result so the team can revisit the evidence behind the atlas.</p>
            <Separator />
            <ul className="grid gap-3 text-sm leading-6 text-foreground">
              {view.sources.map((source) => (
                <li key={source}>
                  <a className="flex items-center gap-3 rounded-[1.2rem] border border-white/75 bg-white/55 px-4 py-3 no-underline shadow-[0_12px_28px_-22px_rgba(99,3,48,0.22)] backdrop-blur-xl transition hover:bg-white/75" href={source} rel="noreferrer" target="_blank">
                    <Link2 className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate">{source}</span>
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
