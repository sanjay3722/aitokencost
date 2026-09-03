# Price verification — do this before sharing the URL

Every model in `src/lib/pricing.ts` currently has `verifiedOn: null`, so the
site shows an "unverified" warning. Clearing it is Week 1, task 1 of the build
plan and the single most important thing on this project.

## How

1. Open the provider's pricing page (URLs are in `PROVIDER_PRICING_URL`).
2. For each model, confirm **input** and **output** USD per 1M tokens against
   `inputPerM` / `outputPerM`.
3. When a model's two numbers match, set its `verifiedOn` to today's date
   (`YYYY-MM-DD`). If a number is wrong, fix it first, then date it.
4. Re-check anything older than `STALE_AFTER_DAYS` (45) — the warning comes
   back on its own.

## Checklist

### OpenAI — https://openai.com/api/pricing/
- [ ] gpt-4o — 2.50 / 10.00
- [ ] gpt-4o-mini — 0.15 / 0.60
- [ ] gpt-4.1 — 2.00 / 8.00
- [ ] gpt-4.1-mini — 0.40 / 1.60
- [ ] gpt-4.1-nano — 0.10 / 0.40
- [ ] o4-mini — 1.10 / 4.40

### Anthropic — https://www.anthropic.com/pricing#api
- [ ] claude-opus-4.1 — 15 / 75
- [ ] claude-sonnet-4.5 — 3 / 15  (check the >200K long-context tier too)
- [ ] claude-haiku-4.5 — 1 / 5
- [ ] claude-haiku-3.5 — 0.80 / 4

### Google — https://ai.google.dev/gemini-api/docs/pricing
- [ ] gemini-2.5-pro — 1.25 / 10  (rises to 2.50 / 15 above 200K input)
- [ ] gemini-2.5-flash — 0.30 / 2.50
- [ ] gemini-2.5-flash-lite — 0.10 / 0.40
- [ ] gemini-2.0-flash — 0.10 / 0.40

The numbers above are what the code was seeded with from memory. They are
starting points to check, **not** confirmed values.
