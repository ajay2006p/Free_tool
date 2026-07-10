import Link from "next/link";
import { site } from "../lib/site";
import { visibleCategories } from "../lib/catalog";

export default function Footer() {
  const cols = visibleCategories.slice(0, 3);
  return (
    <footer className="site-footer">
      <div className="container inner">
        <div className="footer-col">
          <div className="brand" style={{ fontSize: 20 }}>
            {site.name}
            <span className="dot">.</span>
          </div>
          <p className="muted" style={{ marginTop: 8 }}>{site.tagline}.</p>
          <p className="muted" style={{ fontSize: 13 }}>
            Free, private, browser-based tools — no signup, nothing leaves your device.
          </p>
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
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/services">All tools</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <nav className="fb-links" aria-label="Footer">
          <Link href="/services">All services</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
        <p className="fb-copy">
          © 2026 {site.name}. Free tools, learning and career resources for builders.
        </p>
      </div>
    </footer>
  );
}
