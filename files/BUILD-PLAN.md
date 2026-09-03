# aitokencost.dev — build plan

## Setup

```bash
npx create-next-app@latest aitokencost --typescript --app --eslint --src-dir --import-alias "@/*"
cd aitokencost
code .
```

Say **no** to Tailwind — the stylesheet here is plain CSS, which is less code
for a single-page tool. Then drop the provided `src/` files over the generated
ones and run `npm run dev`.

Deploy to Vercel and point aitokencost.dev at it before you write another line.
A live URL changes how you work on it.

---

## Week 1 — ship something real

**1. Verify every price.** Open each provider's pricing page and check the
numbers in `src/lib/pricing.ts` by hand. This is the whole product. A wrong
number destroys the only thing you have, which is being trustworthy.

**2. Real token counting.** The current estimate is character length divided
by 3.8. Replace it:

> Prompt: In src/lib/calc.ts, replace the heuristic countTokens with real
> tokenisation. Install js-tiktoken and use the o200k_base encoding for OpenAI
> models. Keep the function synchronous and memoise the encoder so it is
> created once, not on every keystroke. Fall back to the character heuristic if
> the encoder throws.

For Claude and Gemini, exact counts need a server call. Add later:

> Prompt: Add a Next.js route handler at src/app/api/count/route.ts that
> accepts { text, provider } and returns an exact token count by calling the
> provider's token counting endpoint. Read the API key from process.env, never
> from the client. Debounce the call from the Calculator component at 400ms and
> show the heuristic estimate while it is in flight.

**3. Ship it.** Rough is fine. Live beats polished.

---

## Week 2 — the second input mode

The "what am I spending now" mode you wanted:

> Prompt: Add a second tab to the Calculator called "I already have a bill".
> The user picks the model they currently use and enters their current monthly
> spend in dollars. Work backwards to implied monthly token volume, assuming a
> 1:1 input to output ratio by default with a slider to change it, then show
> what the same volume would cost on every other model, with the saving or
> increase in dollars and percent. Keep the existing prompt-paste mode as the
> first tab. Share the results table component between both modes.

---

## Week 3 — findability

> Prompt: Add src/app/sitemap.ts and src/app/robots.ts using the Next.js 15
> metadata file conventions, with aitokencost.dev as the base URL.

> Prompt: Create an /about page with a real author bio and Person schema, and
> link it from the footer. This is the E-E-A-T signal for the site.

Then submit to Google Search Console and Bing Webmaster Tools.

---

## Week 4 — distribution

The build is the easy part. This is the part that decides whether it works.

- Post to r/LocalLLaMA, r/OpenAI, r/ChatGPTCoding — as a free tool you made,
  not as marketing. Read each subreddit's self-promotion rules first.
- Show HN
- dev.to and Hashnode writeups on what you learned about output token pricing
- Add it to AI tool directories

If nobody uses it after four weeks of real distribution effort, that is
valuable information. Do not spend month two polishing a tool nobody visits.

---

## Only then — affiliate links

You need traffic before programs approve you, and you need trust before links
convert. Order matters:

1. Hosting and infrastructure first — DigitalOcean, Cloudways, Railway. They
   pay $50–200 per referral and your visitors genuinely need hosting for the
   AI apps they are costing out.
2. AI SaaS programs second. Verify each is still open to new applicants before
   you write content around it.
3. Disclose affiliate relationships clearly at the top of any page containing
   them. Required by the FTC in the US, and it costs you nothing in trust if
   your recommendations are honest.

Never recommend a tool you have not used because its commission is higher.
That is the one mistake that ends the site permanently.

---

## What to expect

First commission: three to six months. Meaningful income: a year or more, if
at all. The realistic best case in year one is a few hundred dollars a month
plus a portfolio piece that is genuinely useful for an AI engineering role.

Judge the project in three months on traffic, not revenue. Traffic comes
first; money follows it or does not.
