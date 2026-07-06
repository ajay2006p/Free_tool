"use client";

import { useMemo, useState } from "react";
import { marked } from "marked";
import CopyButton from "../CopyButton";

/* ---------------- JSON Formatter ---------------- */
export function JsonFormatter() {
  const [input, setInput] = useState('{"hello":"world","list":[1,2,3],"nested":{"ok":true}}');
  const [indent, setIndent] = useState(2);
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");

  function run(minify) {
    try {
      const parsed = JSON.parse(input);
      setOut(JSON.stringify(parsed, null, minify ? 0 : indent));
      setErr("");
    } catch (e) {
      setErr(e.message);
      setOut("");
    }
  }
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk">Indent
          <select className="select" style={{ width: 70 }} value={indent} onChange={(e) => setIndent(Number(e.target.value))}>
            <option value={2}>2</option><option value={4}>4</option><option value={8}>8</option>
          </select>
        </label>
        <button className="btn btn-sm" onClick={() => run(false)}>Beautify</button>
        <button className="btn btn-sm btn-outline" onClick={() => run(true)}>Minify</button>
      </div>
      <div className="tool-io">
        <div>
          <label className="fld">Input JSON</label>
          <textarea className="textarea" value={input} onChange={(e) => setInput(e.target.value)} />
        </div>
        <div>
          <label className="fld">Output {out ? <CopyButton value={out} /> : null}</label>
          <textarea className="textarea" readOnly value={out} placeholder="Formatted JSON appears here" />
        </div>
      </div>
      {err ? <p className="result-err hint">✗ {err}</p> : out ? <p className="result-ok hint">✓ Valid JSON</p> : null}
    </div>
  );
}

/* ---------------- Base64 ---------------- */
export function Base64Tool() {
  const [mode, setMode] = useState("encode");
  const [input, setInput] = useState("Hello, world!");
  let out = "";
  let err = "";
  try {
    out = mode === "encode"
      ? btoa(unescape(encodeURIComponent(input)))
      : decodeURIComponent(escape(atob(input)));
  } catch (e) { err = "Invalid input for " + mode; }
  return (
    <div className="tool">
      <div className="tool-controls">
        <div className="pill-group">
          <button className={mode === "encode" ? "on" : ""} onClick={() => setMode("encode")}>Encode</button>
          <button className={mode === "decode" ? "on" : ""} onClick={() => setMode("decode")}>Decode</button>
        </div>
      </div>
      <div className="tool-io">
        <div><label className="fld">Input</label><textarea className="textarea" value={input} onChange={(e) => setInput(e.target.value)} /></div>
        <div><label className="fld">Output {out ? <CopyButton value={out} /> : null}</label><textarea className="textarea" readOnly value={err ? "" : out} /></div>
      </div>
      {err ? <p className="result-err hint">✗ {err}</p> : null}
    </div>
  );
}

/* ---------------- URL Encoder ---------------- */
export function UrlEncoder() {
  const [mode, setMode] = useState("encode");
  const [input, setInput] = useState("https://example.com/search?q=hello world&x=1");
  let out = ""; let err = "";
  try { out = mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input); }
  catch (e) { err = "Invalid input"; }
  return (
    <div className="tool">
      <div className="tool-controls">
        <div className="pill-group">
          <button className={mode === "encode" ? "on" : ""} onClick={() => setMode("encode")}>Encode</button>
          <button className={mode === "decode" ? "on" : ""} onClick={() => setMode("decode")}>Decode</button>
        </div>
      </div>
      <div className="tool-io">
        <div><label className="fld">Input</label><textarea className="textarea" value={input} onChange={(e) => setInput(e.target.value)} /></div>
        <div><label className="fld">Output {out ? <CopyButton value={out} /> : null}</label><textarea className="textarea" readOnly value={err ? "" : out} /></div>
      </div>
      {err ? <p className="result-err hint">✗ {err}</p> : null}
    </div>
  );
}

/* ---------------- JWT Decoder ---------------- */
export function JwtDecoder() {
  const [token, setToken] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
  function part(i) {
    try {
      const seg = token.split(".")[i];
      if (!seg) return "";
      const json = decodeURIComponent(escape(atob(seg.replace(/-/g, "+").replace(/_/g, "/"))));
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch (e) { return "// could not decode this segment"; }
  }
  const header = part(0), payload = part(1);
  return (
    <div className="tool">
      <label className="fld">Paste JWT</label>
      <textarea className="textarea" style={{ minHeight: 110 }} value={token} onChange={(e) => setToken(e.target.value)} />
      <div className="tool-io" style={{ marginTop: 14 }}>
        <div><label className="fld">Header</label><textarea className="textarea" readOnly value={header} /></div>
        <div><label className="fld">Payload</label><textarea className="textarea" readOnly value={payload} /></div>
      </div>
      <p className="hint">⚠️ Decoding does not verify the signature. Never paste production secrets.</p>
    </div>
  );
}

/* ---------------- UUID Generator ---------------- */
function uuidv4() {
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, "0"));
  return `${h[0]}${h[1]}${h[2]}${h[3]}-${h[4]}${h[5]}-${h[6]}${h[7]}-${h[8]}${h[9]}-${h[10]}${h[11]}${h[12]}${h[13]}${h[14]}${h[15]}`;
}
export function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [list, setList] = useState(() => Array.from({ length: 5 }, uuidv4));
  const text = list.join("\n");
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk">How many
          <input className="input" style={{ width: 80 }} type="number" min={1} max={100} value={count} onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value) || 1)))} />
        </label>
        <button className="btn btn-sm" onClick={() => setList(Array.from({ length: count }, uuidv4))}>Generate</button>
        <CopyButton value={text} label="Copy all" />
      </div>
      <textarea className="textarea mono-out" readOnly value={text} />
    </div>
  );
}

/* ---------------- Hash Generator ---------------- */
export function HashGenerator() {
  const [input, setInput] = useState("hello");
  const [algo, setAlgo] = useState("SHA-256");
  const [hash, setHash] = useState("");
  async function run() {
    const data = new TextEncoder().encode(input);
    const buf = await crypto.subtle.digest(algo, data);
    setHash([...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join(""));
  }
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk">Algorithm
          <select className="select" style={{ width: 130 }} value={algo} onChange={(e) => setAlgo(e.target.value)}>
            <option>SHA-1</option><option>SHA-256</option><option>SHA-384</option><option>SHA-512</option>
          </select>
        </label>
        <button className="btn btn-sm" onClick={run}>Hash it</button>
      </div>
      <label className="fld">Text</label>
      <textarea className="textarea" style={{ minHeight: 120 }} value={input} onChange={(e) => setInput(e.target.value)} />
      {hash ? (<><label className="fld" style={{ marginTop: 14 }}>{algo} hash <CopyButton value={hash} /></label><div className="sheet mono-out" style={{ padding: 12 }}>{hash}</div></>) : null}
    </div>
  );
}

/* ---------------- Password Generator ---------------- */
export function PasswordGenerator() {
  const [len, setLen] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [nums, setNums] = useState(true);
  const [syms, setSyms] = useState(true);
  const [pw, setPw] = useState("");
  function gen() {
    let chars = "";
    if (upper) chars += "ABCDEFGHJKLMNPQRSTUVWXYZ";
    if (lower) chars += "abcdefghijkmnopqrstuvwxyz";
    if (nums) chars += "23456789";
    if (syms) chars += "!@#$%^&*()-_=+[]{}";
    if (!chars) { setPw(""); return; }
    const arr = crypto.getRandomValues(new Uint32Array(len));
    setPw([...arr].map((n) => chars[n % chars.length]).join(""));
  }
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk">Length: <strong>{len}</strong>
          <input type="range" min={6} max={64} value={len} onChange={(e) => setLen(Number(e.target.value))} />
        </label>
      </div>
      <div className="tool-controls">
        <label className="chk"><input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} /> Uppercase</label>
        <label className="chk"><input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} /> Lowercase</label>
        <label className="chk"><input type="checkbox" checked={nums} onChange={(e) => setNums(e.target.checked)} /> Numbers</label>
        <label className="chk"><input type="checkbox" checked={syms} onChange={(e) => setSyms(e.target.checked)} /> Symbols</label>
        <button className="btn btn-sm" onClick={gen}>Generate</button>
      </div>
      {pw ? (<div className="sheet mono-out flex-between" style={{ padding: "14px 16px", fontSize: 18 }}><span>{pw}</span><CopyButton value={pw} /></div>) : <p className="hint">Pick options and click Generate.</p>}
    </div>
  );
}

/* ---------------- Lorem Ipsum ---------------- */
const LOREM = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat".split(" ");
export function LoremIpsum() {
  const [paras, setParas] = useState(3);
  const text = useMemo(() => {
    const out = [];
    for (let p = 0; p < paras; p++) {
      const n = 40 + (p * 7) % 30;
      const words = Array.from({ length: n }, (_, i) => LOREM[(i * 3 + p) % LOREM.length]);
      let s = words.join(" ");
      s = s.charAt(0).toUpperCase() + s.slice(1) + ".";
      out.push(s);
    }
    return out.join("\n\n");
  }, [paras]);
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk">Paragraphs
          <input className="input" style={{ width: 80 }} type="number" min={1} max={20} value={paras} onChange={(e) => setParas(Math.min(20, Math.max(1, Number(e.target.value) || 1)))} />
        </label>
        <CopyButton value={text} label="Copy" />
      </div>
      <textarea className="textarea" style={{ fontFamily: "var(--serif)" }} readOnly value={text} />
    </div>
  );
}

/* ---------------- Case Converter ---------------- */
export function CaseConverter() {
  const [input, setInput] = useState("The quick brown Fox");
  const words = input.trim().split(/[\s_-]+/).filter(Boolean);
  const cases = {
    "UPPERCASE": input.toUpperCase(),
    "lowercase": input.toLowerCase(),
    "Title Case": input.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()),
    "Sentence case": input.charAt(0).toUpperCase() + input.slice(1).toLowerCase(),
    "camelCase": words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(""),
    "PascalCase": words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(""),
    "snake_case": words.map((w) => w.toLowerCase()).join("_"),
    "kebab-case": words.map((w) => w.toLowerCase()).join("-"),
    "CONSTANT_CASE": words.map((w) => w.toUpperCase()).join("_"),
  };
  return (
    <div className="tool">
      <label className="fld">Text</label>
      <textarea className="textarea" style={{ minHeight: 90 }} value={input} onChange={(e) => setInput(e.target.value)} />
      <div className="grid grid-2" style={{ marginTop: 14, gap: 10 }}>
        {Object.entries(cases).map(([name, val]) => (
          <div key={name} className="sheet flex-between" style={{ padding: "10px 14px" }}>
            <div><div className="hint" style={{ margin: 0 }}>{name}</div><div className="mono-out" style={{ fontSize: 14 }}>{val}</div></div>
            <CopyButton value={val} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Word Counter ---------------- */
export function WordCounter() {
  const [input, setInput] = useState("");
  const words = input.trim() ? input.trim().split(/\s+/).length : 0;
  const chars = input.length;
  const charsNoSpace = input.replace(/\s/g, "").length;
  const sentences = (input.match(/[.!?]+/g) || []).length;
  const lines = input ? input.split(/\n/).length : 0;
  const readMins = Math.max(1, Math.round(words / 200));
  const stat = (n, l) => (<div className="sheet center" style={{ padding: 16 }}><div style={{ fontSize: 26, fontWeight: 700 }}>{n}</div><div className="hint" style={{ margin: 0 }}>{l}</div></div>);
  return (
    <div className="tool">
      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        {stat(words, "Words")}{stat(chars, "Characters")}{stat(charsNoSpace, "No spaces")}{stat(sentences, "Sentences")}
      </div>
      <div className="grid grid-2" style={{ marginBottom: 16 }}>{stat(lines, "Lines")}{stat(readMins + " min", "Read time")}</div>
      <textarea className="textarea" style={{ fontFamily: "var(--sans)", minHeight: 200 }} placeholder="Start typing or paste your text…" value={input} onChange={(e) => setInput(e.target.value)} />
    </div>
  );
}

/* ---------------- Color Converter ---------------- */
function hexToRgb(hex) {
  const m = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(m)) return null;
  return { r: parseInt(m.slice(0, 2), 16), g: parseInt(m.slice(2, 4), 16), b: parseInt(m.slice(4, 6), 16) };
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
export function ColorConverter() {
  const [hex, setHex] = useState("#b5482e");
  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const rgbStr = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "";
  const hslStr = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "";
  return (
    <div className="tool">
      <div className="tool-controls">
        <input type="color" value={rgb ? hex : "#000000"} onChange={(e) => setHex(e.target.value)} style={{ width: 54, height: 40, border: "none", background: "none" }} />
        <input className="input" style={{ width: 140 }} value={hex} onChange={(e) => setHex(e.target.value)} />
      </div>
      <div className="swatch" style={{ background: rgb ? hex : "#eee", marginBottom: 14 }} />
      {rgb ? (
        <div className="stack-sm">
          {[["HEX", hex], ["RGB", rgbStr], ["HSL", hslStr]].map(([k, v]) => (
            <div key={k} className="sheet flex-between" style={{ padding: "10px 14px", marginBottom: 8 }}>
              <span><strong>{k}</strong> &nbsp; <span className="mono-out">{v}</span></span><CopyButton value={v} />
            </div>
          ))}
        </div>
      ) : <p className="result-err hint">✗ Enter a valid 6-digit hex like #b5482e</p>}
    </div>
  );
}

/* ---------------- Regex Tester ---------------- */
export function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Contact us at hi@site.com or sales@shop.io today.");
  let matches = []; let err = "";
  try {
    const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
    matches = [...text.matchAll(re)].map((m) => m[0]);
  } catch (e) { err = e.message; }
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk" style={{ flex: 1 }}>/ <input className="input" value={pattern} onChange={(e) => setPattern(e.target.value)} /> /</label>
        <input className="input" style={{ width: 80 }} value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="flags" />
      </div>
      <label className="fld">Test string</label>
      <textarea className="textarea" style={{ minHeight: 120, fontFamily: "var(--sans)" }} value={text} onChange={(e) => setText(e.target.value)} />
      {err ? <p className="result-err hint">✗ {err}</p> : <p className="result-ok hint">✓ {matches.length} match{matches.length === 1 ? "" : "es"}: {matches.slice(0, 20).map((m, i) => <code key={i} style={{ marginRight: 6 }}>{m}</code>)}</p>}
    </div>
  );
}

/* ---------------- Markdown Previewer ---------------- */
export function MarkdownPreviewer() {
  const [md, setMd] = useState("# Hello\n\nType **Markdown** on the left.\n\n- Lists\n- `code`\n- [links](https://example.com)\n\n> Quotes too!");
  const html = useMemo(() => marked.parse(md || ""), [md]);
  return (
    <div className="tool">
      <div className="tool-io">
        <div><label className="fld">Markdown</label><textarea className="textarea" style={{ minHeight: 320 }} value={md} onChange={(e) => setMd(e.target.value)} /></div>
        <div><label className="fld">Preview</label><div className="sheet prose" style={{ padding: 16, minHeight: 320, fontSize: 16 }} dangerouslySetInnerHTML={{ __html: html }} /></div>
      </div>
    </div>
  );
}

/* ---------------- QR Code Generator ---------------- */
export function QrCodeGenerator() {
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState(240);
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
  return (
    <div className="tool">
      <label className="fld">Text or URL</label>
      <textarea className="textarea" style={{ minHeight: 90, fontFamily: "var(--sans)" }} value={text} onChange={(e) => setText(e.target.value)} />
      <div className="tool-controls" style={{ marginTop: 12 }}>
        <label className="chk">Size: {size}px<input type="range" min={120} max={480} step={40} value={size} onChange={(e) => setSize(Number(e.target.value))} /></label>
      </div>
      <div className="center">
        {text ? <img src={src} alt="QR code" width={size} height={size} style={{ margin: "10px auto", background: "#fff", borderRadius: 8, padding: 10 }} /> : <p className="hint">Enter text to generate a QR code.</p>}
        <div><a className="btn btn-sm btn-outline" href={src} target="_blank" rel="noreferrer">Open / download image</a></div>
      </div>
    </div>
  );
}
