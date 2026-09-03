import { getEncoding, type Tiktoken } from "js-tiktoken";
import type { Encoding, Model } from "@/lib/pricing";

// ---------------------------------------------------------------------------
// Token counting
//
// OpenAI models on this site all use the o200k_base encoding, so for those we
// can give an exact local count with js-tiktoken. Claude and Gemini use
// tokenisers that are not published; their exact counts need a server round
// trip (see the planned /api/count route), so here they fall back to a
// character heuristic. countTokens stays synchronous so it can run on every
// keystroke without orchestration.
// ---------------------------------------------------------------------------

/** Mean characters per token, measured across mixed English + code prompts. */
const CHARS_PER_TOKEN = 3.8;

export function heuristicTokens(text: string): number {
  if (!text) return 0;
  return Math.max(1, Math.ceil(text.length / CHARS_PER_TOKEN));
}

// Build the encoder once. getEncoding does a non-trivial amount of work
// parsing the merge table, and the Calculator calls countTokens on every
// render, so memoise it. If it ever throws (bad bundle, unsupported runtime)
// we cache the failure and never try again this session.
let encoderCache: Tiktoken | null = null;
let encoderFailed = false;

function o200k(): Tiktoken | null {
  if (encoderCache) return encoderCache;
  if (encoderFailed) return null;
  try {
    encoderCache = getEncoding("o200k_base");
    return encoderCache;
  } catch {
    encoderFailed = true;
    return null;
  }
}

/**
 * Token count for `text` under the given encoding. Exact for "o200k_base";
 * an estimate otherwise. Never throws — any tokeniser failure degrades to the
 * character heuristic.
 */
export function countTokens(text: string, encoding: Encoding): number {
  if (!text) return 0;
  if (encoding === "o200k_base") {
    const enc = o200k();
    if (enc) {
      try {
        return enc.encode(text).length;
      } catch {
        // fall through to heuristic
      }
    }
  }
  return heuristicTokens(text);
}

/** True when the count returned for this encoding is exact rather than estimated. */
export function isExact(encoding: Encoding): boolean {
  return encoding === "o200k_base" && o200k() !== null;
}

// ---------------------------------------------------------------------------
// Cost
// ---------------------------------------------------------------------------

export interface Usage {
  inputTokens: number;
  outputTokens: number;
  /** How many times this request is made in the billing period. */
  calls: number;
}

export interface CostBreakdown {
  inputCost: number;
  outputCost: number;
  perCallCost: number;
  totalCost: number;
}

export function costFor(model: Model, usage: Usage): CostBreakdown {
  const inputCost = (usage.inputTokens / 1_000_000) * model.inputPerM;
  const outputCost = (usage.outputTokens / 1_000_000) * model.outputPerM;
  const perCallCost = inputCost + outputCost;
  return {
    inputCost,
    outputCost,
    perCallCost,
    totalCost: perCallCost * usage.calls,
  };
}

// ---------------------------------------------------------------------------
// "I already have a bill" — work backwards from a dollar figure (Week 2).
//
// Given a monthly spend on a known model and an input:output token ratio,
// solve for the token volume that produces that spend, then that same volume
// can be priced on every other model.
// ---------------------------------------------------------------------------

export interface ImpliedVolume {
  inputTokens: number;
  outputTokens: number;
}

/**
 * @param monthlySpend  dollars per month on `model`
 * @param inputShare    fraction of tokens that are input, 0..1 (0.5 = 1:1)
 */
export function impliedVolume(
  model: Model,
  monthlySpend: number,
  inputShare: number,
): ImpliedVolume {
  const share = clamp(inputShare, 0, 1);
  // spend = T * [ share * inRate + (1 - share) * outRate ]  (rates per token)
  const blendedPerToken =
    (share * model.inputPerM + (1 - share) * model.outputPerM) / 1_000_000;
  const totalTokens = blendedPerToken > 0 ? monthlySpend / blendedPerToken : 0;
  return {
    inputTokens: totalTokens * share,
    outputTokens: totalTokens * (1 - share),
  };
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

// ---------------------------------------------------------------------------
// Comparison rows shared by both input modes (Week 2 asks for one table).
// ---------------------------------------------------------------------------

export interface ComparisonRow {
  model: Model;
  cost: CostBreakdown;
  /** Signed dollar delta vs the baseline row (negative = cheaper). */
  deltaAbs: number;
  /** Signed fractional delta vs the baseline, e.g. -0.25 = 25% cheaper. */
  deltaPct: number;
  isBaseline: boolean;
}

export function compare(
  models: Model[],
  usageFor: (model: Model) => Usage,
  baselineId: string | null,
): ComparisonRow[] {
  const priced = models.map((model) => ({
    model,
    cost: costFor(model, usageFor(model)),
  }));
  const baseline =
    priced.find((p) => p.model.id === baselineId)?.cost.totalCost ?? null;

  return priced
    .map(({ model, cost }) => {
      const deltaAbs = baseline === null ? 0 : cost.totalCost - baseline;
      const deltaPct =
        baseline === null || baseline === 0 ? 0 : deltaAbs / baseline;
      return {
        model,
        cost,
        deltaAbs,
        deltaPct,
        isBaseline: model.id === baselineId,
      };
    })
    .sort((a, b) => a.cost.totalCost - b.cost.totalCost);
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

export function formatUSD(n: number): string {
  const abs = Math.abs(n);
  const digits = abs === 0 ? 2 : abs < 1 ? 4 : abs < 100 ? 2 : 0;
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatPct(frac: number): string {
  const pct = frac * 100;
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(pct === 0 ? 0 : Math.abs(pct) < 10 ? 1 : 0)}%`;
}

export function formatTokens(n: number): string {
  if (n < 1000) return String(Math.round(n));
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}K`;
  if (n < 1_000_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  return `${(n / 1_000_000_000).toFixed(2)}B`;
}
