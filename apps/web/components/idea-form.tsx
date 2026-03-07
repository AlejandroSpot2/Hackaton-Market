"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createRun } from "@/lib/api";
import { DEMO_IDEAS } from "@/lib/constants";

export function IdeaForm() {
  const router = useRouter();
  const [idea, setIdea] = useState(DEMO_IDEAS[0]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedIdea = idea.trim();
  const isIdeaValid = trimmedIdea.length >= 12;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isIdeaValid) {
      setError("Use a fuller SaaS or AI software idea so the atlas has something concrete to map.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await createRun(trimmedIdea, true);
      router.push(`/runs/${response.run_id}`);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Could not create the run.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="surface input-shell observatory-form" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Idea intake</p>
        <label className="panel-title" htmlFor="idea">
          What SaaS or AI software idea are we charting?
        </label>
        <p className="muted form-copy">
          Give the orb a buyer, a workflow, and a wedge. The sharper the premise, the better the map can separate crowded terrain from viable entry routes.
        </p>
      </div>

      <textarea
        id="idea"
        className="textarea"
        value={idea}
        onChange={(event) => setIdea(event.target.value)}
        placeholder="Example: AI revenue copilot for independent property managers that handles tenant follow-up and payment risk triage."
        rows={7}
      />

      <div className="input-guidance">
        <span className="detail-label">Good prompt shape</span>
        <p>Problem + buyer + software wedge. This MVP is tuned for SaaS and AI tools, not consumer social, hardware, or broad marketplaces.</p>
      </div>

      <div className="button-row button-row--stacked-mobile">
        <button className="primary-button" type="submit" disabled={isSubmitting || !isIdeaValid}>
          {isSubmitting ? "Opening the atlas..." : "Open the atlas"}
        </button>
        <span className="muted">Demo mode still walks the real run lifecycle and persists each run JSON to disk.</span>
      </div>

      <div className="input-guidance compact">
        <span className="detail-label">Seeded prompts</span>
      </div>
      <div className="chip-row chip-row--sigils">
        {DEMO_IDEAS.map((demoIdea) => (
          <button key={demoIdea} className="prompt-chip prompt-chip--sigil" type="button" onClick={() => setIdea(demoIdea)}>
            {demoIdea}
          </button>
        ))}
      </div>

      {!isIdeaValid ? <p className="muted validation-copy">Use at least 12 characters so the run has enough context to produce a usable map.</p> : null}
      {error ? <p className="alert">{error}</p> : null}
    </form>
  );
}
