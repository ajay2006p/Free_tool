import Link from "next/link";
import { site } from "../lib/site";
import { visibleCategories } from "../lib/catalog";

export default function Footer() {
  const cols = visibleCategories.slice(0, 4);
  return (
    <footer className="site-footer">
      <div className="container inner">
        <div className="footer-col">
          <div className="brand" style={{ fontSize: 20 }}>
            {site.name}
            <span className="dot">.</span>
          </div>
          <p className="muted" style={{ marginTop: 8 }}>{site.tagline}.</p>
          <p className="muted" style={{ fontSize: 13 }}>Built on paper. 📄</p>
        </div>
        {cols.map((c) => (
          <div className="footer-col" key={c.slug}>
            <h4>{c.name}</h4>
            <ul>
              {c.services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link href={`/${c.slug}/${s.slug}`}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        © 2026 {site.name}. Free tools, learning and career resources for builders. ·{" "}
        <Link href="/services">All services</Link> · <Link href="/blog">Blog</Link> ·{" "}
        <Link href="/about">About</Link>
      </div>
    </footer>
  );
}
