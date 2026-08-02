# Images — 88/100

## What works

- Only 2 genuinely missing alt attributes across 198 images crawled
- The 158 header/footer logo instances flagged by the parser use alt="" with aria-hidden="true", which is the correct treatment for a decorative mark beside a text wordmark - not a defect
- next/image used throughout with explicit dimensions and correct lazy/priority split
- og.png present and resolving on every page (127 KB, 1200x630)

## Findings

### Two blog cover images have no alt text

**Severity:** Medium

The ImageKit-hosted covers on /blog/100-free-tool-website-use-100-online-tools-without-paying and /blog/tech-trends-worth-attention-2026 render with an empty alt attribute. Their filenames are also raw generator output ('ChatGPT_Image_Jul_10...').

**Recommendation:** Add descriptive alt text via the admin panel's post editor and re-upload the assets under descriptive filenames.

### No image sitemap

**Severity:** Low

Blog cover images are hosted on an external CDN and are not declared in any sitemap.

**Recommendation:** Add image entries to the blog portion of the sitemap so covers become eligible for Google Images.

