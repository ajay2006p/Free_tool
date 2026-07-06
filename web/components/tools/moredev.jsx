"use client";

import { useState, useRef } from "react";
import CopyButton from "../CopyButton";

/* ---------------- XML / HTML Formatter (shared) ---------------- */
function prettyMarkup(input) {
  const PAD = "  ";
  let xml = input.replace(/\r?\n/g, "").replace(/>\s*</g, ">\n<");
  let pad = 0;
  return xml.split("\n").map((raw) => {
    const node = raw.trim();
    if (!node) return "";
    let indent = 0;
    if (node.match(/^<\/\w/)) { pad = Math.max(0, pad - 1); }
    else if (node.match(/^<\w[^>]*[^/]>.*$/) && !node.match(/.+<\/\w[^>]*>$/) && !node.match(/\/>$/)) { indent = 1; }
    const line = PAD.repeat(pad) + node;
    pad += indent;
    return line;
  }).filter(Boolean).join("\n");
}
export function XmlFormatter() { return <MarkupTool label="XML" sample={'<note><to>You</to><from>Me</from><body>Hi there</body></note>'} />; }
export function HtmlFormatter() { return <MarkupTool label="HTML" sample={'<div class="box"><h1>Title</h1><p>Hello <b>world</b></p></div>'} />; }
function MarkupTool({ label, sample }) {
  const [input, setInput] = useState(sample);
  let out = ""; let err = "";
  try { out = prettyMarkup(input); } catch (e) { err = "Could not format"; }
  return (
    <div className="tool">
      <div className="tool-io">
        <div><label className="fld">{label} input</label><textarea className="textarea" value={input} onChange={(e) => setInput(e.target.value)} /></div>
        <div><label className="fld">Formatted {out ? <CopyButton value={out} /> : null}</label><textarea className="textarea" readOnly value={out} /></div>
      </div>
      {err ? <p className="result-err hint">✗ {err}</p> : null}
    </div>
  );
}

/* ---------------- YAML tidy ---------------- */
export function YamlFormatter() {
  const [input, setInput] = useState("name:   DevHub\nservices:\n  - tools\n  - blog\nactive: true");
  const out = input
    .replace(/\t/g, "  ")
    .split("\n")
    .map((l) => l.replace(/\s+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^(\s*[\w-]+):\s+/gm, "$1: ");
  return (
    <div className="tool">
      <div className="tool-io">
        <div><label className="fld">YAML input</label><textarea className="textarea" value={input} onChange={(e) => setInput(e.target.value)} /></div>
        <div><label className="fld">Tidied <CopyButton value={out} /></label><textarea className="textarea" readOnly value={out} /></div>
      </div>
      <p className="hint">Normalizes indentation (tabs → 2 spaces), trims trailing spaces and collapses blank lines.</p>
    </div>
  );
}

/* ---------------- SQL Formatter ---------------- */
export function SqlFormatter() {
  const [input, setInput] = useState("select id, name, email from users where active = 1 and age > 18 order by name limit 10");
  function format(sql) {
    const majors = ["from", "where", "group by", "order by", "having", "limit", "left join", "right join", "inner join", "join", "union", "values", "set"];
    let s = sql.replace(/\s+/g, " ").trim();
    majors.forEach((k) => { s = s.replace(new RegExp("\\s+" + k.replace(/ /g, "\\s+") + "\\b", "gi"), "\n" + k.toUpperCase()); });
    s = s.replace(/\bselect\b/gi, "SELECT").replace(/\bupdate\b/gi, "UPDATE").replace(/\binsert into\b/gi, "INSERT INTO").replace(/\bdelete\b/gi, "DELETE").replace(/\band\b/gi, "\n  AND").replace(/\bor\b/gi, "\n  OR").replace(/\bon\b/gi, "ON");
    return s;
  }
  const out = format(input);
  return (
    <div className="tool">
      <div className="tool-io">
        <div><label className="fld">SQL</label><textarea className="textarea" value={input} onChange={(e) => setInput(e.target.value)} /></div>
        <div><label className="fld">Formatted <CopyButton value={out} /></label><textarea className="textarea" readOnly value={out} /></div>
      </div>
    </div>
  );
}

/* ---------------- CSS / JS Minifier ---------------- */
export function CssMinifier() {
  const [input, setInput] = useState(".box {\n  color: red;\n  /* comment */\n  margin: 0 auto;\n}");
  const out = input.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s*([{};:,>])\s*/g, "$1").replace(/;}/g, "}").replace(/\s+/g, " ").trim();
  const saved = input.length ? Math.round((1 - out.length / input.length) * 100) : 0;
  return <MinTool label="CSS" input={input} setInput={setInput} out={out} saved={saved} />;
}
export function JsMinifier() {
  const [input, setInput] = useState("function add(a, b) {\n  // returns sum\n  return a + b;\n}");
  const out = input.replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\n\s*/g, "\n").replace(/\n+/g, " ").replace(/\s*([=+\-*/{};,()<>])\s*/g, "$1").trim();
  const saved = input.length ? Math.round((1 - out.length / input.length) * 100) : 0;
  return (
    <div className="tool">
      <MinTool label="JavaScript" input={input} setInput={setInput} out={out} saved={saved} />
      <p className="hint">⚠️ Basic minifier — strips comments &amp; whitespace. For production use a real bundler (esbuild, terser).</p>
    </div>
  );
}
function MinTool({ label, input, setInput, out, saved }) {
  return (
    <div className="tool">
      <div className="tool-io">
        <div><label className="fld">{label}</label><textarea className="textarea" value={input} onChange={(e) => setInput(e.target.value)} /></div>
        <div><label className="fld">Minified — {saved}% smaller {out ? <CopyButton value={out} /> : null}</label><textarea className="textarea" readOnly value={out} /></div>
      </div>
    </div>
  );
}

/* ---------------- CSV ⇄ JSON ---------------- */
export function CsvConverter() {
  const [csv, setCsv] = useState("name,role,city\nAda,Engineer,London\nGrace,Admiral,New York");
  const [json, setJson] = useState("");
  const [err, setErr] = useState("");
  function toJson() {
    try {
      const [head, ...rows] = csv.trim().split(/\r?\n/);
      const keys = head.split(",").map((k) => k.trim());
      const arr = rows.filter(Boolean).map((r) => {
        const vals = r.split(",");
        return Object.fromEntries(keys.map((k, i) => [k, (vals[i] || "").trim()]));
      });
      setJson(JSON.stringify(arr, null, 2)); setErr("");
    } catch (e) { setErr("Could not parse CSV"); }
  }
  function toCsv() {
    try {
      const arr = JSON.parse(json);
      const keys = [...new Set(arr.flatMap((o) => Object.keys(o)))];
      setCsv([keys.join(","), ...arr.map((o) => keys.map((k) => o[k] ?? "").join(","))].join("\n")); setErr("");
    } catch (e) { setErr("Could not parse JSON"); }
  }
  return (
    <div className="tool">
      <div className="tool-controls"><button className="btn btn-sm" onClick={toJson}>CSV → JSON ↓</button><button className="btn btn-sm btn-outline" onClick={toCsv}>JSON → CSV ↑</button></div>
      <div className="tool-io">
        <div><label className="fld">CSV</label><textarea className="textarea" value={csv} onChange={(e) => setCsv(e.target.value)} /></div>
        <div><label className="fld">JSON {json ? <CopyButton value={json} /> : null}</label><textarea className="textarea" value={json} onChange={(e) => setJson(e.target.value)} /></div>
      </div>
      {err ? <p className="result-err hint">✗ {err}</p> : null}
    </div>
  );
}

/* ---------------- CSS Gradient Generator ---------------- */
export function GradientGenerator() {
  const [c1, setC1] = useState("#b5482e");
  const [c2, setC2] = useState("#c99a2e");
  const [angle, setAngle] = useState(135);
  const css = `background: linear-gradient(${angle}deg, ${c1}, ${c2});`;
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk">Color 1 <input type="color" value={c1} onChange={(e) => setC1(e.target.value)} /></label>
        <label className="chk">Color 2 <input type="color" value={c2} onChange={(e) => setC2(e.target.value)} /></label>
        <label className="chk">Angle {angle}° <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} /></label>
      </div>
      <div style={{ height: 160, borderRadius: 8, border: "1px solid var(--line)", background: `linear-gradient(${angle}deg, ${c1}, ${c2})` }} />
      <label className="fld" style={{ marginTop: 12 }}>CSS <CopyButton value={css} /></label>
      <div className="sheet mono-out" style={{ padding: 12 }}>{css}</div>
    </div>
  );
}

/* ---------------- Image Compressor ---------------- */
export function ImageCompressor() {
  const [src, setSrc] = useState("");
  const [origSize, setOrigSize] = useState(0);
  const [outUrl, setOutUrl] = useState("");
  const [outSize, setOutSize] = useState(0);
  const [quality, setQuality] = useState(0.7);
  const imgRef = useRef(null);

  function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setOrigSize(file.size);
    const reader = new FileReader();
    reader.onload = () => { setSrc(reader.result); setOutUrl(""); };
    reader.readAsDataURL(file);
  }
  function compress() {
    const img = imgRef.current;
    if (!img) return;
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    canvas.getContext("2d").drawImage(img, 0, 0);
    canvas.toBlob((blob) => { if (blob) { setOutSize(blob.size); setOutUrl(URL.createObjectURL(blob)); } }, "image/jpeg", quality);
  }
  const kb = (n) => (n / 1024).toFixed(1) + " KB";
  return (
    <div className="tool">
      <input type="file" accept="image/*" onChange={onFile} className="input" />
      {src ? (
        <>
          <div className="tool-controls" style={{ marginTop: 12 }}>
            <label className="chk">Quality {Math.round(quality * 100)}% <input type="range" min={10} max={100} value={quality * 100} onChange={(e) => setQuality(Number(e.target.value) / 100)} /></label>
            <button className="btn btn-sm" onClick={compress}>Compress</button>
          </div>
          <div className="tool-io" style={{ marginTop: 10 }}>
            <div><label className="fld">Original — {kb(origSize)}</label><img ref={imgRef} src={src} alt="original" style={{ maxHeight: 220, borderRadius: 6, border: "1px solid var(--line)" }} /></div>
            <div><label className="fld">Compressed {outSize ? `— ${kb(outSize)} (${Math.round((1 - outSize / origSize) * 100)}% smaller)` : ""}</label>
              {outUrl ? <><img src={outUrl} alt="compressed" style={{ maxHeight: 220, borderRadius: 6, border: "1px solid var(--line)" }} /><div style={{ marginTop: 8 }}><a className="btn btn-sm btn-outline" href={outUrl} download="compressed.jpg">Download</a></div></> : <p className="hint">Click Compress.</p>}
            </div>
          </div>
        </>
      ) : <p className="hint">Choose an image to compress. Everything happens in your browser.</p>}
    </div>
  );
}
