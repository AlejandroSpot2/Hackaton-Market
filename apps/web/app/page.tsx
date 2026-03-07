import { IdeaForm } from "@/components/idea-form";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="landing-grid">
        <div className="hero-card surface">
          <p className="eyebrow">RealityCheck AI</p>
          <h1>Turn a startup idea into a navigable market atlas.</h1>
          <p className="hero-copy">
            This MVP is atlas-first. Submit a SaaS or AI software idea, watch the run move through real
            progressive states, and inspect the evolving competitive map before the final synthesis lands.
          </p>
          <div className="hero-notes">
            <div>
              <span className="detail-label">Fast pulse</span>
              <p>Queued, running, and pulse-ready are all visible in the UI.</p>
            </div>
            <div>
              <span className="detail-label">Atlas first</span>
              <p>React Flow renders the market map as soon as partial data exists.</p>
            </div>
            <div>
              <span className="detail-label">Demo-safe</span>
              <p>Mock fixtures drive the happy path without live provider dependencies.</p>
            </div>
          </div>
        </div>
        <IdeaForm />
      </section>
    </main>
  );
}