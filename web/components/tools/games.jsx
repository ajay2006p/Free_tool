"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

/* ============================ 2048 ============================ */
const empty2048 = () => Array.from({ length: 4 }, () => [0, 0, 0, 0]);
function spawn(board) {
  const cells = [];
  board.forEach((row, r) => row.forEach((v, c) => { if (!v) cells.push([r, c]); }));
  if (!cells.length) return board;
  const [r, c] = cells[Math.floor(Math.random() * cells.length)];
  const b = board.map((row) => [...row]);
  b[r][c] = Math.random() < 0.9 ? 2 : 4;
  return b;
}
function slideRow(row) {
  const arr = row.filter((v) => v);
  let gain = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) { arr[i] *= 2; gain += arr[i]; arr.splice(i + 1, 1); }
  }
  while (arr.length < 4) arr.push(0);
  return { row: arr, gain };
}
function operate(b, dir) {
  const transpose = (m) => m[0].map((_, i) => m.map((r) => r[i]));
  const rev = (m) => m.map((r) => [...r].reverse());
  let g = 0;
  const slide = (m) => m.map((r) => { const { row, gain } = slideRow(r); g += gain; return row; });
  let x = b;
  if (dir === "up") { x = transpose(x); x = slide(x); x = transpose(x); }
  else if (dir === "down") { x = transpose(x); x = rev(x); x = slide(x); x = rev(x); x = transpose(x); }
  else if (dir === "left") x = slide(x);
  else { x = rev(x); x = slide(x); x = rev(x); }
  return { board: x, gained: g };
}
const TILE = { 0: "#e9edf5", 2: "#dbe4ff", 4: "#bcd0ff", 8: "#8fb4ff", 16: "#6d9bff", 32: "#4f7cf5", 64: "#4f46e5", 128: "#7c3aed", 256: "#9333ea", 512: "#c026d3", 1024: "#db2777", 2048: "#f59e0b" };
export function Game2048() {
  const [board, setBoard] = useState(() => spawn(spawn(empty2048())));
  const [score, setScore] = useState(0);
  const [best, setBest] = useLocalStorage("dh_2048_best", 0);
  const [over, setOver] = useState(false);

  const move = useCallback((dir) => {
    setBoard((prev) => {
      if (over) return prev;
      const { board: moved, gained } = operate(prev, dir);
      if (JSON.stringify(moved) === JSON.stringify(prev)) return prev;
      const next = spawn(moved);
      setScore((s) => { const ns = s + gained; setBest((b) => Math.max(b, ns)); return ns; });
      const full = next.every((r) => r.every((v) => v));
      const stuck = full && !["up", "down", "left", "right"].some((d) => JSON.stringify(operate(next, d).board) !== JSON.stringify(next));
      if (stuck) setOver(true);
      return next;
    });
  }, [over, setBest]);

  useEffect(() => {
    const onKey = (e) => {
      const m = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right" }[e.key];
      if (m) { e.preventDefault(); move(m); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move]);

  function reset() { setBoard(spawn(spawn(empty2048()))); setScore(0); setOver(false); }

  return (
    <div className="tool center">
      <div className="flex-between" style={{ maxWidth: 340, margin: "0 auto 12px" }}>
        <div className="sheet" style={{ padding: "8px 16px" }}><div className="hint" style={{ margin: 0 }}>SCORE</div><strong style={{ fontSize: 20 }}>{score}</strong></div>
        <div className="sheet" style={{ padding: "8px 16px" }}><div className="hint" style={{ margin: 0 }}>BEST</div><strong style={{ fontSize: 20 }}>{best}</strong></div>
        <button className="btn btn-sm" onClick={reset}>New game</button>
      </div>
      <div style={{ position: "relative", width: "min(340px, 88vw)", margin: "0 auto", background: "#c7cede", borderRadius: 12, padding: 8, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, aspectRatio: "1" }}>
        {board.flat().map((v, i) => (
          <div key={i} style={{ background: TILE[v] || "#f59e0b", borderRadius: 8, display: "grid", placeItems: "center", fontWeight: 800, fontSize: v >= 1024 ? 20 : 26, color: v >= 8 ? "#fff" : "#334155" }}>{v || ""}</div>
        ))}
        {over ? <div style={{ position: "absolute", inset: 8, background: "rgba(255,255,255,.8)", borderRadius: 8, display: "grid", placeItems: "center" }}><div><h3>Game over</h3><button className="btn btn-sm" onClick={reset}>Try again</button></div></div> : null}
      </div>
      <p className="hint">Use arrow keys (or W A S D). Combine tiles to reach 2048!</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,52px)", gap: 6, justifyContent: "center", marginTop: 6 }}>
        <span /><button className="btn btn-outline btn-sm" onClick={() => move("up")}>↑</button><span />
        <button className="btn btn-outline btn-sm" onClick={() => move("left")}>←</button>
        <button className="btn btn-outline btn-sm" onClick={() => move("down")}>↓</button>
        <button className="btn btn-outline btn-sm" onClick={() => move("right")}>→</button>
      </div>
    </div>
  );
}

/* ============================ Snake ============================ */
const N = 17;
export function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 8, y: 8 }]);
  const [food, setFood] = useState({ x: 12, y: 8 });
  const [score, setScore] = useState(0);
  const [best, setBest] = useLocalStorage("dh_snake_best", 0);
  const [over, setOver] = useState(false);
  const [running, setRunning] = useState(false);
  const dir = useRef({ x: 1, y: 0 });
  const nextDir = useRef({ x: 1, y: 0 });

  const randFood = useCallback((sn) => {
    let f;
    do { f = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) }; }
    while (sn.some((s) => s.x === f.x && s.y === f.y));
    return f;
  }, []);

  const reset = useCallback(() => {
    const s = [{ x: 8, y: 8 }];
    setSnake(s); setFood(randFood(s)); setScore(0); setOver(false);
    dir.current = { x: 1, y: 0 }; nextDir.current = { x: 1, y: 0 }; setRunning(true);
  }, [randFood]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSnake((prev) => {
        const d = nextDir.current; dir.current = d;
        const head = { x: prev[0].x + d.x, y: prev[0].y + d.y };
        if (head.x < 0 || head.y < 0 || head.x >= N || head.y >= N || prev.some((s) => s.x === head.x && s.y === head.y)) {
          setOver(true); setRunning(false); setScore((sc) => { setBest((b) => Math.max(b, sc)); return sc; });
          return prev;
        }
        const grow = head.x === food.x && head.y === food.y;
        const body = [head, ...prev];
        if (grow) { setScore((s) => s + 1); setFood(randFood(body)); } else body.pop();
        return body;
      });
    }, 110);
    return () => clearInterval(id);
  }, [running, food, randFood, setBest]);

  useEffect(() => {
    const onKey = (e) => {
      const map = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, w: { x: 0, y: -1 }, s: { x: 0, y: 1 }, a: { x: -1, y: 0 }, d: { x: 1, y: 0 } }[e.key];
      if (!map) return;
      e.preventDefault();
      const cur = dir.current;
      if (map.x === -cur.x && map.y === -cur.y) return; // no reverse
      nextDir.current = map;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const cell = (x, y) => snake.some((s) => s.x === x && s.y === y) ? (snake[0].x === x && snake[0].y === y ? "#4338ca" : "#4f46e5") : (food.x === x && food.y === y ? "#e11d48" : "transparent");

  return (
    <div className="tool center">
      <div className="flex-between" style={{ maxWidth: 360, margin: "0 auto 10px" }}>
        <strong>Score: {score}</strong><strong className="muted">Best: {best}</strong>
        <button className="btn btn-sm" onClick={reset}>{running ? "Restart" : "Start"}</button>
      </div>
      <div style={{ width: "min(360px,88vw)", margin: "0 auto", aspectRatio: "1", background: "#eef1f7", border: "1px solid var(--border)", borderRadius: 10, display: "grid", gridTemplateColumns: `repeat(${N},1fr)`, gap: 1, padding: 4, position: "relative" }}>
        {Array.from({ length: N * N }).map((_, i) => {
          const x = i % N, y = Math.floor(i / N);
          return <div key={i} style={{ background: cell(x, y), borderRadius: 3 }} />;
        })}
        {!running && !over ? <div style={{ position: "absolute", inset: 4, background: "rgba(255,255,255,.85)", display: "grid", placeItems: "center", borderRadius: 8 }}><button className="btn" onClick={reset}>▶ Start</button></div> : null}
        {over ? <div style={{ position: "absolute", inset: 4, background: "rgba(255,255,255,.85)", display: "grid", placeItems: "center", borderRadius: 8 }}><div><h3>Game over — {score}</h3><button className="btn btn-sm" onClick={reset}>Play again</button></div></div> : null}
      </div>
      <p className="hint">Arrow keys or W A S D. Eat the red food, don't hit walls or yourself.</p>
    </div>
  );
}

/* ======================= Tic-Tac-Toe (vs AI) ======================= */
const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
function winner(b) {
  for (const [a, c, d] of LINES) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  return b.every(Boolean) ? "draw" : null;
}
function minimax(b, ai, turn) {
  const w = winner(b);
  if (w === ai) return { score: 10 };
  if (w && w !== "draw") return { score: -10 };
  if (w === "draw") return { score: 0 };
  let best = null;
  b.forEach((v, i) => {
    if (v) return;
    const nb = [...b]; nb[i] = turn;
    const res = minimax(nb, ai, turn === "X" ? "O" : "X");
    const score = res.score - (res.score > 0 ? 1 : res.score < 0 ? -1 : 0) * 0; // depth-neutral
    if (best === null || (turn === ai ? score > best.score : score < best.score)) best = { score, move: i };
  });
  return best;
}
export function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [wins, setWins] = useLocalStorage("dh_ttt", { w: 0, l: 0, d: 0 });
  const w = winner(board);

  function play(i) {
    if (board[i] || w) return;
    const nb = [...board]; nb[i] = "X";
    if (winner(nb)) { finish(nb); setBoard(nb); return; }
    const ai = minimax(nb, "O", "O");
    if (ai && ai.move != null) nb[ai.move] = "O";
    finish(nb); setBoard(nb);
  }
  function finish(nb) {
    const res = winner(nb);
    if (res === "X") setWins((s) => ({ ...s, w: s.w + 1 }));
    else if (res === "O") setWins((s) => ({ ...s, l: s.l + 1 }));
    else if (res === "draw") setWins((s) => ({ ...s, d: s.d + 1 }));
  }

  return (
    <div className="tool center">
      <p style={{ fontWeight: 700, fontSize: 18 }}>
        {w === "X" ? "🎉 You win!" : w === "O" ? "🤖 AI wins" : w === "draw" ? "🤝 Draw" : "Your turn (X)"}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 90px)", gap: 8, justifyContent: "center" }}>
        {board.map((v, i) => (
          <button key={i} onClick={() => play(i)} disabled={v || w}
            style={{ width: 90, height: 90, fontSize: 40, fontWeight: 800, borderRadius: 12, border: "1px solid var(--border-strong)", background: "var(--surface)", cursor: v || w ? "default" : "pointer", color: v === "X" ? "var(--accent)" : "var(--red)" }}>
            {v}
          </button>
        ))}
      </div>
      <div className="flex-between" style={{ maxWidth: 300, margin: "16px auto 0" }}>
        <span className="muted">Wins {wins.w} · Losses {wins.l} · Draws {wins.d}</span>
        <button className="btn btn-sm" onClick={() => setBoard(Array(9).fill(null))}>Reset board</button>
      </div>
      <p className="hint">You're X. The AI uses minimax — it's unbeatable, so aim for a draw!</p>
    </div>
  );
}
