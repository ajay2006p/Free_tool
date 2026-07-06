"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { aliases, toolIcon } from "../lib/catalog";

// Searchable tool directory. Renders every category + its tools and filters
// them live. Aliases mean "cv" or "resume maker" also find the Resume Builder.
export default function ToolSearch({ categories, initialQuery = "" }) {
  const [q, setQ] = useState(initialQuery);
  const router = useRouter();
  const query = q.trim().toLowerCase();

  const match = (c, s) => {
    const hay = (s.name + " " + s.desc + " " + c.name + " " + (aliases[s.slug] || "")).toLowerCase();
    return !query || hay.includes(query);
  };

  const filtered = categories
    .map((c) => ({ ...c, services: c.services.filter((s) => match(c, s)) }))
    .filter((c) => c.services.length > 0);

  const total = filtered.reduce((n, c) => n + c.services.length, 0);
  const first = filtered[0]?.services[0];

  return (
    <div>
      <div className="searchbar">
        <span className="s-icon">🔍</span>
        <input
          className="s-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && first) router.push(`/${filtered[0].slug}/${first.slug}`); }}
          placeholder="Search tools — try “resume builder”, “json”, “bmi”…"
          aria-label="Search tools"
        />
        {q ? <button className="s-clear" onClick={() => setQ("")}>✕</button> : null}
      </div>

      {query ? <p className="muted center" style={{ fontSize: 14 }}>{total} tool{total === 1 ? "" : "s"} found{first ? " · press Enter to open the first" : ""}</p> : null}

      {filtered.length === 0 ? (
        <div className="sheet empty">No tools match “{q}”. Try another word.</div>
      ) : (
        filtered.map((c) => (
          <section key={c.slug} id={c.slug} style={{ marginBottom: 32 }}>
            <div className="cat-row">
              <h2><span>{c.icon}</span><Link href={`/${c.slug}`} style={{ color: "var(--text)" }}>{c.name}</Link></h2>
              <span className="muted" style={{ fontSize: 13 }}>{c.services.length} tools</span>
            </div>
            <div className="tool-grid">
              {c.services.map((s) => (
                <Link key={s.slug} href={`/${c.slug}/${s.slug}`} className="tool-card">
                  <span className="tc-icon">{toolIcon(s.slug, c.icon)}</span>
                  <span className="tc-body">
                    <span className="tool-name">{s.name}</span>
                    <span className="tool-desc">{s.desc}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
