"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Fetches the current user client-side so the shared layout stays static.
export default function UserMenu() {
  const [user, setUser] = useState(undefined); // undefined = loading
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const router = useRouter();

  useEffect(() => {
    let alive = true;
    fetch("/api/auth/me").then((r) => r.json()).then((d) => { if (alive) setUser(d.user); }).catch(() => alive && setUser(null));
    return () => { alive = false; };
  }, []);
  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null); setOpen(false); router.refresh();
  }

  if (user === undefined) return <span style={{ width: 70 }} />;
  if (!user) return <Link href="/account" className="btn btn-sm">Log in</Link>;

  const initials = (user.name || user.email).slice(0, 2).toUpperCase();
  return (
    <div className="profile" ref={ref} style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen((o) => !o)}
        style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 6px", border: "1px solid var(--border-strong)", borderRadius: 999, background: "var(--surface)", cursor: "pointer" }}>
        <span style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13 }}>{initials}</span>
        <span className="caret" style={{ color: "var(--muted)", fontSize: 11 }}>▾</span>
      </button>
      {open ? (
        <div style={{ position: "absolute", right: 0, top: "120%", width: 220, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "var(--shadow-lg)", padding: 12, zIndex: 70 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{user.name || "My account"}</div>
          <div className="muted" style={{ fontSize: 12, marginBottom: 8, wordBreak: "break-all" }}>{user.email}</div>
          <Link href="/scraper" onClick={() => setOpen(false)} style={{ display: "block", padding: "8px 10px", borderRadius: 8, fontWeight: 600, fontSize: 14 }}>🔎 Business Scraper</Link>
          <button onClick={logout} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 8, border: "none", background: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, color: "var(--text-soft)" }}>🚪 Log out</button>
        </div>
      ) : null}
    </div>
  );
}
