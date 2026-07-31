import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, visibleCategories, toolIcon } from "../../../lib/catalog";
import { hasTool } from "../../../lib/toolKeys";
import ToolMount from "../../../components/ToolMount";
import { conversionsBySlug } from "../../../lib/conversions";
import { UnitConvert } from "../../../components/tools/UnitConvert";
import { getToolContent, getQuickAnswer, hasRichContent } from "../../../lib/toolContent";
import { site } from "../../../lib/site";
import { graph, breadcrumbLd, howToLd, faqLd, orgRef } from "../../../lib/seo";
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
  // Template-generated pages are kept out of the index (see hasRichContent).
  // `follow` stays on so these pages still pass links through to the tools and
  // categories that are indexed — they are low-value to rank, not to crawl.
  const rich = hasRichContent(category, service);
  return {
    title,
    description,
    alternates: { canonical: `${site.url}/${category.slug}/${service.slug}` },
    openGraph: { title, description, type: "website", url: `${site.url}/${category.slug}/${service.slug}`, images: [{ url: "/og.png", width: 1200, height: 630 }] },
    robots: rich ? undefined : { index: false, follow: true },
  };
}

export default function ServicePage({ params }) {
  const found = getService(params.category, params.tool);
  if (!found) notFound();
  const { category, service } = found;
  const toolKey = `${category.slug}/${service.slug}`;
  const hasWidget = hasTool(category.slug, service.slug);
  const convertCfg = category.slug === "convert" ? conversionsBySlug[service.slug] : null;
  const content = getToolContent(category, service);
  const quick = getQuickAnswer(category, service);
  const url = `${site.url}/${category.slug}/${service.slug}`;

  const isApp = Boolean(hasWidget || convertCfg);
  // One @graph rather than several loose <script> blocks: the app/page, the
  // steps, the FAQ and the breadcrumb trail all describe the same thing, and
  // answer engines resolve them far more reliably when they're linked.
  const jsonLd = graph(
    {
      "@type": isApp ? "WebApplication" : "WebPage",
      "@id": `${url}#tool`,
      name: service.name,
      // The quick-answer lead doubles as the machine-readable abstract, so the
      // passage an engine quotes is the passage a human sees at the top.
      description: quick.lead,
      abstract: service.desc,
      url,
      inLanguage: "en",
      isAccessibleForFree: true,
      publisher: orgRef,
      ...(isApp
        ? {
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any (web browser)",
            browserRequirements: "Requires JavaScript. Runs in any modern browser.",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            featureList: content.howto,
          }
        : {}),
    },
    howToLd({
      name: `How to use ${service.name}`,
      description: content.description,
      steps: content.howto,
      url,
    }),
    faqLd(content.faqs),
    breadcrumbLd([
      ["Home", "/"],
      [category.name, `/${category.slug}`],
      [service.name],
    ])
  );

  return (
    <div className="container section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="crumbs">
        <Link href="/">Home</Link> / <Link href={`/${category.slug}`}>{category.name}</Link> / {service.name}
      </div>

      <div>
        <h1 style={{ fontSize: 34, margin: 0 }}>{service.name}</h1>
        <p className="muted" style={{ fontFamily: "var(--sans)", margin: "6px 0 0" }}>
          {service.desc}
        </p>
      </div>

      {/* Answer-first summary. Deliberately the first content after the <h1>
          and above every ad: an AI crawler that reads only the top of the page
          should still come away with a complete, quotable answer — what this
          is, what it costs, whether it needs an account and where data goes. */}
      <section className="quick-answer" aria-labelledby="quick-answer-h">
        <h2 id="quick-answer-h" className="qa-title">
          {service.name} at a glance
        </h2>
        <p className="qa-lead">{quick.lead}</p>
        <dl className="qa-facts">
          {quick.facts.map((f) => (
            <div key={f.label} className="qa-fact">
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <AdSlot label="Banner" />

      {hasWidget ? (
        <div className="sheet" style={{ padding: "clamp(14px, 4vw, 24px)" }}>
          <ToolMount toolKey={toolKey} />
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
          {/* Ids match the HowToStep `url` anchors emitted in the JSON-LD, so a
              cited step links to the exact step rather than the page top. */}
          <ol className="howto">
            {content.howto.map((step, i) => (
              <li key={i} id={`step-${i + 1}`}>
                {step}
              </li>
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
