"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";

/* ---------------- Hashtag Generator ---------------- */
const HASH_SUFFIX = ["love", "life", "daily", "insta", "gram", "community", "tips", "ideas", "2026", "trending", "viral", "reels", "explore", "photooftheday", "instagood"];
export function HashtagGenerator() {
  const [topic, setTopic] = useState("travel photography");
  const words = topic.toLowerCase().split(/[\s,]+/).map((w) => w.replace(/[^a-z0-9]/g, "")).filter(Boolean);
  const set = new Set();
  words.forEach((w) => { set.add("#" + w); });
  if (words.length > 1) set.add("#" + words.join(""));
  words.forEach((w) => HASH_SUFFIX.forEach((s) => { if (set.size < 30) set.add("#" + w + s); }));
  HASH_SUFFIX.forEach((s) => { if (set.size < 30 && words[0]) set.add("#" + s + words[0]); });
  const tags = [...set].slice(0, 30);
  const text = tags.join(" ");
  return (
    <div className="tool">
      <label className="fld">Topic or keywords</label>
      <input className="input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. fitness motivation" />
      <label className="fld" style={{ marginTop: 14 }}>{tags.length} hashtags <CopyButton value={text} label="Copy all" /></label>
      <div className="sheet" style={{ padding: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
        {tags.map((t) => <span key={t} className="badge badge-cat" style={{ marginTop: 0 }}>{t}</span>)}
      </div>
      <p className="hint">Tip: mix a few big hashtags with niche ones for the best reach.</p>
    </div>
  );
}

/* ---------------- Fancy Text Generator ---------------- */
function mapAlpha(text, U, L, D) {
  return [...text].map((ch) => {
    const c = ch.codePointAt(0);
    if (c >= 65 && c <= 90) return String.fromCodePoint(U + (c - 65));
    if (c >= 97 && c <= 122) return String.fromCodePoint(L + (c - 97));
    if (D && c >= 48 && c <= 57) return String.fromCodePoint(D + (c - 48));
    return ch;
  }).join("");
}
const combine = (text, mark) => [...text].map((ch) => ch + mark).join("");
export function FancyText() {
  const [input, setInput] = useState("Your name");
  const styles = {
    "𝗕𝗼𝗹𝗱": mapAlpha(input, 0x1D5D4, 0x1D5EE, 0x1D7EC),
    "𝑺𝒆𝒓𝒊𝒇 𝑩𝒐𝒍𝒅": mapAlpha(input, 0x1D400, 0x1D41A, 0x1D7CE),
    "𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎": mapAlpha(input, 0x1D670, 0x1D68A, 0x1D7F6),
    "Ｆｕｌｌｗｉｄｔｈ": mapAlpha(input, 0xFF21, 0xFF41, 0xFF10),
    "Ⓒⓘⓡⓒⓛⓔⓓ": mapAlpha(input, 0x24B6, 0x24D0, 0),
    "S̶t̶r̶i̶k̶e̶": combine(input, "̶"),
    "U̲n̲d̲e̲r̲l̲i̲n̲e̲": combine(input, "̲"),
  };
  return (
    <div className="tool">
      <label className="fld">Your text</label>
      <input className="input" value={input} onChange={(e) => setInput(e.target.value)} />
      <div className="stack-sm" style={{ marginTop: 12 }}>
        {Object.entries(styles).map(([name, val]) => (
          <div key={name} className="sheet flex-between" style={{ padding: "10px 14px", marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>{val}</span><CopyButton value={val} />
          </div>
        ))}
      </div>
      <p className="hint">Great for Instagram, TikTok &amp; Twitter/X bios. Paste anywhere.</p>
    </div>
  );
}

/* ---------------- YouTube Thumbnail Downloader ---------------- */
function ytId(url) {
  const m = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/|live\/))([\w-]{11})/);
  if (m) return m[1];
  return /^[\w-]{11}$/.test(url.trim()) ? url.trim() : null;
}
export function YoutubeThumbnail() {
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const id = ytId(url);
  const sizes = [["Max (1280×720)", "maxresdefault"], ["High (480×360)", "hqdefault"], ["Medium (320×180)", "mqdefault"], ["Standard (640×480)", "sddefault"]];
  return (
    <div className="tool">
      <label className="fld">YouTube video URL</label>
      <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
      {id ? (
        <div className="grid grid-2" style={{ marginTop: 14 }}>
          {sizes.map(([label, key]) => {
            const src = `https://img.youtube.com/vi/${id}/${key}.jpg`;
            return (
              <div key={key} className="sheet" style={{ padding: 12 }}>
                <div className="hint" style={{ margin: "0 0 6px" }}>{label}</div>
                <img src={src} alt={label} style={{ width: "100%", borderRadius: 6, border: "1px solid var(--line)" }} />
                <div style={{ marginTop: 8 }}><a className="btn btn-sm btn-outline" href={src} target="_blank" rel="noreferrer">Open / download</a></div>
              </div>
            );
          })}
        </div>
      ) : <p className="result-err hint">✗ Enter a valid YouTube URL.</p>}
      <p className="hint">Downloads the public thumbnail image (not the video).</p>
    </div>
  );
}

/* ---------------- YouTube Embed Generator ---------------- */
export function YoutubeEmbed() {
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const id = ytId(url);
  const code = id ? `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` : "";
  return (
    <div className="tool">
      <label className="fld">YouTube video URL</label>
      <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} />
      {id ? (
        <>
          <div className="center" style={{ margin: "14px 0" }}>
            <iframe width="100%" height="315" style={{ maxWidth: 560, border: 0, borderRadius: 8 }} src={`https://www.youtube.com/embed/${id}`} title="YouTube preview" allowFullScreen />
          </div>
          <label className="fld">Embed code <CopyButton value={code} /></label>
          <div className="sheet mono-out" style={{ padding: 12 }}>{code}</div>
        </>
      ) : <p className="result-err hint">✗ Enter a valid YouTube URL.</p>}
    </div>
  );
}

/* ---------------- Social Character Counter ---------------- */
const LIMITS = [["Twitter / X post", 280], ["Instagram caption", 2200], ["Instagram bio", 150], ["TikTok caption", 2200], ["Facebook post", 63206], ["LinkedIn post", 3000], ["YouTube title", 100], ["YouTube description", 5000]];
export function SocialCharacterCounter() {
  const [text, setText] = useState("");
  const len = text.length;
  return (
    <div className="tool">
      <label className="fld">Your post</label>
      <textarea className="textarea" style={{ minHeight: 120, fontFamily: "var(--sans)" }} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your caption or post…" />
      <p className="hint">{len} characters · {text.trim() ? text.trim().split(/\s+/).length : 0} words</p>
      <div className="grid grid-2" style={{ gap: 8 }}>
        {LIMITS.map(([name, limit]) => {
          const over = len > limit;
          return (
            <div key={name} className="sheet flex-between" style={{ padding: "10px 14px" }}>
              <span>{name}</span>
              <strong style={{ color: over ? "var(--red)" : "var(--green)" }}>{over ? `${len - limit} over` : `${limit - len} left`}</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- UTM Link Builder ---------------- */
export function UtmBuilder() {
  const [f, setF] = useState({ url: "https://example.com", source: "instagram", medium: "social", campaign: "launch", term: "", content: "" });
  const up = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const params = new URLSearchParams();
  if (f.source) params.set("utm_source", f.source);
  if (f.medium) params.set("utm_medium", f.medium);
  if (f.campaign) params.set("utm_campaign", f.campaign);
  if (f.term) params.set("utm_term", f.term);
  if (f.content) params.set("utm_content", f.content);
  const out = f.url + (f.url.includes("?") ? "&" : "?") + params.toString();
  return (
    <div className="tool">
      <div className="grid grid-2" style={{ gap: 12 }}>
        <div><label className="fld">Website URL</label><input className="input" value={f.url} onChange={(e) => up("url", e.target.value)} /></div>
        <div><label className="fld">Campaign source</label><input className="input" value={f.source} onChange={(e) => up("source", e.target.value)} placeholder="instagram, newsletter…" /></div>
        <div><label className="fld">Medium</label><input className="input" value={f.medium} onChange={(e) => up("medium", e.target.value)} placeholder="social, email, cpc…" /></div>
        <div><label className="fld">Campaign name</label><input className="input" value={f.campaign} onChange={(e) => up("campaign", e.target.value)} /></div>
        <div><label className="fld">Term (optional)</label><input className="input" value={f.term} onChange={(e) => up("term", e.target.value)} /></div>
        <div><label className="fld">Content (optional)</label><input className="input" value={f.content} onChange={(e) => up("content", e.target.value)} /></div>
      </div>
      <label className="fld" style={{ marginTop: 14 }}>Your tracked link <CopyButton value={out} /></label>
      <div className="sheet mono-out" style={{ padding: 12 }}>{out}</div>
    </div>
  );
}
