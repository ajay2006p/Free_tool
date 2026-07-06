"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";

/* ---------------- Twitter Card Generator ---------------- */
export function TwitterCardGenerator() {
  const [f, setF] = useState({ card: "summary_large_image", site: "@yourhandle", title: "My Page", desc: "A short description.", image: "https://example.com/preview.png" });
  const up = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const code = [
    `<meta name="twitter:card" content="${f.card}" />`,
    `<meta name="twitter:site" content="${f.site}" />`,
    `<meta name="twitter:title" content="${f.title}" />`,
    `<meta name="twitter:description" content="${f.desc}" />`,
    `<meta name="twitter:image" content="${f.image}" />`,
  ].join("\n");
  return (
    <div className="tool">
      <div className="grid grid-2" style={{ gap: 14 }}>
        <div><label className="fld">Card type</label>
          <select className="select" value={f.card} onChange={(e) => up("card", e.target.value)}><option>summary</option><option>summary_large_image</option></select></div>
        <div><label className="fld">Site handle</label><input className="input" value={f.site} onChange={(e) => up("site", e.target.value)} /></div>
        <div><label className="fld">Title</label><input className="input" value={f.title} onChange={(e) => up("title", e.target.value)} /></div>
        <div><label className="fld">Image URL</label><input className="input" value={f.image} onChange={(e) => up("image", e.target.value)} /></div>
      </div>
      <label className="fld" style={{ marginTop: 12 }}>Description</label>
      <input className="input" value={f.desc} onChange={(e) => up("desc", e.target.value)} />
      <label className="fld" style={{ marginTop: 16 }}>Twitter card tags <CopyButton value={code} /></label>
      <div className="sheet mono-out" style={{ padding: 14 }}>{code}</div>
    </div>
  );
}

/* ---------------- Schema (JSON-LD) Generator ---------------- */
export function SchemaGenerator() {
  const [type, setType] = useState("Article");
  const [f, setF] = useState({ name: "My Title", author: "Jane Doe", url: "https://example.com", desc: "Description", price: "0", brand: "DevHub" });
  const up = (k, v) => setF((s) => ({ ...s, [k]: v }));
  let obj = { "@context": "https://schema.org", "@type": type };
  if (type === "Article") obj = { ...obj, headline: f.name, author: { "@type": "Person", name: f.author }, description: f.desc, url: f.url };
  else if (type === "Product") obj = { ...obj, name: f.name, brand: { "@type": "Brand", name: f.brand }, description: f.desc, offers: { "@type": "Offer", price: f.price, priceCurrency: "USD" } };
  else if (type === "Organization") obj = { ...obj, name: f.name, url: f.url, description: f.desc };
  else if (type === "FAQPage") obj = { ...obj, mainEntity: [{ "@type": "Question", name: f.name, acceptedAnswer: { "@type": "Answer", text: f.desc } }] };
  const code = `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`;
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk">Type
          <select className="select" style={{ width: 160 }} value={type} onChange={(e) => setType(e.target.value)}>
            <option>Article</option><option>Product</option><option>Organization</option><option>FAQPage</option>
          </select>
        </label>
      </div>
      <div className="grid grid-2" style={{ gap: 14 }}>
        <div><label className="fld">{type === "FAQPage" ? "Question" : "Name / Title"}</label><input className="input" value={f.name} onChange={(e) => up("name", e.target.value)} /></div>
        {type === "Article" ? <div><label className="fld">Author</label><input className="input" value={f.author} onChange={(e) => up("author", e.target.value)} /></div> : null}
        {type === "Product" ? <div><label className="fld">Price (USD)</label><input className="input" value={f.price} onChange={(e) => up("price", e.target.value)} /></div> : null}
        {(type === "Organization" || type === "Article") ? <div><label className="fld">URL</label><input className="input" value={f.url} onChange={(e) => up("url", e.target.value)} /></div> : null}
      </div>
      <label className="fld" style={{ marginTop: 12 }}>{type === "FAQPage" ? "Answer" : "Description"}</label>
      <input className="input" value={f.desc} onChange={(e) => up("desc", e.target.value)} />
      <label className="fld" style={{ marginTop: 16 }}>JSON-LD <CopyButton value={code} /></label>
      <div className="sheet mono-out" style={{ padding: 14 }}>{code}</div>
    </div>
  );
}

/* ---------------- Heading Checker ---------------- */
export function HeadingChecker() {
  const [html, setHtml] = useState('<h1>Main title</h1>\n<h2>Section</h2>\n<h4>Skipped h3!</h4>\n<h2>Another section</h2>');
  const matches = [...html.matchAll(/<h([1-6])[^>]*>(.*?)<\/h\1>/gis)].map((m) => ({ level: Number(m[1]), text: m[2].replace(/<[^>]+>/g, "").trim() }));
  const h1s = matches.filter((h) => h.level === 1).length;
  const warnings = [];
  if (h1s === 0) warnings.push("No <h1> found — every page should have exactly one.");
  if (h1s > 1) warnings.push(`Found ${h1s} <h1> tags — use only one per page.`);
  for (let i = 1; i < matches.length; i++) if (matches[i].level - matches[i - 1].level > 1) warnings.push(`Heading level skipped: h${matches[i - 1].level} → h${matches[i].level} ("${matches[i].text}").`);
  return (
    <div className="tool">
      <label className="fld">Paste your HTML</label>
      <textarea className="textarea" value={html} onChange={(e) => setHtml(e.target.value)} />
      <label className="fld" style={{ marginTop: 12 }}>Outline</label>
      <div className="sheet" style={{ padding: 14 }}>
        {matches.length === 0 ? <p className="hint">No headings found.</p> : matches.map((h, i) => (
          <div key={i} style={{ paddingLeft: (h.level - 1) * 18, fontFamily: "var(--sans)", fontSize: 14 }}><span className="badge badge-cat">h{h.level}</span> {h.text}</div>
        ))}
      </div>
      {warnings.length ? <div className="notice notice-warn mt-2">{warnings.map((w, i) => <div key={i}>⚠️ {w}</div>)}</div> : <p className="result-ok hint">✓ Heading structure looks good.</p>}
    </div>
  );
}

/* ---------------- Sitemap Generator ---------------- */
export function SitemapGenerator() {
  const [urls, setUrls] = useState("https://example.com/\nhttps://example.com/about\nhttps://example.com/blog");
  const list = urls.split(/\r?\n/).map((u) => u.trim()).filter(Boolean);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${list.map((u) => `  <url>\n    <loc>${u}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`).join("\n")}\n</urlset>`;
  return (
    <div className="tool">
      <label className="fld">Your URLs (one per line)</label>
      <textarea className="textarea" value={urls} onChange={(e) => setUrls(e.target.value)} />
      <label className="fld" style={{ marginTop: 12 }}>sitemap.xml — {list.length} URL{list.length === 1 ? "" : "s"} <CopyButton value={xml} /></label>
      <div className="sheet mono-out" style={{ padding: 14 }}>{xml}</div>
    </div>
  );
}
