# Technical SEO — 85/100

## What works

- robots.txt explicitly allows 22 named AI and search crawlers, with /admin, /account, /api, /f/, /p/ disallowed
- Canonical present on 100% of crawled pages (79/79), all self-referencing and absolute
- Exactly one H1 on every crawled page - zero missing, zero duplicated
- Server-rendered HTML delivered to Googlebot UA identical to default UA - no cloaking, no SPA shell dependency
- 404 for unknown paths returns a true 404 status, not a soft 200
- HSTS set with max-age=63072000; HTTPS enforced
- Sitemap deliberately trimmed to 79 genuinely distinct URLs out of 264 built pages to protect crawl budget on a new domain

## Findings

### Security headers largely absent

**Severity:** Medium

Only strict-transport-security is returned. X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy and Content-Security-Policy are all missing on the document response.

**Recommendation:** Add a headers() block in next.config.mjs setting X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, and a Permissions-Policy. Introduce CSP in report-only mode first, since AdSense and GTM need allowances.

### Two-hop redirect from http://freetoolss.online

**Severity:** Low

http://freetoolss.online returns 308 to https://freetoolss.online/, which returns a second 308 to https://www.freetoolss.online/. Each hop costs crawl budget and a round trip.

**Recommendation:** Configure the apex http listener to redirect straight to https://www.freetoolss.online/ in one hop.

### No speculation rules for next-navigation

**Severity:** Low

preload_check.py scored the homepage 75/100. Preload hints and LCP fetchpriority are correctly set, but no <script type="speculationrules"> block exists.

**Recommendation:** Add speculation rules prefetching the top category hubs and the five most-used tools to remove next-navigation paint cost.

