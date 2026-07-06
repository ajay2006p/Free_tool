"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileMenu from "./ProfileMenu";

const NAV = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/analytics", label: "Analytics", icon: "📈" },
  { href: "/posts/new", label: "New Post", icon: "✍️" },
  { href: "/monetization", label: "Monetization", icon: "💰" },
];

const TITLES = {
  "/": "Dashboard",
  "/analytics": "Analytics",
  "/posts/new": "New Post",
  "/monetization": "Monetization",
};

export default function DashboardShell({ children }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const site = process.env.NEXT_PUBLIC_SITE_NAME || "DevHub";
  const website = process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000";

  const title =
    TITLES[path] ||
    (path.startsWith("/posts") ? "Posts" : path.startsWith("/analytics") ? "Analytics" : "Admin");

  const close = () => setOpen(false);

  return (
    <div className={"shell" + (open ? " open" : "")}>
      <aside className="sidebar">
        <Link href="/" className="s-brand" onClick={close}>
          <span className="s-logo">⚡</span>
          <span className="s-name">{site}<small>Control Center</small></span>
        </Link>

        <div className="s-section">Manage</div>
        <nav className="s-nav">
          {NAV.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} onClick={close} className={"s-link" + (active ? " active" : "")}>
                <span className="s-ico">{l.icon}</span>
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="s-section">Shortcuts</div>
        <nav className="s-nav">
          <a className="s-link" href={website} target="_blank" rel="noreferrer" onClick={close}>
            <span className="s-ico">🌐</span> View Website
          </a>
          <a className="s-link" href={website + "/blog"} target="_blank" rel="noreferrer" onClick={close}>
            <span className="s-ico">📰</span> Live Blog
          </a>
        </nav>

        <div className="s-ext s-foot">
          Signed in as <b>Admin</b><br />
          {site} · one dashboard for your whole site.
        </div>
      </aside>

      <div className="side-scrim" onClick={close} />

      <div className="main">
        <header className="topbar">
          <div className="inner">
            <button className="menu-btn" onClick={() => setOpen((o) => !o)} aria-label="Menu">☰</button>
            <span className="t-title">{title}</span>
            <span className="spacer" />
            <a className="t-view" href={website} target="_blank" rel="noreferrer">🌐 View site ↗</a>
            <ProfileMenu />
          </div>
        </header>
        <main className="page">{children}</main>
      </div>
    </div>
  );
}
