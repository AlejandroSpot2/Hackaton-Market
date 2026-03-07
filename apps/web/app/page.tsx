import { IdeaForm } from "@/components/idea-form";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="landing-grid">
        <div className="hero-card surface">
          <p className="eyebrow">RealityCheck AI — Hackathon MVP</p>
          <h1>Turn a startup idea into a navigable market atlas.</h1>
          <p className="hero-copy">
            Submit any SaaS or AI software idea. Watch live agentic web research, LLM synthesis,
            and a market map build in real time — with interactive visualizations, competitor analysis,
            and a brutal VC truth.
          </p>
          <div className="hero-notes">
            <div className="hero-note">
              <span className="hero-note-icon">🔍</span>
              <div>
                <span className="detail-label">Live web research</span>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.82rem", marginTop: 3 }}>
                  Exa scans the internet for real competitors and pricing signals.
                </p>
              </div>
            </div>
            <div className="hero-note">
              <span className="hero-note-icon">🧠</span>
              <div>
                <span className="detail-label">Gemini synthesis</span>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.82rem", marginTop: 3 }}>
                  Gemini 2.5 Pro builds a structured market atlas with brutal VC insights.
                </p>
              </div>
            </div>
            <div className="hero-note">
              <span className="hero-note-icon">🗺️</span>
              <div>
                <span className="detail-label">Interactive atlas</span>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.82rem", marginTop: 3 }}>
                  React Flow canvas with draggable nodes, radar charts, and competitor breakdowns.
                </p>
              </div>
            </div>
            <div className="hero-note">
              <span className="hero-note-icon">📦</span>
              <div>
                <span className="detail-label">Demo-safe</span>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.82rem", marginTop: 3 }}>
                  Demo mode uses rich fixtures and walks the full lifecycle instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
        <IdeaForm />
      </section>
    </main>
  );
}