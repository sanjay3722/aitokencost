// The whole product is that these numbers are right.
//
// Every price below is USD per 1,000,000 tokens, taken from the provider's
// public pricing page. Before shipping, open each `source` URL and check the
// two numbers by hand, then set `verifiedOn` to the date you checked. The UI
// shows a warning for any model whose `verifiedOn` is stale or missing, so a
// number nobody has checked can never masquerade as one that has been.
//
// Prices here reflect standard synchronous API usage. Batch, cached-input,
// and context-caching discounts are deliberately excluded — they belong in a
// later, clearly-labelled advanced mode, not baked silently into the headline.

export type Provider = "openai" | "anthropic" | "google";

/** Which local tokeniser to use for the prompt-paste estimate. */
export type Encoding = "o200k_base" | "heuristic";

export interface Model {
  id: string;
  label: string;
  provider: Provider;
  /** USD per 1M input (prompt) tokens. */
  inputPerM: number;
  /** USD per 1M output (completion) tokens. */
  outputPerM: number;
  /** Advertised context window in tokens, for reference only. */
  contextWindow: number;
  encoding: Encoding;
  /** ISO date (YYYY-MM-DD) the two prices were last checked by hand. */
  verifiedOn: string | null;
  notes?: string;
}

export const PROVIDER_LABEL: Record<Provider, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
};

export const PROVIDER_PRICING_URL: Record<Provider, string> = {
  openai: "https://openai.com/api/pricing/",
  anthropic: "https://www.anthropic.com/pricing#api",
  google: "https://ai.google.dev/gemini-api/docs/pricing",
};

// ---------------------------------------------------------------------------
// The table. Keep it to models people actually compare — a wall of every
// deprecated snapshot helps nobody. verifiedOn is null everywhere until a
// human has done Week 1, task 1.
// ---------------------------------------------------------------------------

export const MODELS: Model[] = [
  // OpenAI ------------------------------------------------------------------
  {
    id: "gpt-4o",
    label: "GPT-4o",
    provider: "openai",
    inputPerM: 2.5,
    outputPerM: 10,
    contextWindow: 128_000,
    encoding: "o200k_base",
    verifiedOn: null,
  },
  {
    id: "gpt-4o-mini",
    label: "GPT-4o mini",
    provider: "openai",
    inputPerM: 0.15,
    outputPerM: 0.6,
    contextWindow: 128_000,
    encoding: "o200k_base",
    verifiedOn: null,
  },
  {
    id: "gpt-4.1",
    label: "GPT-4.1",
    provider: "openai",
    inputPerM: 2,
    outputPerM: 8,
    contextWindow: 1_047_576,
    encoding: "o200k_base",
    verifiedOn: null,
  },
  {
    id: "gpt-4.1-mini",
    label: "GPT-4.1 mini",
    provider: "openai",
    inputPerM: 0.4,
    outputPerM: 1.6,
    contextWindow: 1_047_576,
    encoding: "o200k_base",
    verifiedOn: null,
  },
  {
    id: "gpt-4.1-nano",
    label: "GPT-4.1 nano",
    provider: "openai",
    inputPerM: 0.1,
    outputPerM: 0.4,
    contextWindow: 1_047_576,
    encoding: "o200k_base",
    verifiedOn: null,
  },
  {
    id: "o4-mini",
    label: "o4-mini",
    provider: "openai",
    inputPerM: 1.1,
    outputPerM: 4.4,
    contextWindow: 200_000,
    encoding: "o200k_base",
    verifiedOn: null,
    notes: "Reasoning tokens are billed as output.",
  },

  // Anthropic -------------------------------------------------------------
  {
    id: "claude-opus-4.1",
    label: "Claude Opus 4.1",
    provider: "anthropic",
    inputPerM: 15,
    outputPerM: 75,
    contextWindow: 200_000,
    encoding: "heuristic",
    verifiedOn: null,
  },
  {
    id: "claude-sonnet-4.5",
    label: "Claude Sonnet 4.5",
    provider: "anthropic",
    inputPerM: 3,
    outputPerM: 15,
    contextWindow: 200_000,
    encoding: "heuristic",
    verifiedOn: null,
    notes: "Higher long-context tier applies above 200K input tokens.",
  },
  {
    id: "claude-haiku-4.5",
    label: "Claude Haiku 4.5",
    provider: "anthropic",
    inputPerM: 1,
    outputPerM: 5,
    contextWindow: 200_000,
    encoding: "heuristic",
    verifiedOn: null,
  },
  {
    id: "claude-haiku-3.5",
    label: "Claude Haiku 3.5",
    provider: "anthropic",
    inputPerM: 0.8,
    outputPerM: 4,
    contextWindow: 200_000,
    encoding: "heuristic",
    verifiedOn: null,
  },

  // Google --------------------------------------------------------------
  {
    id: "gemini-2.5-pro",
    label: "Gemini 2.5 Pro",
    provider: "google",
    inputPerM: 1.25,
    outputPerM: 10,
    contextWindow: 1_048_576,
    encoding: "heuristic",
    verifiedOn: null,
    notes: "Input rises to $2.50 / output to $15 above 200K input tokens.",
  },
  {
    id: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    provider: "google",
    inputPerM: 0.3,
    outputPerM: 2.5,
    contextWindow: 1_048_576,
    encoding: "heuristic",
    verifiedOn: null,
  },
  {
    id: "gemini-2.5-flash-lite",
    label: "Gemini 2.5 Flash-Lite",
    provider: "google",
    inputPerM: 0.1,
    outputPerM: 0.4,
    contextWindow: 1_048_576,
    encoding: "heuristic",
    verifiedOn: null,
  },
  {
    id: "gemini-2.0-flash",
    label: "Gemini 2.0 Flash",
    provider: "google",
    inputPerM: 0.1,
    outputPerM: 0.4,
    contextWindow: 1_048_576,
    encoding: "heuristic",
    verifiedOn: null,
  },
];

export function getModel(id: string): Model | undefined {
  return MODELS.find((m) => m.id === id);
}

/** Days after which a hand-checked price is considered stale. */
export const STALE_AFTER_DAYS = 45;

export function isStale(model: Model, now = new Date()): boolean {
  if (!model.verifiedOn) return true;
  const checked = new Date(model.verifiedOn + "T00:00:00Z").getTime();
  if (Number.isNaN(checked)) return true;
  const ageDays = (now.getTime() - checked) / 86_400_000;
  return ageDays > STALE_AFTER_DAYS;
}

/** True when at least one displayed model has an unverified or stale price. */
export function anyStale(models: Model[] = MODELS, now = new Date()): boolean {
  return models.some((m) => isStale(m, now));
}
