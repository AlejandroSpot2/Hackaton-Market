import { RunViewModel, StatusStepViewModel } from "@/lib/types";

export type PrefabShellSection = "status" | "summary";

type PrefabPrimitive = string | number | boolean | null;

interface PrefabNode {
  type: string;
  children?: PrefabNode[];
  [key: string]: PrefabNode[] | PrefabPrimitive | undefined;
}

function badgeVariant(step: StatusStepViewModel["state"]): string {
  switch (step) {
    case "done":
      return "success";
    case "active":
      return "warning";
    case "failed":
      return "destructive";
    default:
      return "outline";
  }
}

function textNode(text: string): PrefabNode {
  return {
    type: "Text",
    text
  };
}

function badgeNode(label: string, variant: string): PrefabNode {
  return {
    type: "Badge",
    label,
    variant
  };
}

function card(title: string, description: string, children: PrefabNode[]): PrefabNode {
  return {
    type: "Card",
    children: [
      {
        type: "CardHeader",
        children: [
          { type: "CardTitle", title },
          { type: "CardDescription", description }
        ]
      },
      {
        type: "CardContent",
        children
      }
    ]
  };
}

function summaryCard(
  title: string,
  headline: string,
  body: string,
  bullets: string[],
  state: "waiting" | "ready"
): PrefabNode {
  const lines = bullets.length > 0 ? bullets : [body];

  return card(title, headline, [
    badgeNode(state === "ready" ? "ready" : "pending", state === "ready" ? "success" : "outline"),
    {
      type: "Column",
      gap: 2,
      children: lines.map((line) => textNode(line))
    }
  ]);
}

export function createPrefabShellPayload(section: PrefabShellSection, view: RunViewModel, error: string | null) {
  if (section === "status") {
    const reached = Math.max(
      1,
      Math.round(
        (view.statusShell.steps.filter((step) => step.state === "done" || step.state === "active").length /
          view.statusShell.steps.length) * 100
      )
    );

    return {
      view: {
        type: "Column",
        gap: 4,
        children: [
          card(view.statusShell.headline, view.statusShell.description, [
            { type: "Progress", value: reached },
            {
              type: "Row",
              gap: 2,
              children: view.statusShell.steps.map((step) => badgeNode(step.label, badgeVariant(step.state)))
            }
          ]),
          ...(error
            ? [
                {
                  type: "Alert",
                  variant: "destructive",
                  children: [
                    { type: "AlertTitle", title: "Run error" },
                    { type: "AlertDescription", description: error }
                  ]
                }
              ]
            : [])
        ]
      }
    };
  }

  const children: PrefabNode[] = [
    summaryCard(
      "Market Pulse",
      view.pulseCard.headline,
      view.pulseCard.note,
      view.pulseCard.topSignals.length > 0 ? view.pulseCard.topSignals : [view.pulseCard.whitespace],
      view.pulseCard.state
    ),
    summaryCard(
      view.brutalTruthCard.title,
      view.brutalTruthCard.headline,
      view.brutalTruthCard.state === "ready" ? view.brutalTruthCard.body : view.brutalTruthCard.fallback,
      view.brutalTruthCard.bullets,
      view.brutalTruthCard.state
    ),
    summaryCard(
      view.opportunityCard.title,
      view.opportunityCard.headline,
      view.opportunityCard.state === "ready" ? view.opportunityCard.body : view.opportunityCard.fallback,
      view.opportunityCard.bullets,
      view.opportunityCard.state
    )
  ];

  if (view.sources.length > 0) {
    children.push(
      card("Sources", "Persisted evidence from the current run.", [
        {
          type: "Column",
          gap: 2,
          children: view.sources.map((source) => textNode(source))
        }
      ])
    );
  }

  return {
    view: {
      type: "Grid",
      columns: 3,
      gap: 4,
      children
    }
  };
}
