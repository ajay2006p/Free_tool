"use client";

import { useState } from "react";

const Stat = ({ label, value }) => (
  <div className="sheet flex-between" style={{ padding: "12px 16px", marginBottom: 8 }}>
    <span className="muted">{label}</span><strong style={{ fontSize: 18 }}>{value}</strong>
  </div>
);

/* ---------------- Percentage Calculator ---------------- */
export function PercentageCalculator() {
  const [x, setX] = useState(20);
  const [y, setY] = useState(150);
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk">What is <input className="input" style={{ width: 90 }} type="number" value={x} onChange={(e) => setX(Number(e.target.value) || 0)} /> % of <input className="input" style={{ width: 100 }} type="number" value={y} onChange={(e) => setY(Number(e.target.value) || 0)} /> ?</label>
      </div>
      <Stat label={`${x}% of ${y}`} value={((x / 100) * y).toLocaleString()} />
      <Stat label={`${x} is what % of ${y}`} value={y ? ((x / y) * 100).toFixed(2) + "%" : "—"} />
      <Stat label={`% change ${x} → ${y}`} value={x ? (((y - x) / x) * 100).toFixed(2) + "%" : "—"} />
    </div>
  );
}

/* ---------------- BMI Calculator ---------------- */
export function BmiCalculator() {
  const [unit, setUnit] = useState("metric");
  const [h, setH] = useState(175);
  const [w, setW] = useState(70);
  let bmi = 0;
  if (unit === "metric") bmi = h ? w / Math.pow(h / 100, 2) : 0;
  else bmi = h ? (703 * w) / (h * h) : 0;
  const cat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  return (
    <div className="tool">
      <div className="tool-controls">
        <div className="pill-group"><button className={unit === "metric" ? "on" : ""} onClick={() => setUnit("metric")}>Metric</button><button className={unit === "imperial" ? "on" : ""} onClick={() => setUnit("imperial")}>Imperial</button></div>
      </div>
      <div className="tool-controls">
        <label className="chk">Height ({unit === "metric" ? "cm" : "in"}) <input className="input" style={{ width: 100 }} type="number" value={h} onChange={(e) => setH(Number(e.target.value) || 0)} /></label>
        <label className="chk">Weight ({unit === "metric" ? "kg" : "lb"}) <input className="input" style={{ width: 100 }} type="number" value={w} onChange={(e) => setW(Number(e.target.value) || 0)} /></label>
      </div>
      <div className="sheet center" style={{ padding: 20 }}>
        <div style={{ fontSize: 44, fontWeight: 700, fontFamily: "var(--serif)" }}>{bmi ? bmi.toFixed(1) : "—"}</div>
        <div className="badge badge-cat">{bmi ? cat : "Enter values"}</div>
      </div>
    </div>
  );
}

/* ---------------- Age Calculator ---------------- */
export function AgeCalculator() {
  const [dob, setDob] = useState("2000-01-01");
  let out = null;
  try {
    const d = new Date(dob);
    const now = new Date();
    if (!isNaN(d) && d <= now) {
      let years = now.getFullYear() - d.getFullYear();
      let months = now.getMonth() - d.getMonth();
      let days = now.getDate() - d.getDate();
      if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
      if (months < 0) { years--; months += 12; }
      const totalDays = Math.floor((now - d) / 86400000);
      out = { years, months, days, totalDays };
    }
  } catch (e) {}
  return (
    <div className="tool">
      <div className="tool-controls"><label className="chk">Date of birth <input className="input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} /></label></div>
      {out ? (
        <>
          <div className="sheet center" style={{ padding: 20, marginBottom: 10 }}>
            <div style={{ fontSize: 40, fontWeight: 700, fontFamily: "var(--serif)" }}>{out.years} years</div>
            <div className="muted">{out.months} months, {out.days} days</div>
          </div>
          <Stat label="Total days lived" value={out.totalDays.toLocaleString()} />
          <Stat label="Total weeks" value={Math.floor(out.totalDays / 7).toLocaleString()} />
        </>
      ) : <p className="hint">Pick a valid past date.</p>}
    </div>
  );
}

/* ---------------- Loan / EMI Calculator ---------------- */
export function LoanCalculator() {
  const [amount, setAmount] = useState(20000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);
  const n = years * 12;
  const r = rate / 100 / 12;
  const emi = r ? (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : amount / n;
  const total = emi * n;
  const money = (v) => v.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk">Amount <input className="input" style={{ width: 120 }} type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} /></label>
        <label className="chk">Rate % <input className="input" style={{ width: 80 }} type="number" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} /></label>
        <label className="chk">Years <input className="input" style={{ width: 80 }} type="number" value={years} onChange={(e) => setYears(Number(e.target.value) || 1)} /></label>
      </div>
      <Stat label="Monthly payment" value={money(emi)} />
      <Stat label="Total interest" value={money(total - amount)} />
      <Stat label="Total paid" value={money(total)} />
    </div>
  );
}

/* ---------------- Tip Calculator ---------------- */
export function TipCalculator() {
  const [bill, setBill] = useState(50);
  const [tip, setTip] = useState(15);
  const [people, setPeople] = useState(2);
  const tipAmt = bill * (tip / 100);
  const total = bill + tipAmt;
  const money = (v) => v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk">Bill <input className="input" style={{ width: 100 }} type="number" value={bill} onChange={(e) => setBill(Number(e.target.value) || 0)} /></label>
        <label className="chk">Tip % <input className="input" style={{ width: 80 }} type="number" value={tip} onChange={(e) => setTip(Number(e.target.value) || 0)} /></label>
        <label className="chk">People <input className="input" style={{ width: 80 }} type="number" value={people} onChange={(e) => setPeople(Math.max(1, Number(e.target.value) || 1))} /></label>
      </div>
      <Stat label="Tip amount" value={money(tipAmt)} />
      <Stat label="Total" value={money(total)} />
      <Stat label="Each person pays" value={money(total / people)} />
    </div>
  );
}

/* ---------------- Discount Calculator ---------------- */
export function DiscountCalculator() {
  const [price, setPrice] = useState(80);
  const [off, setOff] = useState(25);
  const save = price * (off / 100);
  const money = (v) => v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk">Original price <input className="input" style={{ width: 110 }} type="number" value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)} /></label>
        <label className="chk">Discount % <input className="input" style={{ width: 90 }} type="number" value={off} onChange={(e) => setOff(Number(e.target.value) || 0)} /></label>
      </div>
      <Stat label="You save" value={money(save)} />
      <Stat label="Final price" value={money(price - save)} />
    </div>
  );
}
