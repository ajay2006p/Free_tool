"use client";

import { useState, useRef, useEffect } from "react";
import CopyButton from "../CopyButton";

/* ================= shared helpers (not components) ================= */
function roundRectPath(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  if (r <= 0) { ctx.rect(x, y, w, h); return; }
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function toHex(r, g, b) {
  const h = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return "#" + h(r) + h(g) + h(b);
}
function wrapLines(ctx, text, maxWidth) {
  const out = [];
  const paras = String(text).split(/\n/);
  for (const para of paras) {
    const words = para.split(/\s+/).filter(Boolean);
    if (!words.length) { out.push(""); continue; }
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxWidth && line) { out.push(line); line = w; }
      else line = test;
    }
    if (line) out.push(line);
  }
  return out;
}
function downloadCanvas(canvas, filename) {
  if (!canvas) return;
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }, "image/png");
}
const GRAD = "linear-gradient(135deg,var(--accent),var(--accent-2))";

/* ================= 1. Favicon Generator ================= */
export function FaviconGenerator() {
  const [mode, setMode] = useState("text"); // "text" | "upload"
  const [text, setText] = useState("A");
  const [bg, setBg] = useState("#4f46e5");
  const [fg, setFg] = useState("#ffffff");
  const [shape, setShape] = useState("rounded"); // square | rounded | circle
  const [outputs, setOutputs] = useState([]);
  const [imgVersion, setImgVersion] = useState(0);
  const imgRef = useRef(null);

  const files = {
    16: "favicon-16x16.png",
    32: "favicon-32x32.png",
    48: "favicon-48x48.png",
    180: "apple-touch-icon.png",
    192: "android-chrome-192x192.png",
    512: "android-chrome-512x512.png",
  };

  function onFile(e) {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const im = new Image();
      im.onload = () => { imgRef.current = im; setMode("upload"); setImgVersion((v) => v + 1); };
      im.src = String(r.result);
    };
    r.readAsDataURL(f);
  }

  useEffect(() => {
    const sizes = [16, 32, 48, 180, 192, 512];
    const out = sizes.map((s) => {
      const c = document.createElement("canvas");
      c.width = s; c.height = s;
      const ctx = c.getContext("2d");
      ctx.clearRect(0, 0, s, s);
      ctx.save();
      const r = shape === "circle" ? s / 2 : shape === "rounded" ? s * 0.22 : 0;
      roundRectPath(ctx, 0, 0, s, s, r);
      ctx.clip();
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, s, s);
      if (mode === "upload" && imgRef.current) {
        const im = imgRef.current;
        const scale = Math.max(s / im.width, s / im.height);
        const w = im.width * scale, h = im.height * scale;
        ctx.drawImage(im, (s - w) / 2, (s - h) / 2, w, h);
      } else {
        ctx.fillStyle = fg;
        ctx.font = `bold ${Math.round(s * 0.58)}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText((text || "A").slice(0, 2), s / 2, s / 2 + s * 0.04);
      }
      ctx.restore();
      return { size: s, url: c.toDataURL("image/png") };
    });
    setOutputs(out);
  }, [mode, text, bg, fg, shape, imgVersion]);

  const big = outputs.find((o) => o.size === 192)?.url || outputs.find((o) => o.size === 512)?.url;
  const snippet =
    `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n` +
    `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n` +
    `<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">\n` +
    `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">\n` +
    `<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">\n` +
    `<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">`;

  return (
    <div className="tool">
      <div className="tool-io">
        <div>
          <div className="tool-controls" style={{ marginBottom: 12 }}>
            <button type="button" className={mode === "text" ? "btn btn-sm" : "btn btn-sm btn-outline"} onClick={() => setMode("text")}>Letter / Emoji</button>
            <button type="button" className={mode === "upload" ? "btn btn-sm" : "btn btn-sm btn-outline"} onClick={() => setMode("upload")}>Upload image</button>
          </div>

          {mode === "text" ? (
            <>
              <label className="fld">Letter or emoji</label>
              <input className="input" value={text} maxLength={2} onChange={(e) => setText(e.target.value)} placeholder="A or 🚀" />
              <div className="tool-controls" style={{ marginTop: 10 }}>
                <label className="chk">Background <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} /></label>
                <label className="chk">Text <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} /></label>
              </div>
            </>
          ) : (
            <>
              <label className="fld">Source image</label>
              <input type="file" accept="image/*" className="input" onChange={onFile} />
              <div className="tool-controls" style={{ marginTop: 10 }}>
                <label className="chk">Background <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} /></label>
              </div>
              {!imgRef.current ? <p className="hint">Upload an image to build your favicon.</p> : null}
            </>
          )}

          <label className="fld" style={{ marginTop: 12 }}>Corner shape</label>
          <div className="tool-controls">
            {["square", "rounded", "circle"].map((sh) => (
              <button key={sh} type="button" className={shape === sh ? "btn btn-sm" : "btn btn-sm btn-outline"} onClick={() => setShape(sh)} style={{ textTransform: "capitalize" }}>{sh}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-2)", borderRadius: "var(--radius)", minHeight: 200, padding: 16 }}>
          {big ? <img src={big} alt="favicon preview" width={128} height={128} style={{ width: 128, height: 128, boxShadow: "var(--shadow)", borderRadius: shape === "circle" ? "50%" : shape === "rounded" ? "22%" : 4 }} /> : <p className="hint">Preview appears here.</p>}
        </div>
      </div>

      <label className="fld" style={{ marginTop: 14 }}>All sizes</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
        {outputs.map((o) => (
          <div key={o.size} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: 10, boxShadow: "var(--shadow-sm)", minWidth: 96 }}>
            <div style={{ width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={o.url} alt={o.size + "px favicon"} style={{ width: Math.min(o.size, 64), height: Math.min(o.size, 64), imageRendering: o.size <= 48 ? "pixelated" : "auto" }} />
            </div>
            <span className="mono-out" style={{ padding: "2px 6px", fontSize: 12 }}>{o.size}×{o.size}</span>
            <a className="btn btn-sm btn-outline" href={o.url} download={files[o.size]}>Download</a>
          </div>
        ))}
      </div>

      <label className="fld" style={{ marginTop: 16 }}>HTML snippet (add to your &lt;head&gt;) <CopyButton value={snippet} /></label>
      <div className="sheet mono-out" style={{ padding: 12, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{snippet}</div>
      <p className="hint">Everything is generated in your browser — no uploads leave your device.</p>
    </div>
  );
}

/* ================= 2. Meme Generator ================= */
export function MemeGenerator() {
  const [top, setTop] = useState("Top text");
  const [bottom, setBottom] = useState("Bottom text");
  const [fontSize, setFontSize] = useState(48);
  const [fill, setFill] = useState("#ffffff");
  const [outline, setOutline] = useState("#000000");
  const [imgVersion, setImgVersion] = useState(0);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  function onFile(e) {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const im = new Image();
      im.onload = () => { imgRef.current = im; setImgVersion((v) => v + 1); };
      im.src = String(r.result);
    };
    r.readAsDataURL(f);
  }

  useEffect(() => {
    const im = imgRef.current, canvas = canvasRef.current;
    if (!im || !canvas) return;
    canvas.width = im.width;
    canvas.height = im.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(im, 0, 0);
    ctx.font = `bold ${fontSize}px Impact, "Arial Black", Haettenschweiler, sans-serif`;
    ctx.textAlign = "center";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(2, fontSize * 0.07);
    ctx.strokeStyle = outline;
    ctx.fillStyle = fill;
    const maxW = canvas.width * 0.94;
    const lh = fontSize * 1.08;
    const margin = fontSize * 0.35;
    const x = canvas.width / 2;

    const drawBlock = (raw, pos) => {
      const lines = wrapLines(ctx, String(raw).toUpperCase(), maxW).filter((l) => l !== "");
      if (!lines.length) return;
      if (pos === "top") {
        ctx.textBaseline = "top";
        lines.forEach((ln, i) => { const y = margin + i * lh; ctx.strokeText(ln, x, y); ctx.fillText(ln, x, y); });
      } else {
        ctx.textBaseline = "bottom";
        const yBase = canvas.height - margin;
        lines.forEach((ln, i) => { const y = yBase - (lines.length - 1 - i) * lh; ctx.strokeText(ln, x, y); ctx.fillText(ln, x, y); });
      }
    };
    drawBlock(top, "top");
    drawBlock(bottom, "bottom");
  }, [top, bottom, fontSize, fill, outline, imgVersion]);

  const hasImg = !!imgRef.current;
  return (
    <div className="tool">
      <input type="file" accept="image/*" className="input" onChange={onFile} />
      <div className="tool-io" style={{ marginTop: 12 }}>
        <div>
          <label className="fld">Top text</label>
          <input className="input" value={top} onChange={(e) => setTop(e.target.value)} placeholder="Top text" />
          <label className="fld" style={{ marginTop: 10 }}>Bottom text</label>
          <input className="input" value={bottom} onChange={(e) => setBottom(e.target.value)} placeholder="Bottom text" />
          <label className="chk" style={{ width: "100%", marginTop: 12 }}>Font size {fontSize}px <input type="range" min={14} max={140} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} style={{ flex: 1 }} /></label>
          <div className="tool-controls" style={{ marginTop: 8 }}>
            <label className="chk">Text <input type="color" value={fill} onChange={(e) => setFill(e.target.value)} /></label>
            <label className="chk">Outline <input type="color" value={outline} onChange={(e) => setOutline(e.target.value)} /></label>
          </div>
          {hasImg ? (
            <div style={{ marginTop: 12 }}>
              <button type="button" className="btn btn-sm" onClick={() => downloadCanvas(canvasRef.current, "meme.png")}>Download PNG</button>
            </div>
          ) : null}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-2)", borderRadius: "var(--radius)", minHeight: 200, padding: 12 }}>
          <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto", borderRadius: "var(--radius-sm)", display: hasImg ? "block" : "none", boxShadow: "var(--shadow-sm)" }} />
          {!hasImg ? <p className="hint">Upload an image to start your meme.</p> : null}
        </div>
      </div>
      <p className="hint">Classic Impact caption, drawn live in your browser.</p>
    </div>
  );
}

/* ================= 3. Color Palette From Image ================= */
export function ColorPaletteFromImage() {
  const [colors, setColors] = useState([]);
  const [ready, setReady] = useState(false);
  const imgRef = useRef(null);

  function onFile(e) {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const im = new Image();
      im.onload = () => { imgRef.current = im; extract(im); };
      im.src = String(r.result);
    };
    r.readAsDataURL(f);
  }

  function extract(im) {
    const max = 120;
    const scale = Math.min(1, max / Math.max(im.width, im.height));
    const w = Math.max(1, Math.round(im.width * scale));
    const h = Math.max(1, Math.round(im.height * scale));
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    ctx.drawImage(im, 0, 0, w, h);
    let data;
    try { data = ctx.getImageData(0, 0, w, h).data; }
    catch (err) { setColors([]); setReady(true); return; }
    const step = 24;
    const buckets = {};
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 125) continue;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const key = `${Math.round(r / step)}-${Math.round(g / step)}-${Math.round(b / step)}`;
      const bk = buckets[key] || (buckets[key] = { r: 0, g: 0, b: 0, n: 0 });
      bk.r += r; bk.g += g; bk.b += b; bk.n++;
    }
    const top = Object.values(buckets).sort((x, y) => y.n - x.n).slice(0, 6);
    setColors(top.map((bk) => toHex(bk.r / bk.n, bk.g / bk.n, bk.b / bk.n)));
    setReady(true);
  }

  const css = colors.length
    ? ":root {\n" + colors.map((c, i) => `  --color-${i + 1}: ${c};`).join("\n") + "\n}"
    : "";

  return (
    <div className="tool">
      <input type="file" accept="image/*" className="input" onChange={onFile} />
      {ready && colors.length ? (
        <>
          <div className="grid-3" style={{ marginTop: 14 }}>
            {colors.map((c, i) => (
              <div key={i} style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ background: c, height: 84 }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, padding: "8px 10px", background: "var(--surface)" }}>
                  <span className="mono-out" style={{ padding: "2px 6px", fontSize: 13 }}>{c}</span>
                  <CopyButton value={c} />
                </div>
              </div>
            ))}
          </div>
          <label className="fld" style={{ marginTop: 16 }}>CSS variables <CopyButton value={css} /></label>
          <div className="sheet mono-out" style={{ padding: 12, whiteSpace: "pre-wrap" }}>{css}</div>
        </>
      ) : ready ? (
        <p className="hint">Couldn't read pixels from that image. Try a standard JPG or PNG.</p>
      ) : (
        <p className="hint">Upload an image to pull its 6 dominant colors. Runs entirely in your browser.</p>
      )}
    </div>
  );
}

/* ================= 4. Text To Handwriting ================= */
export function TextToHandwriting() {
  const [text, setText] = useState("Dear friend,\nThis note was typed but looks handwritten. Neat, right?");
  const [ink, setInk] = useState("#22317c");
  const [paper, setPaper] = useState("ruled"); // ruled | plain
  const [fontSize, setFontSize] = useState(28);
  const [jitter, setJitter] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const width = 760;
    const marginL = paper === "ruled" ? 74 : 44;
    const marginR = 32;
    const marginT = 66;
    const lineHeight = fontSize * 1.95;
    const font = `${fontSize}px "Segoe Script", "Bradley Hand", "Comic Sans MS", cursive`;

    canvas.width = width;
    let ctx = canvas.getContext("2d");
    ctx.font = font;
    const lines = wrapLines(ctx, text, width - marginL - marginR);
    const height = Math.max(320, marginT + lines.length * lineHeight + 44);
    canvas.height = height;

    ctx = canvas.getContext("2d");
    ctx.font = font;
    ctx.textBaseline = "alphabetic";

    // paper
    ctx.fillStyle = paper === "ruled" ? "#fffdf6" : "#ffffff";
    ctx.fillRect(0, 0, width, height);
    if (paper === "ruled") {
      ctx.strokeStyle = "#bcd2f0";
      ctx.lineWidth = 1;
      for (let y = marginT + 6; y < height - 10; y += lineHeight) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }
      ctx.strokeStyle = "#f2a9a9";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(marginL - 16, 0); ctx.lineTo(marginL - 16, height); ctx.stroke();
    }

    // ink
    ctx.fillStyle = ink;
    lines.forEach((ln, i) => {
      const baseY = marginT + i * lineHeight;
      if (!jitter) { ctx.fillText(ln, marginL, baseY); return; }
      let x = marginL;
      for (const ch of ln) {
        const dy = (Math.random() - 0.5) * fontSize * 0.14;
        const dx = (Math.random() - 0.5) * 1.2;
        ctx.fillText(ch, x + dx, baseY + dy);
        x += ctx.measureText(ch).width;
      }
    });
  }, [text, ink, paper, fontSize, jitter]);

  return (
    <div className="tool">
      <div className="tool-io">
        <div>
          <label className="fld">Your text</label>
          <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} rows={6} placeholder="Type anything…" />
          <div className="tool-controls" style={{ marginTop: 10 }}>
            <label className="chk">Ink <input type="color" value={ink} onChange={(e) => setInk(e.target.value)} /></label>
            <label className="chk">Paper
              <select className="input" value={paper} onChange={(e) => setPaper(e.target.value)} style={{ width: 120 }}>
                <option value="ruled">Ruled lines</option>
                <option value="plain">Plain</option>
              </select>
            </label>
          </div>
          <label className="chk" style={{ width: "100%", marginTop: 8 }}>Size {fontSize}px <input type="range" min={16} max={48} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} style={{ flex: 1 }} /></label>
          <label className="chk" style={{ marginTop: 4 }}><input type="checkbox" checked={jitter} onChange={(e) => setJitter(e.target.checked)} /> Realistic jitter</label>
          <div style={{ marginTop: 12 }}>
            <button type="button" className="btn btn-sm" onClick={() => downloadCanvas(canvasRef.current, "handwriting.png")}>Download PNG</button>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-2)", borderRadius: "var(--radius)", padding: 12 }}>
          <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto", borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow)" }} />
        </div>
      </div>
      <p className="hint">Uses your device's script fonts — the exact look varies a little per device.</p>
    </div>
  );
}

/* ================= 5. Placeholder Image ================= */
export function PlaceholderImage() {
  const [w, setW] = useState(640);
  const [h, setH] = useState(360);
  const [bg, setBg] = useState("#7c3aed");
  const [fg, setFg] = useState("#ffffff");
  const [label, setLabel] = useState("");
  const [uri, setUri] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const cw = Math.max(1, Math.min(4000, Math.round(w) || 1));
    const ch = Math.max(1, Math.min(4000, Math.round(h) || 1));
    canvas.width = cw; canvas.height = ch;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, cw, ch);
    // subtle inner border
    ctx.strokeStyle = fg;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = Math.max(2, Math.min(cw, ch) * 0.01);
    ctx.strokeRect(ctx.lineWidth, ctx.lineWidth, cw - ctx.lineWidth * 2, ch - ctx.lineWidth * 2);
    ctx.globalAlpha = 1;
    // label
    const txt = label.trim() || `${cw} × ${ch}`;
    ctx.fillStyle = fg;
    let fontPx = Math.max(12, Math.min(cw, ch) / 7);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${fontPx}px system-ui, sans-serif`;
    while (ctx.measureText(txt).width > cw * 0.86 && fontPx > 10) {
      fontPx -= 1; ctx.font = `bold ${fontPx}px system-ui, sans-serif`;
    }
    ctx.fillText(txt, cw / 2, ch / 2);
    setUri(canvas.toDataURL("image/png"));
  }, [w, h, bg, fg, label]);

  return (
    <div className="tool">
      <div className="tool-io">
        <div>
          <div className="tool-controls">
            <label className="chk">Width <input className="input" type="number" min={1} max={4000} value={w} onChange={(e) => setW(Number(e.target.value))} style={{ width: 100 }} /></label>
            <label className="chk">Height <input className="input" type="number" min={1} max={4000} value={h} onChange={(e) => setH(Number(e.target.value))} style={{ width: 100 }} /></label>
          </div>
          <div className="tool-controls" style={{ marginTop: 8 }}>
            <label className="chk">Background <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} /></label>
            <label className="chk">Text <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} /></label>
          </div>
          <label className="fld" style={{ marginTop: 12 }}>Custom label</label>
          <input className="input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder={`${Math.round(w) || 0}x${Math.round(h) || 0}`} />
          <div className="tool-controls" style={{ marginTop: 12 }}>
            <a className="btn btn-sm" href={uri || undefined} download={`placeholder-${Math.round(w)}x${Math.round(h)}.png`}>Download PNG</a>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-2)", borderRadius: "var(--radius)", minHeight: 200, padding: 12 }}>
          <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto", borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-sm)" }} />
        </div>
      </div>
      <label className="fld" style={{ marginTop: 14 }}>Data URI <CopyButton value={uri} /></label>
      <div className="sheet mono-out" style={{ padding: 12, whiteSpace: "nowrap", overflowX: "auto" }}>{uri}</div>
      <p className="hint">Great for mockups and wireframes — generated instantly in your browser.</p>
    </div>
  );
}
