import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, visibleCategories, toolIcon } from "../../lib/catalog";
import { site } from "../../lib/site";
import { graph, breadcrumbLd, itemListLd, faqLd, orgRef } from "../../lib/seo";
import { getCategoryContent } from "../../lib/categoryContent";
import AdSlot from "../../components/AdSlot";

export function generateStaticParams() {
  return visibleCategories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }) {
  const cat = getCategory(params.category);
  if (!cat) return { title: "Not found" };
  const title = `${cat.name} - free online ${cat.name.toLowerCase()}`;
  const description = `${cat.tagline} Free ${cat.name} on ${site.name} - no signup.`;
  const url = `${site.url}/${cat.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    // Both blocks are restated per page. Next.js merges `metadata` field by
    // field, so a page that sets only title/description still inherits the root
    // layout's `openGraph` and `twitter` verbatim — every category hub was
    // sharing as "FreeTool" with the generic sitewide blurb.
    openGraph: { title, description, type: "website", url, images: [{ url: "/og.png", width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  };
}

export default function CategoryPage({ params }) {
  const cat = getCategory(params.category);
  if (!cat) notFound();

  const content = getCategoryContent(cat.slug);

  // The ItemList is what makes this page useful to an answer engine: asked for
  // "free <category> tools", it can return the actual list with names, URLs and
  // one-liners instead of a single link to a hub it has to crawl first.
  const jsonLd = graph(
    {
      "@type": "CollectionPage",
      "@id": `${site.url}/${cat.slug}#page`,
      name: `${cat.name} — free online ${cat.name.toLowerCase()}`,
      description: cat.tagline,
      url: `${site.url}/${cat.slug}`,
      inLanguage: "en",
      isAccessibleForFree: true,
      publisher: orgRef,
      mainEntity: { "@id": `${site.url}/${cat.slug}#tools` },
    },
    {
      ...itemListLd(
        cat.services.map((s) => ({ name: s.name, desc: s.desc, path: `/${cat.slug}/${s.slug}` })),
        { name: `Free ${cat.name.toLowerCase()}` }
      ),
      "@id": `${site.url}/${cat.slug}#tools`,
    },
    faqLd(content?.faqs),
    breadcrumbLd([
      ["Home", "/"],
      ["Tools", "/services"],
      [cat.name],
    ])
  );

  return (
    <div className="container section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="crumbs">
        <Link href="/">Home</Link> / <Link href="/services">Tools</Link> / {cat.name}
      </div>

      <div className="cat-head">
        <span className="big-ic" style={{ fontSize: 48 }}>
          {cat.icon}
        </span>
        <div>
          <h1 style={{ margin: 0, fontSize: 34 }}>{cat.name}</h1>
          <p className="muted" style={{ fontFamily: "var(--sans)", margin: "4px 0 0" }}>
            {cat.tagline}
          </p>
        </div>
      </div>

      <AdSlot label="Banner" />

      <div className="tool-grid">
        {cat.services.map((s) => (
          <Link key={s.slug} href={`/${cat.slug}/${s.slug}`} className="tool-card">
            <span className="tc-icon">{toolIcon(s.slug, cat.icon)}</span>
            <span className="tc-body">
              <span className="tool-name">{s.name}</span>
              <span className="tool-desc">{s.desc}</span>
            </span>
          </Link>
        ))}
      </div>

      {/* Hand-written, category-specific copy. Without this the hub renders a
          tool grid and nothing else — roughly 250 words of visible text, nearly
          all of it shared header and footer chrome. */}
      {content ? (
        <section className="tool-seo">
          <div className="seo-about">
            <h2>About {cat.name.toLowerCase()}</h2>
            {content.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
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
      ) : null}

      <div className="center mt-4">
        <Link href="/services" className="btn btn-outline">
          ← All tools
        </Link>
      </div>
    </div>
  );
}
