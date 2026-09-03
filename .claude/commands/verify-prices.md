---
description: Walk the VERIFY.md pricing checklist and update verifiedOn dates
argument-hint: [openai|anthropic|google, defaults to all]
allowed-tools: Read, Edit, WebFetch, Bash(git diff:*)
---

Verify the model prices in `src/lib/pricing.ts` for provider `${1:-all}`. This
is the single most important task on the project — a wrong number destroys the
only thing the site has.

1. Read `VERIFY.md` for the checklist and `src/lib/pricing.ts` for the current
   values and the `PROVIDER_PRICING_URL` map.
2. For each model of the requested provider, fetch the provider's public
   pricing page and find its **input** and **output** price in USD per 1M
   tokens.
3. Compare to `inputPerM` / `outputPerM`:
   - Match → set that model's `verifiedOn` to today's date (`YYYY-MM-DD`).
   - Mismatch → correct the number, then set `verifiedOn` to today. Call out
     every change explicitly with old → new.
   - Can't find it / model retired → leave `verifiedOn: null`, note it, and
     suggest removing or replacing the entry.
4. Watch for tiered pricing (e.g. Gemini 2.5 Pro and Claude long-context above
   200K tokens). Keep the table's standard tier; make sure the `notes` field
   still describes the tier boundary correctly.
5. Do **not** fold in batch, cached-input, or context-caching discounts — the
   table is standard synchronous pricing only.
6. Show `git diff src/lib/pricing.ts` and a short summary: which models are now
   verified, which numbers changed, which still need attention.

If today's date is unknown, ask before writing any `verifiedOn`.
