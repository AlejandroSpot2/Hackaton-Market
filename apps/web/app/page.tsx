"use client";

import { IdeaForm } from "@/components/idea-form";
import { useTheme } from "@/lib/theme";

export default function HomePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 20px",
      background: isDark
        ? "radial-gradient(ellipse at 10% 0%, rgba(56,189,248,0.09) 0%, transparent 50%), " +
          "radial-gradient(ellipse at 90% 0%, rgba(167,139,250,0.07) 0%, transparent 50%), " +
          "radial-gradient(ellipse at 50% 100%, rgba(245,158,11,0.05) 0%, transparent 50%), " +
          "#050c18"
        : "radial-gradient(ellipse at 12% 18%, rgba(99,3,48,0.1), transparent 28%), " +
          "radial-gradient(ellipse at 82% 12%, rgba(168,61,116,0.14), transparent 32%), " +
          "linear-gradient(135deg, #fffafc 0%, #f9f0f5 40%, #f5edf8 70%, #eef3fb 100%)",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: isDark ? "#eef2ff" : "#2d1424",
      transition: "background 0.4s, color 0.3s",
    }}>
      <div style={{ width: "100%", maxWidth: 720, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>

        {/* Logo mark */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
            <rect x="2" y="2" width="44" height="44" rx="14"
              fill={isDark ? "rgba(7,15,28,0.95)" : "rgba(255,255,255,0.85)"}
              stroke={isDark ? "rgba(99,120,170,0.25)" : "rgba(99,3,48,0.15)"} strokeWidth="1.5" />
            <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle" fontSize="22" fontWeight="800" fill="url(#rGrad)" fontFamily="Inter,sans-serif">R</text>
            <defs>
              <linearGradient id="rGrad" x1="0" y1="0" x2="48" y2="48">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
          <span style={{
            fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
            color: isDark ? "rgba(245,158,11,0.75)" : "rgba(99,3,48,0.65)", fontWeight: 600,
          }}>
            RealityCheck AI
          </span>
        </div>

        {/* Hero */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 14 }}>
          <h1 style={{
            margin: 0, fontSize: "clamp(30px, 5.5vw, 50px)", fontWeight: 800,
            lineHeight: 1.06, letterSpacing: "-0.025em",
            background: isDark
              ? "linear-gradient(135deg,#eef2ff 0%,#7ba8ff 55%,#a78bfa 100%)"
              : "linear-gradient(135deg,#2d1424 0%,#630330 55%,#8b2252 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            Turn a startup idea into a<br />navigable market atlas.
          </h1>
          <p style={{
            margin: 0, fontSize: 15,
            color: isDark ? "rgba(200,215,240,0.65)" : "rgba(45,20,36,0.6)",
            lineHeight: 1.65, maxWidth: "54ch", alignSelf: "center",
          }}>
            Submit any SaaS or AI idea. Watch agentic web research and Gemini&apos;s reasoning engine build an interactive
            market map — with competitor radar charts, scatter plots, and a brutal VC truth.
          </p>
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {[
            "🔍 Live Exa research",
            "🧠 Gemini 2.5 Pro",
            "🗺️ Interactive atlas",
            "⚔️ Competitor analysis",
            "📊 Scatter & radar charts",
            "⚡ Real-time pipeline",
          ].map((label) => (
            <span key={label} style={{
              display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12,
              padding: "7px 14px", borderRadius: 999,
              border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(99,3,48,0.12)"}`,
              background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.6)",
              color: isDark ? "rgba(200,215,240,0.8)" : "rgba(45,20,36,0.7)",
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
