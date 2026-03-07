"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createRun } from "@/lib/api";

const DEMO_IDEAS = [
  "AI assistant that applies to jobs automatically",
  "AI mobile coding copilot for React Native teams",
  "AI travel planner that coordinates bookings and itinerary changes"
];

const SPONSORS = [
  { name: "Google Gemini", dot: "#4285F4", emoji: "✦" },
  { name: "Exa", dot: "#7c3aed", emoji: "🔍" },
  { name: "Prefect", dot: "#22c55e", emoji: "⚡" },
  { name: "Next.js", dot: "#ffffff", emoji: "▲" },
  { name: "React Flow", dot: "#f59e0b", emoji: "🗺️" },
];

export function IdeaForm() {
  const router = useRouter();
  const [idea, setIdea] = useState(DEMO_IDEAS[0]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liveMode, setLiveMode] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await createRun(idea, !liveMode);
      router.push(`/runs/${response.run_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the run.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="surface input-shell" onSubmit={handleSubmit}>
      <label className="panel-title" htmlFor="idea">Startup idea</label>
      <textarea
        id="idea"
        className="textarea"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="Describe the software or AI startup idea you want to map..."
        rows={5}
      />

      <div className="button-row">
        <button className="primary-button" type="submit" disabled={isSubmitting || idea.trim().length < 10}>
          {isSubmitting ? "Starting analysis..." : "Analyze →"}
        </button>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.8rem", color: "var(--muted)" }}>
          <input
            type="checkbox"
            checked={liveMode}
            onChange={(e) => setLiveMode(e.target.checked)}
            style={{ accentColor: "var(--blue)", width: 14, height: 14 }}
          />
          Live AI mode
        </label>
      </div>

      <div className="chip-row">
        {DEMO_IDEAS.map((d) => (
          <button key={d} className="prompt-chip" type="button" onClick={() => setIdea(d)}>{d}</button>
        ))}
      </div>

      {!liveMode && (
        <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
          Demo mode uses rich fixture data and walks the full run lifecycle instantly. Enable Live AI mode to use real Gemini + Exa.
        </p>
      )}

      {error ? <p className="alert">{error}</p> : null}

      {/* Powered By Sponsors */}
      <div className="powered-by">
        <span className="powered-by-label">Powered by</span>
        {SPONSORS.map((s) => (
          <span key={s.name} className="sponsor-chip">
            <span className="sponsor-dot" style={{ background: s.dot }} />
            {s.name}
          </span>
        ))}
      </div>
    </form>
  );
}