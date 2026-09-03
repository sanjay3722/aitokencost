"use client";

import { useMemo, useState } from "react";
import {
  compare,
  countTokens,
  formatTokens,
  isExact,
  type Usage,
} from "@/lib/calc";
import { anyStale, MODELS } from "@/lib/pricing";
import ResultsTable from "@/components/ResultsTable";

const SAMPLE_PROMPT =
  "You are a senior support engineer. Given the customer email below, draft a " +
  "reply that acknowledges the problem, states the next concrete step, and " +
  "gives a realistic timeline. Keep it under 150 words and do not promise a " +
  "refund.";

export default function Calculator() {
  const [prompt, setPrompt] = useState(SAMPLE_PROMPT);
  const [outputTokens, setOutputTokens] = useState(500);
  const [callsPerMonth, setCallsPerMonth] = useState(10_000);
  const [baselineId, setBaselineId] = useState<string>("");

  const rows = useMemo(() => {
    const usageFor = (model: (typeof MODELS)[number]): Usage => ({
      inputTokens: countTokens(prompt, model.encoding),
      outputTokens: Math.max(0, outputTokens),
      calls: Math.max(0, callsPerMonth),
    });
    return compare(MODELS, usageFor, baselineId || null);
  }, [prompt, outputTokens, callsPerMonth, baselineId]);

  const openaiInputTokens = countTokens(prompt, "o200k_base");
  const exact = isExact("o200k_base");
  const stale = anyStale();

  return (
    <section className="calculator">
      <div className="tabs" role="tablist" aria-label="Input mode">
        <button role="tab" aria-selected="true" className="tab active">
          Paste a prompt
        </button>
        <button role="tab" aria-selected="false" className="tab" disabled>
          I already have a bill
          <span className="soon">soon</span>
        </button>
      </div>

      <div className="panel" role="tabpanel">
        <label className="field">
          <span className="label">Your prompt (system + user, one request)</span>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            spellCheck={false}
            placeholder="Paste the prompt you send on every call…"
          />
          <span className="hint">
            ≈ {formatTokens(openaiInputTokens)} input tokens
            {exact
              ? " — exact for OpenAI models, estimated for others"
              : " — estimated (local tokeniser unavailable)"}
          </span>
        </label>

        <div className="row">
          <label className="field">
            <span className="label">Output tokens per call</span>
            <input
              type="number"
              min={0}
              step={50}
              value={outputTokens}
              onChange={(e) => setOutputTokens(Number(e.target.value))}
            />
            <span className="hint">The model&rsquo;s reply length. A short paragraph is ~150.</span>
          </label>

          <label className="field">
            <span className="label">Calls per month</span>
            <input
              type="number"
              min={0}
              step={1000}
              value={callsPerMonth}
              onChange={(e) => setCallsPerMonth(Number(e.target.value))}
            />
            <span className="hint">How many times you run this request.</span>
          </label>

          <label className="field">
            <span className="label">Compare against</span>
            <select
              value={baselineId}
              onChange={(e) => setBaselineId(e.target.value)}
            >
              <option value="">— no baseline —</option>
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
            <span className="hint">Pick the model you use now to see the delta.</span>
          </label>
        </div>
      </div>

      {stale && (
        <p className="warn" role="status">
          Some prices below have not been hand-verified yet. Treat them as
          indicative until the checkmark appears.
        </p>
      )}

      <ResultsTable
        rows={rows}
        amountLabel="Cost / month"
        showDelta={Boolean(baselineId)}
      />

      <p className="fineprint">
        Figures assume standard synchronous API pricing. Prompt caching, batch
        discounts, and reasoning-token overhead are not modelled. Output-token
        count is your estimate, not a measurement.
      </p>
    </section>
  );
}
