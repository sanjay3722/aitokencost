---
description: Scaffold a new App Router route the correct way for Next.js 16
argument-hint: <route-path> [page|handler|layout] (e.g. about page, api/count handler)
allowed-tools: Read, Write, Edit, Bash(npm run lint), Bash(npm run build)
---

Add a new route at `$1` of kind `${2:-page}` to this Next.js 16 App Router app.

Before writing anything:

1. Read `.claude/skills/nextjs-best-practices/SKILL.md` and `CLAUDE.md`.
2. Read the matching bundled doc:
   - page/layout → `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
   - handler → `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
   - metadata files → `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md`

Then implement, honoring:

- Files go under `src/app/`. `page.tsx` for a page, `route.ts` for a handler,
  `layout.tsx` for a layout. Metadata file conventions (`sitemap.ts`,
  `robots.ts`, `opengraph-image.tsx`, `icon.tsx`) at `src/app/`.
- **Server Component by default.** No `"use client"` unless the route needs
  state/effects/browser APIs — if it does, isolate that in a child component.
- `params` / `searchParams` are `Promise`s — type them as such and `await`.
- Page: export `metadata` or `generateMetadata`. Absolute URLs resolve against
  the `metadataBase` already set in the root layout.
- Handler: validate the request body (shape, size, type) before use; read any
  keys from `process.env`; return typed JSON; add simple rate limiting if it
  spends money or calls a paid API.
- Styling: reuse `src/app/globals.css` tokens. No new stylesheet.
- Link to the new page from wherever a user would reach it (e.g. the footer in
  `src/app/page.tsx`), using `next/link`.

Finish by running `npm run lint` and `npm run build` and reporting the result.
If either fails, fix it before returning.
