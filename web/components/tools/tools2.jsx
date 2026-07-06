"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";

/* ---------------- Random Number Generator ---------------- */
export function RandomNumber() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [uniq, setUniq] = useState(false);
  const [out, setOut] = useState([]);
  function gen() {
    const lo = Math.min(min, max), hi = Math.max(min, max);
    const range = hi - lo + 1;
    const n = Math.min(count, uniq ? range : 100000);
    const res = [];
    if (uniq) {
      const pool = Array.from({ length: range }, (_, i) => lo + i);
      for (let i = 0; i < n; i++) res.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    } else {
      for (let i = 0; i < n; i++) res.push(lo + Math.floor(Math.random() * range));
    }
    setOut(res);
  }
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk">Min <input className="input" style={{ width: 90 }} type="number" value={min} onChange={(e) => setMin(+e.target.value || 0)} /></label>
        <label className="chk">Max <input className="input" style={{ width: 90 }} type="number" value={max} onChange={(e) => setMax(+e.target.value || 0)} /></label>
        <label className="chk">How many <input className="input" style={{ width: 80 }} type="number" min={1} value={count} onChange={(e) => setCount(Math.max(1, +e.target.value || 1))} /></label>
        <label className="chk"><input type="checkbox" checked={uniq} onChange={(e) => setUniq(e.target.checked)} /> Unique</label>
        <button className="btn btn-sm" onClick={gen}>Generate</button>
      </div>
      {out.length ? (
        <div className="sheet center" style={{ padding: 20 }}>
          {out.length === 1 ? <div style={{ fontSize: 48, fontWeight: 800 }}>{out[0]}</div> : <div className="flex-between"><span className="mono-out" style={{ fontSize: 16 }}>{out.join(", ")}</span><CopyButton value={out.join(", ")} /></div>}
        </div>
      ) : <p className="hint">Set a range and generate.</p>}
    </div>
  );
}

/* ---------------- Dice & Coin ---------------- */
const PIPS = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
export function DiceCoin() {
  const [dice, setDice] = useState([4]);
  const [n, setN] = useState(2);
  const [coin, setCoin] = useState("—");
  const roll = () => setDice(Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 6)));
  const flip = () => setCoin(Math.random() < 0.5 ? "Heads" : "Tails");
  return (
    <div className="tool">
      <div className="grid grid-2">
        <div className="sheet center" style={{ padding: 20 }}>
          <h3 style={{ marginTop: 0 }}>🎲 Dice</h3>
          <div style={{ fontSize: 52, letterSpacing: 4 }}>{dice.map((d) => PIPS[d]).join("")}</div>
          <div className="muted">Total: {dice.reduce((a, b) => a + b, 0)}</div>
          <div className="tool-controls" style={{ justifyContent: "center", marginTop: 10 }}>
            <label className="chk">Dice <input className="input" style={{ width: 70 }} type="number" min={1} max={6} value={n} onChange={(e) => setN(Math.max(1, Math.min(6, +e.target.value || 1)))} /></label>
            <button className="btn btn-sm" onClick={roll}>Roll</button>
          </div>
        </div>
        <div className="sheet center" style={{ padding: 20 }}>
          <h3 style={{ marginTop: 0 }}>🪙 Coin</h3>
          <div style={{ fontSize: 44, fontWeight: 800, minHeight: 60 }}>{coin}</div>
          <button className="btn btn-sm" onClick={flip} style={{ marginTop: 10 }}>Flip</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Spin the Wheel ---------------- */
const WHEEL_COLORS = ["#4f46e5", "#7c3aed", "#db2777", "#e11d48", "#ea580c", "#d97706", "#059669", "#0891b2"];
export function SpinWheel() {
  const [text, setText] = useState("Alice\nBob\nCharlie\nDana\nErin\nFrank");
  const names = text.split("\n").map((s) => s.trim()).filter(Boolean);
  const [rot, setRot] = useState(0);
  const [winner, setWinner] = useState("");
  const [spinning, setSpinning] = useState(false);
  const seg = names.length ? 360 / names.length : 360;
  const gradient = names.length
    ? `conic-gradient(${names.map((_, i) => `${WHEEL_COLORS[i % WHEEL_COLORS.length]} ${i * seg}deg ${(i + 1) * seg}deg`).join(",")})`
    : "#e5e7eb";
  function spin() {
    if (!names.length || spinning) return;
    const i = Math.floor(Math.random() * names.length);
    const target = 360 * 6 + (360 - (i + 0.5) * seg);
    setSpinning(true); setWinner("");
    setRot((prev) => prev - (prev % 360) + target);
    setTimeout(() => { setWinner(names[i]); setSpinning(false); }, 4200);
  }
  return (
    <div className="tool">
      <div className="tool-io">
        <div><label className="fld">Options (one per line)</label><textarea className="textarea" style={{ minHeight: 220 }} value={text} onChange={(e) => setText(e.target.value)} /></div>
        <div className="center">
          <div style={{ position: "relative", width: "min(280px,80vw)", margin: "0 auto" }}>
            <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", fontSize: 26, zIndex: 2 }}>🔻</div>
            <div style={{ width: "100%", aspectRatio: "1", borderRadius: "50%", background: gradient, border: "6px solid #fff", boxShadow: "var(--shadow)", transition: "transform 4s cubic-bezier(.15,.9,.2,1)", transform: `rotate(${rot}deg)` }} />
          </div>
          <button className="btn" onClick={spin} disabled={spinning} style={{ marginTop: 14 }}>{spinning ? "Spinning…" : "🎡 Spin"}</button>
          {winner ? <div className="sheet" style={{ padding: 14, marginTop: 12, fontSize: 20, fontWeight: 800 }}>🎉 {winner}</div> : null}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Color Contrast Checker ---------------- */
function lum(hex) {
  const m = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(m)) return null;
  const c = [0, 2, 4].map((i) => {
    let v = parseInt(m.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export function ColorContrast() {
  const [fg, setFg] = useState("#1a1a1a");
  const [bg, setBg] = useState("#ffffff");
  const l1 = lum(fg), l2 = lum(bg);
  const ratio = l1 != null && l2 != null ? (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05) : null;
  const Pill = ({ ok, label }) => <span className="badge" style={{ background: ok ? "var(--green-soft)" : "#fee2e2", color: ok ? "var(--green)" : "var(--red)", border: `1px solid ${ok ? "#a7f3d0" : "#fecaca"}` }}>{label} {ok ? "✓ Pass" : "✕ Fail"}</span>;
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk">Text <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} /> <input className="input" style={{ width: 110 }} value={fg} onChange={(e) => setFg(e.target.value)} /></label>
        <label className="chk">Background <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} /> <input className="input" style={{ width: 110 }} value={bg} onChange={(e) => setBg(e.target.value)} /></label>
      </div>
      <div style={{ background: bg, color: fg, padding: 24, borderRadius: 10, border: "1px solid var(--border)", textAlign: "center" }}>
        <div style={{ fontSize: 24, fontWeight: 700 }}>Large text sample</div>
        <div style={{ fontSize: 14 }}>Normal body text sample — the quick brown fox.</div>
      </div>
      {ratio ? (
        <div className="center" style={{ marginTop: 14 }}>
          <div style={{ fontSize: 34, fontWeight: 800 }}>{ratio.toFixed(2)}:1</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
            <Pill ok={ratio >= 4.5} label="AA normal" />
            <Pill ok={ratio >= 3} label="AA large" />
            <Pill ok={ratio >= 7} label="AAA normal" />
          </div>
        </div>
      ) : <p className="result-err hint">✗ Enter valid 6-digit hex colors.</p>}
    </div>
  );
}
