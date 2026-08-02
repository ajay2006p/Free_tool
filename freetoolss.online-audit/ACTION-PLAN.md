# Action Plan — freetoolss.online

Ordered by impact per unit of effort. Severity reflects SEO consequence, not engineering difficulty.

---

## Critical

### 1. Build domain authority — this is the binding constraint
**Evidence:** `commoncrawl_graph.py` (`cc-main-2026-jan-feb-mar`) returns `in_crawl: false`, `in_rankings: false`, null pagerank, null harmonic centrality.

The site has no measurable inbound link profile. Every other item on this list is worth doing, and none of them will move rankings for competitive utility keywords while this stays true. Incumbents ranking for "json formatter" or "compress pdf" hold very large link profiles.

Realistic paths, in rough order of return:
- Submit tools to developer directories and `awesome-*` GitHub lists where they genuinely fit
- Publish the blog content where the audience already is, rather than waiting for it to be found
- Lead with the differentiator that is actually true and verifiable — everything runs client-side, nothing is uploaded, no signup
- Target long-tail, low-competition queries first; they are winnable without authority and compound

Treat this as the primary workstream for the next quarter. Timeframe: ongoing.

---

## High

### 2. Deploy the two fixes applied this session
Both are built and verified but sit uncommitted. The live site still serves the old metadata. Nothing improves until this ships. **Effort: minutes.**

### 3. Fill out the thin category hubs
`career` (49 words), `games` (53), `converters` (56), `social` (92), `files` (101), `ai` (104), `image` (119), `text` (120), `calculators` (123), `productivity` (126).

These are indexed, one click from the homepage, and currently near-empty. Add 200–300 words of genuinely category-specific copy each: what the category covers, who it is for, how to choose between the tools listed, plus 2–3 category-level FAQs. Start with the three thinnest. **Effort: ~1 day.**

### 4. Deepen the highest-intent tool pages
46/79 pages are under 500 words. Rather than lifting all of them slightly, take the 10–15 tools with the strongest commercial intent past 800 words with worked examples, edge cases, format explanations and honest comparison notes. Depth on a few pages beats a thin uplift everywhere. **Effort: ~2–3 days.**

---

## Medium

### 5. Shorten 18 over-length titles
Truncating in SERPs: `ai/ai-image-prompt` (69), `productivity/survey-maker` (70), `files/certificate-generator` (66), `productivity/presentation-maker` (67), `productivity/meeting-scheduler` (65), `calculators/compound-interest` (64), `productivity/flashcard-maker` (64), and six blog posts (63–71). Target ≤60 characters including the ` · FreeTool` suffix, primary keyword first.

### 6. Rewrite 32 out-of-band descriptions
24 under 110 characters (`about` 82, `blog` 75, `career` 75, `converters` 80, `games` 81 …) waste SERP space; 8 over 160 (`tools/link-in-bio` 180, `ai/ai-image-prompt` 177 …) truncate mid-sentence. Target 140–158.

### 7. Add outbound citations
Only 4 external links exist across 79 pages. Add 1–2 authoritative sources per technical tool page — RFC 8259 on the JSON tools, OWASP guidance on the password tools, the WCAG spec on the contrast checker. This is both an E-E-A-T signal and a direct GEO signal: answer engines preferentially cite pages that cite primary sources.

### 8. Cross-link the blog
Every post has exactly one inbound internal link, from `/blog` alone. Link each tool page to a relevant post, link posts to each other, and link posts to the tools they discuss.

### 9. Add security headers
Only HSTS is set. Add via `headers()` in `next.config.mjs`:
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` restricting unused features
- CSP in **report-only** mode first — AdSense and GTM both need allowances and a strict policy will break ads.

### 10. Alt text on 2 blog covers
`/blog/100-free-tool-website-use-100-online-tools-without-paying` and `/blog/tech-trends-worth-attention-2026`. Add descriptive alt via the admin post editor; re-upload under descriptive filenames rather than `ChatGPT_Image_Jul_10...`.

### 11. Resolve the GA4 / GTM overlap
GA4 loads via a hard-coded `gtag` block *and* a GTM container loads independently. If a GA4 tag for the same measurement id is ever added inside GTM, every pageview double-counts. Keep GA4 in exactly one place.

### 12. Add `sameAs` to Organization and blog author
No off-domain corroboration that the brand exists. Add `sameAs` arrays pointing at real, controlled profiles — only ones that genuinely exist.

---

## Low

### 13. Collapse the two-hop apex redirect
`http://freetoolss.online` → 308 → `https://freetoolss.online/` → 308 → `https://www.freetoolss.online/`. Point the apex http listener straight at the final canonical.

### 14. Add speculation rules
`preload_check.py` scored 75/100, the deduction attributable to the missing `speculationrules` block. Add prefetch/prerender for the top category hubs and five most-used tools.

### 15. Add an image sitemap
Blog covers are CDN-hosted and undeclared in any sitemap, so they are ineligible for Google Images.

---

## Instrumentation — do this early, it is free

The audit had to infer several scores because no measurement is connected:

| Connect | Unlocks |
|---|---|
| **Google Search Console** | Indexation coverage, impressions, queries, actual CTR |
| **Bing Webmaster Tools** | Bing/Copilot indexation, free backlink data |
| **Google API key** (free) | PageSpeed Insights + CrUX field data — replaces the inferred Performance score with measured LCP/INP/CLS |

Save the API key to `~/.config/claude-seo/google-api.json`, then `/seo google` and `/seo audit` return measured rather than inferred results.

Once GSC is connected, capture a drift baseline (`/seo drift baseline <url>`) and compare monthly.

---

## Deliberately not recommended

- **`aggregateRating` markup** — do not add ratings that no real users gave. Google strips unverifiable review markup and it carries manual-action risk.
- **Indexing the remaining 185 templated pages** — the existing decision to `noindex` them and keep the sitemap at 79 distinct URLs is correct for a domain with no crawl authority. Do not reverse it.
- **Removing ads to chase Core Web Vitals** — ads are the business model, they are already kept below the fold on mobile, and no field data yet shows they are causing a CWV failure. Measure first.
