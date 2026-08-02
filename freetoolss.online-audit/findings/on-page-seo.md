# On-Page SEO — 62/100

## What works

- Zero exactly-duplicated titles and zero exactly-duplicated descriptions across the 79 crawled pages
- og:image present on 79/79 pages
- One H1 per page throughout; heading hierarchy valid
- Blog excerpts are truncated at a word boundary near 155 chars rather than dumped whole into the description

## Findings

### Twitter/X share cards fall back to the sitewide default

**Severity:** High

61 of 79 pages emitted twitter:title 'FreeTool' and the generic sitewide description while og:title was page-specific. A further 13 category hubs set neither block and inherited both. Cause: Next.js merges metadata field by field, so a route that sets only openGraph inherits the root layout's twitter object verbatim.

**Recommendation:** Restate a twitter block in every generateMetadata that sets openGraph. APPLIED to app/[category]/[tool]/page.jsx, app/[category]/page.jsx and app/blog/[slug]/page.jsx; verified in the build output.

### Boilerplate titles and descriptions on 38 tool pages

**Severity:** High

38 of the 49 indexed tool overrides omitted title and description, so getToolContent fell back to a template. Nine pages shared the suffix 'Free Online Developer Tool', five 'Free Online Calculator', five 'Free Online Image Tool'. Every description ended with the identical clause 'free online - no signup, no install, works on any device.' Values were technically unique but formulaically near-identical.

**Recommendation:** Write unique keyword-first metadata per tool. APPLIED: 38 unique titles and descriptions added to lib/toolContent.js, all within length limits, verified in the build output.

### 18 titles exceed 62 characters

**Severity:** Medium

Titles including ai/ai-image-prompt (69), productivity/survey-maker (70), files/certificate-generator (66) and six blog posts (63-71) will be truncated in SERPs, cutting the differentiating end of the title.

**Recommendation:** Shorten to 60 characters or fewer including the ' · FreeTool' suffix, front-loading the primary keyword.

### 24 descriptions under 110 characters, 8 over 160

**Severity:** Low

Short descriptions (about 82, blog 75, career 75, converters 80, games 81) waste available SERP real estate; over-long ones (tools/link-in-bio 180, ai/ai-image-prompt 177) get truncated mid-sentence.

**Recommendation:** Rewrite outliers into the 140-158 character band.

