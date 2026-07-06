"use client";

import { useState } from "react";

const Stat = ({ label, value }) => (
  <div className="sheet flex-between" style={{ padding: "12px 16px", marginBottom: 8 }}>
    <span className="muted">{label}</span><strong style={{ fontSize: 18 }}>{value}</strong>
  </div>
);
const money = (n) => (isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—");

/* ---------------- Mortgage Calculator ---------------- */
export function MortgageCalculator() {
  const [price, setPrice] = useState(300000);
  const [down, setDown] = useState(60000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const loan = Math.max(0, price - down);
  const n = years * 12, r = rate / 100 / 12;
  const m = r ? (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loan / n;
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk">Home price <input className="input" style={{ width: 120 }} type="number" value={price} onChange={(e) => setPrice(+e.target.value || 0)} /></label>
        <label className="chk">Down payment <input className="input" style={{ width: 110 }} type="number" value={down} onChange={(e) => setDown(+e.target.value || 0)} /></label>
      </div>
      <div className="tool-controls">
        <label className="chk">Rate % <input className="input" style={{ width: 80 }} type="number" value={rate} onChange={(e) => setRate(+e.target.value || 0)} /></label>
        <label className="chk">Term (yrs) <input className="input" style={{ width: 80 }} type="number" value={years} onChange={(e) => setYears(+e.target.value || 1)} /></label>
      </div>
      <Stat label="Monthly payment (P&I)" value={money(m)} />
      <Stat label="Loan amount" value={money(loan)} />
      <Stat label="Total interest" value={money(m * n - loan)} />
      <Stat label="Total of payments" value={money(m * n)} />
    </div>
  );
}

/* ---------------- Compound Interest ---------------- */
export function CompoundInterest() {
  const [p, setP] = useState(1000);
  const [monthly, setMonthly] = useState(100);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);
  const r = rate / 100 / 12, n = years * 12;
  const fromP = p * Math.pow(1 + r, n);
  const fromC = r ? monthly * ((Math.pow(1 + r, n) - 1) / r) : monthly * n;
  const total = fromP + fromC;
  const contributed = p + monthly * n;
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk">Initial <input className="input" style={{ width: 110 }} type="number" value={p} onChange={(e) => setP(+e.target.value || 0)} /></label>
        <label className="chk">Monthly add <input className="input" style={{ width: 100 }} type="number" value={monthly} onChange={(e) => setMonthly(+e.target.value || 0)} /></label>
        <label className="chk">Rate % <input className="input" style={{ width: 80 }} type="number" value={rate} onChange={(e) => setRate(+e.target.value || 0)} /></label>
        <label className="chk">Years <input className="input" style={{ width: 80 }} type="number" value={years} onChange={(e) => setYears(+e.target.value || 1)} /></label>
      </div>
      <Stat label="Future value" value={money(total)} />
      <Stat label="Total contributed" value={money(contributed)} />
      <Stat label="Interest earned" value={money(total - contributed)} />
    </div>
  );
}

/* ---------------- Calorie / TDEE Calculator ---------------- */
const ACT = { "Sedentary": 1.2, "Light (1-3 days)": 1.375, "Moderate (3-5)": 1.55, "Active (6-7)": 1.725, "Very active": 1.9 };
export function CalorieCalculator() {
  const [sex, setSex] = useState("male");
  const [age, setAge] = useState(28);
  const [h, setH] = useState(175);
  const [w, setW] = useState(70);
  const [act, setAct] = useState("Moderate (3-5)");
  const bmr = sex === "male" ? 10 * w + 6.25 * h - 5 * age + 5 : 10 * w + 6.25 * h - 5 * age - 161;
  const tdee = bmr * ACT[act];
  return (
    <div className="tool">
      <div className="tool-controls">
        <div className="pill-group"><button className={sex === "male" ? "on" : ""} onClick={() => setSex("male")}>Male</button><button className={sex === "female" ? "on" : ""} onClick={() => setSex("female")}>Female</button></div>
        <label className="chk">Age <input className="input" style={{ width: 70 }} type="number" value={age} onChange={(e) => setAge(+e.target.value || 0)} /></label>
        <label className="chk">Height cm <input className="input" style={{ width: 80 }} type="number" value={h} onChange={(e) => setH(+e.target.value || 0)} /></label>
        <label className="chk">Weight kg <input className="input" style={{ width: 80 }} type="number" value={w} onChange={(e) => setW(+e.target.value || 0)} /></label>
      </div>
      <div className="tool-controls">
        <label className="chk">Activity <select className="select" style={{ width: 170 }} value={act} onChange={(e) => setAct(e.target.value)}>{Object.keys(ACT).map((k) => <option key={k}>{k}</option>)}</select></label>
      </div>
      <Stat label="BMR (calories at rest)" value={Math.round(bmr) + " kcal"} />
      <Stat label="Maintenance (TDEE)" value={Math.round(tdee) + " kcal"} />
      <Stat label="Lose weight (−20%)" value={Math.round(tdee * 0.8) + " kcal"} />
      <Stat label="Gain weight (+15%)" value={Math.round(tdee * 1.15) + " kcal"} />
    </div>
  );
}

/* ---------------- GPA Calculator ---------------- */
const GP = { "A+": 4, "A": 4, "A-": 3.7, "B+": 3.3, "B": 3, "B-": 2.7, "C+": 2.3, "C": 2, "C-": 1.7, "D": 1, "F": 0 };
export function GpaCalculator() {
  const [rows, setRows] = useState([{ grade: "A", credits: 3 }, { grade: "B+", credits: 4 }, { grade: "A-", credits: 3 }]);
  const up = (i, k, v) => setRows(rows.map((r, j) => j === i ? { ...r, [k]: k === "credits" ? +v : v } : r));
  const totalCr = rows.reduce((s, r) => s + (r.credits || 0), 0);
  const gpa = totalCr ? rows.reduce((s, r) => s + GP[r.grade] * (r.credits || 0), 0) / totalCr : 0;
  return (
    <div className="tool">
      {rows.map((r, i) => (
        <div key={i} className="tool-controls" style={{ marginBottom: 6 }}>
          <input className="input" style={{ flex: 1 }} placeholder={`Course ${i + 1}`} />
          <select className="select" style={{ width: 90 }} value={r.grade} onChange={(e) => up(i, "grade", e.target.value)}>{Object.keys(GP).map((g) => <option key={g}>{g}</option>)}</select>
          <input className="input" style={{ width: 90 }} type="number" value={r.credits} onChange={(e) => up(i, "credits", e.target.value)} placeholder="Credits" />
          <button className="copy-btn" onClick={() => setRows(rows.filter((_, j) => j !== i))}>✕</button>
        </div>
      ))}
      <button className="btn btn-sm btn-outline" onClick={() => setRows([...rows, { grade: "A", credits: 3 }])}>+ Add course</button>
      <div className="sheet center" style={{ padding: 20, marginTop: 12 }}>
        <div style={{ fontSize: 40, fontWeight: 800, fontFamily: "var(--serif)" }}>{gpa.toFixed(2)}</div>
        <div className="muted">GPA · {totalCr} credits</div>
      </div>
    </div>
  );
}

/* ---------------- Scientific Calculator ---------------- */
const KEYS = ["sin", "cos", "tan", "(", ")", "√", "^", "log", "ln", "π", "7", "8", "9", "/", "C", "4", "5", "6", "*", "⌫", "1", "2", "3", "-", "=", "0", ".", "e", "+", "%"];
export function ScientificCalculator() {
  const [expr, setExpr] = useState("");
  const [out, setOut] = useState("");
  function evaluate(s) {
    let js = s
      .replace(/π/g, "Math.PI").replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g, "Math.E")
      .replace(/√\s*\(?/g, "Math.sqrt(").replace(/\^/g, "**")
      .replace(/sin\(/g, "Math.sin(").replace(/cos\(/g, "Math.cos(").replace(/tan\(/g, "Math.tan(")
      .replace(/log\(/g, "Math.log10(").replace(/ln\(/g, "Math.log(");
    // balance a trailing sqrt/func open paren
    const opens = (js.match(/\(/g) || []).length, closes = (js.match(/\)/g) || []).length;
    js += ")".repeat(Math.max(0, opens - closes));
    // eslint-disable-next-line no-new-func
    return Function('"use strict";return (' + js + ")")();
  }
  function press(k) {
    if (k === "C") { setExpr(""); setOut(""); return; }
    if (k === "⌫") { setExpr(expr.slice(0, -1)); return; }
    if (k === "=") { try { const r = evaluate(expr); setOut(String(Number.isInteger(r) ? r : +r.toFixed(8))); } catch { setOut("Error"); } return; }
    const map = { "sin": "sin(", "cos": "cos(", "tan": "tan(", "log": "log(", "ln": "ln(", "√": "√(" };
    setExpr(expr + (map[k] || k));
  }
  return (
    <div className="tool" style={{ maxWidth: 360, margin: "0 auto" }}>
      <div className="sheet" style={{ padding: "12px 16px", marginBottom: 10, textAlign: "right", minHeight: 60 }}>
        <div className="muted mono" style={{ fontSize: 14, minHeight: 18, wordBreak: "break-all" }}>{expr || "0"}</div>
        <div style={{ fontSize: 26, fontWeight: 800 }}>{out}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6 }}>
        {KEYS.map((k) => (
          <button key={k} onClick={() => press(k)}
            style={{ padding: "12px 0", borderRadius: 8, border: "1px solid var(--border-strong)", cursor: "pointer", fontWeight: 700, fontSize: 15,
              background: k === "=" ? "var(--accent)" : "C⌫".includes(k) ? "#fee2e2" : /[0-9.]/.test(k) ? "var(--surface)" : "var(--surface-2)",
              color: k === "=" ? "#fff" : "var(--text)" }}>{k}</button>
        ))}
      </div>
    </div>
  );
}
