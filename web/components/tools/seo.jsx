"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";

/* ---------------- Meta Tag Generator ---------------- */
export function MetaTagGenerator() {
  const [f, setF] = useState({ title: "My Awesome Page", description: "A short, compelling description for search engines.", keywords: "developer tools, free, online", author: "" });
  const up = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const code = [
    `<title>${f.title}</title>`,
    `<meta name="description" content="${f.description}" />`,
    f.keywords ? `<meta name="keywords" content="${f.keywords}" />` : "",
    f.author ? `<meta name="author" content="${f.author}" />` : "",
    `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
    `<meta name="robots" content="index, follow" />`,
  ].filter(Boolean).join("\n");
  return (
    <div className="tool">
      <div className="grid grid-2" style={{ gap: 14 }}>
        <div><label className="fld">Page title</label><input className="input" value={f.title} onChange={(e) => up("title", e.target.value)} /></div>
        <div><label className="fld">Keywords (comma separated)</label><input className="input" value={f.keywords} onChange={(e) => up("keywords", e.target.value)} /></div>
      </div>
      <label className="fld" style={{ marginTop: 12 }}>Description</label>
      <textarea className="textarea" style={{ minHeight: 80, fontFamily: "var(--sans)" }} value={f.description} onChange={(e) => up("description", e.target.value)} />
      <label className="fld" style={{ marginTop: 12 }}>Author (optional)</label>
      <input className="input" value={f.author} onChange={(e) => up("author", e.target.value)} />
      <label className="fld" style={{ marginTop: 16 }}>Generated tags <CopyButton value={code} /></label>
      <div className="sheet mono-out" style={{ padding: 14 }}>{code}</div>
    </div>
  );
}

/* ---------------- Open Graph Generator ---------------- */
export function OpenGraphGenerator() {
  const [f, setF] = useState({ title: "My Page", description: "Great description for social shares.", url: "https://example.com", image: "https://example.com/preview.png", type: "website", site: "DevHub" });
  const up = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const code = [
    `<meta property="og:title" content="${f.title}" />`,
    `<meta property="og:description" content="${f.description}" />`,
    `<meta property="og:type" content="${f.type}" />`,
    `<meta property="og:url" content="${f.url}" />`,
    `<meta property="og:image" content="${f.image}" />`,
    `<meta property="og:site_name" content="${f.site}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${f.title}" />`,
    `<meta name="twitter:description" content="${f.description}" />`,
    `<meta name="twitter:image" content="${f.image}" />`,
  ].join("\n");
  return (
    <div className="tool">
      <div className="grid grid-2" style={{ gap: 14 }}>
        <div><label className="fld">Title</label><input className="input" value={f.title} onChange={(e) => up("title", e.target.value)} /></div>
        <div><label className="fld">Page URL</label><input className="input" value={f.url} onChange={(e) => up("url", e.target.value)} /></div>
        <div><label className="fld">Image URL</label><input className="input" value={f.image} onChange={(e) => up("image", e.target.value)} /></div>
        <div><label className="fld">Site name</label><input className="input" value={f.site} onChange={(e) => up("site", e.target.value)} /></div>
      </div>
      <label className="fld" style={{ marginTop: 12 }}>Description</label>
      <textarea className="textarea" style={{ minHeight: 70, fontFamily: "var(--sans)" }} value={f.description} onChange={(e) => up("description", e.target.value)} />
      <label className="fld" style={{ marginTop: 16 }}>Open Graph + Twitter tags <CopyButton value={code} /></label>
      <div className="sheet mono-out" style={{ padding: 14 }}>{code}</div>
    </div>
  );
}

/* ---------------- Robots.txt Generator ---------------- */
export function RobotsTxtGenerator() {
  const [allowAll, setAllowAll] = useState(true);
  const [disallow, setDisallow] = useState("/admin\n/api");
  const [sitemap, setSitemap] = useState("https://example.com/sitemap.xml");
  const lines = ["User-agent: *"];
  if (allowAll) {
    lines.push("Allow: /");
    disallow.split("\n").map((l) => l.trim()).filter(Boolean).forEach((p) => lines.push(`Disallow: ${p}`));
  } else {
    lines.push("Disallow: /");
  }
  if (sitemap) lines.push("", `Sitemap: ${sitemap}`);
  const code = lines.join("\n");
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk"><input type="checkbox" checked={allowAll} onChange={(e) => setAllowAll(e.target.checked)} /> Allow crawlers (recommended)</label>
      </div>
      {allowAll ? (<><label className="fld">Paths to disallow (one per line)</label><textarea className="textarea" style={{ minHeight: 90 }} value={disallow} onChange={(e) => setDisallow(e.target.value)} /></>) : <p className="hint">All crawlers will be blocked from the entire site.</p>}
      <label className="fld" style={{ marginTop: 12 }}>Sitemap URL</label>
      <input className="input" value={sitemap} onChange={(e) => setSitemap(e.target.value)} />
      <label className="fld" style={{ marginTop: 16 }}>robots.txt <CopyButton value={code} /></label>
      <div className="sheet mono-out" style={{ padding: 14 }}>{code}</div>
    </div>
  );
}

/* ---------------- Slug Generator ---------------- */
export function SlugGenerator() {
  const [input, setInput] = useState("10 Best Free Developer Tools in 2026!");
  const slug = input.toLowerCase().trim().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  return (
    <div className="tool">
      <label className="fld">Title or text</label>
      <input className="input" value={input} onChange={(e) => setInput(e.target.value)} />
      <label className="fld" style={{ marginTop: 16 }}>SEO-friendly slug <CopyButton value={slug} /></label>
      <div className="sheet mono-out" style={{ padding: 14, fontSize: 16 }}>{slug || "—"}</div>
    </div>
  );
}
