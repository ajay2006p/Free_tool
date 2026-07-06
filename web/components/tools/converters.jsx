"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";

/* ---------------- Unit Converter ---------------- */
const UNITS = {
  Length: { base: "m", units: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.34, yd: 0.9144, ft: 0.3048, in: 0.0254 } },
  Weight: { base: "kg", units: { kg: 1, g: 0.001, mg: 1e-6, lb: 0.453592, oz: 0.0283495, t: 1000 } },
  Temperature: { special: true },
};
export function UnitConverter() {
  const [cat, setCat] = useState("Length");
  const [val, setVal] = useState(1);
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");
  let result = "";
  if (cat === "Temperature") {
    const tFrom = from, tTo = to;
    let c = tFrom === "C" ? val : tFrom === "F" ? (val - 32) * 5 / 9 : val - 273.15;
    result = tTo === "C" ? c : tTo === "F" ? c * 9 / 5 + 32 : c + 273.15;
    result = Number(result.toFixed(2));
  } else {
    const u = UNITS[cat].units;
    result = Number(((val * u[from]) / u[to]).toPrecision(6));
  }
  const opts = cat === "Temperature" ? ["C", "F", "K"] : Object.keys(UNITS[cat].units);
  function changeCat(c) { setCat(c); const o = c === "Temperature" ? ["C", "F"] : Object.keys(UNITS[c].units); setFrom(o[0]); setTo(o[1]); }
  return (
    <div className="tool">
      <div className="tool-controls">
        {Object.keys(UNITS).map((c) => <button key={c} className={"copy-btn" + (cat === c ? " " : "")} style={cat === c ? { background: "var(--ink)", color: "var(--paper-2)" } : {}} onClick={() => changeCat(c)}>{c}</button>)}
      </div>
      <div className="tool-controls">
        <input className="input" style={{ width: 130 }} type="number" value={val} onChange={(e) => setVal(Number(e.target.value) || 0)} />
        <select className="select" style={{ width: 90 }} value={from} onChange={(e) => setFrom(e.target.value)}>{opts.map((o) => <option key={o}>{o}</option>)}</select>
        <span>→</span>
        <select className="select" style={{ width: 90 }} value={to} onChange={(e) => setTo(e.target.value)}>{opts.map((o) => <option key={o}>{o}</option>)}</select>
      </div>
      <div className="sheet center" style={{ padding: 20, fontSize: 26, fontFamily: "var(--serif)", fontWeight: 700 }}>{val} {from} = {result} {to}</div>
    </div>
  );
}

/* ---------------- Number Base Converter ---------------- */
export function NumberBaseConverter() {
  const [val, setVal] = useState("255");
  const [base, setBase] = useState(10);
  let dec = parseInt(val, base);
  const valid = !isNaN(dec);
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk">Value <input className="input" style={{ width: 160 }} value={val} onChange={(e) => setVal(e.target.value)} /></label>
        <label className="chk">from base
          <select className="select" style={{ width: 110 }} value={base} onChange={(e) => setBase(Number(e.target.value))}><option value={2}>Binary (2)</option><option value={8}>Octal (8)</option><option value={10}>Decimal (10)</option><option value={16}>Hex (16)</option></select>
        </label>
      </div>
      {valid ? (
        <div className="stack-sm">
          {[["Binary", dec.toString(2)], ["Octal", dec.toString(8)], ["Decimal", dec.toString(10)], ["Hexadecimal", dec.toString(16).toUpperCase()]].map(([k, v]) => (
            <div key={k} className="sheet flex-between" style={{ padding: "10px 14px", marginBottom: 8 }}><span><strong>{k}</strong></span><span className="mono-out">{v} <CopyButton value={v} /></span></div>
          ))}
        </div>
      ) : <p className="result-err hint">✗ Not a valid base-{base} number.</p>}
    </div>
  );
}

/* ---------------- Roman Numeral Converter ---------------- */
function toRoman(num) {
  if (num <= 0 || num > 3999) return "";
  const map = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let r = "";
  for (const [v, s] of map) while (num >= v) { r += s; num -= v; }
  return r;
}
function fromRoman(str) {
  const val = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0, prev = 0;
  for (const ch of str.toUpperCase().split("").reverse()) {
    const v = val[ch]; if (!v) return null;
    total += v < prev ? -v : v; prev = v;
  }
  return total;
}
export function RomanNumeralConverter() {
  const [num, setNum] = useState("2026");
  const [roman, setRoman] = useState("MMXXVI");
  return (
    <div className="tool">
      <div className="grid grid-2" style={{ gap: 14 }}>
        <div><label className="fld">Number (1–3999)</label><input className="input" value={num} onChange={(e) => { setNum(e.target.value); setRoman(toRoman(Number(e.target.value))); }} />
          <div className="sheet mono-out" style={{ padding: 10, marginTop: 8 }}>{toRoman(Number(num)) || "—"}</div></div>
        <div><label className="fld">Roman numeral</label><input className="input" value={roman} onChange={(e) => { setRoman(e.target.value); const n = fromRoman(e.target.value); setNum(n ? String(n) : ""); }} />
          <div className="sheet mono-out" style={{ padding: 10, marginTop: 8 }}>{fromRoman(roman) ?? "—"}</div></div>
      </div>
    </div>
  );
}

/* ---------------- Timestamp Converter ---------------- */
export function TimestampConverter() {
  const [ts, setTs] = useState(String(Math.floor(Date.now() / 1000)));
  const [dt, setDt] = useState("");
  const date = new Date(Number(ts) * 1000);
  const valid = !isNaN(date);
  return (
    <div className="tool">
      <div className="tool-controls"><button className="btn btn-sm" onClick={() => setTs(String(Math.floor(Date.now() / 1000)))}>Use current time</button></div>
      <label className="fld">Unix timestamp (seconds)</label>
      <input className="input" value={ts} onChange={(e) => setTs(e.target.value)} />
      {valid ? (
        <div className="stack-sm" style={{ marginTop: 12 }}>
          <div className="sheet flex-between" style={{ padding: "10px 14px", marginBottom: 8 }}><span>Local</span><span className="mono-out">{date.toLocaleString()}</span></div>
          <div className="sheet flex-between" style={{ padding: "10px 14px", marginBottom: 8 }}><span>UTC / ISO</span><span className="mono-out">{date.toISOString()} <CopyButton value={date.toISOString()} /></span></div>
          <div className="sheet flex-between" style={{ padding: "10px 14px" }}><span>Milliseconds</span><span className="mono-out">{Number(ts) * 1000}</span></div>
        </div>
      ) : <p className="result-err hint">✗ Invalid timestamp.</p>}
      <label className="fld" style={{ marginTop: 14 }}>Or pick a date → timestamp</label>
      <input className="input" type="datetime-local" value={dt} onChange={(e) => { setDt(e.target.value); const d = new Date(e.target.value); if (!isNaN(d)) setTs(String(Math.floor(d.getTime() / 1000))); }} />
    </div>
  );
}
