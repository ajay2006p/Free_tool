"use client";

import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import CopyButton from "../CopyButton";

export function UrlShortener() {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [links, setLinks] = useLocalStorage("dh_shortlinks", []);
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  async function shorten() {
    if (!url.trim()) return;
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/shorten", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      const data = await res.json();
      if (data.error) setErr(data.error);
      else { setLinks([{ code: data.code, url, at: new Date().toLocaleString() }, ...links].slice(0, 30)); setUrl(""); }
    } catch (e) { setErr("Something went wrong."); }
    finally { setBusy(false); }
  }
  return (
    <div className="tool">
      <label className="fld">Long URL</label>
      <div className="tool-controls">
        <input className="input" style={{ flex: 1 }} value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && shorten()} placeholder="https://example.com/very/long/link" />
        <button className="btn" onClick={shorten} disabled={busy}>{busy ? "…" : "Shorten"}</button>
      </div>
      {err ? <div className="notice notice-warn">{err}</div> : null}
      <div className="stack-sm" style={{ marginTop: 8 }}>
        {links.map((l) => {
          const short = `${origin}/s/${l.code}`;
          return (
            <div key={l.code} className="sheet flex-between" style={{ padding: "10px 14px", marginBottom: 6 }}>
              <div style={{ minWidth: 0 }}>
                <a href={short} target="_blank" rel="noreferrer" style={{ fontWeight: 700 }}>{origin.replace(/^https?:\/\//, "")}/s/{l.code}</a>
                <div className="muted" style={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.url}</div>
              </div>
              <CopyButton value={short} />
            </div>
          );
        })}
        {links.length === 0 ? <p className="hint">Your shortened links will appear here.</p> : null}
      </div>
    </div>
  );
}
