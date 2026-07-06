"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Header autocomplete search. Typing filters all tools; Enter or click opens
// the matching tool page. Works from any page on the site.
export default function SearchBox({ tools, placeholder = "Search tools…" }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const router = useRouter();

  const query = q.trim().toLowerCase();
  const matches = query
    ? tools
        .map((t) => {
          const hay = (t.name + " " + t.desc + " " + t.categoryName + " " + t.kw).toLowerCase();
          const starts = t.name.toLowerCase().startsWith(query) ? 0 : 1;
          return hay.includes(query) ? { t, starts } : null;
        })
        .filter(Boolean)
        .sort((a, b) => a.starts - b.starts)
        .slice(0, 7)
        .map((x) => x.t)
    : [];

  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function go(href) { setOpen(false); setQ(""); router.push(href); }

  function onKey(e) {
    if (!matches.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % matches.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a - 1 + matches.length) % matches.length); }
    else if (e.key === "Enter") { e.preventDefault(); go(matches[Math.min(active, matches.length - 1)].href); }
    else if (e.key === "Escape") setOpen(false);
  }

  return (
    <div className="hsearch" ref={ref}>
      <span className="hs-ic">🔍</span>
      <input
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
        placeholder={placeholder}
        aria-label="Search tools"
      />
      {open && matches.length > 0 ? (
        <div className="hs-drop">
          {matches.map((t, i) => (
            <Link key={t.href} href={t.href} className={"hs-item" + (i === active ? " active" : "")}
              onClick={() => { setOpen(false); setQ(""); }} onMouseEnter={() => setActive(i)}>
              <span className="hi-ic">{t.icon}</span>
              <span className="hi-name">{t.name}</span>
              <span className="hi-cat">{t.categoryName}</span>
            </Link>
          ))}
        </div>
      ) : null}
      {open && query && matches.length === 0 ? (
        <div className="hs-drop"><div className="hs-item" style={{ color: "var(--muted)" }}>No tools match “{q}”.</div></div>
      ) : null}
    </div>
  );
}
