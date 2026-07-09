"use client";

import { useState, useEffect } from "react";

function preview(cfg) {
  const w = cfg.width || 728, h = cfg.height || 90;
  const wrap = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>${inner}</body></html>`;
  if (cfg.mode === "custom" && cfg.customCode) return wrap(cfg.customCode);
  if (cfg.adsterraKey) return wrap(`<script type="text/javascript">atOptions={'key':'${cfg.adsterraKey}','format':'iframe','height':${h},'width':${w},'params':{}};<\/script><script type="text/javascript" src="//www.highperformanceformat.com/${cfg.adsterraKey}/invoke.js"><\/script>`);
  return null;
}

export default function AdsManager() {
  const [cfg, setCfg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((d) => setCfg(d.ads)).catch(() => setErr("Could not load settings."));
  }, []);

  const up = (k, v) => { setCfg((c) => ({ ...c, [k]: v })); setSaved(false); };

  async function save() {
    setSaving(true); setErr(""); setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cfg) });
      const data = await res.json();
      if (data.error) setErr(data.error);
      else { setCfg(data.ads); setSaved(true); }
    } catch (e) { setErr("Could not save."); }
    finally { setSaving(false); }
  }

  if (!cfg) return <div className="empty">Loading ad settings…</div>;
  const src = preview(cfg);

  return (
    <div className="grid grid-2" style={{ alignItems: "start", gap: 20 }}>
      <div className="card">
        <h3 style={{ marginTop: 0, fontSize: 17 }}>Ad settings</h3>

        <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600, marginBottom: 14 }}>
          <input type="checkbox" checked={cfg.enabled} onChange={(e) => up("enabled", e.target.checked)} /> Ads enabled
        </label>

        <div className="form-field">
          <label>Ad source</label>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className={"btn btn-sm " + (cfg.mode === "adsterra" ? "" : "btn-outline")} onClick={() => up("mode", "adsterra")}>Adsterra key</button>
            <button type="button" className={"btn btn-sm " + (cfg.mode === "custom" ? "" : "btn-outline")} onClick={() => up("mode", "custom")}>Custom code (any network)</button>
          </div>
        </div>

        {cfg.mode === "adsterra" ? (
          <div className="form-field">
            <label>Adsterra ad key</label>
            <input className="input" value={cfg.adsterraKey} onChange={(e) => up("adsterraKey", e.target.value)} placeholder="e.g. 36801d22c98024a83ca56aeedce5d398" />
            <div className="hint">Adsterra dashboard → your banner ad unit → copy the <code>key</code> from its code.</div>
          </div>
        ) : (
          <div className="form-field">
            <label>Paste your ad code</label>
            <textarea className="textarea" style={{ minHeight: 150, fontFamily: "var(--mono)", fontSize: 13 }} value={cfg.customCode} onChange={(e) => up("customCode", e.target.value)} placeholder={"Paste the full <script>…</script> ad code from any network (Adsterra, PropellerAds, AdSense, etc.)"} />
            <div className="hint">Works with any banner code. It runs in a safe sandbox so it can't break your site.</div>
          </div>
        )}

        <div className="grid grid-2" style={{ gap: 12 }}>
          <div className="form-field"><label>Width (px)</label><input className="input" type="number" value={cfg.width} onChange={(e) => up("width", Number(e.target.value) || 0)} /></div>
          <div className="form-field"><label>Height (px)</label><input className="input" type="number" value={cfg.height} onChange={(e) => up("height", Number(e.target.value) || 0)} /></div>
        </div>
        <div className="hint" style={{ marginBottom: 14 }}>Must match the banner size of your ad unit (common: 728×90, 300×250, 320×50, 160×600).</div>

        <button className="btn" onClick={save} disabled={saving}>{saving ? "Saving…" : "💾 Save & go live"}</button>
        {saved ? <span className="badge badge-live" style={{ marginLeft: 10 }}>Saved — live on the site</span> : null}
        {err ? <div className="notice notice-error" style={{ marginTop: 12 }}>{err}</div> : null}
      </div>

      <div className="card">
        <div className="flex-between"><h3 style={{ margin: 0, fontSize: 17 }}>Live preview</h3><span className="badge badge-soon">don't click your own ads</span></div>
        <div className="notice notice-warn" style={{ marginTop: 10 }}>⚠️ Clicking or refreshing your own ads gets your account banned. This is only to confirm the code loads.</div>
        {src ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 10, background: "var(--surface-2)", borderRadius: 8 }}>
            <iframe title="Ad preview" srcDoc={src} width={cfg.width || 728} height={cfg.height || 90} scrolling="no" style={{ border: 0, maxWidth: "100%" }} />
          </div>
        ) : <p className="muted">Add a key or code, then save to see it.</p>}
        <p className="hint" style={{ marginTop: 12 }}>Note: ad networks don't serve ads on <code>localhost</code> — you'll only see real ads on your live, approved domain.</p>
      </div>
    </div>
  );
}
