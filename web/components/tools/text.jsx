"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";

/* ---------------- Text Diff ---------------- */
export function TextDiff() {
  const [a, setA] = useState("The quick brown fox\njumps over the lazy dog");
  const [b, setB] = useState("The quick red fox\njumps over the lazy dog\nextra line");
  const la = a.split("\n"), lb = b.split("\n");
  const max = Math.max(la.length, lb.length);
  const rows = [];
  for (let i = 0; i < max; i++) {
    const same = la[i] === lb[i];
    rows.push({ i, left: la[i] ?? "", right: lb[i] ?? "", same });
  }
  const diffs = rows.filter((r) => !r.same).length;
  return (
    <div className="tool">
      <div className="tool-io">
        <div><label className="fld">Original</label><textarea className="textarea" value={a} onChange={(e) => setA(e.target.value)} /></div>
        <div><label className="fld">Changed</label><textarea className="textarea" value={b} onChange={(e) => setB(e.target.value)} /></div>
      </div>
      <label className="fld" style={{ marginTop: 12 }}>{diffs} line{diffs === 1 ? "" : "s"} differ</label>
      <div className="sheet" style={{ padding: 12, fontFamily: "var(--mono)", fontSize: 13 }}>
        {rows.map((r) => (
          <div key={r.i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, background: r.same ? "transparent" : "var(--accent-soft)", padding: "1px 4px" }}>
            <span style={{ color: r.same ? "var(--ink-faint)" : "var(--accent)" }}>{r.left || "·"}</span>
            <span style={{ color: r.same ? "var(--ink-faint)" : "var(--accent-2)" }}>{r.right || "·"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Remove Duplicate Lines ---------------- */
export function RemoveDuplicates() {
  const [input, setInput] = useState("apple\nbanana\napple\ncherry\nbanana");
  const [trim, setTrim] = useState(true);
  const [ci, setCi] = useState(false);
  const seen = new Set();
  const out = input.split("\n").filter((line) => {
    let key = trim ? line.trim() : line;
    if (ci) key = key.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key); return true;
  }).join("\n");
  const removed = input.split("\n").length - out.split("\n").length;
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk"><input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} /> Ignore spaces</label>
        <label className="chk"><input type="checkbox" checked={ci} onChange={(e) => setCi(e.target.checked)} /> Ignore case</label>
      </div>
      <div className="tool-io">
        <div><label className="fld">Input</label><textarea className="textarea" value={input} onChange={(e) => setInput(e.target.value)} /></div>
        <div><label className="fld">Unique — {removed} removed <CopyButton value={out} /></label><textarea className="textarea" readOnly value={out} /></div>
      </div>
    </div>
  );
}

/* ---------------- Sort Lines ---------------- */
export function SortLines() {
  const [input, setInput] = useState("banana\napple\ncherry\nDate");
  const [dir, setDir] = useState("asc");
  const [ci, setCi] = useState(true);
  let lines = input.split("\n");
  lines.sort((x, y) => (ci ? x.toLowerCase() : x).localeCompare(ci ? y.toLowerCase() : y));
  if (dir === "desc") lines.reverse();
  const out = lines.join("\n");
  return (
    <div className="tool">
      <div className="tool-controls">
        <div className="pill-group"><button className={dir === "asc" ? "on" : ""} onClick={() => setDir("asc")}>A → Z</button><button className={dir === "desc" ? "on" : ""} onClick={() => setDir("desc")}>Z → A</button></div>
        <label className="chk"><input type="checkbox" checked={ci} onChange={(e) => setCi(e.target.checked)} /> Ignore case</label>
      </div>
      <div className="tool-io">
        <div><label className="fld">Input</label><textarea className="textarea" value={input} onChange={(e) => setInput(e.target.value)} /></div>
        <div><label className="fld">Sorted <CopyButton value={out} /></label><textarea className="textarea" readOnly value={out} /></div>
      </div>
    </div>
  );
}

/* ---------------- Reverse Text ---------------- */
export function ReverseText() {
  const [input, setInput] = useState("Hello world");
  const [mode, setMode] = useState("chars");
  const out = mode === "chars" ? [...input].reverse().join("") : mode === "words" ? input.split(/\s+/).reverse().join(" ") : input.split("\n").reverse().join("\n");
  return (
    <div className="tool">
      <div className="tool-controls">
        <div className="pill-group">{["chars", "words", "lines"].map((m) => <button key={m} className={mode === m ? "on" : ""} onClick={() => setMode(m)}>{m}</button>)}</div>
      </div>
      <label className="fld">Text</label>
      <textarea className="textarea" style={{ fontFamily: "var(--sans)" }} value={input} onChange={(e) => setInput(e.target.value)} />
      <label className="fld" style={{ marginTop: 12 }}>Reversed <CopyButton value={out} /></label>
      <div className="sheet mono-out" style={{ padding: 12 }}>{out}</div>
    </div>
  );
}

/* ---------------- Find & Replace ---------------- */
export function FindReplace() {
  const [input, setInput] = useState("cat sat on the cat mat");
  const [find, setFind] = useState("cat");
  const [rep, setRep] = useState("dog");
  const [ci, setCi] = useState(false);
  let out = input; let count = 0;
  if (find) {
    try {
      const re = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), ci ? "gi" : "g");
      count = (input.match(re) || []).length;
      out = input.replace(re, rep);
    } catch (e) {}
  }
  return (
    <div className="tool">
      <div className="tool-controls">
        <input className="input" style={{ flex: 1 }} value={find} onChange={(e) => setFind(e.target.value)} placeholder="Find" />
        <input className="input" style={{ flex: 1 }} value={rep} onChange={(e) => setRep(e.target.value)} placeholder="Replace with" />
        <label className="chk"><input type="checkbox" checked={ci} onChange={(e) => setCi(e.target.checked)} /> Ignore case</label>
      </div>
      <label className="fld">Text</label>
      <textarea className="textarea" style={{ fontFamily: "var(--sans)" }} value={input} onChange={(e) => setInput(e.target.value)} />
      <label className="fld" style={{ marginTop: 12 }}>Result — {count} replaced <CopyButton value={out} /></label>
      <div className="sheet mono-out" style={{ padding: 12 }}>{out}</div>
    </div>
  );
}

/* ---------------- Text Repeater ---------------- */
export function TextRepeater() {
  const [input, setInput] = useState("Hello ");
  const [times, setTimes] = useState(5);
  const [sep, setSep] = useState("newline");
  const joiner = sep === "newline" ? "\n" : sep === "space" ? " " : "";
  const out = Array(Math.max(0, Math.min(10000, times))).fill(input).join(joiner);
  return (
    <div className="tool">
      <label className="fld">Text to repeat</label>
      <textarea className="textarea" style={{ minHeight: 80, fontFamily: "var(--sans)" }} value={input} onChange={(e) => setInput(e.target.value)} />
      <div className="tool-controls">
        <label className="chk">Times <input className="input" style={{ width: 90 }} type="number" min={1} max={10000} value={times} onChange={(e) => setTimes(Number(e.target.value) || 1)} /></label>
        <label className="chk">Separator
          <select className="select" style={{ width: 120 }} value={sep} onChange={(e) => setSep(e.target.value)}><option value="newline">New line</option><option value="space">Space</option><option value="none">None</option></select>
        </label>
        <CopyButton value={out} label="Copy" />
      </div>
      <textarea className="textarea" readOnly value={out} />
    </div>
  );
}
