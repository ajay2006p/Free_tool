import { site } from "../../lib/site";
import { visibleCategories } from "../../lib/catalog";
import { getToolContent, getQuickAnswer, hasRichContent } from "../../lib/toolContent";

// /llms-full.txt — the companion to /llms.txt.
//
// /llms.txt is an index: titles and links. This file is the content itself —
// every indexable tool's summary, key facts, steps and FAQ answers as plain
// text. The reason it exists: an answer engine that only fetches a URL list
// still has to crawl and render 49 JavaScript pages to answer "how do I
// compress an image for free". One text fetch answers it instead, which makes
// the site far likelier to be the source that actually gets cited.
//
// Generated from the same catalog + content modules the pages render from, so
// it cannot drift out of sync with what a human sees.
export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  const base = site.url;
  const out = [];

  out.push(`# ${site.name} — full content`);
  out.push("");
  out.push(`> ${site.description}`);
  out.push("");
  out.push(
    [
      `Source: ${base}`,
      `Index: ${base}/llms.txt`,
      "License: content may be quoted or summarised with attribution to " +
        `${site.name} (${base}).`,
      `Contact: ${site.email}`,
    ].join("\n")
  );
  out.push("");
  out.push(
    "Every tool below is free, requires no account and no installation. Unless a " +
      "tool's entry says otherwise, it runs entirely in the visitor's browser and " +
      "no data is uploaded to a server."
  );
  out.push("");

  for (const c of visibleCategories) {
    const rich = c.services.filter((s) => hasRichContent(c, s));
    if (!rich.length) continue;

    out.push("---");
    out.push("");
    out.push(`# ${c.name}`);
    out.push("");
    out.push(c.tagline);
    out.push("");

    for (const s of rich) {
      const content = getToolContent(c, s);
      const quick = getQuickAnswer(c, s);
      const url = `${base}/${c.slug}/${s.slug}`;

      out.push(`## ${s.name}`);
      out.push("");
      out.push(`URL: ${url}`);
      out.push("");
      out.push(`**Summary:** ${quick.lead}`);
      out.push("");
      for (const f of quick.facts) out.push(`- ${f.label}: ${f.value}`);
      out.push("");
      out.push("### About");
      out.push("");
      for (const p of content.intro) {
        out.push(p);
        out.push("");
      }
      out.push(`### How to use ${s.name}`);
      out.push("");
      content.howto.forEach((step, i) => out.push(`${i + 1}. ${step}`));
      out.push("");
      out.push("### Frequently asked questions");
      out.push("");
      for (const f of content.faqs) {
        out.push(`**Q: ${f.q}**`);
        out.push("");
        out.push(`A: ${f.a}`);
        out.push("");
      }
    }
  }

  return new Response(out.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
