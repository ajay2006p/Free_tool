"use client";

import { useState, useEffect, useRef } from "react";

/* ---------------- Stopwatch ---------------- */
export function Stopwatch() {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const start = useRef(0);
  const ref = useRef(null);
  useEffect(() => {
    if (running) {
      start.current = Date.now() - ms;
      ref.current = setInterval(() => setMs(Date.now() - start.current), 31);
      return () => clearInterval(ref.current);
    }
  }, [running]); // eslint-disable-line
  const fmt = (t) => { const cs = Math.floor((t % 1000) / 10), s = Math.floor(t / 1000) % 60, m = Math.floor(t / 60000); return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`; };
  return (
    <div className="tool center">
      <div style={{ fontSize: 64, fontWeight: 800, fontFamily: "var(--mono)" }}>{fmt(ms)}</div>
      <div className="hero-actions" style={{ justifyContent: "center", marginTop: 10 }}>
        <button className="btn" onClick={() => setRunning((r) => !r)}>{running ? "Pause" : "Start"}</button>
        <button className="btn btn-outline" onClick={() => running && setLaps([fmt(ms), ...laps])} disabled={!running}>Lap</button>
        <button className="btn btn-outline" onClick={() => { setRunning(false); setMs(0); setLaps([]); }}>Reset</button>
      </div>
      {laps.length ? <div className="sheet" style={{ padding: 12, marginTop: 14, textAlign: "left", maxWidth: 300, margin: "14px auto 0" }}>{laps.map((l, i) => <div key={i} className="flex-between mono" style={{ fontSize: 14 }}><span className="muted">Lap {laps.length - i}</span><span>{l}</span></div>)}</div> : null}
    </div>
  );
}

/* ---------------- Countdown to Date ---------------- */
export function CountdownDate() {
  const [target, setTarget] = useState("2027-01-01T00:00");
  const [now, setNow] = useState(null);
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); setNow(Date.now()); return () => clearInterval(id); }, []);
  const diff = now != null ? new Date(target).getTime() - now : 0;
  const past = diff <= 0;
  const d = Math.abs(diff);
  const days = Math.floor(d / 86400000), hrs = Math.floor(d / 3600000) % 24, mins = Math.floor(d / 60000) % 60, secs = Math.floor(d / 1000) % 60;
  const Box = ({ n, l }) => <div className="sheet center" style={{ padding: "14px 8px" }}><div style={{ fontSize: 34, fontWeight: 800 }}>{n}</div><div className="hint" style={{ margin: 0 }}>{l}</div></div>;
  return (
    <div className="tool">
      <label className="fld">Count down to</label>
      <input className="input" type="datetime-local" value={target} onChange={(e) => setTarget(e.target.value)} />
      <div className="grid grid-4" style={{ marginTop: 16 }}>
        <Box n={days} l="Days" /><Box n={hrs} l="Hours" /><Box n={mins} l="Minutes" /><Box n={secs} l="Seconds" />
      </div>
      {now != null ? <p className="center muted" style={{ marginTop: 10 }}>{past ? "That moment has passed." : "remaining"}</p> : null}
    </div>
  );
}

/* ---------------- Typing Speed Test ---------------- */
const PASSAGES = [
  "The quick brown fox jumps over the lazy dog while the sun sets slowly behind the quiet hills.",
  "Practice makes progress, and every expert was once a beginner who refused to give up on the craft.",
  "Good code is simple, readable, and honest about what it does and what it cannot yet do well.",
];
export function TypingTest() {
  const [text] = useState(() => PASSAGES[Math.floor(Math.random() * PASSAGES.length)]);
  const [input, setInput] = useState("");
  const [start, setStart] = useState(null);
  const [endT, setEndT] = useState(null);
  const [, setTick] = useState(0);
  useEffect(() => {
    if (start === null || endT) return;
    const id = setInterval(() => setTick((t) => t + 1), 150);
    return () => clearInterval(id);
  }, [start, endT]);
  function onChange(e) {
    const v = e.target.value;
    if (start === null && v.length) setStart(Date.now());
    setInput(v);
    if (v === text) setEndT(Date.now());
  }
  const done = endT != null;
  const secs = start ? ((endT || Date.now()) - start) / 1000 : 0;
  const words = input.trim().split(/\s+/).filter(Boolean).length;
  const wpm = secs > 0.3 ? Math.round((words / secs) * 60) : 0;
  let correct = 0; for (let i = 0; i < input.length; i++) if (input[i] === text[i]) correct++;
  const acc = input.length ? Math.round((correct / input.length) * 100) : 100;
  function reset() { location.reload(); }
  return (
    <div className="tool">
      <div className="sheet" style={{ padding: 16, fontSize: 18, lineHeight: 1.7, marginBottom: 12 }}>
        {text.split("").map((ch, i) => {
          let color = "var(--muted)";
          if (i < input.length) color = input[i] === ch ? "var(--green)" : "var(--red)";
          return <span key={i} style={{ color, background: i === input.length ? "var(--accent-soft)" : "transparent" }}>{ch}</span>;
        })}
      </div>
      <textarea className="textarea" style={{ minHeight: 90, fontFamily: "var(--sans)", fontSize: 16 }} value={input} onChange={onChange} disabled={done} placeholder="Start typing here…" autoFocus />
      <div className="grid grid-3" style={{ marginTop: 12 }}>
        <div className="sheet center" style={{ padding: 14 }}><div style={{ fontSize: 28, fontWeight: 800 }}>{wpm}</div><div className="hint" style={{ margin: 0 }}>WPM</div></div>
        <div className="sheet center" style={{ padding: 14 }}><div style={{ fontSize: 28, fontWeight: 800 }}>{acc}%</div><div className="hint" style={{ margin: 0 }}>Accuracy</div></div>
        <div className="sheet center" style={{ padding: 14 }}><div style={{ fontSize: 28, fontWeight: 800 }}>{secs.toFixed(1)}s</div><div className="hint" style={{ margin: 0 }}>Time</div></div>
      </div>
      {done ? <div className="notice notice-ok" style={{ marginTop: 12 }}>🎉 Done! {wpm} WPM at {acc}% accuracy. <button className="copy-btn" onClick={reset}>Try again</button></div> : null}
    </div>
  );
}
