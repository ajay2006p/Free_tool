/* ============================================================================
   Structured-data helpers, shared by every page.

   These exist for GEO (generative engine optimisation) as much as for classic
   SEO: answer engines — ChatGPT, Perplexity, Google AI Overviews, Claude —
   parse JSON-LD to decide what a page *is*, who stands behind it and whether
   it's free. Emitting one `@graph` per page with cross-linked @ids gives them
   an unambiguous entity map instead of several disconnected islands.
   ========================================================================== */

import { site } from "./site";

// Stable @ids so every node can reference the publisher instead of repeating it.
export const ORG_ID = `${site.url}/#organization`;
export const SITE_ID = `${site.url}/#website`;

/** Reference to the site-wide Organization defined in the root layout. */
export const orgRef = { "@id": ORG_ID };

/** Wrap nodes in a single @graph document — one <script> per page. */
export function graph(...nodes) {
  return { "@context": "https://schema.org", "@graph": nodes.filter(Boolean) };
}

/**
 * BreadcrumbList from [[label, path], …]. The last item is the current page and
 * carries no link, matching how the visible crumbs render.
 */
export function breadcrumbLd(trail) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      ...(path ? { item: `${site.url}${path}` } : {}),
    })),
  };
}

/** ItemList of tools/links — tells engines a hub page is a curated collection. */
export function itemListLd(items, { name } = {}) {
  return {
    "@type": "ItemList",
    ...(name ? { name } : {}),
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: `${site.url}${it.path}`,
      ...(it.desc ? { description: it.desc } : {}),
    })),
  };
}

/**
 * HowTo built from the plain-string steps already rendered on tool pages.
 * Answer engines lift these near-verbatim when asked "how do I …", so the step
 * text must stand on its own without the surrounding page.
 */
export function howToLd({ name, description, steps, url }) {
  return {
    "@type": "HowTo",
    name,
    description,
    ...(url ? { url } : {}),
    totalTime: "PT2M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
    step: steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: firstSentence(text),
      text,
      ...(url ? { url: `${url}#step-${i + 1}` } : {}),
    })),
  };
}

/** FAQPage — the single highest-value block for question-shaped AI queries. */
export function faqLd(faqs) {
  if (!faqs?.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// A step's first sentence, capped — used as the HowToStep `name`.
function firstSentence(s, max = 80) {
  const text = String(s || "").trim();
  const end = text.search(/[.!?](\s|$)/);
  const head = end > 0 ? text.slice(0, end) : text;
  return head.length <= max ? head : head.slice(0, max).replace(/\s+\S*$/, "") + "…";
}
