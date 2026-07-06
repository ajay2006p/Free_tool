"use client";

import { useState } from "react";

const Stat = ({ label, value }) => (
  <div className="sheet flex-between" style={{ padding: "12px 16px", marginBottom: 8 }}>
    <span className="muted">{label}</span><strong style={{ fontSize: 18 }}>{value}</strong>
  </div>
);
const money = (n) => (isFinite(n) ? Math.round(n).toLocaleString() : "—");

/* ---------------- SIP / Investment Calculator ---------------- */
export function SipCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const i = rate / 100 / 12, n = years * 12;
  const fv = i ? monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i) : monthly * n;
  const invested = monthly * n;
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk">Monthly investment <input className="input" style={{ width: 120 }} type="number" value={monthly} onChange={(e) => setMonthly(+e.target.value || 0)} /></label>
        <label className="chk">Return % p.a. <input className="input" style={{ width: 80 }} type="number" value={rate} onChange={(e) => setRate(+e.target.value || 0)} /></label>
        <label className="chk">Years <input className="input" style={{ width: 80 }} type="number" value={years} onChange={(e) => setYears(+e.target.value || 1)} /></label>
      </div>
      <Stat label="Invested amount" value={money(invested)} />
      <Stat label="Estimated returns" value={money(fv - invested)} />
      <Stat label="Total value" value={money(fv)} />
    </div>
  );
}

/* ---------------- Income Tax Estimator ---------------- */
const REGIMES = {
  "India — New regime": { std: 75000, slabs: [[300000, 0], [600000, 0.05], [900000, 0.10], [1200000, 0.15], [1500000, 0.20], [Infinity, 0.30]] },
  "India — Old regime": { std: 50000, slabs: [[250000, 0], [500000, 0.05], [1000000, 0.20], [Infinity, 0.30]] },
};
export function IncomeTaxCalculator() {
  const [income, setIncome] = useState(1200000);
  const [regime, setRegime] = useState("India — New regime");
  const R = REGIMES[regime];
  const taxable = Math.max(0, income - R.std);
  let tax = 0, prev = 0;
  for (const [cap, rate] of R.slabs) { if (taxable > prev) { tax += (Math.min(taxable, cap) - prev) * rate; prev = cap; } else break; }
  const cess = tax * 0.04;
  const total = tax + cess;
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk">Annual income <input className="input" style={{ width: 130 }} type="number" value={income} onChange={(e) => setIncome(+e.target.value || 0)} /></label>
        <label className="chk">Regime <select className="select" style={{ width: 180 }} value={regime} onChange={(e) => setRegime(e.target.value)}>{Object.keys(REGIMES).map((k) => <option key={k}>{k}</option>)}</select></label>
      </div>
      <Stat label="Standard deduction" value={money(R.std)} />
      <Stat label="Taxable income" value={money(taxable)} />
      <Stat label="Income tax" value={money(tax)} />
      <Stat label="+ 4% cess" value={money(cess)} />
      <Stat label="Total tax payable" value={money(total)} />
      <p className="hint">Estimate only — real tax depends on deductions, exemptions & the latest budget. Not financial advice.</p>
    </div>
  );
}

/* ---------------- GST Calculator ---------------- */
export function GstCalculator() {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState("add");
  let net, gst, gross;
  if (mode === "add") { net = amount; gst = amount * (rate / 100); gross = net + gst; }
  else { gross = amount; net = amount / (1 + rate / 100); gst = gross - net; }
  return (
    <div className="tool">
      <div className="tool-controls">
        <div className="pill-group"><button className={mode === "add" ? "on" : ""} onClick={() => setMode("add")}>Add GST</button><button className={mode === "remove" ? "on" : ""} onClick={() => setMode("remove")}>Remove GST</button></div>
        <label className="chk">Amount <input className="input" style={{ width: 120 }} type="number" value={amount} onChange={(e) => setAmount(+e.target.value || 0)} /></label>
        <label className="chk">GST %
          <select className="select" style={{ width: 90 }} value={rate} onChange={(e) => setRate(+e.target.value)}>{[3, 5, 12, 18, 28].map((r) => <option key={r} value={r}>{r}%</option>)}</select>
        </label>
      </div>
      <Stat label="Net amount" value={money(net)} />
      <Stat label={`GST (${rate}%)`} value={money(gst)} />
      <Stat label="Gross amount" value={money(gross)} />
    </div>
  );
}

/* ---------------- Date Difference Calculator ---------------- */
export function DateCalculator() {
  const [a, setA] = useState("2026-01-01");
  const [b, setB] = useState("2026-07-06");
  const [addDays, setAddDays] = useState(30);
  const [base, setBase] = useState("2026-07-06");
  const d1 = new Date(a), d2 = new Date(b);
  const validDiff = !isNaN(d1) && !isNaN(d2);
  const days = validDiff ? Math.round(Math.abs(d2 - d1) / 86400000) : 0;
  const target = !isNaN(new Date(base)) ? new Date(new Date(base).getTime() + addDays * 86400000) : null;
  return (
    <div className="tool">
      <h3 style={{ fontSize: 16 }}>Days between two dates</h3>
      <div className="tool-controls">
        <label className="chk">From <input className="input" type="date" value={a} onChange={(e) => setA(e.target.value)} /></label>
        <label className="chk">To <input className="input" type="date" value={b} onChange={(e) => setB(e.target.value)} /></label>
      </div>
      {validDiff ? (
        <div className="grid grid-4" style={{ marginBottom: 16 }}>
          <div className="sheet center" style={{ padding: 14 }}><div style={{ fontSize: 26, fontWeight: 800 }}>{days}</div><div className="hint" style={{ margin: 0 }}>days</div></div>
          <div className="sheet center" style={{ padding: 14 }}><div style={{ fontSize: 26, fontWeight: 800 }}>{Math.floor(days / 7)}</div><div className="hint" style={{ margin: 0 }}>weeks</div></div>
          <div className="sheet center" style={{ padding: 14 }}><div style={{ fontSize: 26, fontWeight: 800 }}>{(days / 30.44).toFixed(1)}</div><div className="hint" style={{ margin: 0 }}>months</div></div>
          <div className="sheet center" style={{ padding: 14 }}><div style={{ fontSize: 26, fontWeight: 800 }}>{(days / 365.25).toFixed(2)}</div><div className="hint" style={{ margin: 0 }}>years</div></div>
        </div>
      ) : null}
      <h3 style={{ fontSize: 16 }}>Add days to a date</h3>
      <div className="tool-controls">
        <label className="chk">Start <input className="input" type="date" value={base} onChange={(e) => setBase(e.target.value)} /></label>
        <label className="chk">+ days <input className="input" style={{ width: 90 }} type="number" value={addDays} onChange={(e) => setAddDays(+e.target.value || 0)} /></label>
      </div>
      {target ? <Stat label="Result date" value={target.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })} /> : null}
    </div>
  );
}
