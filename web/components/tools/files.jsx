"use client";

import { useState, useRef, useEffect } from "react";

function downloadBytes(bytes, name, type = "application/pdf") {
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
const kb = (n) => n < 1048576 ? (n / 1024).toFixed(1) + " KB" : (n / 1048576).toFixed(2) + " MB";

/* ---------------- PDF Merge ---------------- */
export function PdfMerge() {
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function merge() {
    if (files.length < 2) { setErr("Choose at least 2 PDFs."); return; }
    setBusy(true); setErr("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const out = await PDFDocument.create();
      for (const f of files) {
        const doc = await PDFDocument.load(await f.arrayBuffer());
        const pages = await out.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      downloadBytes(await out.save(), "merged.pdf");
    } catch (e) { setErr("Could not merge — make sure all files are valid PDFs."); }
    finally { setBusy(false); }
  }
  return (
    <div className="tool">
      <label className="fld">Select PDFs (in the order you want them)</label>
      <input type="file" accept="application/pdf" multiple className="input" onChange={(e) => setFiles([...e.target.files])} />
      {files.length ? <p className="hint">{files.length} file(s): {files.map((f) => f.name).join(", ")}</p> : null}
      <button className="btn" onClick={merge} disabled={busy} style={{ marginTop: 8 }}>{busy ? "Merging…" : "Merge & download"}</button>
      {err ? <div className="notice notice-warn" style={{ marginTop: 10 }}>{err}</div> : null}
      <p className="hint">100% private — your files never leave your browser.</p>
    </div>
  );
}

/* ---------------- PDF Split ---------------- */
export function PdfSplit() {
  const [file, setFile] = useState(null);
  const [range, setRange] = useState("1-3");
  const [pageCount, setPageCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function onFile(e) {
    const f = e.target.files?.[0]; setFile(f); setErr("");
    if (f) { try { const { PDFDocument } = await import("pdf-lib"); const d = await PDFDocument.load(await f.arrayBuffer()); setPageCount(d.getPageCount()); } catch { setErr("Not a valid PDF."); } }
  }
  function parseRange(str, max) {
    const idx = new Set();
    str.split(",").forEach((part) => {
      const m = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
      if (!m) return;
      const a = +m[1], b = m[2] ? +m[2] : a;
      for (let i = a; i <= b; i++) if (i >= 1 && i <= max) idx.add(i - 1);
    });
    return [...idx].sort((x, y) => x - y);
  }
  async function split() {
    if (!file) { setErr("Choose a PDF."); return; }
    setBusy(true); setErr("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer());
      const idx = parseRange(range, src.getPageCount());
      if (!idx.length) { setErr("No valid pages in that range."); setBusy(false); return; }
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, idx);
      pages.forEach((p) => out.addPage(p));
      downloadBytes(await out.save(), "split.pdf");
    } catch (e) { setErr("Could not split the PDF."); }
    finally { setBusy(false); }
  }
  return (
    <div className="tool">
      <label className="fld">PDF file</label>
      <input type="file" accept="application/pdf" className="input" onChange={onFile} />
      {pageCount ? <p className="hint">{pageCount} pages. Enter pages/ranges to keep (e.g. 1-3, 5, 8-10).</p> : null}
      <label className="fld" style={{ marginTop: 8 }}>Pages to extract</label>
      <input className="input" value={range} onChange={(e) => setRange(e.target.value)} placeholder="1-3, 5" />
      <button className="btn" onClick={split} disabled={busy} style={{ marginTop: 10 }}>{busy ? "Working…" : "Extract & download"}</button>
      {err ? <div className="notice notice-warn" style={{ marginTop: 10 }}>{err}</div> : null}
    </div>
  );
}

/* ---------------- PDF Compress (optimize) ---------------- */
export function PdfCompress() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function compress() {
    if (!file) { setErr("Choose a PDF."); return; }
    setBusy(true); setErr(""); setResult(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const bytes = await doc.save({ useObjectStreams: true });
      setResult({ before: file.size, after: bytes.length, bytes });
    } catch (e) { setErr("Could not process the PDF."); }
    finally { setBusy(false); }
  }
  return (
    <div className="tool">
      <label className="fld">PDF file</label>
      <input type="file" accept="application/pdf" className="input" onChange={(e) => { setFile(e.target.files?.[0]); setResult(null); }} />
      <button className="btn" onClick={compress} disabled={busy} style={{ marginTop: 10 }}>{busy ? "Optimizing…" : "Optimize PDF"}</button>
      {result ? (
        <div className="sheet" style={{ padding: 16, marginTop: 12 }}>
          <div className="flex-between"><span className="muted">Before</span><strong>{kb(result.before)}</strong></div>
          <div className="flex-between"><span className="muted">After</span><strong>{kb(result.after)}</strong></div>
          <div className="flex-between"><span className="muted">Saved</span><strong className="result-ok">{Math.max(0, Math.round((1 - result.after / result.before) * 100))}%</strong></div>
          <button className="btn btn-sm" style={{ marginTop: 10 }} onClick={() => downloadBytes(result.bytes, "optimized.pdf")}>Download</button>
        </div>
      ) : null}
      {err ? <div className="notice notice-warn" style={{ marginTop: 10 }}>{err}</div> : null}
      <p className="hint">Rebuilds the PDF structure (object streams). Best on unoptimized PDFs; image-heavy files compress less.</p>
    </div>
  );
}

/* ---------------- Images to PDF ---------------- */
export function ImagesToPdf() {
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function make() {
    if (!files.length) { setErr("Choose image(s)."); return; }
    setBusy(true); setErr("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.create();
      for (const f of files) {
        const buf = await f.arrayBuffer();
        const img = /png$/i.test(f.type) ? await pdf.embedPng(buf) : await pdf.embedJpg(buf);
        const page = pdf.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      downloadBytes(await pdf.save(), "images.pdf");
    } catch (e) { setErr("Only JPG/PNG images are supported."); }
    finally { setBusy(false); }
  }
  return (
    <div className="tool">
      <label className="fld">Images (JPG or PNG)</label>
      <input type="file" accept="image/png,image/jpeg" multiple className="input" onChange={(e) => setFiles([...e.target.files])} />
      {files.length ? <p className="hint">{files.length} image(s) → one PDF, one image per page.</p> : null}
      <button className="btn" onClick={make} disabled={busy} style={{ marginTop: 10 }}>{busy ? "Building…" : "Create PDF"}</button>
      {err ? <div className="notice notice-warn" style={{ marginTop: 10 }}>{err}</div> : null}
    </div>
  );
}

/* ---------------- PDF e-Signature ---------------- */
export function PdfSign() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pos, setPos] = useState("bottom-right");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.strokeStyle = "#111827";
    const pt = (e) => { const r = c.getBoundingClientRect(); const t = e.touches?.[0] || e; return { x: t.clientX - r.left, y: t.clientY - r.top }; };
    const down = (e) => { drawing.current = true; const p = pt(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); e.preventDefault(); };
    const move = (e) => { if (!drawing.current) return; const p = pt(e); ctx.lineTo(p.x, p.y); ctx.stroke(); e.preventDefault(); };
    const up = () => { drawing.current = false; };
    c.addEventListener("mousedown", down); c.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
    c.addEventListener("touchstart", down); c.addEventListener("touchmove", move); window.addEventListener("touchend", up);
    return () => { c.removeEventListener("mousedown", down); c.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); c.removeEventListener("touchstart", down); c.removeEventListener("touchmove", move); window.removeEventListener("touchend", up); };
  }, []);

  async function onFile(e) {
    const f = e.target.files?.[0]; setFile(f); setErr("");
    if (f) { try { const { PDFDocument } = await import("pdf-lib"); const d = await PDFDocument.load(await f.arrayBuffer()); setPageCount(d.getPageCount()); setPage(d.getPageCount()); } catch { setErr("Not a valid PDF."); } }
  }
  function clearSig() { const c = canvasRef.current; c.getContext("2d").clearRect(0, 0, c.width, c.height); }
  async function sign() {
    if (!file) { setErr("Choose a PDF."); return; }
    setBusy(true); setErr("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const png = await doc.embedPng(canvasRef.current.toDataURL("image/png"));
      const target = doc.getPage(Math.min(Math.max(1, page), doc.getPageCount()) - 1);
      const { width, height } = target.getSize();
      const w = 150, h = 60, m = 30;
      const spots = {
        "bottom-right": { x: width - w - m, y: m }, "bottom-left": { x: m, y: m },
        "top-right": { x: width - w - m, y: height - h - m }, "top-left": { x: m, y: height - h - m },
      };
      target.drawImage(png, { ...spots[pos], width: w, height: h });
      downloadBytes(await doc.save(), "signed.pdf");
    } catch (e) { setErr("Could not sign the PDF."); }
    finally { setBusy(false); }
  }
  return (
    <div className="tool">
      <label className="fld">PDF to sign</label>
      <input type="file" accept="application/pdf" className="input" onChange={onFile} />
      <label className="fld" style={{ marginTop: 12 }}>Draw your signature</label>
      <canvas ref={canvasRef} width={460} height={140} style={{ width: "100%", maxWidth: 460, height: 140, border: "1px dashed var(--border-strong)", borderRadius: 8, background: "#fff", touchAction: "none" }} />
      <div className="tool-controls">
        <button className="copy-btn" onClick={clearSig}>Clear</button>
        {pageCount ? <label className="chk">Page <input className="input" style={{ width: 70 }} type="number" min={1} max={pageCount} value={page} onChange={(e) => setPage(+e.target.value || 1)} /> / {pageCount}</label> : null}
        <label className="chk">Position <select className="select" style={{ width: 140 }} value={pos} onChange={(e) => setPos(e.target.value)}>{["bottom-right", "bottom-left", "top-right", "top-left"].map((p) => <option key={p}>{p}</option>)}</select></label>
      </div>
      <button className="btn" onClick={sign} disabled={busy}>{busy ? "Signing…" : "Sign & download"}</button>
      {err ? <div className="notice notice-warn" style={{ marginTop: 10 }}>{err}</div> : null}
    </div>
  );
}

/* ---------------- Image Format Converter ---------------- */
export function ImageConverter() {
  const [src, setSrc] = useState("");
  const [fmt, setFmt] = useState("image/png");
  const [out, setOut] = useState("");
  const imgRef = useRef(null);
  function onFile(e) { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => { setSrc(String(r.result)); setOut(""); }; r.readAsDataURL(f); }
  function convert() {
    const im = imgRef.current; const c = document.createElement("canvas");
    c.width = im.naturalWidth; c.height = im.naturalHeight;
    const ctx = c.getContext("2d");
    if (fmt !== "image/png") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); }
    ctx.drawImage(im, 0, 0);
    setOut(c.toDataURL(fmt, 0.92));
  }
  const ext = fmt.split("/")[1].replace("jpeg", "jpg");
  return (
    <div className="tool">
      <input type="file" accept="image/*" className="input" onChange={onFile} />
      {src ? <img ref={imgRef} src={src} alt="" style={{ display: "none" }} /> : null}
      <div className="tool-controls" style={{ marginTop: 10 }}>
        <label className="chk">Convert to <select className="select" style={{ width: 130 }} value={fmt} onChange={(e) => setFmt(e.target.value)}><option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option></select></label>
        <button className="btn btn-sm" onClick={convert} disabled={!src}>Convert</button>
      </div>
      {out ? <div className="center"><img src={out} alt="converted" style={{ maxWidth: "100%", maxHeight: 280, border: "1px solid var(--border)", borderRadius: 8 }} /><div style={{ marginTop: 8 }}><a className="btn btn-sm" href={out} download={`image.${ext}`}>Download .{ext}</a></div></div> : <p className="hint">Choose an image, pick a format, convert — all in your browser.</p>}
    </div>
  );
}

/* ---------------- Social Media Image Resizer ---------------- */
const PRESETS = [
  ["Instagram Post", 1080, 1080], ["Instagram Story", 1080, 1920], ["YouTube Thumbnail", 1280, 720],
  ["Facebook Cover", 820, 312], ["Twitter/X Header", 1500, 500], ["LinkedIn Banner", 1584, 396], ["Custom", 0, 0],
];
export function SocialImageResizer() {
  const [src, setSrc] = useState("");
  const [preset, setPreset] = useState("Instagram Post");
  const [cw, setCw] = useState(1080);
  const [ch, setCh] = useState(1080);
  const [out, setOut] = useState("");
  const imgRef = useRef(null);
  const p = PRESETS.find((x) => x[0] === preset);
  const w = preset === "Custom" ? cw : p[1], h = preset === "Custom" ? ch : p[2];
  function onFile(e) { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => { setSrc(String(r.result)); setOut(""); }; r.readAsDataURL(f); }
  function resize() {
    const im = imgRef.current, c = document.createElement("canvas"); c.width = w; c.height = h;
    const ctx = c.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
    // cover fit
    const scale = Math.max(w / im.naturalWidth, h / im.naturalHeight);
    const dw = im.naturalWidth * scale, dh = im.naturalHeight * scale;
    ctx.drawImage(im, (w - dw) / 2, (h - dh) / 2, dw, dh);
    setOut(c.toDataURL("image/jpeg", 0.92));
  }
  return (
    <div className="tool">
      <input type="file" accept="image/*" className="input" onChange={onFile} />
      {src ? <img ref={imgRef} src={src} alt="" style={{ display: "none" }} /> : null}
      <div className="tool-controls" style={{ marginTop: 10 }}>
        <label className="chk">Preset <select className="select" style={{ width: 180 }} value={preset} onChange={(e) => setPreset(e.target.value)}>{PRESETS.map((x) => <option key={x[0]}>{x[0]}</option>)}</select></label>
        {preset === "Custom" ? (<><label className="chk">W <input className="input" style={{ width: 80 }} type="number" value={cw} onChange={(e) => setCw(+e.target.value || 0)} /></label><label className="chk">H <input className="input" style={{ width: 80 }} type="number" value={ch} onChange={(e) => setCh(+e.target.value || 0)} /></label></>) : <span className="hint" style={{ margin: 0 }}>{w} × {h}</span>}
        <button className="btn btn-sm" onClick={resize} disabled={!src}>Resize</button>
      </div>
      {out ? <div className="center"><img src={out} alt="resized" style={{ maxWidth: "100%", maxHeight: 280, border: "1px solid var(--border)", borderRadius: 8 }} /><div style={{ marginTop: 8 }}><a className="btn btn-sm" href={out} download="social.jpg">Download</a></div></div> : <p className="hint">Fits your image to the exact size each platform wants.</p>}
    </div>
  );
}
