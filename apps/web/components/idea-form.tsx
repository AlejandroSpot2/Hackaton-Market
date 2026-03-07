"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createRun } from "@/lib/api";

const DEMO_IDEAS = [
  "AI assistant that applies to jobs automatically",
  "AI mobile coding copilot for React Native teams",
  "AI travel planner that coordinates bookings live",
];

const SPONSORS = [
  { name: "Google Gemini", color: "#4285F4" },
  { name: "Exa", color: "#7c3aed" },
  { name: "Prefect", color: "#22c55e" },
  { name: "Next.js", color: "#ffffff" },
  { name: "React Flow", color: "#f59e0b" },
];

export function IdeaForm() {
  const router = useRouter();
  const [idea, setIdea] = useState(DEMO_IDEAS[0]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [liveMode, setLiveMode] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null); setBusy(true);
    try {
      const res = await createRun(idea, !liveMode);
      router.push(`/runs/${res.run_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the run.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/[0.08] bg-[rgba(7,15,28,0.97)] p-6 flex flex-col gap-4"
    >
      <label className="text-[10px] uppercase tracking-[0.12em] text-muted font-semibold" htmlFor="idea">
        Startup idea
      </label>

      <textarea
        id="idea"
        rows={5}
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="Describe the software or AI startup idea you want to map..."
        className="w-full rounded-xl border border-white/[0.12] bg-[rgba(5,10,22,0.8)] text-slate-100 placeholder-muted/50 p-4 text-sm resize-y focus:outline-none focus:border-sky-500/40 transition-colors"
      />

      <div className="flex items-center justify-between gap-3">
        <button
          type="submit"
          disabled={busy || idea.trim().length < 10}
          className="rounded-full px-5 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-[#16120a] font-bold text-sm shadow-[0_4px_18px_rgba(245,158,11,0.35)] hover:opacity-90 hover:-translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {busy ? "Starting..." : "Analyze →"}
        </button>

        <label className="flex items-center gap-2 cursor-pointer text-[11px] text-muted select-none">
          <input
            type="checkbox"
            checked={liveMode}
            onChange={(e) => setLiveMode(e.target.checked)}
            className="accent-sky-500 w-3.5 h-3.5"
          />
          Live AI mode
        </label>
      </div>

      {/* Quick pick chips */}
      <div className="flex flex-wrap gap-2">
        {DEMO_IDEAS.map((d) => (
          <button key={d} type="button" onClick={() => setIdea(d)}
            className="text-[11px] rounded-full px-3 py-1.5 border border-amber-500/20 bg-amber-500/8 text-slate-300 hover:border-amber-500/40 hover:bg-amber-500/12 transition-all">
            {d}
          </button>
        ))}
      </div>

      {!liveMode && (
        <p className="text-[11px] text-muted">
          Demo mode uses rich fixture data for an instant full run. Enable Live AI to call Gemini + Exa.
        </p>
      )}

      {error && <p className="text-[12px] text-rose-300 border border-rose-500/30 bg-rose-500/10 rounded-xl px-4 py-3">{error}</p>}

      {/* Sponsors */}
      <div className="flex items-center flex-wrap gap-2 pt-1 border-t border-white/[0.06]">
        <span className="text-[9px] uppercase tracking-[0.14em] text-muted mr-1">Powered by</span>
        {SPONSORS.map((s) => (
          <span key={s.name} className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-muted hover:border-sky-500/30 hover:text-slate-300 transition-all">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    </form>
  );
}