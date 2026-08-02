# Performance (Core Web Vitals) — 75/100

## What works

- LCP image marked with fetchpriority=high and preloaded; 2 preload hints present
- No bfcache killers - no no-store, no unload, no beforeunload handlers
- Zero deprecated prerender directives
- Resource hints preconnect/dns-prefetch open connections to AdSense, GTM and both image CDNs ahead of parse
- next/image supplies explicit width and height, avoiding layout shift on the logo and blog covers
- No ad rendered above the fold on mobile

## Findings

### No field (CrUX) or lab (PSI) data could be collected

**Severity:** Info

pagespeed_check.py returned 'PSI rate limit exceeded' - the unkeyed shared quota is exhausted - and no GOOGLE_API_KEY is configured, so CrUX field data is also unavailable. This category score is inferred from static analysis only and carries low confidence.

**Recommendation:** Create a free Google API key, save it to ~/.config/claude-seo/google-api.json, then re-run PSI and CrUX to replace this inferred score with measured LCP, INP and CLS.

### No speculation rules

**Severity:** Low

preload_check.py scored 75/100, with the deduction attributable to the absent speculationrules block.

**Recommendation:** Add prefetch/prerender speculation rules for the top navigation paths.

### Third-party ad and tag scripts dominate the loading cost

**Severity:** Medium

AdSense, GA4 gtag and a GTM container all load on every page. GTM and the hard-coded gtag tag are independent, so a GA4 tag added inside GTM for the same measurement id would double-count.

**Recommendation:** Keep GA4 in exactly one place. Audit the GTM container for redundant tags and consider consolidating GA4 into GTM or removing GTM if it carries nothing else.

