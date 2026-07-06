import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, visibleCategories, toolIcon } from "../../../lib/catalog";
import { getTool } from "../../../lib/toolRegistry";
import { conversionsBySlug } from "../../../lib/conversions";
import { UnitConvert } from "../../../components/tools/UnitConvert";
import { site } from "../../../lib/site";
import AdSlot from "../../../components/AdSlot";

export function generateStaticParams() {
  const params = [];
  for (const c of visibleCategories) {
    for (const s of c.services) params.push({ category: c.slug, tool: s.slug });
  }
  return params;
}

export function generateMetadata({ params }) {
  const found = getService(params.category, params.tool);
  if (!found) return { title: "Not found" };
  const { category, service } = found;
  const title = `${service.name} — free online ${service.name.toLowerCase()}`;
  return {
    title,
    description: `${service.desc} Free ${service.name} on ${site.name} — fast, private and no signup.`,
    alternates: { canonical: `${site.url}/${category.slug}/${service.slug}` },
    openGraph: { title, description: service.desc, type: "website" },
  };
}

export default function ServicePage({ params }) {
  const found = getService(params.category, params.tool);
  if (!found) notFound();
  const { category, service } = found;
  const Tool = getTool(category.slug, service.slug);
  const convertCfg = category.slug === "convert" ? conversionsBySlug[service.slug] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": Tool || convertCfg ? "SoftwareApplication" : "WebPage",
    name: service.name,
    description: service.desc,
    applicationCategory: "DeveloperApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: `${site.url}/${category.slug}/${service.slug}`,
  };

  return (
    <div className="container section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="crumbs">
        <Link href="/">Home</Link> / <Link href={`/${category.slug}`}>{category.name}</Link> / {service.name}
      </div>

      <div>
        <h1 style={{ fontSize: 34, margin: 0 }}>{service.name}</h1>
        <p className="muted" style={{ fontFamily: "var(--sans)", margin: "6px 0 0" }}>{service.desc}</p>
      </div>

      <AdSlot label="Banner" />

      {Tool ? (
        <div className="sheet" style={{ padding: 24 }}>
          <Tool />
        </div>
      ) : convertCfg ? (
        <div className="sheet" style={{ padding: 24 }}>
          <UnitConvert cfg={convertCfg} />
        </div>
      ) : (
        <div className="sheet center" style={{ padding: 40 }}>
          <p className="muted" style={{ fontFamily: "var(--sans)" }}>This tool isn't available.</p>
          <Link href="/services" className="btn">Browse all tools →</Link>
        </div>
      )}

      {/* Related in the same category */}
      <section className="section">
        <div className="cat-row"><h2 style={{ fontSize: 20 }}>More {category.name}</h2></div>
        <div className="tool-grid">
          {category.services.filter((s) => s.slug !== service.slug).slice(0, 8).map((s) => (
            <Link key={s.slug} href={`/${category.slug}/${s.slug}`} className="tool-card">
              <span className="tc-icon">{toolIcon(s.slug, category.icon)}</span>
              <span className="tc-body">
                <span className="tool-name">{s.name}</span>
                <span className="tool-desc">{s.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <AdSlot label="Footer banner" />
    </div>
  );
}
