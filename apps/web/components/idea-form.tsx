"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, Lightbulb, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DEMO_IDEAS } from "@/lib/constants";
import { createRun } from "@/lib/api";

const SPONSORS = [
  { name: "Google Gemini", dot: "#7c4dff" },
  { name: "Exa", dot: "#7c3aed" },
  { name: "Prefect", dot: "#22c55e" },
  { name: "Next.js", dot: "#630330" },
  { name: "React Flow", dot: "#cc8e73" },
];

export function IdeaForm() {
  const router = useRouter();
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
      className="glass-panel glass-panel-strong flex h-full flex-col gap-6 p-7 sm:p-8"
      onSubmit={handleSubmit}
    >
      <div className="space-y-3">
        <span className="glass-chip">Idea intake</span>
        <div className="space-y-3">
          <p className="section-kicker">Start a market run</p>
          <h2 className="font-serif text-3xl tracking-[-0.03em] text-foreground">Frame the idea in one clean paragraph.</h2>
          <p className="panel-copy">
            Include the buyer, the workflow, and the wedge. The more specific the software angle, the better the
            early pulse and atlas structure.
          </p>
        </div>
      </div>

      <Textarea
        id="idea"
        value={idea}
        onChange={(event) => setIdea(event.target.value)}
        placeholder="Example: AI revenue copilot for independent property managers that handles tenant follow-up and payment risk triage."
        rows={7}
      />

      <div className="grid gap-3 rounded-[1.5rem] border border-white/70 bg-white/46 p-4 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-primary/10 p-2.5 text-primary ring-1 ring-primary/10">
            <Lightbulb className="h-4 w-4" />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-foreground">Good input shape</p>
            <p className="panel-copy">Problem + buyer + software wedge. This MVP is tuned for SaaS and AI tools only.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-primary/10 p-2.5 text-primary ring-1 ring-primary/10">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-foreground">What happens next</p>
            <p className="panel-copy">The run redirects to a live workspace that polls the API through queued, running, pulse-ready, and complete.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={isSubmitting || !isIdeaValid} size="lg">
          {isSubmitting ? "Starting analysis..." : "Analyze idea"}
          <ArrowRight className="h-4 w-4" />
        </Button>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={liveMode}
            onChange={(e) => setLiveMode(e.target.checked)}
            className="h-3.5 w-3.5 accent-primary"
          />
          Live AI mode (Gemini + Exa)
        </label>
      </div>

      {!liveMode && (
        <p className="text-sm text-muted-foreground">
          Demo mode uses rich fixture data and walks the full run lifecycle instantly. Enable Live AI mode to use real Gemini + Exa.
        </p>
      )}

      <div className="space-y-3">
        <p className="section-kicker">Try a demo prompt</p>
        <div className="flex flex-wrap gap-2.5">
          {DEMO_IDEAS.map((demoIdea) => (
            <button
              key={demoIdea}
              className="rounded-full border border-white/75 bg-white/52 px-4 py-2 text-left text-sm font-medium text-foreground shadow-[0_14px_32px_-24px_rgba(99,3,48,0.28)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/72"
              type="button"
              onClick={() => setIdea(demoIdea)}
            >
              {demoIdea}
            </button>
          ))}
        </div>
      </div>

      {!isIdeaValid ? <p className="text-sm text-muted-foreground">Use at least 12 characters so the run has enough context to produce a usable atlas.</p> : null}
      {error ? <p className="rounded-[1.25rem] border border-rose-200/90 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 backdrop-blur-xl">{error}</p> : null}

      <div className="flex flex-wrap items-center gap-2.5 border-t border-white/60 pt-5">
        <span className="section-kicker mr-1">Powered by</span>
        {SPONSORS.map((s) => (
          <span key={s.name} className="glass-chip !text-[0.7rem]">
            <span className="h-2 w-2 rounded-full" style={{ background: s.dot }} />
            {s.name}
          </span>
        ))}
      </div>
    </motion.form>
  );
}
