# aitokencost.dev

A single-page tool: paste a prompt, see what one request costs per month across
OpenAI, Anthropic, and Google models. Token counting for OpenAI models is exact
(js-tiktoken, `o200k_base`); Claude and Gemini use a character heuristic until
the server-side counting route is added.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build + typecheck
npm run lint
```

## Layout

| Path | What it is |
| --- | --- |
| `src/lib/pricing.ts` | The model table. USD per 1M tokens, per-model `verifiedOn` date. Editing this is the product. |
| `src/lib/calc.ts` | Token counting (memoised tiktoken + heuristic fallback), cost math, the shared `compare()` used by both input modes, formatters. |
| `src/components/Calculator.tsx` | Client component. "Paste a prompt" tab wired; "I already have a bill" tab stubbed for Week 2. |
| `src/components/ResultsTable.tsx` | Presentational comparison table, shared between both modes. |
| `src/app/page.tsx` / `layout.tsx` | Page shell and metadata. |
| `src/app/globals.css` | The whole stylesheet. Plain CSS, light/dark via `prefers-color-scheme`. |

## Before you share the URL

Work through `VERIFY.md` — every price ships unverified and the UI says so
until you hand-check it.

## Next

See `files/BUILD-PLAN.md`. Immediate: verify prices (Week 1.1), then the
`/api/count` route for exact Claude/Gemini counts, then the Week 2 bill mode
(`impliedVolume` in `calc.ts` is already there for it).
