import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, visibleCategories, toolIcon } from "../../lib/catalog";
import { site } from "../../lib/site";
import AdSlot from "../../components/AdSlot";

export function generateStaticParams() {
  return visibleCategories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }) {
  const cat = getCategory(params.category);
  if (!cat) return { title: "Not found" };
  return {
    title: `${cat.name} — free online ${cat.name.toLowerCase()}`,
    description: `${cat.tagline} Free ${cat.name} on ${site.name} — no signup.`,
    alternates: { canonical: `${site.url}/${cat.slug}` },
  };
}

export default function CategoryPage({ params }) {
  const cat = getCategory(params.category);
  if (!cat) notFound();

  const jsonLd = {
    "@context": "https://schema.org", "@type": "CollectionPage",
    name: cat.name, description: cat.tagline, url: `${site.url}/${cat.slug}`,
  };

  return (
    <div className="container section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="crumbs"><Link href="/">Home</Link> / <Link href="/services">Tools</Link> / {cat.name}</div>

      <div className="cat-head">
        <span className="big-ic" style={{ fontSize: 48 }}>{cat.icon}</span>
        <div>
          <h1 style={{ margin: 0, fontSize: 34 }}>{cat.name}</h1>
          <p className="muted" style={{ fontFamily: "var(--sans)", margin: "4px 0 0" }}>{cat.tagline}</p>
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

      <div className="center mt-4"><Link href="/services" className="btn btn-outline">← All tools</Link></div>
    </div>
  );
}
