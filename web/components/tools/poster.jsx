"use client";

/* ============================================================================
   Poster & Social Graphic Maker — headline, colours, size, download PNG.

   Everything is drawn on a real <canvas> at full export resolution and then
   scaled down with CSS for the preview, so what you see is exactly what
   downloads — no second rendering path to drift out of sync.

   No fonts are fetched: the canvas uses the system UI stack, which keeps the
   tool instant, offline-capable and free of any font licensing question.
   ========================================================================== */

import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

const SIZES = [
  { key: "ig-post", name: "Instagram post", w: 1080, h: 1080 },
  { key: "ig-story", name: "Story / Reel", w: 1080, h: 1920 },
  { key: "yt-thumb", name: "YouTube thumbnail", w: 1280, h: 720 },
  { key: "fb-post", name: "Facebook / X post", w: 1200, h: 630 },
  { key: "a4", name: "A4 poster", w: 1240, h: 1754 },
  { key: "linkedin", name: "LinkedIn banner", w: 1584, h: 396 },
];

const PALETTES = [
  { key: "sunset", name: "Sunset", from: "#f97316", to: "#db2777", ink: "#ffffff" },
  { key: "ocean", name: "Ocean", from: "#0ea5e9", to: "#4338ca", ink: "#ffffff" },
  { key: "forest", name: "Forest", from: "#059669", to: "#065f46", ink: "#ffffff" },
  { key: "night", name: "Night", from: "#111827", to: "#374151", ink: "#f9fafb" },
  { key: "candy", name: "Candy", from: "#f472b6", to: "#a78bfa", ink: "#3b0764" },
  { key: "lemon", name: "Lemon", from: "#fde047", to: "#f59e0b", ink: "#422006" },
  { key: "paper", name: "Paper", from: "#f8fafc", to: "#e2e8f0", ink: "#0f172a" },
];

const ALIGNS = ["left", "center", "right"];

const EMPTY = {
  size: "ig-post",
  palette: "sunset",
  headline: "Free tools,\nno signup",
  sub: "150+ browser tools that just work",
  badge: "freetoolss.online",
  emoji: "✨",
  align: "center",
  scale: 100,
  angle: 135,
};

/** Word-wrap that also honours the newlines the user typed. */
function layout(ctx, text, maxW) {
  const lines = [];
  for (const para of String(text || "").split("\n")) {
    if (!para.trim()) {
      lines.push("");
      continue;
    }
    let line = "";
    for (const word of para.split(/\s+/)) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

function draw(canvas, d) {
  const size = SIZES.find((s) => s.key === d.size) || SIZES[0];
  const pal = PALETTES.find((p) => p.key === d.palette) || PALETTES[0];
  const { w, h } = size;

  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Background: a linear gradient at the chosen angle.
  const rad = ((d.angle || 135) * Math.PI) / 180;
  const cx = w / 2;
  const cy = h / 2;
  const len = Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad));
  const gx = (Math.cos(rad) * len) / 2;
  const gy = (Math.sin(rad) * len) / 2;
  const grad = ctx.createLinearGradient(cx - gx, cy - gy, cx + gx, cy + gy);
  grad.addColorStop(0, pal.from);
  grad.addColorStop(1, pal.to);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // A soft light source keeps flat gradients from looking like a colour swatch.
  const glow = ctx.createRadialGradient(w * 0.25, h * 0.2, 0, w * 0.25, h * 0.2, Math.max(w, h) * 0.75);
  glow.addColorStop(0, "rgba(255,255,255,.18)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  const pad = Math.round(Math.min(w, h) * 0.09);
  const maxW = w - pad * 2;
  const stack = "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  const align = ALIGNS.includes(d.align) ? d.align : "center";
  const x = align === "left" ? pad : align === "right" ? w - pad : cx;
  ctx.textAlign = align;
  ctx.fillStyle = pal.ink;

  // Headline size scales with the canvas, then with the user's slider, then
  // shrinks further if the text still doesn't fit the frame.
  const base = Math.min(w, h) * 0.115 * ((d.scale || 100) / 100);
  let fontSize = base;
  let lines = [];
  for (let i = 0; i < 24; i++) {
    ctx.font = `800 ${fontSize}px ${stack}`;
    lines = layout(ctx, d.headline, maxW);
    const blockH = lines.length * fontSize * 1.14;
    if (blockH <= h * 0.52 || fontSize <= 14) break;
    fontSize *= 0.93;
  }

  const emoji = String(d.emoji || "").trim();
  const emojiSize = emoji ? fontSize * 0.95 : 0;
  const subSize = Math.max(13, fontSize * 0.34);
  ctx.font = `500 ${subSize}px ${stack}`;
  const subLines = d.sub?.trim() ? layout(ctx, d.sub, maxW) : [];

  const headH = lines.length * fontSize * 1.14;
  const subH = subLines.length * subSize * 1.4;
  const totalH = (emoji ? emojiSize * 1.3 : 0) + headH + (subH ? subH + fontSize * 0.35 : 0);
  let y = cy - totalH / 2 + fontSize * 0.85;

  if (emoji) {
    ctx.font = `400 ${emojiSize}px ${stack}`;
    ctx.fillText(emoji, x, y);
    y += emojiSize * 1.3;
  }

  ctx.font = `800 ${fontSize}px ${stack}`;
  ctx.shadowColor = "rgba(0,0,0,.16)";
  ctx.shadowBlur = fontSize * 0.14;
  ctx.shadowOffsetY = fontSize * 0.04;
  for (const line of lines) {
    ctx.fillText(line, x, y);
    y += fontSize * 1.14;
  }
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  if (subLines.length) {
    y += fontSize * 0.2;
    ctx.font = `500 ${subSize}px ${stack}`;
    ctx.globalAlpha = 0.9;
    for (const line of subLines) {
      ctx.fillText(line, x, y);
      y += subSize * 1.4;
    }
    ctx.globalAlpha = 1;
  }

  // Badge / handle, pinned to the bottom.
  const badge = String(d.badge || "").trim();
  if (badge) {
    const badgeSize = Math.max(12, Math.min(w, h) * 0.028);
    ctx.font = `700 ${badgeSize}px ${stack}`;
    const tw = ctx.measureText(badge).width;
    const bw = tw + badgeSize * 1.8;
    const bh = badgeSize * 2.2;
    const bx = align === "left" ? pad : align === "right" ? w - pad - bw : cx - bw / 2;
    const by = h - pad - bh;
    const r = bh / 2;
    ctx.fillStyle = "rgba(0,0,0,.22)";
    ctx.beginPath();
    // roundRect isn't in older Safari; build the pill by hand.
    ctx.moveTo(bx + r, by);
    ctx.lineTo(bx + bw - r, by);
    ctx.arc(bx + bw - r, by + r, r, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(bx + r, by + bh);
    ctx.arc(bx + r, by + r, r, Math.PI / 2, -Math.PI / 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = pal.ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(badge, bx + bw / 2, by + bh / 2 + badgeSize * 0.05);
    ctx.textBaseline = "alphabetic";
  }
}

export function PosterMaker() {
  const [d, setD] = useLocalStorage("dh_poster", EMPTY);
  const canvasRef = useRef(null);
  const [note, setNote] = useState("");

  const size = SIZES.find((s) => s.key === d.size) || SIZES[0];

  useEffect(() => {
    if (!canvasRef.current) return;
    draw(canvasRef.current, d);
  }, [d]);

  function set(patch) {
    setD({ ...d, ...patch });
  }

  function downloadPng() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${(d.headline || "poster").split("\n")[0].replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 40) || "poster"}-${size.w}x${size.h}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        setNote(`Downloaded at full ${size.w} × ${size.h} resolution.`);
        setTimeout(() => setNote(""), 4000);
      }, "image/png");
    } catch (e) {
      setNote("Your browser blocked the download. Try right-clicking the preview and saving the image.");
    }
  }

  return (
    <div className="tool">
      <div className="fld">Size</div>
      <div className="chips" style={{ marginBottom: 14 }}>
        {SIZES.map((s) => (
          <button
            key={s.key}
            className="chip"
            onClick={() => set({ size: s.key })}
            style={d.size === s.key ? { borderColor: "var(--accent)", fontWeight: 800 } : undefined}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid-2" style={{ gap: 18, alignItems: "start" }}>
        {/* ---------------- controls ---------------- */}
        <div>
          <label className="fld">Headline</label>
          <textarea
            className="textarea"
            rows={3}
            value={d.headline}
            onChange={(e) => set({ headline: e.target.value })}
            placeholder="Your big message"
            maxLength={200}
          />
          <p className="hint">Press Enter for a deliberate line break.</p>

          <label className="fld" style={{ marginTop: 10 }}>Subtitle</label>
          <input className="input" value={d.sub} onChange={(e) => set({ sub: e.target.value })} maxLength={160} />

          <div className="grid-2" style={{ gap: 12, marginTop: 12 }}>
            <div>
              <label className="fld">Badge / handle</label>
              <input className="input" value={d.badge} onChange={(e) => set({ badge: e.target.value })} maxLength={40} />
            </div>
            <div>
              <label className="fld">Emoji (optional)</label>
              <input className="input" value={d.emoji} onChange={(e) => set({ emoji: e.target.value })} maxLength={4} />
            </div>
          </div>

          <div className="fld" style={{ marginTop: 16 }}>Colours</div>
          <div className="chips">
            {PALETTES.map((p) => (
              <button
                key={p.key}
                className="chip"
                onClick={() => set({ palette: p.key })}
                style={d.palette === p.key ? { borderColor: "var(--accent)", fontWeight: 800 } : undefined}
              >
                <span
                  style={{
                    display: "inline-block", width: 12, height: 12, borderRadius: 3, marginRight: 6,
                    background: `linear-gradient(135deg,${p.from},${p.to})`,
                  }}
                />
                {p.name}
              </button>
            ))}
          </div>

          <div className="fld" style={{ marginTop: 16 }}>Alignment</div>
          <div className="chips">
            {ALIGNS.map((a) => (
              <button
                key={a}
                className="chip"
                onClick={() => set({ align: a })}
                style={d.align === a ? { borderColor: "var(--accent)", fontWeight: 800 } : undefined}
              >
                {a === "left" ? "◧ Left" : a === "center" ? "▣ Centre" : "◨ Right"}
              </button>
            ))}
          </div>

          <label className="fld" style={{ marginTop: 16 }}>
            Text size: <strong>{d.scale}%</strong>
          </label>
          <input
            type="range"
            min={60}
            max={150}
            step={5}
            value={d.scale}
            onChange={(e) => set({ scale: Number(e.target.value) })}
            style={{ width: "100%" }}
            aria-label="Text size"
          />

          <label className="fld" style={{ marginTop: 12 }}>
            Gradient angle: <strong>{d.angle}°</strong>
          </label>
          <input
            type="range"
            min={0}
            max={360}
            step={15}
            value={d.angle}
            onChange={(e) => set({ angle: Number(e.target.value) })}
            style={{ width: "100%" }}
            aria-label="Gradient angle"
          />
        </div>

        {/* ---------------- preview ---------------- */}
        <div>
          <div className="flex-between">
            <div className="fld">Preview</div>
            <span className="muted" style={{ fontSize: 12 }}>{size.w} × {size.h}</span>
          </div>
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: 460,
              objectFit: "contain",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow)",
              display: "block",
            }}
          />
          <div className="tool-controls" style={{ marginTop: 12 }}>
            <button className="btn btn-accent" onClick={downloadPng}>Download PNG</button>
            <button className="btn btn-outline" onClick={() => setD(EMPTY)}>Reset</button>
          </div>
          {note ? <div className="notice notice-ok" style={{ marginTop: 10 }}>{note}</div> : null}
          <p className="hint">
            No watermark, no signup, no upload — the image is rendered on your device and saved at full resolution.
          </p>
        </div>
      </div>
    </div>
  );
}
