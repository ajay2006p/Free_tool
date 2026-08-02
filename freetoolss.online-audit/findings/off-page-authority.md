# Off-Page / Authority — 20/100

## What works

- Clean, keyword-relevant domain
- No toxic or spammy link patterns detected

## Findings

### Domain absent from the Common Crawl web graph

**Severity:** Critical

commoncrawl_graph.py against release cc-main-2026-jan-feb-mar returned in_crawl: false, in_rankings: false, with null pagerank and null harmonic centrality. The domain has no measurable inbound link profile. On-page work cannot overcome zero authority for competitive utility keywords, where incumbents hold very large link profiles.

**Recommendation:** This is the binding constraint. Pursue genuine link acquisition: submit the tools to developer directories and awesome-lists, publish the blog content where the audience already is, and earn mentions through the free-and-private positioning. Treat this as the primary workstream for the next quarter.

### No backlink or Search Console data connected

**Severity:** Info

Moz and Bing Webmaster API keys are unconfigured, and no Google Search Console OAuth token or service account is present, so indexation coverage, impressions and query data are all unavailable.

**Recommendation:** Connect Search Console and Bing Webmaster Tools. Both are free and would replace several inferred findings in this report with measured data.

