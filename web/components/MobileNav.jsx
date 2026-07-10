"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { site } from "../lib/site";

const EXTRA = [
  { href: "/services", icon: "🧰", label: "All tools" },
  { href: "/scraper", icon: "🔎", label: "Business Scraper" },
  { href: "/blog", icon: "📝", label: "Blog" },
  { href: "/about", icon: "💡", label: "About" },
  { href: "/contact", icon: "✉️", label: "Contact" },
];

/**
 * Full-height slide-in navigation for phones and small tablets.
 *
 * Replaces a <details> panel that couldn't scroll (14 categories + 5 links
 * overflowed the viewport) and stayed open across client-side navigations.
 *
 * The panel stays mounted so it can transition. It lives inside `.drawer-layer`,
 * a viewport-sized `overflow: hidden` box — without that clip, the closed panel
 * (translated 100% to the right) extends the document's scrollWidth and every
 * page picks up a phantom horizontal scroll. The layer's `visibility: hidden`
 * also keeps the links out of the tab order and a11y tree without `inert`.
 */
export default function MobileNav({ categories }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef(null);
  const closeRef = useRef(null);

  // A tapped link navigates client-side; the drawer must follow it closed.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    // Escape must hand focus back to the toggle, not drop it on <body>.
    const onKey = (e) => e.key === "Escape" && close({ restoreFocus: true });
    document.addEventListener("keydown", onKey);
    document.body.classList.add("drawer-open");
    // focus() is a no-op while the panel still computes to `visibility: hidden`,
    // which it does on the frame the `.open` class lands (the visibility
    // transition has not started yet). Wait two frames, past the flip.
    let raf2;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => closeRef.current?.focus());
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("drawer-open");
    };
  }, [open]);

  function close({ restoreFocus = false } = {}) {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="menu-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-drawer"
        onClick={() => setOpen((o) => !o)}
      >
        <span className={"burger" + (open ? " x" : "")} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </button>

      <div className={"drawer-layer" + (open ? " open" : "")}>
        <div className="drawer-scrim" onClick={() => close()} aria-hidden="true" />

        <nav id="mobile-drawer" className="drawer" aria-label="Main menu">
          <div className="drawer-head">
            <span className="brand" style={{ fontSize: 18 }}>
              <Logo size={26} />
              <span style={{ marginLeft: 8 }}>
                {site.name}
                <span className="dot">.</span>
              </span>
            </span>
            <button
              ref={closeRef}
              type="button"
              className="drawer-close"
              onClick={() => close({ restoreFocus: true })}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <div className="drawer-body">
            <p className="drawer-label">Categories</p>
            {categories.map((c) => (
              <Link key={c.slug} href={`/${c.slug}`} className="drawer-link">
                <span className="di" aria-hidden="true">{c.icon}</span>
                <span className="dn">
                  <span className="dn-name">{c.name}</span>
                  <span className="dn-sub">{c.services.length} tools</span>
                </span>
              </Link>
            ))}

            <p className="drawer-label">More</p>
            {EXTRA.map((l) => (
              <Link key={l.href} href={l.href} className="drawer-link">
                <span className="di" aria-hidden="true">{l.icon}</span>
                <span className="dn">
                  <span className="dn-name">{l.label}</span>
                </span>
              </Link>
            ))}

            <Link href="/account" className="btn drawer-cta">
              👤 Log in / Sign up
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
