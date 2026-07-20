import { prisma } from "../lib/db";
import { site } from "../lib/site";
import { visibleCategories } from "../lib/catalog";
import { hasRichContent } from "../lib/toolContent";

export const dynamic = "force-dynamic";

/* Only pages with hand-written content are submitted.
 *
 * Submitting all 256 URLs — 100 templated conversion pages plus ~107 tool
 * pages whose copy came from the generic generator — spread a new domain's
 * small crawl budget across near-duplicates. Google crawled a sample, indexed
 * almost none of it, and throttled crawling of the rest.
 *
 * A smaller sitemap of genuinely distinct pages is crawled sooner and judged
 * better. The excluded pages stay live and internally linked; they are just
 * not submitted, and `hasRichContent` marks them noindex to match. */
export default async function sitemap() {
  const base = site.url;
  const routes = [
    { url: `${base}`, priority: 1, changeFrequency: "daily" },
    { url: `${base}/services`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/blog`, priority: 0.8, changeFrequency: "daily" },
    { url: `${base}/about`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${base}/contact`, priority: 0.4, changeFrequency: "monthly" },
    { url: `${base}/privacy`, priority: 0.3, changeFrequency: "yearly" },
    { url: `${base}/terms`, priority: 0.3, changeFrequency: "yearly" },
  ];

  for (const c of visibleCategories) {
    const rich = c.services.filter((s) => hasRichContent(c, s));
    // A category hub is only worth submitting if it leads somewhere indexable.
    if (!rich.length) continue;
    routes.push({ url: `${base}/${c.slug}`, priority: 0.8, changeFrequency: "weekly" });
    for (const s of rich) {
      routes.push({ url: `${base}/${c.slug}/${s.slug}`, priority: 0.7, changeFrequency: "weekly" });
    }
  }

  try {
    const posts = await prisma.post.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } });
    for (const p of posts) {
      routes.push({ url: `${base}/blog/${p.slug}`, lastModified: p.updatedAt, priority: 0.6, changeFrequency: "monthly" });
    }
  } catch (e) {}

  return routes;
}
