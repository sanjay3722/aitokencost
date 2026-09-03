---
name: pricing-data
description: >-
  How the model pricing table in src/lib/pricing.ts is structured and kept
  trustworthy. Use when adding, removing, or editing a model or a price, when
  changing the Model type or the staleness logic, or when anything reads
  MODELS / isStale / anyStale. Covers the per-field contract, the verifiedOn
  discipline, tiered-pricing traps, and what must never be folded into the
  headline numbers.
---

# Pricing data (`src/lib/pricing.ts`)

The accuracy of this file **is the product**. A wrong number is the one bug
that loses the site its only asset — being trustworthy. Treat every edit here
as higher-stakes than a code change.

## The `Model` shape

```ts
interface Model {
  id: string;            // provider's API model id, stable
  label: string;         // display name, e.g. "GPT-4o mini"
  provider: Provider;    // "openai" | "anthropic" | "google"
  inputPerM: number;     // USD per 1,000,000 input (prompt) tokens
  outputPerM: number;    // USD per 1,000,000 output (completion) tokens
  contextWindow: number; // advertised window, reference only
  encoding: Encoding;    // "o200k_base" (exact local count) | "heuristic"
  verifiedOn: string | null; // ISO YYYY-MM-DD the two prices were hand-checked
  notes?: string;        // tier boundaries, billing quirks
}
```

- **`inputPerM` / `outputPerM` are per *million* tokens, USD, standard
  synchronous tier.** The calc layer divides by 1e6 — do not pre-scale.
- `encoding: "o200k_base"` only for models actually tokenised that way
  (current OpenAI models). Everything else is `"heuristic"` until the planned
  `/api/count` route gives exact server counts.
- `id` should match the provider's real API id so the table stays checkable.

## The `verifiedOn` discipline

- Editing *any* number for a model means you opened that provider's live
  pricing page in this session and confirmed both values. Then set
  `verifiedOn` to today (`YYYY-MM-DD`).
- Never set `verifiedOn` for a model you did not personally check, even if the
  number "looks right" or was verified for a sibling model.
- A new model ships with `verifiedOn: null` unless you checked it now.
- `isStale(model)` returns true when `verifiedOn` is null, unparseable, or
  older than `STALE_AFTER_DAYS` (45). `anyStale()` drives the yellow-grey
  notice in `Calculator.tsx`. Do not suppress that notice, raise the
  threshold to hide staleness, or special-case a model out of it.

## Tiered pricing — the usual traps

The table holds **one** tier per model (the standard/short-context one). When a
provider has tiers, keep the base numbers and describe the boundary in
`notes`:

- **Gemini 2.5 Pro** — input/output roughly double above 200K input tokens.
- **Claude Sonnet / long context** — higher rate above the 200K-input tier.
- **Batch API** — typically ~50% off. **Not** modelled here.
- **Cached / context-cached input** — cheaper read rate. **Not** modelled.
- **Prompt-caching writes**, priority/flex tiers, image or audio token rates —
  out of scope.

If a model's real cost depends on a discount the table can't express, say so in
`notes`; never bake the discount into `inputPerM` / `outputPerM`.

## Adding or removing a model

- Keep the list to models people actually compare. A wall of deprecated
  snapshots hurts scannability and raises the verification burden.
- Group by provider, in the existing order. Update nothing else — `MODELS` is
  consumed generically by `compare()` and the UI; there are no per-id
  branches, keep it that way.
- Removing a model: check it isn't the default `baselineId` anywhere and that
  `VERIFY.md`'s checklist is updated to match.

## Downstream contract (don't break)

- `src/lib/calc.ts` imports `Model` / `Encoding` and treats `MODELS` as an
  opaque list. `pricing.ts` must stay pure — no `react`, no `next/*`, no
  `fetch`, no `process.env`.
- `PROVIDER_LABEL` and `PROVIDER_PRICING_URL` are keyed by every `Provider`
  literal — add a key if you add a provider, or the `Record` type breaks the
  build.
- `getModel(id)` returns `undefined` for unknown ids; callers handle that.

## Related

- `VERIFY.md` — the per-model checklist to work through before sharing the URL.
- `/verify-prices` command — automates a provider's checklist with WebFetch.
- `pricing-auditor` agent — does the full pass and reports discrepancies.
