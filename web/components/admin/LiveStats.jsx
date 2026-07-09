"use client";

import { useState, useEffect } from "react";

const money = (n) => "$" + (Number(n) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function LiveStats() {
  const [s, setS] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/admin/stats", { cache: "no-store" });
        if (!res.ok) throw new Error("Could not load stats");
        const data = await res.json();
        if (alive) {
          setS(data);
          setErr("");
        }
      } catch (e) {
        if (alive) setErr(e.message);
      }
    }
    load();
    const id = setInterval(load, 10000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  if (err) return <div className="notice notice-error">{err}. If the visits data is missing, check <code>DATABASE_URL</code> in web/.env.</div>;
  if (!s) return <div className="empty">Loading live stats...</div>;

  const dbWarning = s.error ? (
    <div className="notice notice-error" style={{ marginBottom: 16 }}>
      {s.error}. Check <code>DATABASE_URL</code> and your MongoDB Atlas network access.
    </div>
  ) : null;

  const maxDay = Math.max(1, ...s.days.map((d) => d.count));
  const pretty = (p) => p === "/" ? "Home" : p;

  return (
    <div>
      {dbWarning}
      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        <div className="stat reveal g4">
          <div className="s-top">
            <span className="s-ic">🟢</span>
            <span className="s-trend" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span className="live-dot" /> LIVE</span>
          </div>
          <h3>{s.liveUsers}</h3>
          <p>active in last 5 min</p>
        </div>
        <div className="stat reveal g1"><div className="s-top"><span className="s-ic">👁️</span></div><h3>{s.totalViews.toLocaleString()}</h3><p>Total page views</p></div>
        <div className="stat reveal g2"><div className="s-top"><span className="s-ic">🧑‍🤝‍🧑</span></div><h3>{s.uniqueVisitors.toLocaleString()}</h3><p>Unique visitors</p></div>
        <div className="stat reveal g3"><div className="s-top"><span className="s-ic">📅</span></div><h3>{s.todayViews.toLocaleString()}</h3><p>Views today</p></div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="flex-between"><h3 style={{ margin: 0, fontSize: 16 }}>💰 Estimated earnings</h3><span className="badge badge-soon">est.</span></div>
          <div style={{ fontSize: 34, fontWeight: 800, margin: "8px 0 2px" }}>{money(s.earnings.estimated)}</div>
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>≈ {s.totalViews.toLocaleString()} views × ${s.earnings.cpm} CPM ÷ 1000. Set <code>ADSTERRA_CPM</code> in web/.env.</p>
        </div>
        <div className="card">
          <div className="flex-between"><h3 style={{ margin: 0, fontSize: 16 }}>📊 Adsterra (real)</h3>{s.earnings.connected ? <span className="badge badge-live">connected</span> : <span className="badge badge-soon">not connected</span>}</div>
          {s.earnings.connected ? (
            <>
              <div style={{ fontSize: 34, fontWeight: 800, margin: "8px 0 2px" }}>{money(s.earnings.revenue)}</div>
              <p className="muted" style={{ fontSize: 13, margin: 0 }}>last 7 days · {Number(s.earnings.impressions || 0).toLocaleString()} impressions</p>
            </>
          ) : (
            <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>Add <code>ADSTERRA_API_TOKEN</code> in web/.env (Adsterra → Settings → API) to pull real revenue. {s.earnings.error ? `(${s.earnings.error})` : ""}</p>
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 16 }}>Views - last 7 days</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 160 }}>
          {s.days.map((d) => (
            <div key={d.key} style={{ flex: 1, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{d.count}</div>
              <div className="bar-grow" style={{ background: "linear-gradient(180deg,var(--violet),var(--accent))", borderRadius: "6px 6px 0 0", height: `${(d.count / maxDay) * 120}px`, minHeight: 3 }} />
              <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>{d.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ margin: "0 0 10px", fontSize: 16 }}>Top pages</h3>
          {s.topPages.length ? s.topPages.map((p) => (
            <div key={p.path} className="flex-between" style={{ padding: "7px 0", borderBottom: "1px solid var(--line-soft)", fontSize: 14 }}>
              <span className="mono" style={{ color: "var(--text-soft)", overflow: "hidden", textOverflow: "ellipsis" }}>{pretty(p.path)}</span><strong>{p.count}</strong>
            </div>
          )) : <p className="muted">No views yet.</p>}
        </div>
        <div className="card">
          <h3 style={{ margin: "0 0 10px", fontSize: 16 }}>Traffic sources</h3>
          {s.referrers.length ? s.referrers.map((r) => (
            <div key={r.ref} className="flex-between" style={{ padding: "7px 0", borderBottom: "1px solid var(--line-soft)", fontSize: 14 }}>
              <span style={{ color: "var(--text-soft)", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "70%" }}>{(() => { try { return new URL(r.ref).hostname; } catch { return r.ref; } })()}</span><strong>{r.count}</strong>
            </div>
          )) : <p className="muted">Mostly direct traffic so far.</p>}
        </div>
      </div>

      <p className="muted center" style={{ fontSize: 12, marginTop: 16 }}>🔄 Auto-refreshes every 10 seconds · last update {new Date(s.at).toLocaleTimeString()}</p>
    </div>
  );
}
