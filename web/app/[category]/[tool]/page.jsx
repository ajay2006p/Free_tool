import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, visibleCategories, toolIcon } from "../../../lib/catalog";
import { getTool } from "../../../lib/toolRegistry";
import { conversionsBySlug } from "../../../lib/conversions";
import { UnitConvert } from "../../../components/tools/UnitConvert";
import { getToolContent } from "../../../lib/toolContent";
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
  const { title, description } = getToolContent(category, service);
  return {
    title,
    description,
    alternates: { canonical: `${site.url}/${category.slug}/${service.slug}` },
    openGraph: { title, description, type: "website", url: `${site.url}/${category.slug}/${service.slug}` },
  };
}

export default function ServicePage({ params }) {
  const found = getService(params.category, params.tool);
  if (!found) notFound();
  const { category, service } = found;
  const Tool = getTool(category.slug, service.slug);
  const convertCfg = category.slug === "convert" ? conversionsBySlug[service.slug] : null;
  const content = getToolContent(category, service);

  const isApp = Boolean(Tool || convertCfg);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": isApp ? "WebApplication" : "WebPage",
    name: service.name,
    description: service.desc,
    url: `${site.url}/${category.slug}/${service.slug}`,
    ...(isApp
      ? {
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any (web browser)",
          browserRequirements: "Requires JavaScript. Runs in any modern browser.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          isAccessibleForFree: true,
          publisher: { "@type": "Organization", name: site.name, url: site.url },
        }
      : {}),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="container section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="crumbs">
        <Link href="/">Home</Link> / <Link href={`/${category.slug}`}>{category.name}</Link> / {service.name}
      </div>

      <div>
        <h1 style={{ fontSize: 34, margin: 0 }}>{service.name}</h1>
        <p className="muted" style={{ fontFamily: "var(--sans)", margin: "6px 0 0" }}>
          {service.desc}
        </p>
      </div>

      <AdSlot label="Banner" />

      {Tool ? (
        <div className="sheet" style={{ padding: "clamp(14px, 4vw, 24px)" }}>
          <Tool />
        </div>
      ) : convertCfg ? (
        <div className="sheet" style={{ padding: "clamp(14px, 4vw, 24px)" }}>
          <UnitConvert cfg={convertCfg} />
        </div>
      ) : (
        <div className="sheet center" style={{ padding: "clamp(20px, 6vw, 40px)" }}>
          <p className="muted" style={{ fontFamily: "var(--sans)" }}>
            This tool isn't available.
          </p>
          <Link href="/services" className="btn">
            Browse all tools →
          </Link>
        </div>
      )}

      {/* High-viewability in-content ad: appears after the user has used the
          tool, with article content directly below it. Best earning + least
          intrusive spot on the page. */}
      <AdSlot label="In-article" variant="in-article" />

      <section className="tool-seo">
        <div className="seo-about">
          <h2>About {service.name}</h2>
          {content.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="seo-how">
          <h2>How to use {service.name}</h2>
          <ol className="howto">
            {content.howto.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="seo-faq">
          <h2>Frequently asked questions</h2>
          <div className="faq-list">
            {content.faqs.map((f, i) => (
              <details key={i} className="faq-item" open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="cat-row">
          <h2 style={{ fontSize: 20 }}>More {category.name}</h2>
        </div>
        <div className="tool-grid">
          {category.services
            .filter((s) => s.slug !== service.slug)
            .slice(0, 8)
            .map((s) => (
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
