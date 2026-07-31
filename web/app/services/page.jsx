import { visibleCategories, countTotal } from "../../lib/catalog";
import { site } from "../../lib/site";
import { graph, breadcrumbLd, itemListLd, orgRef } from "../../lib/seo";
import AdSlot from "../../components/AdSlot";
import ToolSearch from "../../components/ToolSearch";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Tools",
  description:
    "Every free tool on the platform - formatters, converters, calculators, SEO, social media and productivity apps.",
  alternates: { canonical: `${site.url}/services` },
};

export default function ServicesHub({ searchParams }) {
  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  // Categories rather than all ~250 tools: this page is the map, and each
  // category hub already carries the full ItemList for its own tools. Keeps the
  // payload small and gives engines a clean two-level structure to follow.
  const jsonLd = graph(
    {
      "@type": "CollectionPage",
      "@id": `${site.url}/services#page`,
      name: `All ${countTotal()} free online tools`,
      description:
        "Every free tool on the platform - formatters, converters, calculators, SEO, social media and productivity apps.",
      url: `${site.url}/services`,
      inLanguage: "en",
      isAccessibleForFree: true,
      publisher: orgRef,
      mainEntity: { "@id": `${site.url}/services#categories` },
    },
    {
      ...itemListLd(
        visibleCategories.map((c) => ({ name: c.name, desc: c.tagline, path: `/${c.slug}` })),
        { name: "Tool categories" }
      ),
      "@id": `${site.url}/services#categories`,
    },
    breadcrumbLd([["Home", "/"], ["All tools"]])
  );

  return (
    <div className="container section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="center" style={{ marginBottom: 22 }}>
        <span className="kicker">Everything, free</span>
        <h1 style={{ fontSize: 34, margin: "8px 0 4px" }}>All {countTotal()} tools</h1>
        <p className="muted">Search or browse by category - no signup, runs in your browser.</p>
      </div>
      <ToolSearch categories={visibleCategories} initialQuery={q} />
      <AdSlot label="Banner" />
    </div>
  );
}
