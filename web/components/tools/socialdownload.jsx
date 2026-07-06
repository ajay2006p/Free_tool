"use client";

import { useState } from "react";

const PLATFORMS = [
  ["youtube", "▶️ YouTube", /youtube\.com|youtu\.be/i],
  ["tiktok", "🎵 TikTok", /tiktok\.com/i],
  ["instagram", "📸 Instagram", /instagram\.com/i],
  ["facebook", "📘 Facebook", /facebook\.com|fb\.watch/i],
  ["twitter", "𝕏 Twitter/X", /twitter\.com|x\.com/i],
  ["pinterest", "📌 Pinterest", /pinterest\./i],
];

export function SocialMediaDownloader() {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [res, setRes] = useState(null);

  const detected = PLATFORMS.find(([, , re]) => re.test(url));

  async function run() {
    if (!url.trim()) return;
    setBusy(true); setErr(""); setRes(null);
    try {
      const r = await fetch("/api/social-download", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      const data = await r.json();
      if (data.error === "not_configured") setErr("not_configured");
      else if (data.error) setErr(data.error);
      else setRes(data);
    } catch (e) { setErr("Something went wrong."); }
    finally { setBusy(false); }
  }

  return (
    <div className="tool">
      <div className="tool-controls">
        <input className="input" style={{ flex: 1 }} value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()} placeholder="Paste a video/reel/post link…" />
        <button className="btn" onClick={run} disabled={busy}>{busy ? "Fetching…" : "⬇ Download"}</button>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
        {PLATFORMS.map(([k, label]) => (
          <span key={k} className="badge" style={{ background: detected && detected[0] === k ? "var(--accent-soft)" : "var(--surface-2)", color: detected && detected[0] === k ? "var(--accent)" : "var(--muted)", border: "1px solid var(--border)" }}>{label}</span>
        ))}
      </div>

      {err === "not_configured" ? (
        <div className="notice notice-warn">
          <strong>Almost ready.</strong> Connect a downloader API to switch this on (free tier available):
          <ol style={{ margin: "8px 0 0 18px", fontSize: 13 }}>
            <li>Get a free key on RapidAPI (search “Social Media Video Downloader”).</li>
            <li>Put it in <code>web/.env</code> → <code>SOCIAL_DL_API_URL</code>, <code>SOCIAL_DL_API_KEY</code>, <code>SOCIAL_DL_API_HOST</code>.</li>
            <li>Restart the site — this tool works instantly.</li>
          </ol>
        </div>
      ) : err ? <div className="notice notice-warn">{err}</div> : null}

      {res ? (
        <div className="sheet" style={{ padding: 16 }}>
          {res.thumbnail ? <img src={res.thumbnail} alt="" style={{ maxHeight: 180, borderRadius: 8, border: "1px solid var(--border)" }} /> : null}
          {res.title ? <p style={{ fontWeight: 700, margin: "10px 0" }}>{res.title}</p> : null}
          <div className="stack-sm">
            {res.medias.map((m, i) => (
              <div key={i} className="flex-between" style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 14 }}>{m.type === "audio" ? "🎵" : "🎬"} {m.quality || m.type} {m.ext ? `· ${m.ext}` : ""}</span>
                <a className="btn btn-sm" href={m.url} target="_blank" rel="noreferrer" download>Download</a>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <p className="hint">Only download content you own or have the right to use. Respect each platform's terms and copyright.</p>
    </div>
  );
}
