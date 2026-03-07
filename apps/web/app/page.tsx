import { Layers3, Radar, Sparkles } from "lucide-react";

import { IdeaForm } from "@/components/idea-form";

const HIGHLIGHTS = [
  {
    icon: Radar,
    title: "Pulse first",
    copy: "See the first market read before the full synthesis lands."
  },
  {
    icon: Layers3,
    title: "Atlas-first",
    copy: "Inspect competitors, segments, adjacency, and entry wedges in one workspace."
  },
  {
    icon: Sparkles,
    title: "Persisted runs",
    copy: "Every state is saved to disk so the demo path stays stable while the backend evolves."
  }
];

export default function HomePage() {
  return (
    <main className="app-shell">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.12fr)_430px]">
        <div className="glass-panel glass-panel-strong p-7 sm:p-9 lg:p-11">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex flex-wrap gap-2">
                <span className="glass-chip">RealityCheck AI</span>
                <span className="glass-chip">Light demo shell</span>
              </div>

              <div className="space-y-4">
                <p className="section-kicker">Market atlas for startup ideas</p>
                <h1 className="hero-title">See the market before you build the product.</h1>
                <p className="hero-body">
                  Enter a SaaS or AI idea and RealityCheck AI turns it into a navigable market atlas. The first pulse
                  appears early, the graph stays explorable, and the sharper synthesis arrives without hiding the map.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="metric-chip">
                  <p className="section-kicker">Polling</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-foreground">2.5s</p>
                  <p className="panel-copy mt-2">Fast enough for a demo, simple enough for MVP reliability.</p>
                </div>
                <div className="metric-chip">
                  <p className="section-kicker">Atlas engine</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-foreground">React Flow</p>
                  <p className="panel-copy mt-2">The graph is still the product, not a secondary report widget.</p>
                </div>
                <div className="metric-chip">
                  <p className="section-kicker">Run storage</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-foreground">JSON</p>
                  <p className="panel-copy mt-2">Runs persist locally so the team can keep iterating against stable fixtures.</p>
                </div>
              </div>
            </div>

            <div className="relative grid content-start gap-4">
              <div className="glass-panel floating-panel mt-4 p-5 [animation-delay:-1s]">
                <p className="section-kicker">Run flow</p>
                <h2 className="mt-2 font-serif text-2xl text-foreground">Queued to complete without a blank state</h2>
                <p className="panel-copy mt-3">
                  The run page keeps the atlas live from pulse-ready onward while the summary cards continue to update.
                </p>
              </div>

              {HIGHLIGHTS.map(({ icon: Icon, title, copy }, index) => (
                <div key={title} className="glass-panel floating-panel flex items-start gap-3 p-4" style={{ animationDelay: `${index * -1.6}s` }}>
                  <div className="rounded-2xl bg-white/68 p-3 text-primary shadow-[0_14px_36px_-20px_rgba(99,3,48,0.24)] ring-1 ring-white/75">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="panel-copy">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <IdeaForm />
      </section>
    </main>
  );
}
