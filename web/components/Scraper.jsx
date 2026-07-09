"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Scraper() {
  const [user, setUser] = useState(undefined);
  const [f, setF] = useState({ query: "restaurants", location: "New York", limit: 20 });
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const up = (k, v) => setF((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user)).catch(() => setUser(null));
  }, []);

  async function run() {
    setBusy(true); setErr(""); setRows([]);
    try {
      const res = await fetch("/api/scrape", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const data = await res.json();
      if (data.error === "login_required") { setErr("Please log in to use the scraper."); setUser(null); }
      else if (data.error === "not_configured") setErr("The scraper API isn't connected yet. Add SCRAPER_API_URL (and SCRAPER_API_KEY) in web/.env — your uploaded provider's endpoint — then restart.");
      else if (data.error) setErr(data.error);
      else setRows(data.results || []);
    } catch (e) { setErr("Something went wrong."); }
    finally { setBusy(false); }
  }

  function exportCsv() {
    const head = ["name", "address", "phone", "website", "email", "rating", "category"];
    const csv = [head.join(","), ...rows.map((r) => head.map((h) => `"${String(r[h] || "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "leads.csv"; a.click();
  }

  if (user === undefined) return <div className="sheet empty">Loading…</div>;
  if (!user) {
    return (
      <div className="sheet center" style={{ padding: "clamp(24px, 7vw, 44px)" }}>
        <div style={{ fontSize: 44 }}>🔒</div>
        <h2 style={{ fontSize: 24 }}>Log in to use the Business Scraper</h2>
        <p className="muted">Create a free account to search and export business leads.</p>
        <Link href="/account?next=/scraper" className="btn">Log in / Sign up →</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="sheet" style={{ padding: 22, marginBottom: 18 }}>
        <div className="grid grid-3" style={{ gap: 12 }}>
          <div><label className="fld">What to find</label><input className="input" value={f.query} onChange={(e) => up("query", e.target.value)} placeholder="e.g. dentists, cafes, plumbers" /></div>
          <div><label className="fld">Location</label><input className="input" value={f.location} onChange={(e) => up("location", e.target.value)} placeholder="City / area" /></div>
          <div><label className="fld">Max results</label><input className="input" type="number" min={1} max={200} value={f.limit} onChange={(e) => up("limit", +e.target.value || 20)} /></div>
        </div>
        <div className="tool-controls" style={{ marginTop: 12 }}>
          <button className="btn" onClick={run} disabled={busy}>{busy ? "Searching…" : "🔎 Search leads"}</button>
          {rows.length ? <button className="btn btn-outline" onClick={exportCsv}>⬇ Export CSV ({rows.length})</button> : null}
        </div>
        {err ? <div className="notice notice-warn" style={{ marginTop: 12, marginBottom: 0 }}>{err}</div> : null}
      </div>

      {rows.length ? (
        <div className="sheet" style={{ padding: 0, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead><tr style={{ textAlign: "left" }}>{["Name", "Address", "Phone", "Website", "Rating"].map((h) => <th key={h} style={{ padding: 12, borderBottom: "1px solid var(--border)", color: "var(--muted)", fontSize: 12, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td style={{ padding: 12, borderBottom: "1px solid var(--border)", fontWeight: 600 }}>{r.name}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid var(--border)", color: "var(--text-soft)" }}>{r.address}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid var(--border)" }}>{r.phone}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid var(--border)" }}>{r.website ? <a href={r.website} target="_blank" rel="noreferrer">site ↗</a> : ""}</td>
                  <td style={{ padding: 12, borderBottom: "1px solid var(--border)" }}>{r.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
