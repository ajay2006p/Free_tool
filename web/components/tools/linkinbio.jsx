"use client";

/* ============================================================================
   Link-in-Bio / one-page site builder — design a page, publish it to a link,
   or download it as a standalone HTML file you can host anywhere.

   The download path matters: it means the tool is still useful to someone who
   wants their own domain, and nobody is locked into our hosting.
   ========================================================================== */

import { useState } from "react";
import { useLocalStorage, uid } from "./useLocalStorage";
import { usePublish, ShareBox, OwnedList } from "./hostedShare";
import { THEMES } from "../../lib/microsite";

const EMPTY = {
  name: "",
  tagline: "",
  avatar: "🙂",
  theme: "midnight",
  links: [{ id: "a", label: "", url: "", icon: "🔗" }],
};

const AVATARS = ["🙂", "🚀", "🎨", "💻", "📸", "🎧", "✍️", "🍰", "🏋️", "🐾", "🌱", "⭐"];
const ICONS = ["🔗", "📸", "▶️", "🐦", "💼", "🎵", "🛍️", "📧", "📝", "💬", "☕", "📅"];

/** Accept "example.com" as readily as a full URL — people rarely type the scheme. */
function normalizeUrl(raw) {
  const s = String(raw || "").trim();
  if (!s) return "";
  if (/^(https?:|mailto:|tel:)/i.test(s)) return s;
  if (/^[\w.+-]+@[\w-]+\.\w+$/.test(s)) return `mailto:${s}`;
  return `https://${s}`;
}

const esc = (s) =>
  String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/** A complete, dependency-free HTML file for the current design. */
function buildHtml(d, theme) {
  const links = (d.links || [])
    .filter((l) => l.label.trim() && l.url.trim())
    .map(
      (l) =>
        `      <a href="${esc(normalizeUrl(l.url))}" target="_blank" rel="noreferrer">${esc(l.icon)}  ${esc(l.label)}</a>`
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(d.name || "My page")}</title>
<meta name="description" content="${esc(d.tagline || d.name || "My links")}">
<style>
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;background:${theme.bg};color:${theme.text};
       font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
       display:flex;align-items:flex-start;justify-content:center;padding:48px 16px}
  .wrap{width:100%;max-width:520px;text-align:center}
  .avatar{width:88px;height:88px;margin:0 auto 14px;border-radius:50%;display:grid;
          place-items:center;font-size:40px;background:${theme.card};border:2px solid ${theme.accent}}
  h1{font-size:27px;margin:0 0 6px}
  p.tag{margin:0 0 22px;opacity:.8;font-size:15px;line-height:1.6}
  a{display:block;padding:14px 18px;margin-bottom:12px;border-radius:14px;text-decoration:none;
    font-weight:700;font-size:16px;background:${theme.card};color:${theme.text};
    border:1px solid ${theme.accent};transition:transform .12s ease,opacity .12s ease}
  a:hover{transform:translateY(-2px);opacity:.92}
  footer{margin-top:34px;font-size:12px;opacity:.6}
</style>
</head>
<body>
  <div class="wrap">
    <div class="avatar">${esc(d.avatar || "🙂")}</div>
    <h1>${esc(d.name || "My page")}</h1>
    ${d.tagline ? `<p class="tag">${esc(d.tagline)}</p>` : ""}
${links}
    <footer>Built with FreeTool</footer>
  </div>
</body>
</html>
`;
}

export function LinkInBio() {
  const [d, setD] = useLocalStorage("dh_bio_draft", EMPTY);
  const [saved, setSaved] = useState("");
  const { publish, busy, err, result, reset } = usePublish("site");

  const theme = THEMES.find((t) => t.key === d.theme) || THEMES[0];
  const links = d.links || [];
  const validLinks = links.filter((l) => l.label.trim() && l.url.trim());
  const canPublish = d.name.trim() && validLinks.length > 0;

  function set(patch) {
    setD({ ...d, ...patch });
  }
  function setLink(id, patch) {
    set({ links: links.map((l) => (l.id === id ? { ...l, ...patch } : l)) });
  }
  function addLink() {
    set({ links: [...links, { id: uid(), label: "", url: "", icon: "🔗" }] });
  }
  function removeLink(id) {
    set({ links: links.filter((l) => l.id !== id) });
  }
  function move(id, dir) {
    const i = links.findIndex((l) => l.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= links.length) return;
    const nx = links.slice();
    [nx[i], nx[j]] = [nx[j], nx[i]];
    set({ links: nx });
  }

  function downloadHtml() {
    try {
      const html = buildHtml(d, theme);
      const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(d.name || "my-page").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.html`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      setSaved("Downloaded — upload that one file to any host.");
      setTimeout(() => setSaved(""), 4000);
    } catch (e) {}
  }

  return (
    <div className="tool">
      {result ? (
        <div style={{ marginBottom: 18 }}>
          <ShareBox entry={result} publicPath={`/p/${result.code}`} publicLabel="Your page is live at">
            <p className="hint" style={{ marginTop: 10, marginBottom: 0 }}>
              Put this in your Instagram, TikTok or X bio. Publish again any time to create an updated page.
            </p>
          </ShareBox>
        </div>
      ) : null}

      <div className="grid-2" style={{ gap: 18, alignItems: "start" }}>
        {/* ---------------- editor ---------------- */}
        <div>
          <label className="fld">Your name or brand</label>
          <input className="input" value={d.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Ajay Kumar" maxLength={80} />

          <label className="fld" style={{ marginTop: 12 }}>Short bio (optional)</label>
          <textarea
            className="textarea"
            rows={2}
            value={d.tagline}
            onChange={(e) => set({ tagline: e.target.value })}
            placeholder="e.g. Designer & photographer. Bookings open."
            maxLength={200}
          />

          <div className="fld" style={{ marginTop: 14 }}>Avatar</div>
          <div className="chips">
            {AVATARS.map((a) => (
              <button
                key={a}
                className="chip"
                onClick={() => set({ avatar: a })}
                style={d.avatar === a ? { borderColor: "var(--accent)", fontWeight: 800 } : undefined}
              >
                {a}
              </button>
            ))}
          </div>

          <div className="fld" style={{ marginTop: 14 }}>Theme</div>
          <div className="chips">
            {THEMES.map((t) => (
              <button
                key={t.key}
                className="chip"
                onClick={() => set({ theme: t.key })}
                style={d.theme === t.key ? { borderColor: "var(--accent)", fontWeight: 800 } : undefined}
              >
                {t.name}
              </button>
            ))}
          </div>

          <div className="fld" style={{ marginTop: 18 }}>Links</div>
          {links.map((l, i) => (
            <div key={l.id} className="sheet" style={{ padding: "10px 12px", marginBottom: 8 }}>
              <div className="tool-controls">
                <select className="input" style={{ maxWidth: 74 }} value={l.icon} onChange={(e) => setLink(l.id, { icon: e.target.value })}>
                  {ICONS.map((ic) => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
                <input
                  className="input"
                  style={{ flex: 1 }}
                  value={l.label}
                  onChange={(e) => setLink(l.id, { label: e.target.value })}
                  placeholder="Button text"
                  maxLength={60}
                />
              </div>
              <div className="tool-controls" style={{ marginTop: 6 }}>
                <input
                  className="input"
                  style={{ flex: 1 }}
                  value={l.url}
                  onChange={(e) => setLink(l.id, { url: e.target.value })}
                  placeholder="instagram.com/you"
                  maxLength={500}
                />
                <button className="btn btn-sm btn-outline" onClick={() => move(l.id, -1)} disabled={i === 0}>↑</button>
                <button className="btn btn-sm btn-outline" onClick={() => move(l.id, 1)} disabled={i === links.length - 1}>↓</button>
                <button className="btn btn-sm btn-outline" onClick={() => removeLink(l.id)} disabled={links.length <= 1}>✕</button>
              </div>
            </div>
          ))}
          <button className="btn btn-sm btn-outline" onClick={addLink}>+ Add link</button>
        </div>

        {/* ---------------- live preview ---------------- */}
        <div>
          <div className="fld">Live preview</div>
          <div
            style={{
              background: theme.bg,
              color: theme.text,
              borderRadius: "var(--radius)",
              padding: "28px 20px",
              textAlign: "center",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                width: 72, height: 72, margin: "0 auto 12px", borderRadius: "50%",
                display: "grid", placeItems: "center", fontSize: 34,
                background: theme.card, border: `2px solid ${theme.accent}`,
              }}
            >
              {d.avatar}
            </div>
            <div style={{ fontSize: 21, fontWeight: 800, marginBottom: 5 }}>{d.name || "Your name"}</div>
            {d.tagline ? <div style={{ opacity: 0.8, fontSize: 14, marginBottom: 16 }}>{d.tagline}</div> : <div style={{ height: 12 }} />}
            <div style={{ display: "grid", gap: 10 }}>
              {validLinks.map((l) => (
                <div
                  key={l.id}
                  style={{
                    padding: "12px 16px", borderRadius: 13, fontWeight: 700, fontSize: 15,
                    background: theme.card, border: `1px solid ${theme.accent}`,
                  }}
                >
                  {l.icon} {l.label}
                </div>
              ))}
              {!validLinks.length ? <div style={{ opacity: 0.65, fontSize: 14 }}>Add a link to see it here</div> : null}
            </div>
          </div>
        </div>
      </div>

      {err ? <div className="notice notice-warn" style={{ marginTop: 14 }}>{err}</div> : null}
      {saved ? <div className="notice notice-ok" style={{ marginTop: 14 }}>{saved}</div> : null}

      <div className="tool-controls" style={{ marginTop: 18 }}>
        <button
          className="btn btn-accent"
          disabled={!canPublish || busy}
          onClick={() => {
            reset();
            publish(d.name, {
              name: d.name.trim(),
              tagline: d.tagline.trim(),
              avatar: d.avatar,
              theme: d.theme,
              links: validLinks.map((l) => ({ label: l.label.trim(), url: normalizeUrl(l.url), icon: l.icon })),
            });
          }}
        >
          {busy ? "Publishing…" : "Publish my page"}
        </button>
        <button className="btn btn-outline" onClick={downloadHtml} disabled={!canPublish}>
          Download HTML
        </button>
        <button className="btn btn-outline" onClick={() => setD(EMPTY)}>Clear</button>
      </div>
      {!canPublish ? <p className="hint">Add your name and at least one complete link.</p> : null}

      <OwnedList kind="site" publicPath={(it) => `/p/${it.code}`} />
    </div>
  );
}
