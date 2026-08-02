# Schema / Structured Data — 92/100

## What works

- Zero malformed JSON-LD blocks across all 79 pages; zero pages without structured data
- Organization emitted on all 79 pages with a stable @id every other node references via publisher
- WebApplication + HowTo + FAQPage on all 49 rich tool pages
- BreadcrumbList on 73 pages, BlogPosting on 12, ItemList on 13, CollectionPage on 12, WebSite on 1
- One cross-linked @graph per page rather than disconnected script islands
- HowToStep url anchors match real #step-N ids in the rendered DOM

## Findings

### No author entity or sameAs profiles

**Severity:** Medium

BlogPosting names an author as a Person but that Person has no sameAs profiles, and the Organization has no sameAs links to any social or third-party profile. Answer engines weight author and publisher identity when choosing between competing sources.

**Recommendation:** Add sameAs arrays to the Organization and to the blog author Person pointing at real, controlled profiles. Only list profiles that genuinely exist.

### No aggregateRating or usage signals on WebApplication nodes

**Severity:** Info

WebApplication nodes carry offers and featureList but no rating or interaction signals.

**Recommendation:** Only add aggregateRating if real user ratings are collected. Fabricated ratings are a manual-action risk and Google strips unverifiable review markup.

