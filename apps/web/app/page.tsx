import { IdeaForm } from "@/components/idea-form";

export default function HomePage() {
  return (
    <main className="page-shell page-shell--landing">
      <section className="landing-grid landing-grid--observatory">
        <div className="hero-card surface landing-hero">
          <div className="landing-hero-visual" aria-hidden="true">
            <div className="landing-orb">
              <span className="landing-orb-core" />
              <span className="landing-orb-ring landing-orb-ring--one" />
              <span className="landing-orb-ring landing-orb-ring--two" />
              <span className="landing-orb-island landing-orb-island--idea">Idea</span>
              <span className="landing-orb-island landing-orb-island--segment">Biome</span>
              <span className="landing-orb-island landing-orb-island--opportunity">Wedge</span>
            </div>
          </div>

          <div className="landing-hero-copy">
            <p className="eyebrow">RealityCheck AI</p>
            <h1>Scry the market before you ship the product.</h1>
            <p className="hero-copy">
              Submit a SaaS or AI software idea and the app turns it into an explorable market atlas. Pulse lands first, the world map unlocks next, and the final synthesis settles around the scene instead of burying it.
            </p>

            <div className="hero-notes">
              <div className="hero-note surface-subtle">
                <span className="detail-label">Atlas before report</span>
                <p>The map is the product. Competitors, segments, adjacency, and wedge show up as navigable territory.</p>
              </div>
              <div className="hero-note surface-subtle">
                <span className="detail-label">Progressive by design</span>
                <p>Queued, running, pulse_ready, and complete are all visible states so the demo never stalls behind a blank screen.</p>
              </div>
              <div className="hero-note surface-subtle">
                <span className="detail-label">Mock-safe foundation</span>
                <p>Fixtures, polling, and persisted JSON keep the happy path stable while the team upgrades providers behind the scenes.</p>
              </div>
            </div>
          </div>
        </div>

        <IdeaForm />
      </section>
    </main>
  );
}
