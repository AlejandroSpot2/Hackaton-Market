import { IdeaForm } from "@/components/idea-form";

export default function HomePage() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      background:
        "radial-gradient(ellipse at 10% 0%, rgba(56,189,248,0.09) 0%, transparent 50%), " +
        "radial-gradient(ellipse at 90% 0%, rgba(167,139,250,0.07) 0%, transparent 50%), " +
        "radial-gradient(ellipse at 50% 100%, rgba(245,158,11,0.06) 0%, transparent 50%), " +
        "#050c18",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: "#eef2ff",
    }}>
      <div style={{ width: "100%", maxWidth: 660, display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        {/* Logo mark */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 30, background: "linear-gradient(135deg,rgba(245,158,11,0.18),rgba(167,139,250,0.18))",
            border: "1px solid rgba(255,255,255,0.09)",
          }}>🧠</div>
          <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,158,11,0.75)", fontWeight: 600 }}>
            RealityCheck AI
          </span>
        </div>

        {/* Hero */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 16 }}>
          <h1 style={{
            margin: 0, fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.025em",
            background: "linear-gradient(135deg,#eef2ff 0%,#7ba8ff 55%,#a78bfa 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            Turn a startup idea into a<br />navigable market atlas.
          </h1>
          <p style={{ margin: 0, fontSize: 16, color: "rgba(200,215,240,0.65)", lineHeight: 1.65, maxWidth: "52ch" }}>
            Submit any SaaS or AI idea. Watch agentic web research and Gemini&apos;s reasoning engine build an interactive
            market map — with competitor radar charts, bubble charts, and a brutal VC truth.
          </p>
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {[
            "🔍 Live Exa research",
            "🧠 Gemini 2.5 Pro",
            "🗺️ Interactive atlas",
            "⚔️ Competitor analysis",
            "📊 Radar & bubble charts",
            "⚡ Real-time pipeline",
          ].map((label) => (
            <span key={label} style={{
              display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13,
              padding: "8px 16px", borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)", color: "rgba(200,215,240,0.8)",
            }}>
              {label}
            </span>
          ))}
        </div>

        {/* Form */}
        <div style={{ width: "100%" }}>
          <IdeaForm />
        </div>
      </div>
    </main>
  );
}