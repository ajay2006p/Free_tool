import { prisma } from "../lib/db";
import { site } from "../lib/site";
import { visibleCategories } from "../lib/catalog";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const base = site.url;
  const routes = [
    { url: `${base}`, priority: 1, changeFrequency: "daily" },
    { url: `${base}/services`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/blog`, priority: 0.8, changeFrequency: "daily" },
    { url: `${base}/about`, priority: 0.5, changeFrequency: "monthly" },
  ];

  for (const c of visibleCategories) {
    routes.push({ url: `${base}/${c.slug}`, priority: 0.8, changeFrequency: "weekly" });
    for (const s of c.services) {
      routes.push({ url: `${base}/${c.slug}/${s.slug}`, priority: s.live ? 0.7 : 0.4, changeFrequency: "weekly" });
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
