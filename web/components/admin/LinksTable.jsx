"use client";

import { useState, useEffect } from "react";

const fmt = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export default function LinksTable() {
  const [links, setLinks] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => { setOrigin(window.location.origin); }, []);

  async function load() {
    try {
      const res = await fetch("/api/admin/links", { cache: "no-store" });
      const data = await res.json();
      if (data.error) setErr(data.error);
      else setLinks(data.links);
    } catch (e) { setErr("Could not load links."); }
  }
  useEffect(() => { load(); }, []);

  async function remove(id) {
    if (!confirm("Delete this short link?")) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/links?id=${id}`, { method: "DELETE" });
      if (res.ok) setLinks((l) => l.filter((x) => x.id !== id));
      else alert("Could not delete.");
    } catch (e) { alert("Something went wrong."); }
    finally { setBusy(""); }
  }

  if (err) return <div className="notice notice-error">{err}</div>;
  if (!links) return <div className="empty">Loading short links…</div>;

  const totalClicks = links.reduce((s, l) => s + (l.clicks || 0), 0);

  return (
    <>
      <div className="grid grid-3" style={{ marginBottom: 20 }}>
        <div className="stat reveal g1"><div className="s-top"><span className="s-ic">🔗</span></div><h3>{links.length}</h3><p>Short links</p></div>
        <div className="stat reveal g2"><div className="s-top"><span className="s-ic">👆</span></div><h3>{totalClicks.toLocaleString()}</h3><p>Total clicks</p></div>
        <div className="stat reveal g3"><div className="s-top"><span className="s-ic">📈</span></div><h3>{links.length ? Math.round(totalClicks / links.length) : 0}</h3><p>Avg clicks / link</p></div>
      </div>

      <div className="sheet" style={{ padding: 8 }}>
        {links.length === 0 ? (
          <div className="empty">No short links yet. Links created with the URL Shortener tool show up here.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead><tr><th>Short link</th><th>Destination</th><th>Clicks</th><th>Created</th><th></th></tr></thead>
              <tbody>
                {links.map((l) => (
                  <tr key={l.id}>
                    <td><a className="mono" href={`/s/${l.code}`} target="_blank" rel="noreferrer">{origin ? origin.replace(/^https?:\/\//, "") : ""}/s/{l.code}</a></td>
                    <td className="muted" style={{ maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.url}</td>
                    <td><strong>{l.clicks || 0}</strong></td>
                    <td className="muted">{fmt(l.createdAt)}</td>
                    <td><div className="row-actions"><button className="btn btn-sm btn-outline" disabled={busy === l.id} onClick={() => remove(l.id)}>{busy === l.id ? "…" : "Delete"}</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
