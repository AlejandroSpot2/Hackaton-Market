import { LockKeyhole, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryCardViewModel } from "@/lib/types";

interface SummaryCardProps {
  card: SummaryCardViewModel;
}

export function SummaryCard({ card }: SummaryCardProps) {
  return (
    <Card className="h-full p-6">
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="section-kicker">{card.eyebrow}</p>
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.headline}</CardDescription>
          </div>
          <Badge variant={card.state === "ready" ? "default" : "secondary"}>{card.state === "ready" ? "Ready" : "Pending"}</Badge>
        </div>
      </CardHeader>

      <CardContent className="gap-5">
        <p className="panel-copy">{card.state === "ready" ? card.body : card.fallback}</p>

        {card.state === "ready" && card.bullets.length > 0 ? (
          <ul className="grid gap-2 text-sm leading-6 text-foreground">
            {card.bullets.map((bullet) => (
              <li key={bullet} className="rounded-[1.2rem] border border-white/75 bg-white/58 px-4 py-3 shadow-[0_12px_30px_-24px_rgba(99,3,48,0.22)] backdrop-blur-xl">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>{bullet}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-[1.25rem] border border-dashed border-primary/18 bg-white/40 px-4 py-4 text-sm text-muted-foreground backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-primary/65" />
              <span>This panel stays reserved so the workspace remains stable while the final synthesis is still running.</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
