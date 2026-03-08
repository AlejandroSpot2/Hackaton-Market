import { Building2, Compass, Link2, Radar, Sparkles, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NODE_TYPE_META } from "@/lib/constants";
import { AtlasNode, CompetitorDetail } from "@/lib/types";

interface DetailPanelProps {
  node: AtlasNode | null;
  detail: CompetitorDetail | null;
}

function renderList(items: string[]) {
  return (
    <ul className="grid gap-2 text-sm leading-6 text-foreground">
      {items.map((item) => (
        <li key={item} className="rounded-[1.1rem] border border-white/75 bg-white/58 px-3 py-2.5 shadow-[0_12px_28px_-24px_rgba(99,3,48,0.2)] backdrop-blur-xl">
          {item}
        </li>
      ))}
    </ul>
  );
}

function nodeLens(node: AtlasNode): { title: string; copy: string } {
  switch (node.type) {
    case "idea":
      return {
        title: "Core framing",
        copy: "Use this node as the anchor. Every segment, competitor, and opportunity should be interpreted relative to this product thesis."
      };
    case "segment":
      return {
        title: "Segment read",
        copy: "Segments summarize how buyers cluster, how problems get described, and where expectations start to converge."
      };
    case "adjacent_category":
      return {
        title: "Boundary pressure",
        copy: "Adjacent categories matter when budget, buyer language, or incumbent workflows bleed into your target space."
      };
    case "opportunity":
      return {
        title: "Entry angle",
        copy: "Opportunity nodes highlight wedges where the product story could enter with less friction than the crowded center of the market."
      };
    default:
      return {
        title: "Competitor read",
        copy: "Competitor nodes help the team compare messaging, strength, and buyer expectations without losing the surrounding market context."
      };
  }
}

function nodeIcon(node: AtlasNode) {
  switch (node.type) {
    case "idea":
      return Target;
    case "segment":
      return Compass;
    case "adjacent_category":
      return Sparkles;
    case "opportunity":
      return Radar;
    default:
      return Building2;
  }
}

export function DetailPanel({ node, detail }: DetailPanelProps) {
  if (!node) {
    return (
      <Card className="h-full p-6 sm:p-7">
        <CardHeader className="gap-3">
          <p className="section-kicker">Detail panel</p>
          <CardTitle>Select a node from the atlas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="panel-copy">
            The right panel updates with competitive detail, framing notes, and supporting evidence when a node is selected.
          </p>
        </CardContent>
      </Card>
    );
  }

  const meta = NODE_TYPE_META[node.type];
  const lens = nodeLens(node);
  const Icon = nodeIcon(node);

  return (
    <Card className="h-full p-6 sm:p-7">
      <CardHeader className="gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="section-kicker">Detail panel</p>
            <div className="space-y-2">
              <CardTitle>{node.label}</CardTitle>
              <p className="text-sm leading-6 text-muted-foreground">{meta.description}</p>
            </div>
          </div>
          <Badge variant={node.type === "opportunity" ? "default" : "secondary"}>{meta.eyebrow}</Badge>
        </div>

        <div className="rounded-[1.35rem] border border-white/75 bg-white/56 p-4 backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary ring-1 ring-primary/10">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/65">Market signal</p>
              <p className="mt-2 text-sm leading-6 text-foreground">{node.market_signal}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="gap-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/65">Atlas summary</p>
          <p className="text-sm leading-6 text-foreground">{node.summary}</p>
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/65">{lens.title}</p>
          <p className="text-sm leading-6 text-foreground">{lens.copy}</p>
        </div>

        {detail ? (
          <>
            {detail.website ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/65">Website</p>
                <a className="flex items-center gap-3 rounded-[1.2rem] border border-white/75 bg-white/55 px-4 py-3 no-underline shadow-[0_12px_28px_-22px_rgba(99,3,48,0.22)] backdrop-blur-xl transition hover:bg-white/75" href={detail.website} rel="noreferrer" target="_blank">
                  <Link2 className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate text-sm text-foreground">{detail.website}</span>
                </a>
              </div>
            ) : null}

            {detail.tagline ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/65">Positioning</p>
                <p className="text-sm leading-6 text-foreground">{detail.tagline}</p>
              </div>
            ) : null}

            {detail.why_it_wins ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/65">Why it wins</p>
                <p className="text-sm leading-6 text-foreground">{detail.why_it_wins}</p>
              </div>
            ) : null}

            {detail.pricing_hint ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/65">Pricing signal</p>
                <p className="text-sm leading-6 text-foreground">{detail.pricing_hint}</p>
              </div>
            ) : null}

            {detail.signals.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/65">Signals</p>
                {renderList(detail.signals)}
              </div>
            ) : null}

            {detail.risks.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/65">Risks</p>
                {renderList(detail.risks)}
              </div>
            ) : null}

            {detail.sources.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/65">Evidence</p>
                <ul className="grid gap-2 text-sm leading-6 text-foreground">
                  {detail.sources.map((source) => (
                    <li key={source}>
                      <a className="flex items-center gap-3 rounded-[1.2rem] border border-white/75 bg-white/55 px-4 py-3 no-underline shadow-[0_12px_28px_-22px_rgba(99,3,48,0.22)] backdrop-blur-xl transition hover:bg-white/75" href={source} rel="noreferrer" target="_blank">
                        <Link2 className="h-4 w-4 shrink-0 text-primary" />
                        <span className="truncate">{source}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        ) : (
          <div className="rounded-[1.25rem] border border-dashed border-primary/18 bg-white/40 px-4 py-4 text-sm text-muted-foreground backdrop-blur-xl">
            This node does not have a dedicated dossier yet. The atlas summary is the primary record for now.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
