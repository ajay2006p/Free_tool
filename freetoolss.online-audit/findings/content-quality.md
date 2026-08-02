# Content Quality — 62/100

## What works

- Every tool page opens with an answer-first quick-answer block above all ads
- Hand-written intro, how-to steps and FAQs exist for 49 tools
- Template-generated pages are correctly marked noindex and excluded from the sitemap rather than padding the index
- content_quality.py scored sampled tool pages 77/100 with zero filler and zero AI-pattern flags

## Findings

### Category hub pages are extremely thin

**Severity:** High

Word counts: career 49, games 53, converters 56, social 92, files 101, ai 104, image 119, text 120, calculators 123, productivity 126. These hubs are indexed and sit one click from the homepage but carry almost no unique text.

**Recommendation:** Add 200-300 words of genuinely category-specific copy per hub: what the category covers, who uses it, how to choose between the tools listed, and 2-3 category-level FAQs.

### 46 of 79 indexed pages are under 500 words

**Severity:** High

Median word count across the indexed set is 481. Tool pages run 352-480 words, which is thin against competitors ranking for the same utility queries.

**Recommendation:** Prioritise depth on the 10-15 highest-intent tools: add worked examples, edge cases, format explanations and comparison notes. Depth on a few pages beats a thin uplift everywhere.

### Almost no outbound citations sitewide

**Severity:** Medium

Only 4 external links exist across all 79 indexed pages; 78 of 79 pages have zero. Outbound citation to authoritative sources is a documented E-E-A-T signal and materially affects whether answer engines treat a page as sourced.

**Recommendation:** Add 1-2 authoritative citations per technical tool page - RFC 8259 on the JSON pages, OWASP password guidance on the password tools, the WCAG contrast spec on the contrast checker.

### Blog posts receive only one inbound internal link each

**Severity:** Medium

Every blog post has exactly 1 inbound internal link within the crawled set, arriving solely from the /blog index. No tool page links to a related post and no post links to another post.

**Recommendation:** Add a contextual 'related reading' link from each tool page to a relevant post, and cross-link posts to each other and to the tools they discuss.

