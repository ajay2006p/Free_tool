"use client";

import { useState, useEffect, useRef } from "react";
import { useLocalStorage, uid } from "./useLocalStorage";
import { buildInvoicePdf, downloadBytes } from "../../lib/pdf";

/* ---------------- Invoice Generator ---------------- */
export function InvoiceGenerator() {
  const [f, setF] = useState({ number: "INV-001", from: "Your Name\nyour@email.com", to: "Client Co\nclient@email.com", tax: 0 });
  const [items, setItems] = useState([{ id: uid(), desc: "Website design", qty: 1, rate: 500 }]);
  const up = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const upItem = (id, k, v) => setItems(items.map((i) => i.id === id ? { ...i, [k]: k === "desc" ? v : Number(v) } : i));
  const sub = items.reduce((s, i) => s + i.qty * i.rate, 0);
  const taxAmt = sub * (f.tax / 100);
  const total = sub + taxAmt;
  const money = (n) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function download() {
    setBusy(true); setErr("");
    try {
      const bytes = await buildInvoicePdf(f, items, { sub, taxAmt, total, taxRate: f.tax });
      downloadBytes(bytes, `invoice-${(f.number || "001").replace(/[^a-z0-9-]/gi, "")}.pdf`);
    } catch (e) { setErr("Could not create the PDF. Please try again."); }
    finally { setBusy(false); }
  }
  return (
    <div className="tool">
      <div className="grid grid-3" style={{ gap: 12 }}>
        <div><label className="fld">Invoice #</label><input className="input" value={f.number} onChange={(e) => up("number", e.target.value)} /></div>
        <div><label className="fld">From</label><textarea className="textarea" style={{ minHeight: 60 }} value={f.from} onChange={(e) => up("from", e.target.value)} /></div>
        <div><label className="fld">Bill to</label><textarea className="textarea" style={{ minHeight: 60 }} value={f.to} onChange={(e) => up("to", e.target.value)} /></div>
      </div>
      <label className="fld" style={{ marginTop: 12 }}>Line items</label>
      {items.map((i) => (
        <div key={i.id} className="tool-controls" style={{ marginBottom: 6 }}>
          <input className="input" style={{ flex: 1 }} value={i.desc} onChange={(e) => upItem(i.id, "desc", e.target.value)} placeholder="Description" />
          <input className="input" style={{ width: 70 }} type="number" value={i.qty} onChange={(e) => upItem(i.id, "qty", e.target.value)} />
          <input className="input" style={{ width: 100 }} type="number" value={i.rate} onChange={(e) => upItem(i.id, "rate", e.target.value)} />
          <span style={{ width: 90, textAlign: "right", fontWeight: 600 }}>{money(i.qty * i.rate)}</span>
          <button className="copy-btn" onClick={() => setItems(items.filter((x) => x.id !== i.id))}>✕</button>
        </div>
      ))}
      <div className="tool-controls">
        <button className="btn btn-sm btn-outline" onClick={() => setItems([...items, { id: uid(), desc: "", qty: 1, rate: 0 }])}>+ Add line</button>
        <label className="chk">Tax % <input className="input" style={{ width: 70 }} type="number" value={f.tax} onChange={(e) => up("tax", Number(e.target.value) || 0)} /></label>
      </div>
      <div className="sheet" style={{ padding: 16, marginTop: 8 }}>
        <div className="flex-between"><span className="muted">Subtotal</span><span>{money(sub)}</span></div>
        <div className="flex-between"><span className="muted">Tax ({f.tax}%)</span><span>{money(taxAmt)}</span></div>
        <div className="flex-between" style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}><span>Total</span><span>{money(total)}</span></div>
      </div>
      <div className="center mt-2">
        <button className="btn" onClick={download} disabled={busy}>{busy ? "Creating PDF…" : "⬇ Download invoice PDF"}</button>
        {err ? <div className="notice notice-warn" style={{ marginTop: 10 }}>{err}</div> : null}
      </div>
    </div>
  );
}

/* ---------------- Time Tracker ---------------- */
export function TimeTracker() {
  const [task, setTask] = useState("");
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [log, setLog] = useLocalStorage("dh_timelog", []);
  const startRef = useRef(0);
  const tickRef = useRef(null);

  useEffect(() => {
    if (running) {
      tickRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 500);
      return () => clearInterval(tickRef.current);
    }
  }, [running]);

  function start() { if (!task.trim()) return; startRef.current = Date.now(); setElapsed(0); setRunning(true); }
  function stop() {
    setRunning(false);
    if (elapsed > 0) setLog([{ id: uid(), task: task.trim(), secs: elapsed, at: new Date().toLocaleString() }, ...log]);
    setElapsed(0);
  }
  const fmt = (s) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const totalSecs = log.reduce((s, e) => s + e.secs, 0);
  return (
    <div className="tool">
      <div className="tool-controls">
        <input className="input" style={{ flex: 1 }} value={task} onChange={(e) => setTask(e.target.value)} placeholder="What are you working on?" disabled={running} />
        {running ? <button className="btn btn-accent" onClick={stop}>■ Stop</button> : <button className="btn" onClick={start}>▶ Start</button>}
      </div>
      <div className="center" style={{ fontFamily: "var(--serif)", fontSize: 56, fontWeight: 700 }}>{fmt(elapsed)}</div>
      <div className="flex-between" style={{ marginTop: 10 }}><label className="fld" style={{ margin: 0 }}>Log</label><span className="hint" style={{ margin: 0 }}>Total tracked: {fmt(totalSecs)}</span></div>
      <div className="stack-sm">
        {log.map((e) => (
          <div key={e.id} className="sheet flex-between" style={{ padding: "10px 14px", marginBottom: 6 }}>
            <span>{e.task} <span className="hint" style={{ margin: 0 }}>· {e.at}</span></span>
            <span><strong className="mono">{fmt(e.secs)}</strong> <button className="copy-btn" onClick={() => setLog(log.filter((x) => x.id !== e.id))}>✕</button></span>
          </div>
        ))}
        {log.length === 0 ? <p className="hint">No time logged yet.</p> : null}
      </div>
    </div>
  );
}
