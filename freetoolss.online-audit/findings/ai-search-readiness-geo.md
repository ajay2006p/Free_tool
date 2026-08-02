# AI Search Readiness (GEO) — 88/100

## What works

- GPTBot, ClaudeBot, PerplexityBot and CCBot all receive HTTP 200 on tool pages - verified by live UA request
- llms.txt index plus a 112 KB llms-full.txt carrying full tool copy, steps and FAQ answers
- Both files advertised via <link rel=alternate> in the document head
- Answer-first quick-answer block placed above every ad, with price, signup, where-it-runs and browser support as machine-readable label/value pairs
- FAQPage schema on 49 pages - the highest-value block for question-shaped AI queries
- Explicit attribution and contact line in llms.txt

## Findings

### No outbound citations to authoritative sources

**Severity:** Medium

With 4 external links sitewide, pages present claims without sourcing. Answer engines preferentially cite pages that themselves cite primary sources.

**Recommendation:** Add primary-source links to the specs and standards each tool implements.

### No brand entity corroboration

**Severity:** Medium

The Organization has no sameAs, and the domain has no third-party mentions detectable in the Common Crawl graph. There is no external corroboration that the brand exists.

**Recommendation:** Establish and link controlled profiles, then reference them via sameAs so the entity is verifiable off-domain.

