---
description: Audit the app for Core Web Vitals, bundle size, and RSC-boundary issues
argument-hint: [route path, defaults to /]
allowed-tools: Read, Grep, Glob, Bash
---

Do a performance and correctness audit of this Next.js 16 app, focused on
`${1:-/}`. This is a static single-page tool; the bar is "loads instantly".

Steps:

1. `npm run build` and read the route output table — note First Load JS per
   route and whether routes are `○ (Static)` or `ƒ (Dynamic)`. Flag anything
   unexpectedly dynamic.
2. Inspect the client bundle. `js-tiktoken` bundles all encoding tables and is
   large — confirm whether it is in the first-load JS and whether that is
   acceptable, or should move behind the planned `/api/count` route.
3. Grep for `"use client"` (`grep -rn '"use client"' src`). For each, confirm
   it is required (state/effects/browser API/handlers) and as low in the tree
   as possible. `Calculator.tsx` should be the only one.
4. Check images: any `<img>` that should be `next/image`; missing
   `width`/`height`/`sizes`; missing `priority` on an LCP image.
5. Check fonts: `next/font` usage, no layout shift, no render-blocking webfont
   `<link>`.
6. Check `<Link>` usage for internal navigation and unnecessary
   `prefetch={false}`.
7. Metadata: `metadataBase` set, canonical + OG present, `sitemap.ts` /
   `robots.ts` present (or note they're pending per the build plan).
8. Look for accidental client-side data fetching in `useEffect` that could be
   a Server Component fetch.
9. CLS/hydration risks: values that differ between server and client render
   (dates, `Math.random`, `typeof window` branches) in `calc.ts` or components.

Report findings ranked blocker / should-fix / nit, each with `file:line` and a
one-line fix. End with the build's per-route First Load JS numbers.
