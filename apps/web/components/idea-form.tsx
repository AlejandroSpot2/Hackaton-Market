"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, Lightbulb, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DEMO_IDEAS } from "@/lib/constants";
import { createRun } from "@/lib/api";
import { useTheme } from "@/lib/theme";

function makeStyles(isDark: boolean) {
  return {
    card: {
      background: isDark ? "rgba(7,15,28,0.88)" : "rgba(255,255,255,0.72)",
      border: `1px solid ${isDark ? "rgba(99,120,170,0.2)" : "rgba(99,3,48,0.12)"}`,
      borderRadius: 24, backdropFilter: "blur(24px)",
      boxShadow: isDark ? "0 24px 64px -32px rgba(0,0,0,0.55)" : "0 24px 64px -32px rgba(99,3,48,0.25)",
    } as React.CSSProperties,
    innerBox: {
      background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.55)",
      border: `1px solid ${isDark ? "rgba(99,120,170,0.14)" : "rgba(99,3,48,0.1)"}`,
      borderRadius: 16, padding: "16px",
    } as React.CSSProperties,
    eyebrow: { fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: isDark ? "rgba(56,189,248,0.7)" : "rgba(99,3,48,0.6)" },
    heading: { margin: 0, fontSize: "1.65rem", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.025em", color: isDark ? "#eef2ff" : "#2d1424" },
    body: { margin: 0, fontSize: 14, color: isDark ? "rgba(126,144,184,0.85)" : "rgba(45,20,36,0.65)", lineHeight: 1.65 },
    chip: {
      display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999,
      border: `1px solid ${isDark ? "rgba(56,189,248,0.22)" : "rgba(99,3,48,0.18)"}`,
      background: isDark ? "rgba(56,189,248,0.07)" : "rgba(99,3,48,0.06)",
      fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" as const,
      color: isDark ? "rgba(56,189,248,0.8)" : "rgba(99,3,48,0.7)",
    },
    iconBox: {
      borderRadius: 12,
      background: isDark ? "rgba(56,189,248,0.08)" : "rgba(56,189,248,0.1)",
      padding: 10, color: "#38bdf8",
      border: `1px solid ${isDark ? "rgba(56,189,248,0.15)" : "rgba(56,189,248,0.2)"}`,
    },
    label: { fontSize: 13, fontWeight: 600, color: isDark ? "#eef2ff" : "#2d1424" },
    copy: { fontSize: 13, color: isDark ? "rgba(126,144,184,0.8)" : "rgba(45,20,36,0.6)", lineHeight: 1.55 },
    demoBtn: {
      borderRadius: 999,
      border: `1px solid ${isDark ? "rgba(99,120,170,0.2)" : "rgba(99,3,48,0.15)"}`,
      background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.65)",
      padding: "7px 16px", fontSize: 13, fontWeight: 500,
      color: isDark ? "rgba(200,215,240,0.85)" : "rgba(45,20,36,0.75)",
      cursor: "pointer", transition: "all 0.18s",
    },
    divider: { borderTop: `1px solid ${isDark ? "rgba(99,120,170,0.15)" : "rgba(99,3,48,0.1)"}`, paddingTop: 18 },
    muted: { fontSize: 13, color: isDark ? "rgba(126,144,184,0.65)" : "rgba(45,20,36,0.5)" },
    error: { borderRadius: 12, border: "1px solid rgba(248,113,113,0.35)", background: "rgba(248,113,113,0.08)", padding: "10px 14px", fontSize: 13, color: "#f87171" },
    textarea: {
      background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)",
      border: `1px solid ${isDark ? "rgba(99,120,170,0.2)" : "rgba(99,3,48,0.12)"}`,
      borderRadius: 12, color: isDark ? "#eef2ff" : "#2d1424", fontSize: 14,
    },
  };
}

/* ── Brand logos (inline SVG) ───────────────────── */
function GeminiLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="gem-g" x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="50%" stopColor="#9b5de5" />
          <stop offset="100%" stopColor="#f72585" />
        </linearGradient>
      </defs>
      <path d="M12 2C12 2 14.5 8.5 22 12C14.5 15.5 12 22 12 22C12 22 9.5 15.5 2 12C9.5 8.5 12 2Z" fill="url(#gem-g)" />
    </svg>
  );
}

function ExaLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#7c3aed" />
      <text x="12" y="16.5" textAnchor="middle" fontSize="11" fontWeight="800" fill="white" fontFamily="Inter,sans-serif">exa</text>
    </svg>
  );
}

function PrefectLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#22c55e" />
      <path d="M7 6h6a3 3 0 010 6H7V6z" fill="white" />
      <path d="M7 12h4l4 6H7v-6z" fill="rgba(255,255,255,0.7)" />
    </svg>
  );
}

function NextjsLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" fill="#000" />
      <path d="M7 8v9l8-9v9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ReactFlowLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="rgba(56,189,248,0.15)" stroke="rgba(56,189,248,0.5)" strokeWidth="1" />
      <circle cx="5" cy="12" r="2.5" fill="#38bdf8" />
      <circle cx="19" cy="12" r="2.5" fill="#38bdf8" />
      <circle cx="12" cy="6" r="2.5" fill="#a78bfa" />
      <circle cx="12" cy="18" r="2.5" fill="#a78bfa" />
      <line x1="7" y1="12" x2="17" y2="12" stroke="rgba(56,189,248,0.5)" strokeWidth="1.2" />
      <line x1="12" y1="8" x2="12" y2="16" stroke="rgba(167,139,250,0.5)" strokeWidth="1.2" />
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
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const s = makeStyles(isDark);
  const [idea, setIdea] = useState(DEMO_IDEAS[0]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liveMode, setLiveMode] = useState(false);

  const trimmedIdea = idea.trim();
  const isIdeaValid = trimmedIdea.length >= 12;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isIdeaValid) {
      setError("Describe a more specific SaaS or AI software idea so the atlas has enough signal to work with.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await createRun(trimmedIdea, !liveMode);
      router.push(`/runs/${response.run_id}`);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Could not start the analysis run.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{ ...s.card, display: "flex", flexDirection: "column", gap: 22, padding: "28px 30px" }}
      onSubmit={handleSubmit}
    >
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={s.chip}>Idea intake</span>
        <p style={s.eyebrow}>Start a market run</p>
        <h2 style={s.heading}>Frame the idea in one clean paragraph.</h2>
        <p style={s.body}>
          Include the buyer, the workflow, and the wedge. The more specific the software angle, the better the
          early pulse and atlas structure.
        </p>
      </div>

      {/* Textarea */}
      <Textarea
        id="idea"
        value={idea}
        onChange={(event) => setIdea(event.target.value)}
        placeholder="Example: AI revenue copilot for independent property managers that handles tenant follow-up and payment risk triage."
        rows={6}
        style={s.textarea}
      />

      {/* Info hints — two column */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ ...s.innerBox, display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={s.iconBox}><Lightbulb size={14} /></div>
          <div>
            <p style={{ ...s.label, fontSize: 12 }}>Good input shape</p>
            <p style={{ ...s.copy, marginTop: 3, fontSize: 12 }}>Problem + buyer + software wedge. SaaS/AI tools only.</p>
          </div>
        </div>
        <div style={{ ...s.innerBox, display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={s.iconBox}><Sparkles size={14} /></div>
          <div>
            <p style={{ ...s.label, fontSize: 12 }}>What happens next</p>
            <p style={{ ...s.copy, marginTop: 3, fontSize: 12 }}>Live workspace polling: queued → running → pulse-ready → complete.</p>
          </div>
        </div>
      </div>

      {/* Submit row */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <Button
          type="submit"
          disabled={isSubmitting || !isIdeaValid}
          size="lg"
          style={{
            background: isSubmitting || !isIdeaValid
              ? "rgba(56,189,248,0.3)"
              : "linear-gradient(135deg, #38bdf8 0%, #7c3aed 100%)",
            color: "#fff",
            boxShadow: isSubmitting || !isIdeaValid ? "none" : "0 8px 28px -8px rgba(56,189,248,0.45)",
            border: "none",
            transition: "all 0.2s",
          }}
        >
          {isSubmitting ? "Starting analysis..." : "Analyze idea"}
          <ArrowRight className="h-4 w-4" />
        </Button>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", ...s.muted }}>
          <input
            type="checkbox"
            checked={liveMode}
            onChange={(e) => setLiveMode(e.target.checked)}
            style={{ accentColor: "#38bdf8" }}
          />
          Live AI mode (Gemini + Exa)
        </label>
      </div>

      {!liveMode && (
        <p style={s.muted}>
          Demo mode uses rich fixture data and walks the full run lifecycle instantly. Enable Live AI mode to use real Gemini + Exa.
        </p>
      )}

      {/* Demo prompts */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <p style={s.eyebrow}>Try a demo prompt</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {DEMO_IDEAS.map((demoIdea) => (
            <button
              key={demoIdea}
              type="button"
              onClick={() => setIdea(demoIdea)}
              style={s.demoBtn}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(56,189,248,0.1)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(56,189,248,0.35)"; (e.currentTarget as HTMLButtonElement).style.color = "#eef2ff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,120,170,0.2)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(200,215,240,0.85)"; }}
            >
              {demoIdea}
            </button>
          ))}
        </div>
      </div>

      {!isIdeaValid && <p style={s.muted}>Use at least 12 characters so the run has enough context to produce a usable atlas.</p>}
      {error && <p style={s.error}>{error}</p>}

      {/* Powered by */}
      <div style={{ ...s.divider, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
        <span style={{ ...s.eyebrow, marginRight: 4 }}>Powered by</span>
        {SPONSORS.map(({ name, Logo }) => (
          <span key={name} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 8, border: "1px solid rgba(99,120,170,0.15)", background: "rgba(255,255,255,0.03)", fontSize: 12, fontWeight: 500, color: "rgba(200,215,240,0.75)" }}>
            <Logo />
            {name}
          </span>
        ))}
      </div>
    </motion.form>
  );
}
