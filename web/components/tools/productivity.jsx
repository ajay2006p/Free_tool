"use client";

import { useState, useEffect, useRef } from "react";
import { useLocalStorage, uid } from "./useLocalStorage";

/* ---------------- Notes ---------------- */
export function Notes() {
  const [notes, setNotes] = useLocalStorage("dh_notes", []);
  const [text, setText] = useState("");
  function add() {
    if (!text.trim()) return;
    setNotes([{ id: uid(), text: text.trim(), at: new Date().toLocaleString() }, ...notes]);
    setText("");
  }
  return (
    <div className="tool">
      <label className="fld">New note</label>
      <textarea className="textarea" style={{ minHeight: 90, fontFamily: "var(--sans)" }} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a note…" />
      <div className="tool-controls"><button className="btn btn-sm" onClick={add}>+ Add note</button><span className="hint" style={{ margin: 0 }}>Saved in your browser.</span></div>
      <div className="grid grid-2" style={{ marginTop: 8 }}>
        {notes.map((n) => (
          <div key={n.id} className="sheet" style={{ padding: 14 }}>
            <div style={{ whiteSpace: "pre-wrap", fontFamily: "var(--serif)" }}>{n.text}</div>
            <div className="flex-between" style={{ marginTop: 8 }}><span className="hint" style={{ margin: 0 }}>{n.at}</span><button className="copy-btn" onClick={() => setNotes(notes.filter((x) => x.id !== n.id))}>Delete</button></div>
          </div>
        ))}
        {notes.length === 0 ? <p className="hint">No notes yet.</p> : null}
      </div>
    </div>
  );
}

/* ---------------- Todo List ---------------- */
export function TodoList() {
  const [items, setItems] = useLocalStorage("dh_todo", []);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const add = () => { if (text.trim()) { setItems([...items, { id: uid(), text: text.trim(), done: false }]); setText(""); } };
  const toggle = (id) => setItems(items.map((i) => i.id === id ? { ...i, done: !i.done } : i));
  const shown = items.filter((i) => filter === "all" ? true : filter === "active" ? !i.done : i.done);
  const left = items.filter((i) => !i.done).length;
  return (
    <div className="tool">
      <div className="tool-controls">
        <input className="input" style={{ flex: 1 }} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="What needs doing?" />
        <button className="btn btn-sm" onClick={add}>Add</button>
      </div>
      <div className="tool-controls">
        <div className="pill-group">
          {["all", "active", "done"].map((f) => <button key={f} className={filter === f ? "on" : ""} onClick={() => setFilter(f)}>{f}</button>)}
        </div>
        <span className="hint" style={{ margin: 0 }}>{left} left</span>
      </div>
      <div className="stack-sm">
        {shown.map((i) => (
          <div key={i.id} className="sheet flex-between" style={{ padding: "10px 14px", marginBottom: 8 }}>
            <label className="chk"><input type="checkbox" checked={i.done} onChange={() => toggle(i.id)} /> <span style={{ textDecoration: i.done ? "line-through" : "none", color: i.done ? "var(--ink-faint)" : "inherit" }}>{i.text}</span></label>
            <button className="copy-btn" onClick={() => setItems(items.filter((x) => x.id !== i.id))}>✕</button>
          </div>
        ))}
        {shown.length === 0 ? <p className="hint">Nothing here.</p> : null}
      </div>
    </div>
  );
}

/* ---------------- Kanban Board ---------------- */
const COLS = [["todo", "To do"], ["doing", "Doing"], ["done", "Done"]];
export function Kanban() {
  const [cards, setCards] = useLocalStorage("dh_kanban", []);
  const [text, setText] = useState("");
  const add = () => { if (text.trim()) { setCards([...cards, { id: uid(), text: text.trim(), col: "todo" }]); setText(""); } };
  const move = (id, dir) => setCards(cards.map((c) => {
    if (c.id !== id) return c;
    const idx = COLS.findIndex(([k]) => k === c.col);
    const next = Math.max(0, Math.min(COLS.length - 1, idx + dir));
    return { ...c, col: COLS[next][0] };
  }));
  return (
    <div className="tool">
      <div className="tool-controls">
        <input className="input" style={{ flex: 1 }} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="Add a card to To do…" />
        <button className="btn btn-sm" onClick={add}>Add</button>
      </div>
      <div className="grid grid-3">
        {COLS.map(([key, label]) => (
          <div key={key} className="sheet" style={{ padding: 12 }}>
            <div className="flex-between" style={{ marginBottom: 8 }}><strong>{label}</strong><span className="hint" style={{ margin: 0 }}>{cards.filter((c) => c.col === key).length}</span></div>
            {cards.filter((c) => c.col === key).map((c) => (
              <div key={c.id} className="card" style={{ padding: "8px 10px", marginBottom: 8 }}>
                <div style={{ fontSize: 14 }}>{c.text}</div>
                <div className="flex-between" style={{ marginTop: 6 }}>
                  <span>
                    <button className="copy-btn" disabled={key === "todo"} onClick={() => move(c.id, -1)}>←</button>{" "}
                    <button className="copy-btn" disabled={key === "done"} onClick={() => move(c.id, 1)}>→</button>
                  </span>
                  <button className="copy-btn" onClick={() => setCards(cards.filter((x) => x.id !== c.id))}>✕</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Pomodoro Timer ---------------- */
export function Pomodoro() {
  const [secs, setSecs] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState("focus");
  const [rounds, setRounds] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSecs((s) => s - 1), 1000);
      return () => clearInterval(ref.current);
    }
  }, [running]);
  useEffect(() => {
    if (secs <= 0) {
      setRunning(false);
      if (mode === "focus") { setRounds((r) => r + 1); setMode("break"); setSecs(5 * 60); }
      else { setMode("focus"); setSecs(25 * 60); }
    }
  }, [secs, mode]);
  const mm = String(Math.max(0, Math.floor(secs / 60))).padStart(2, "0");
  const ss = String(Math.max(0, secs % 60)).padStart(2, "0");
  const reset = (m) => { setRunning(false); setMode(m); setSecs(m === "focus" ? 25 * 60 : 5 * 60); };
  return (
    <div className="tool center">
      <div className="tool-controls" style={{ justifyContent: "center" }}>
        <div className="pill-group">
          <button className={mode === "focus" ? "on" : ""} onClick={() => reset("focus")}>Focus 25</button>
          <button className={mode === "break" ? "on" : ""} onClick={() => reset("break")}>Break 5</button>
        </div>
      </div>
      <div style={{ fontFamily: "var(--serif)", fontSize: 84, fontWeight: 700, lineHeight: 1 }}>{mm}:{ss}</div>
      <p className="muted" style={{ fontFamily: "var(--sans)" }}>Completed focus sessions: <strong>{rounds}</strong></p>
      <div className="hero-actions" style={{ justifyContent: "center" }}>
        <button className="btn" onClick={() => setRunning((r) => !r)}>{running ? "Pause" : "Start"}</button>
        <button className="btn btn-outline" onClick={() => reset(mode)}>Reset</button>
      </div>
    </div>
  );
}

/* ---------------- Habit Tracker ---------------- */
export function HabitTracker() {
  const [habits, setHabits] = useLocalStorage("dh_habits", []);
  const [name, setName] = useState("");
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const add = () => { if (name.trim()) { setHabits([...habits, { id: uid(), name: name.trim(), marks: Array(7).fill(false) }]); setName(""); } };
  const toggle = (id, d) => setHabits(habits.map((h) => h.id === id ? { ...h, marks: h.marks.map((m, i) => i === d ? !m : m) } : h));
  return (
    <div className="tool">
      <div className="tool-controls">
        <input className="input" style={{ flex: 1 }} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="New habit (e.g. Read 30 min)" />
        <button className="btn btn-sm" onClick={add}>Add</button>
      </div>
      <div className="stack-sm">
        {habits.map((h) => (
          <div key={h.id} className="sheet flex-between" style={{ padding: "10px 14px", marginBottom: 8 }}>
            <strong style={{ flex: 1 }}>{h.name}</strong>
            <div style={{ display: "flex", gap: 5 }}>
              {days.map((d, i) => (
                <button key={i} onClick={() => toggle(h.id, i)} title={"Day " + (i + 1)}
                  style={{ width: 30, height: 30, borderRadius: 6, cursor: "pointer", border: "1.5px solid var(--line)", fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, background: h.marks[i] ? "var(--accent-2)" : "var(--paper-2)", color: h.marks[i] ? "#fff" : "var(--ink-faint)" }}>{d}</button>
              ))}
            </div>
            <button className="copy-btn" onClick={() => setHabits(habits.filter((x) => x.id !== h.id))}>✕</button>
          </div>
        ))}
        {habits.length === 0 ? <p className="hint">Add a habit to start your 7-day streak.</p> : null}
      </div>
    </div>
  );
}

/* ---------------- Goal Tracker ---------------- */
export function GoalTracker() {
  const [goals, setGoals] = useLocalStorage("dh_goals", []);
  const [f, setF] = useState({ title: "", target: 100 });
  const add = () => { if (f.title.trim()) { setGoals([...goals, { id: uid(), title: f.title.trim(), target: Number(f.target) || 100, current: 0 }]); setF({ title: "", target: 100 }); } };
  const bump = (id, delta) => setGoals(goals.map((g) => g.id === id ? { ...g, current: Math.max(0, Math.min(g.target, g.current + delta)) } : g));
  return (
    <div className="tool">
      <div className="tool-controls">
        <input className="input" style={{ flex: 1 }} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Goal (e.g. Read 12 books)" />
        <input className="input" style={{ width: 100 }} type="number" value={f.target} onChange={(e) => setF({ ...f, target: e.target.value })} placeholder="Target" />
        <button className="btn btn-sm" onClick={add}>Add</button>
      </div>
      <div className="stack-sm">
        {goals.map((g) => {
          const pct = Math.round((g.current / g.target) * 100);
          return (
            <div key={g.id} className="sheet" style={{ padding: "12px 14px", marginBottom: 8 }}>
              <div className="flex-between"><strong>{g.title}</strong><span className="hint" style={{ margin: 0 }}>{g.current}/{g.target} · {pct}%</span></div>
              <div style={{ height: 10, background: "var(--paper-2)", borderRadius: 999, border: "1px solid var(--line)", margin: "8px 0", overflow: "hidden" }}>
                <div style={{ width: pct + "%", height: "100%", background: "var(--accent-2)" }} />
              </div>
              <div className="row-actions">
                <button className="copy-btn" onClick={() => bump(g.id, 1)}>+1</button>
                <button className="copy-btn" onClick={() => bump(g.id, 5)}>+5</button>
                <button className="copy-btn" onClick={() => bump(g.id, -1)}>-1</button>
                <button className="copy-btn" onClick={() => setGoals(goals.filter((x) => x.id !== g.id))}>Delete</button>
              </div>
            </div>
          );
        })}
        {goals.length === 0 ? <p className="hint">Add a goal and track your progress.</p> : null}
      </div>
    </div>
  );
}

/* ---------------- Expense Tracker ---------------- */
export function ExpenseTracker() {
  const [items, setItems] = useLocalStorage("dh_expenses", []);
  const [f, setF] = useState({ label: "", amount: "", cat: "General" });
  const add = () => { if (f.label.trim() && f.amount) { setItems([{ id: uid(), label: f.label.trim(), amount: Number(f.amount), cat: f.cat }, ...items]); setF({ label: "", amount: "", cat: "General" }); } };
  const total = items.reduce((s, i) => s + i.amount, 0);
  return (
    <div className="tool">
      <div className="tool-controls">
        <input className="input" style={{ flex: 1 }} value={f.label} onChange={(e) => setF({ ...f, label: e.target.value })} placeholder="Expense" />
        <input className="input" style={{ width: 110 }} type="number" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} placeholder="Amount" />
        <select className="select" style={{ width: 130 }} value={f.cat} onChange={(e) => setF({ ...f, cat: e.target.value })}>
          {["General", "Food", "Rent", "Transport", "Fun", "Bills"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <button className="btn btn-sm" onClick={add}>Add</button>
      </div>
      <div className="sheet flex-between" style={{ padding: "12px 16px", marginBottom: 12 }}><strong>Total spent</strong><span style={{ fontSize: 22, fontWeight: 700 }}>{total.toFixed(2)}</span></div>
      <div className="stack-sm">
        {items.map((i) => (
          <div key={i.id} className="sheet flex-between" style={{ padding: "10px 14px", marginBottom: 6 }}>
            <span>{i.label} <span className="badge badge-cat">{i.cat}</span></span>
            <span><strong>{i.amount.toFixed(2)}</strong> <button className="copy-btn" onClick={() => setItems(items.filter((x) => x.id !== i.id))}>✕</button></span>
          </div>
        ))}
        {items.length === 0 ? <p className="hint">No expenses logged.</p> : null}
      </div>
    </div>
  );
}

/* ---------------- Bookmark Manager ---------------- */
export function BookmarkManager() {
  const [marks, setMarks] = useLocalStorage("dh_bookmarks", []);
  const [f, setF] = useState({ title: "", url: "" });
  const add = () => {
    let url = f.url.trim(); if (!url) return;
    if (!/^https?:\/\//.test(url)) url = "https://" + url;
    setMarks([{ id: uid(), title: f.title.trim() || url, url }, ...marks]); setF({ title: "", url: "" });
  };
  return (
    <div className="tool">
      <div className="tool-controls">
        <input className="input" style={{ width: 200 }} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Title (optional)" />
        <input className="input" style={{ flex: 1 }} value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="example.com" />
        <button className="btn btn-sm" onClick={add}>Save</button>
      </div>
      <div className="stack-sm">
        {marks.map((m) => (
          <div key={m.id} className="sheet flex-between" style={{ padding: "10px 14px", marginBottom: 6 }}>
            <a href={m.url} target="_blank" rel="noreferrer">🔖 {m.title}</a>
            <button className="copy-btn" onClick={() => setMarks(marks.filter((x) => x.id !== m.id))}>✕</button>
          </div>
        ))}
        {marks.length === 0 ? <p className="hint">Save your favorite links here.</p> : null}
      </div>
    </div>
  );
}
