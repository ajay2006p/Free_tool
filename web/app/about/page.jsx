import Link from "next/link";
import { site } from "../../lib/site";
import { visibleCategories, countTotal } from "../../lib/catalog";

export const metadata = {
  title: "About",
  description: `About ${site.name} — ${countTotal()} free online tools for developers, students and professionals.`,
};

export default function AboutPage() {
  return (
    <div className="container container-narrow article">
      <h1>About {site.name}</h1>
      <p className="lead" style={{ color: "var(--ink-soft)" }}>
        {site.name} is a growing collection of {countTotal()} free online tools — no signup, no limits, all running in your browser.
      </p>
      <div className="prose">
        <p>Instead of hopping between a dozen websites, you get formatters, converters, calculators, SEO helpers and productivity apps in one clean place. Most tools never send your data anywhere — everything happens on your device.</p>
        <h2>Categories</h2>
        <ul>
          {visibleCategories.map((c) => (
            <li key={c.slug}>{c.icon} <strong><Link href={`/${c.slug}`}>{c.name}</Link></strong> — {c.tagline}</li>
          ))}
        </ul>
      </div>
      <div className="center mt-4"><Link href="/services" className="btn">Browse all tools →</Link></div>
    </div>
  );
}
