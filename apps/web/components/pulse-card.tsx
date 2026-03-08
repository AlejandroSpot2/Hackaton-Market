import { Gauge, Radar, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PulseCardViewModel } from "@/lib/types";

interface PulseCardProps {
  card: PulseCardViewModel;
}

export function PulseCard({ card }: PulseCardProps) {
  return (
    <Card className="h-full p-6">
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="section-kicker">Market pulse</p>
            <CardTitle>First read on the category</CardTitle>
            <CardDescription>{card.headline}</CardDescription>
          </div>
          <Badge variant={card.state === "ready" ? "success" : "secondary"}>{card.state === "ready" ? "Live" : "Pending"}</Badge>
        </div>
      </CardHeader>

      <CardContent className="gap-5">
        <p className="panel-copy">{card.note}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.35rem] border border-white/75 bg-white/58 p-4 shadow-[0_16px_36px_-28px_rgba(99,3,48,0.28)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-2.5 text-primary ring-1 ring-primary/10">
                <Gauge className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/65">Temperature</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{card.marketTemperature}</p>
              </div>
            </div>
          </div>
          <div className="rounded-[1.35rem] border border-white/75 bg-white/58 p-4 shadow-[0_16px_36px_-28px_rgba(99,3,48,0.28)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-2.5 text-primary ring-1 ring-primary/10">
                <Radar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/65">Competition</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{card.competitionLevel}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.35rem] border border-white/75 bg-white/52 p-4 backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/65">Whitespace</p>
          <p className="mt-2 text-sm leading-6 text-foreground">{card.whitespace}</p>
        </div>

        <div className="rounded-[1.35rem] border border-white/75 bg-white/52 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/65">Top signals</p>
          </div>
          {card.topSignals.length > 0 ? (
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-foreground">
              {card.topSignals.map((signal) => (
                <li key={signal} className="rounded-2xl bg-white/65 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                  {signal}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Signals will populate here as soon as the first pulse is ready.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
