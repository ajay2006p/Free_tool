"use client";

import { useState, useEffect, useCallback } from "react";

const num = (n) => (Number(n) || 0).toLocaleString();
const pct = (n) => ((Number(n) || 0) * 100).toFixed(1) + "%";
const pos = (n) => (n == null ? "—" : Number(n).toFixed(1));

/* Position falls as ranking improves, so the API already inverts the delta:
   a positive number always means "better" here. */
function Delta({ value, suffix = "", invertColour = false }) {
  if (value == null || value === 0) return <span className="kw-flat">—</span>;
  const good = invertColour ? value < 0 : value > 0;
  const arrow = value > 0 ? "▲" : "▼";
  return (
    <span className={good ? "kw-up" : "kw-down"}>
      {arrow} {Math.abs(value).toFixed(suffix === "" ? 1 : 0)}
      {suffix}
    </span>
  );
}

function Setup({ site }) {
  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Connect Google Search Console</h2>
      <p className="muted">
        Ranking data comes from Search Console — it is Google&rsquo;s own record of how your
        site performs, so the positions are real rather than estimated. It is free.
      </p>
      <ol className="kw-steps">
        <li>
          In the <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer">Google Cloud console</a>,
          create a project and enable the <strong>Google Search Console API</strong>.
        </li>
        <li>
          Create a <strong>Service Account</strong>, then create a <strong>JSON key</strong> for it and download it.
        </li>
        <li>
          In <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer">Search Console</a> →
          Settings → Users and permissions, add the service account&rsquo;s <code>client_email</code> as a user.
          <em> This step is the one people miss — the key works but sees nothing until the property grants it access.</em>
        </li>
        <li>
          Put these in the admin app&rsquo;s <code>.env</code>, then restart it:
          <pre className="kw-pre">{`GSC_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
GSC_SITE_URL=sc-domain:freetoolss.online`}</pre>
          <span className="muted">
            Use <code>sc-domain:freetoolss.online</code> for a Domain property, or the full
            <code> https://www.freetoolss.online/</code> including the trailing slash for a URL-prefix
            property. They are different properties with different data, and a mismatch returns a
            permission error rather than an empty result.
          </span>
        </li>
      </ol>
      {site ? <p className="hint">Currently pointing at: <code>{site}</code></p> : null}
    </div>
  );
}

export default function KeywordTracker() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [days, setDays] = useState(28);
  const [phrase, setPhrase] = useState("");
  const [tab, setTab] = useState("tracked");
  const [msg, setMsg] = useState("");

  const load = useCallback(
    async (opts = {}) => {
      setBusy(true);
      try {
        const res = await fetch(`/api/keywords/data?days=${days}${opts.save ? "&save=1" : ""}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Could not load keyword data");
        setData(json);
        setErr(json.error || "");
      } catch (e) {
        setErr(e.message);
      } finally {
        setBusy(false);
      }
    },
    [days]
  );

  useEffect(() => {
    load();
  }, [load]);

  async function addKeyword(e) {
    e.preventDefault();
    if (!phrase.trim()) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phrase }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not add");
      setPhrase("");
      setMsg(
        `Added ${json.added}${json.skipped?.length ? ` · ${json.skipped.length} already on the list` : ""}`
      );
      await load();
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    setBusy(true);
    try {
      await fetch(`/api/keywords?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function track(p) {
    setBusy(true);
    try {
      await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phrase: p }),
      });
      await load();
    } finally {
      setBusy(false);
    }
  }

  if (!data && !err) return <div className="empty">Loading keyword data…</div>;
  if (data && data.configured === false) return <Setup site={data.site} />;

  const t = data?.totals;

  return (
    <div>
      {err ? (
        <div className="notice notice-error" style={{ marginBottom: 16 }}>
          {err}
        </div>
      ) : null}

      {t ? (
        <div className="grid grid-4" style={{ marginBottom: 20 }}>
          <div className="stat reveal g1">
            <div className="s-top"><span className="s-ic">👆</span></div>
            <h3>{num(t.clicks)}</h3>
            <p>Clicks · last {data.days} days</p>
          </div>
          <div className="stat reveal g2">
            <div className="s-top"><span className="s-ic">👁️</span></div>
            <h3>{num(t.impressions)}</h3>
            <p>Impressions · times you appeared</p>
          </div>
          <div className="stat reveal g3">
            <div className="s-top"><span className="s-ic">🔑</span></div>
            <h3>{num(t.queries)}</h3>
            <p>Keywords you rank for</p>
          </div>
          <div className="stat reveal g4">
            <div className="s-top"><span className="s-ic">📍</span></div>
            <h3>{t.avgPosition || "—"}</h3>
            <p>Average position</p>
          </div>
        </div>
      ) : null}

      <div className="card" style={{ marginBottom: 20 }}>
        <form onSubmit={addKeyword} className="kw-add">
          <input
            className="input"
            placeholder="Add keywords to watch — one per line, or comma separated"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
          />
          <button className="btn" disabled={busy || !phrase.trim()}>
            Add
          </button>
        </form>
        <div className="kw-controls">
          <label className="muted">
            Period:{" "}
            <select className="input kw-select" value={days} onChange={(e) => setDays(Number(e.target.value))}>
              <option value={7}>Last 7 days</option>
              <option value={28}>Last 28 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </label>
          <button className="btn btn-outline btn-sm" onClick={() => load()} disabled={busy}>
            {busy ? "Refreshing…" : "Refresh"}
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => load({ save: true })} disabled={busy} title="Record today's positions so you can see movement later">
            Save snapshot
          </button>
          {msg ? <span className="hint">{msg}</span> : null}
        </div>
      </div>

      <div className="ed-tabs" style={{ marginBottom: 14 }}>
        <button className={"ed-tab" + (tab === "tracked" ? " active" : "")} onClick={() => setTab("tracked")}>
          My keywords ({data?.tracked?.length || 0})
        </button>
        <button className={"ed-tab" + (tab === "working" ? " active" : "")} onClick={() => setTab("working")}>
          What&rsquo;s working ({data?.discovered?.length || 0})
        </button>
        <button className={"ed-tab" + (tab === "wins" ? " active" : "")} onClick={() => setTab("wins")}>
          Best opportunities
        </button>
      </div>

      {tab === "tracked" ? <TrackedTable rows={data?.tracked || []} onRemove={remove} /> : null}
      {tab === "working" ? <DiscoveredTable rows={data?.discovered || []} onTrack={track} /> : null}
      {tab === "wins" ? (
        <DiscoveredTable
          rows={[...(data?.discovered || [])].filter((r) => r.opportunity > 0).sort((a, b) => b.opportunity - a.opportunity).slice(0, 50)}
          onTrack={track}
          showOpportunity
          caption="Queries where Google already shows you and people are already searching, but you sit below the top few results. Improving these pages is usually the cheapest traffic available."
        />
      ) : null}
    </div>
  );
}

function TrackedTable({ rows, onRemove }) {
  if (!rows.length) {
    return (
      <div className="empty">
        No keywords on your watchlist yet. Add the terms you want to rank for above — they will show
        here with your position as soon as Search Console reports them.
      </div>
    );
  }
  return (
    <div className="card kw-card">
      <table className="kw-table">
        <thead>
          <tr>
            <th>Keyword</th>
            <th>Position</th>
            <th>Change</th>
            <th>Clicks</th>
            <th>Impressions</th>
            <th>CTR</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>
                <span className="kw-phrase">{r.phrase}</span>
                {r.isNew ? <span className="badge badge-live">new</span> : null}
                {r.lost ? <span className="badge">lost</span> : null}
              </td>
              <td>
                {r.ranking ? (
                  <strong className={r.position <= 10 ? "kw-up" : ""}>{pos(r.position)}</strong>
                ) : (
                  <span className="muted">not ranking</span>
                )}
              </td>
              <td><Delta value={r.positionChange} /></td>
              <td>{r.ranking ? num(r.clicks) : "—"}</td>
              <td>{r.ranking ? num(r.impressions) : "—"}</td>
              <td>{r.ranking ? pct(r.ctr) : "—"}</td>
              <td>
                <button className="btn btn-outline btn-sm" onClick={() => onRemove(r.id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="hint">
        &ldquo;Not ranking&rdquo; means Search Console reported no impressions for that exact phrase in this
        period. On a new site that is normal — it usually means the page has not been crawled and
        assessed yet, rather than that it ranks badly.
      </p>
    </div>
  );
}

function DiscoveredTable({ rows, onTrack, showOpportunity, caption }) {
  if (!rows.length) {
    return (
      <div className="empty">
        Search Console has not reported any queries for this period yet. On a newly deployed site this
        typically takes a few days to a couple of weeks.
      </div>
    );
  }
  return (
    <div className="card kw-card">
      {caption ? <p className="muted" style={{ marginTop: 0 }}>{caption}</p> : null}
      <table className="kw-table">
        <thead>
          <tr>
            <th>Keyword</th>
            <th>Position</th>
            <th>Change</th>
            <th>Clicks</th>
            <th>Impressions</th>
            <th>CTR</th>
            {showOpportunity ? <th>Opportunity</th> : null}
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.phrase}>
              <td>
                <span className="kw-phrase">{r.phrase}</span>
                {r.isNew ? <span className="badge badge-live">new</span> : null}
              </td>
              <td>
                <strong className={r.position <= 10 ? "kw-up" : ""}>{pos(r.position)}</strong>
              </td>
              <td><Delta value={r.positionChange} /></td>
              <td>{num(r.clicks)}</td>
              <td>{num(r.impressions)}</td>
              <td>{pct(r.ctr)}</td>
              {showOpportunity ? <td>{num(r.opportunity)}</td> : null}
              <td>
                {r.tracked ? (
                  <span className="muted">tracked</span>
                ) : (
                  <button className="btn btn-outline btn-sm" onClick={() => onTrack(r.phrase)}>
                    Track
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
