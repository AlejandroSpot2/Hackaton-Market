"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createRun } from "@/lib/api";

const DEMO_IDEAS = [
  "AI assistant that applies to jobs automatically",
  "AI mobile coding copilot for React Native teams",
  "AI travel planner that coordinates bookings and itinerary changes"
];

export function IdeaForm() {
  const router = useRouter();
  const [idea, setIdea] = useState(DEMO_IDEAS[0]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await createRun(idea, process.env.NEXT_PUBLIC_DEMO_MODE === "true");
      router.push(`/runs/${response.run_id}`);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Could not create the run.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="surface input-shell" onSubmit={handleSubmit}>
      <label className="panel-title" htmlFor="idea">
        Startup idea
      </label>
      <textarea
        id="idea"
        className="textarea"
        value={idea}
        onChange={(event) => setIdea(event.target.value)}
        placeholder="Describe the software or AI startup idea you want to map."
        rows={6}
      />
      <div className="button-row">
        <button className="primary-button" type="submit" disabled={isSubmitting || idea.trim().length < 10}>
          {isSubmitting ? "Starting analysis..." : "Analyze"}
        </button>
        <span className="muted">Demo mode uses local fixtures and still walks the full run lifecycle.</span>
      </div>
      <div className="chip-row">
        {DEMO_IDEAS.map((demoIdea) => (
          <button
            key={demoIdea}
            className="prompt-chip"
            type="button"
            onClick={() => setIdea(demoIdea)}
          >
            {demoIdea}
          </button>
        ))}
      </div>
      {error ? <p className="alert">{error}</p> : null}
    </form>
  );
}