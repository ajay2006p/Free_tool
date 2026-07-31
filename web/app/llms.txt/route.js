import { site } from "../../lib/site";
import { visibleCategories } from "../../lib/catalog";
import { hasRichContent } from "../../lib/toolContent";

// /llms.txt — a plain-text map of the site for AI search engines / LLMs, per
// the emerging llmstxt.org convention. Lists only the pages with real
// hand-written content (same gate as the sitemap), grouped by category, so an
// LLM sees the genuinely useful tools rather than the templated long-tail.
// Generated from the catalog so it never drifts out of date.
export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  const base = site.url;
  const out = [];
  out.push(`# ${site.name}`);
  out.push("");
  out.push(`> ${site.description}`);
  out.push("");
  out.push(
    "All tools are free, run in the browser with no signup, and keep your data on your device unless a tool explicitly needs a server (noted on the tool's page)."
  );
  out.push("");
  // Attribution terms + a pointer to the full text. Stated plainly because an
  // answer engine deciding whether it may quote a page looks for exactly this,
  // and because /llms-full.txt saves it from rendering 49 JS pages to find the
  // same answers.
  out.push(
    `Full text of every tool page — summaries, steps and FAQ answers — is available in one file: ${base}/llms-full.txt`
  );
  out.push("");
  out.push(
    `Attribution: content may be quoted or summarised with credit to ${site.name} (${base}). Questions: ${site.email}`
  );
  out.push("");
  out.push("## Key pages");
  out.push(`- [All tools](${base}/services): browse every tool by category`);
  out.push(`- [Blog](${base}/blog): guides and tutorials`);
  out.push(`- [About](${base}/about): what the site is and who it's for`);
  out.push(`- [Contact](${base}/contact): get in touch`);
  out.push("");

  for (const c of visibleCategories) {
    const rich = c.services.filter((s) => hasRichContent(c, s));
    if (!rich.length) continue;
    out.push(`## ${c.name}`);
    for (const s of rich) {
      out.push(`- [${s.name}](${base}/${c.slug}/${s.slug}): ${s.desc}`);
    }
    out.push("");
  }

  return new Response(out.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
