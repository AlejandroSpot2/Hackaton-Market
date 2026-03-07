import { IdeaForm } from "@/components/idea-form";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{
        background:
          "radial-gradient(ellipse at 10% 0%, rgba(56,189,248,0.09) 0%, transparent 50%), " +
          "radial-gradient(ellipse at 90% 0%, rgba(167,139,250,0.07) 0%, transparent 50%), " +
          "radial-gradient(ellipse at 50% 100%, rgba(245,158,11,0.06) 0%, transparent 50%), " +
          "#050c18",
      }}
    >
      <div className="w-full max-w-3xl flex flex-col items-center gap-10">
        {/* Logo mark */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.2),rgba(167,139,250,0.2))", border: "1px solid rgba(255,255,255,0.1)" }}>
            🧠
          </div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-amber-400/70 font-semibold">RealityCheck AI</p>
        </div>

        {/* Hero headline */}
        <div className="text-center space-y-5">
          <h1 className="text-5xl font-extrabold tracking-tight leading-[1.04] text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg,#eef2ff 0%,#7ba8ff 55%,#a78bfa 100%)" }}>
            Turn a startup idea into a<br />navigable market atlas.
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-[52ch] mx-auto">
            Submit any SaaS or AI idea. Watch agentic web research and Gemini synthesis build
            an interactive competitive map — with radar charts, competitor breakdowns, and a brutal VC truth.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { icon: "🔍", label: "Live Exa research" },
            { icon: "🧠", label: "Gemini 2.5 Pro" },
            { icon: "🗺️", label: "Interactive atlas" },
            { icon: "⚔️", label: "Competitor analysis" },
            { icon: "📊", label: "Radar & bubble charts" },
            { icon: "⚡", label: "Real-time pipeline" },
          ].map(({ icon, label }) => (
            <span key={label}
              className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] text-slate-300">
              {icon} {label}
            </span>
          ))}
        </div>

        {/* Form */}
        <div className="w-full">
          <IdeaForm />
        </div>
      </div>
    </main>
  );
}