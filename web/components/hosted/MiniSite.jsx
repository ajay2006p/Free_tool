"use client";

/* ============================================================================
   /p/<code> — a published one-page site / link-in-bio page.

   Rendered from the creator's saved JSON. The themes are inlined rather than
   using site CSS variables so a published page looks the same regardless of
   the visitor's light/dark preference — the creator picked the look.
   ========================================================================== */

import { useEffect, useState } from "react";
import Link from "next/link";
import { THEMES } from "../../lib/microsite";

export default function MiniSite({ code }) {
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/hosted/${code}`);
        const json = await res.json();
        if (!alive) return;
        if (!res.ok || json.error || json.kind !== "site") {
          setState({ status: "missing" });
          return;
        }
        let data = null;
        try {
          data = JSON.parse(json.data);
        } catch (e) {}
        setState(data ? { status: "ready", data } : { status: "missing" });
      } catch (e) {
        if (alive) setState({ status: "missing" });
      }
    })();
    return () => {
      alive = false;
    };
  }, [code]);

  if (state.status === "loading") {
    return (
      <div className="container-narrow section">
        <p className="muted">Loading…</p>
      </div>
    );
  }
  if (state.status === "missing") {
    return (
      <div className="container-narrow section">
        <div className="sheet" style={{ padding: "clamp(16px, 5vw, 30px)" }}>
          <h1 style={{ fontSize: 24, marginTop: 0 }}>Page not found</h1>
          <p className="muted">This page has been removed, or the link is wrong.</p>
          <Link className="btn" href="/tools/link-in-bio">
            Build your own free page →
          </Link>
        </div>
      </div>
    );
  }

  const d = state.data;
  const theme = THEMES.find((t) => t.key === d.theme) || THEMES[0];
  const links = Array.isArray(d.links) ? d.links : [];

  return (
    <div style={{ background: theme.bg, minHeight: "70vh", padding: "40px 16px" }}>
      <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center", color: theme.text }}>
        <div
          style={{
            width: 88,
            height: 88,
            margin: "0 auto 14px",
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            fontSize: 40,
            background: theme.card,
            border: `2px solid ${theme.accent}`,
          }}
        >
          {d.avatar || "🙂"}
        </div>

        <h1 style={{ fontSize: 27, margin: "0 0 6px", color: theme.text }}>{d.name || "My page"}</h1>
        {d.tagline ? (
          <p style={{ margin: "0 0 22px", opacity: 0.8, fontSize: 15, lineHeight: 1.6 }}>{d.tagline}</p>
        ) : (
          <div style={{ height: 18 }} />
        )}

        <div style={{ display: "grid", gap: 12 }}>
          {links.map((l, i) => (
            <a
              key={i}
              href={l.url}
              target="_blank"
              rel="noreferrer nofollow"
              style={{
                display: "block",
                padding: "14px 18px",
                borderRadius: 14,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 16,
                background: theme.card,
                color: theme.text,
                border: `1px solid ${theme.accent}`,
              }}
            >
              {l.icon ? `${l.icon}  ` : ""}
              {l.label}
            </a>
          ))}
        </div>

        {!links.length ? <p style={{ opacity: 0.7 }}>No links yet.</p> : null}

        <p style={{ marginTop: 34, fontSize: 12, opacity: 0.6 }}>
          Built free with{" "}
          <Link href="/tools/link-in-bio" style={{ color: theme.text, textDecoration: "underline" }}>
            FreeTool
          </Link>
        </p>
      </div>
    </div>
  );
}
