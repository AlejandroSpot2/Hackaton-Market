"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createRun } from "@/lib/api";

const DEMO_IDEAS = [
  "AI assistant that applies to jobs automatically",
  "AI mobile coding copilot for React Native teams",
  "AI travel planner that coordinates bookings live",
];

// ── Inline SVG logos ──────────────────────────────────────────
function GeminiLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="gLg" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="100%" stopColor="#9b72cb" />
        </linearGradient>
      </defs>
      <path d="M12 2C12 2 6 8 6 12C6 16 12 22 12 22C12 22 18 16 18 12C18 8 12 2 12 2Z" fill="url(#gLg)" opacity="0.9" />
      <path d="M2 12C2 12 8 6 12 6C16 6 22 12 22 12C22 12 16 18 12 18C8 18 2 12 2 12Z" fill="url(#gLg)" opacity="0.5" />
    </svg>
  );
}

function ExaLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="rgba(124,58,237,0.15)" />
      <text x="4" y="17" fontSize="13" fontWeight="800" fill="#a78bfa" fontFamily="Inter,sans-serif">Ex</text>
    </svg>
  );
}

function PrefectLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="rgba(34,197,94,0.12)" />
      <path d="M7 5 L7 19 L12 14 L17 19 L17 5" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function NextjsLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="rgba(255,255,255,0.06)" />
      <path d="M12 4L20 20H4L12 4Z" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function ReactFlowLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="rgba(245,158,11,0.12)" />
      <circle cx="7" cy="12" r="2.5" fill="#f59e0b" />
      <circle cx="17" cy="7" r="2.5" fill="#f59e0b" opacity="0.7" />
      <circle cx="17" cy="17" r="2.5" fill="#f59e0b" opacity="0.7" />
      <line x1="9.2" y1="11" x2="15" y2="8" stroke="#f59e0b" strokeWidth="1.2" opacity="0.6" />
      <line x1="9.2" y1="13" x2="15" y2="16" stroke="#f59e0b" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

const SPONSORS = [
  { name: "Google Gemini", Logo: GeminiLogo },
  { name: "Exa", Logo: ExaLogo },
  { name: "Prefect", Logo: PrefectLogo },
  { name: "Next.js", Logo: NextjsLogo },
  { name: "React Flow", Logo: ReactFlowLogo },
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
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-white/[0.09] bg-[rgba(7,15,28,0.97)] p-6 flex flex-col gap-4">
        <label className="text-[10px] uppercase tracking-[0.14em] text-slate-500 font-semibold" htmlFor="idea">
          Describe your startup idea
        </label>

        <textarea
          id="idea"
          rows={4}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. AI coding assistant embedded in VS Code that reviews PRs automatically..."
          className="w-full rounded-xl border border-white/[0.1] bg-[rgba(5,10,22,0.8)] text-slate-100 placeholder-slate-600 p-4 text-sm resize-none focus:outline-none focus:border-sky-500/40 transition-colors"
        />

        <div className="flex items-center justify-between gap-3">
          <button
            type="submit"
            disabled={busy || idea.trim().length < 10}
            className="rounded-full px-6 py-2.5 font-bold text-sm text-[#16120a] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:opacity-90 hover:-translate-y-px"
            style={{
              background: "linear-gradient(135deg,#f59e0b,#f97316)",
              boxShadow: "0 4px 20px rgba(245,158,11,0.35)",
            }}
          >
            {busy ? "Starting analysis…" : "Analyze →"}
          </button>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-500 select-none">
            <input type="checkbox" checked={liveMode} onChange={(e) => setLiveMode(e.target.checked)}
              className="accent-sky-500 w-3.5 h-3.5" />
            Live AI mode
          </label>
        </div>

        {/* Prompt chips */}
        <div className="flex flex-wrap gap-2">
          {DEMO_IDEAS.map((d) => (
            <button key={d} type="button" onClick={() => setIdea(d)}
              className="text-[11px] rounded-full px-3 py-1.5 border border-white/[0.1] bg-white/[0.03] text-slate-400 hover:border-amber-500/30 hover:text-slate-200 transition-all">
              {d}
            </button>
          ))}
        </div>

        {!liveMode && (
          <p className="text-[11px] text-slate-600">
            Demo mode uses rich fixture data for an instant full lifecycle. Enable Live AI to call Gemini + Exa.
          </p>
        )}

        {error && (
          <p className="text-xs text-rose-300 border border-rose-500/25 bg-rose-500/8 rounded-xl px-4 py-3">{error}</p>
        )}
      </form>

      {/* ── Powered By Sponsors ── */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600 font-semibold">Powered by</p>
        <div className="flex flex-wrap justify-center gap-3">
          {SPONSORS.map(({ name, Logo }) => (
            <div key={name}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.025] text-slate-300 text-sm font-medium hover:border-white/[0.18] hover:bg-white/[0.05] transition-all cursor-default">
              <Logo />
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}