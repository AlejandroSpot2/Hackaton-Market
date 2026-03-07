import { IdeaForm } from "@/components/idea-form";

export default function HomePage() {
  return (
    <main className="max-w-[1380px] mx-auto px-4 py-7 pb-16">
      <section className="grid gap-5" style={{ gridTemplateColumns: "1.1fr 0.9fr" }}>
        {/* Hero */}
        <div className="rounded-2xl border border-white/[0.08] bg-[rgba(7,15,28,0.97)] p-8">
          <p className="text-[10px] uppercase tracking-[0.14em] text-amber-400/80 font-semibold mb-4">RealityCheck AI — Hackathon MVP</p>
          <h1 className="text-4xl font-extrabold tracking-tight leading-[0.96] text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg,#eef2ff 0%,#7ba8ff 60%,#a78bfa 100%)" }}>
            Turn a startup idea into a navigable market atlas.
          </h1>
          <p className="mt-4 text-[13px] text-muted leading-relaxed max-w-[56ch]">
            Submit any SaaS or AI idea. Watch agentic web research, Gemini synthesis,
            and a live interactive market map build in real time — with competitor breakdowns, radar charts, and a brutal VC truth.
          </p>
          <div className="mt-6 grid gap-3">
            {[
              { icon: "🔍", label: "Live web research", desc: "Exa scans the internet for real competitors and pricing signals." },
              { icon: "🧠", label: "Gemini synthesis", desc: "Gemini 2.5 Pro builds a structured atlas with VC-grade insights." },
              { icon: "🗺️", label: "Interactive atlas", desc: "React Flow canvas — drag nodes, click to inspect, scroll for insights." },
              { icon: "📦", label: "Demo-safe", desc: "Demo mode uses rich fixtures for an instant full lifecycle walk." },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="flex gap-3">
                <span className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  {icon}
                </span>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-sky-400 font-semibold">{label}</span>
                  <p className="text-[12px] text-muted mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <IdeaForm />
      </section>
    </main>
  );
}