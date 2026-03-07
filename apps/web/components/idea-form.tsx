"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createRun } from "@/lib/api";

const DEMO_IDEAS = [
  "AI assistant that applies to jobs automatically",
  "AI mobile coding copilot for React Native teams",
  "AI travel planner that coordinates bookings live",
];

// ── SVG Logos ────────────────────────────────────────────────
function GeminiLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="gL" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="100%" stopColor="#9b72cb" />
        </linearGradient>
      </defs>
      <path d="M12 2C12 2 6 8 6 12C6 16 12 22 12 22C12 22 18 16 18 12C18 8 12 2 12 2Z" fill="url(#gL)" opacity="0.9" />
      <path d="M2 12C2 12 8 6 12 6C16 6 22 12 22 12C22 12 16 18 12 18C8 18 2 12 2 12Z" fill="url(#gL)" opacity="0.45" />
    </svg>
  );
}

function ExaLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="rgba(124,58,237,0.2)" />
      <text x="3.5" y="17" fontSize="13" fontWeight="800" fill="#a78bfa" fontFamily="Inter,sans-serif">Ex</text>
    </svg>
  );
}

function PrefectLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="rgba(34,197,94,0.15)" />
      <path d="M7 5 L7 19 L12 14 L17 19 L17 5" stroke="#22c55e" strokeWidth="2.2" strokeLinejoin="round" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function NextjsLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="rgba(255,255,255,0.07)" />
      <path d="M12 4L20 20H4L12 4Z" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function ReactFlowLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="rgba(245,158,11,0.15)" />
      <circle cx="6" cy="12" r="2.5" fill="#f59e0b" />
      <circle cx="18" cy="7" r="2.5" fill="#f59e0b" opacity="0.7" />
      <circle cx="18" cy="17" r="2.5" fill="#f59e0b" opacity="0.7" />
      <line x1="8.3" y1="11" x2="15.7" y2="7.8" stroke="#f59e0b" strokeWidth="1.3" opacity="0.55" />
      <line x1="8.3" y1="13" x2="15.7" y2="16.2" stroke="#f59e0b" strokeWidth="1.3" opacity="0.55" />
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

  const card: React.CSSProperties = {
    width: "100%",
    borderRadius: 20,
    border: "1px solid rgba(99,120,170,0.15)",
    background: "rgba(7,15,28,0.97)",
    padding: "24px 24px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Form card ── */}
      <form onSubmit={handleSubmit} style={card}>
        <label htmlFor="idea" style={{ fontSize: 11, letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(126,144,184,0.9)", fontWeight: 600 }}>
          Describe your startup idea
        </label>

        <textarea
          id="idea"
          rows={4}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. AI coding assistant embedded in VS Code that reviews PRs automatically..."
          style={{
            width: "100%", boxSizing: "border-box",
            borderRadius: 12, border: "1px solid rgba(99,120,170,0.2)",
            background: "rgba(5,10,22,0.8)", color: "#eef2ff",
            padding: "12px 14px", fontSize: 14, resize: "none", outline: "none",
            fontFamily: "inherit", lineHeight: 1.6,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <button
            type="submit"
            disabled={busy || idea.trim().length < 10}
            style={{
              borderRadius: 999, padding: "10px 22px", fontWeight: 700, fontSize: 14,
              color: "#16120a", border: "none", cursor: busy ? "not-allowed" : "pointer",
              background: "linear-gradient(135deg,#f59e0b,#f97316)",
              boxShadow: "0 4px 20px rgba(245,158,11,0.35)",
              opacity: busy || idea.trim().length < 10 ? 0.5 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {busy ? "Starting analysis…" : "Analyze →"}
          </button>

          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, color: "rgba(126,144,184,0.75)", userSelect: "none" }}>
            <input type="checkbox" checked={liveMode} onChange={(e) => setLiveMode(e.target.checked)} style={{ accentColor: "#38bdf8", width: 14, height: 14 }} />
            Live AI mode
          </label>
        </div>

        {/* Prompt chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {DEMO_IDEAS.map((d) => (
            <button key={d} type="button" onClick={() => setIdea(d)} style={{
              fontSize: 11, borderRadius: 999, padding: "6px 14px",
              border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.035)",
              color: "rgba(200,215,240,0.7)", cursor: "pointer", fontFamily: "inherit",
            }}>
              {d}
            </button>
          ))}
        </div>

        {!liveMode && (
          <p style={{ margin: 0, fontSize: 11, color: "rgba(126,144,184,0.6)" }}>
            Demo mode uses rich fixture data for an instant full lifecycle. Enable Live AI to call Gemini + Exa.
          </p>
        )}

        {error && (
          <p style={{ margin: 0, fontSize: 12, color: "#fca5a5", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 12, padding: "10px 14px", background: "rgba(248,113,113,0.08)" }}>
            {error}
          </p>
        )}
      </form>

      {/* ── Powered by ── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(126,144,184,0.5)", fontWeight: 600 }}>
          Powered by
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
          {SPONSORS.map(({ name, Logo }) => (
            <div key={name} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
              borderRadius: 999, border: "1px solid rgba(99,120,170,0.15)",
              background: "rgba(255,255,255,0.03)",
              color: "rgba(200,215,240,0.8)", fontSize: 13, fontWeight: 500,
            }}>
              <Logo />
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}