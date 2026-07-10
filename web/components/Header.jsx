import Link from "next/link";
import { site } from "../lib/site";
import { visibleCategories, allTools } from "../lib/catalog";
import SearchBox from "./SearchBox";
import UserMenu from "./UserMenu";
import MobileNav from "./MobileNav";
import Logo from "./Logo";

const NAV = ["ai", "files", "convert", "calculators", "tools", "image"];

export default function Header() {
  const links = NAV.map((slug) => visibleCategories.find((c) => c.slug === slug)).filter(Boolean);
  return (
    <header className="site-header">
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="container inner">
        <Link href="/" className="brand" aria-label={`${site.name} home`}>
          <Logo size={30} />
          <span style={{ marginLeft: 9 }}>{site.name}<span className="dot">.</span></span>
        </Link>
        <SearchBox tools={allTools} placeholder="Search tools — try “resume builder”…" />
        <nav className="nav" aria-label="Primary">
          {links.map((c) => (
            <Link key={c.slug} href={`/${c.slug}`} className="desk">{c.name.replace(" Tools", "")}</Link>
          ))}
          <Link href="/scraper" className="desk">Scraper</Link>
          <Link href="/blog" className="desk">Blog</Link>
          <UserMenu />
          <MobileNav categories={visibleCategories} />
        </nav>
      </div>
    </header>
  );
}
