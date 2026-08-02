# Full SEO Audit — freetoolss.online

**Audited:** 2 August 2026
**Scope:** 79 indexed URLs crawled live from `sitemap.xml` (site builds 264 pages; 185 are deliberately `noindex`)
**Method:** `claude-seo` v2.2.4 — `fetch_page`, `parse_html`, `render_page`, `content_quality`, `preload_check`, `capture_screenshot`, `commoncrawl_graph`, plus live header and user-agent probes
**Business type:** Ad-supported free online tools / utility web app — Next.js App Router on Vercel behind Cloudflare

---

## SEO Health Score: 75 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 85 | 18.7 |
| Content Quality | 23% | 62 | 14.3 |
| On-Page SEO | 20% | 62 | 12.4 |
| Schema / Structured Data | 10% | 92 | 9.2 |
| Performance (CWV) | 10% | 75* | 7.5 |
| AI Search Readiness (GEO) | 10% | 88 | 8.8 |
| Images | 5% | 88 | 4.4 |
| **Total** | | | **75.3** |

\* Inferred from static analysis only — no field or lab data could be collected (see Performance).

Off-page authority is scored separately at **20/100** and sits outside the weighting model. It is the single largest constraint on this site.

**Projected score after deploying the two fixes applied in this session: 79/100.**

---

## Executive summary

The engineering quality of this site's SEO layer is genuinely high. Structured data is the standout: 79/79 pages carry valid, cross-linked JSON-LD in a single `@graph` per page, with a stable Organization `@id` that every other node references. There are zero malformed blocks, zero pages without schema, exactly one `<h1>` per page, and a canonical on every single URL. The sitemap has been deliberately trimmed from 264 built pages to 79 genuinely distinct ones to protect crawl budget on a young domain — that is a deliberate, correct decision that most sites get wrong.

The GEO layer is ahead of the curve: `llms.txt` plus a 112 KB `llms-full.txt`, both advertised in the head, 22 AI and search crawlers explicitly allowed in `robots.txt`, and an answer-first quick-answer block placed above every ad on every tool page. I verified live that GPTBot, ClaudeBot, PerplexityBot and CCBot all receive HTTP 200.

Three things hold it back.

**First, a real bug.** 74 of 79 pages served a Twitter/X share card titled simply "FreeTool" with the generic sitewide description. Next.js merges `metadata` field by field, so routes that set only `openGraph` silently inherited the root layout's `twitter` block wholesale — and category hubs, which set neither, inherited both. Every share of a tool page on X has been landing as an untitled generic card. Fixed and verified this session.

**Second, thin content.** 46 of 79 indexed pages are under 500 words, with a median of 481. The category hubs are the worst offenders — `career` at 49 words, `games` at 53, `converters` at 56 — and these are indexed pages one click from the homepage.

**Third, and most importantly: the domain has no authority.** `commoncrawl_graph.py` against the current release returns `in_crawl: false` with null pagerank and null harmonic centrality. There is no measurable inbound link profile at all. For competitive utility keywords — "json formatter", "password generator", "compress pdf" — the incumbents hold very large link profiles. **No amount of on-page work overcomes zero authority for those terms.** This should be read as the primary finding of the audit.

---

## What is already working

These are verified, not assumed:

- **Structured data** — 79/79 valid. Organization ×79, BreadcrumbList ×73, WebApplication ×49, HowTo ×49, FAQPage ×49, ItemList ×13, CollectionPage ×12, BlogPosting ×12, WebSite ×1. `HowToStep` anchors resolve to real `#step-N` ids in the DOM.
- **Crawlability** — canonical on 100% of pages, all self-referencing and absolute. One H1 per page, zero missing, zero duplicated. Unknown paths return a true 404.
- **No cloaking** — HTML served to a Googlebot UA is identical to the default UA. Fully server-rendered; nothing depends on client hydration.
- **AI crawler access** — verified 200 for GPTBot, ClaudeBot, PerplexityBot, CCBot.
- **Image handling** — `next/image` throughout with explicit dimensions. The 158 logo instances the parser flags as "missing alt" use `alt=""` with `aria-hidden="true"`, which is the *correct* treatment for a decorative mark beside a text wordmark. Not a defect.
- **Mobile above-fold** — clear H1, no interstitial, no ad above the fold.
- **Privacy positioning** — the "runs in your browser, nothing uploaded" claim is consistently stated and schema-backed via `isAccessibleForFree` and `offers`.

---

## Findings by category

### Technical SEO — 85/100

| Finding | Severity |
|---|---|
| Security headers largely absent — only HSTS is returned. No `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` or CSP. | Medium |
| `http://freetoolss.online` takes two 308 hops to reach `https://www.freetoolss.online/`. | Low |
| No `speculationrules` block. `preload_check.py` scored the homepage 75/100; preload hints and LCP `fetchpriority` are otherwise correct. | Low |

### Content Quality — 62/100

| Finding | Severity |
|---|---|
| Category hubs are extremely thin: career 49, games 53, converters 56, social 92, files 101, ai 104, image 119, text 120, calculators 123, productivity 126 words. | High |
| 46/79 indexed pages under 500 words; median 481. Tool pages run 352–480. | High |
| Only 4 external links exist sitewide; 78/79 pages have zero outbound citations. | Medium |
| Every blog post has exactly 1 inbound internal link, arriving solely from `/blog`. | Medium |

`content_quality.py` scored sampled tool pages **77/100** — zero filler, zero AI-pattern flags, flagged only as "repetitive" (partly an artefact of scoring raw HTML).

### On-Page SEO — 62/100

| Finding | Severity |
|---|---|
| **Twitter/X cards fell back to the sitewide default on 74/79 pages.** 61 pages had page-specific `og:title` but generic `twitter:title`; 13 category hubs inherited both. **FIXED.** | High |
| Boilerplate metadata on 38/49 tool pages — 9 shared the suffix "Free Online Developer Tool", every description ended with the identical clause. Technically unique, formulaically near-identical. **FIXED.** | High |
| 18 titles exceed 62 characters and will truncate in SERPs. | Medium |
| 24 descriptions under 110 characters; 8 over 160. | Low |

Note: zero *exactly* duplicated titles or descriptions were found. The boilerplate problem was near-duplication through templating, not literal duplication.

### Schema — 92/100

| Finding | Severity |
|---|---|
| No `sameAs` on Organization, and the blog author Person has no profile links. No off-domain corroboration the brand exists. | Medium |
| No `aggregateRating` on WebApplication nodes. Only add this if real ratings are collected — fabricated review markup is a manual-action risk. | Info |

### Performance — 75/100 (low confidence)

| Finding | Severity |
|---|---|
| **No field or lab data collected.** PSI returned "rate limit exceeded" on the unkeyed shared quota; no `GOOGLE_API_KEY` is configured so CrUX is also unavailable. This score is inferred from static analysis. | Info |
| AdSense + GA4 gtag + a GTM container all load on every page. GTM and the hard-coded gtag are independent — a GA4 tag inside GTM for the same measurement id would double-count. | Medium |
| No speculation rules. | Low |

Verified good: LCP image preloaded with `fetchpriority=high`, no bfcache killers (`no-store`/`unload`/`beforeunload` all absent), zero deprecated prerender, resource hints open connections to AdSense/GTM/both image CDNs ahead of parse.

### AI Search Readiness (GEO) — 88/100

The strongest area relative to typical sites. `llms.txt` + 112 KB `llms-full.txt`, both `<link rel=alternate>` advertised; quick-answer blocks with machine-readable label/value facts placed above all ads; FAQPage on 49 pages; explicit attribution and contact in `llms.txt`.

| Finding | Severity |
|---|---|
| No outbound citations — pages assert claims without sourcing them. Answer engines preferentially cite pages that themselves cite primary sources. | Medium |
| No brand entity corroboration: no `sameAs`, no third-party mentions in the Common Crawl graph. | Medium |

### Images — 88/100

| Finding | Severity |
|---|---|
| 2 blog cover images have empty alt, both ImageKit-hosted. Filenames are raw generator output (`ChatGPT_Image_Jul_10...`). | Medium |
| No image sitemap for blog covers. | Low |

### Off-Page / Authority — 20/100

| Finding | Severity |
|---|---|
| **Domain absent from the Common Crawl web graph** (`cc-main-2026-jan-feb-mar`): `in_crawl: false`, `in_rankings: false`, null pagerank, null harmonic centrality. No measurable inbound links. | **Critical** |
| No Moz, Bing Webmaster or Google Search Console data connected — indexation, impressions and query data all unavailable. | Info |

---

## Changes applied this session

Two fixes were implemented, built and verified against the build output:

1. **Twitter card metadata** — `twitter` blocks added to `generateMetadata` in [app/[category]/[tool]/page.jsx](../web/app/%5Bcategory%5D/%5Btool%5D/page.jsx), [app/[category]/page.jsx](../web/app/%5Bcategory%5D/page.jsx) and [app/blog/[slug]/page.jsx](../web/app/blog/%5Bslug%5D/page.jsx). Verified: `twitter:title` now reads "JSON Formatter — Beautify, Minify & Validate" on the tool page and "Developer Tools - free online developer tools" on the hub.

2. **Unique tool metadata** — 38 unique titles and descriptions added to [lib/toolContent.js](../web/lib/toolContent.js), all within length limits. Verified: 264 unique titles across 264 built pages, zero duplicates.

`npm run build` exits 0. Changes are uncommitted and **not yet deployed** — the live site still serves the old metadata.

---

## Data limitations

Stated plainly so the scores are not over-read:

- **No Core Web Vitals data.** PSI quota exhausted, no API key. The Performance score is inferred.
- **No Search Console or GA4.** No indexation coverage, impressions, click or query data.
- **No commercial backlink data.** Moz and Bing keys unconfigured; Common Crawl alone confirms the domain is absent from the graph but cannot enumerate what few links may exist.
- **Crawl reflects production**, which predates this session's fixes.
- **PDF export unavailable** — `google_report.py` requires WeasyPrint, which needs native GTK/Pango libraries not installed on this Windows machine.
