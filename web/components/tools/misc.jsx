"use client";

import { useState, useEffect, useRef } from "react";
import CopyButton from "../CopyButton";

/* ---------------- Text to Speech ---------------- */
export function TextToSpeech() {
  const [text, setText] = useState("Hello! This text is being read aloud by your browser.");
  const [voices, setVoices] = useState([]);
  const [voice, setVoice] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!supported) return;
    const load = () => { const v = window.speechSynthesis.getVoices(); setVoices(v); if (v[0] && !voice) setVoice(v[0].name); };
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, []); // eslint-disable-line

  function speak() {
    if (!supported || !text.trim()) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = voices.find((x) => x.name === voice); if (v) u.voice = v;
    u.rate = rate; u.pitch = pitch;
    u.onend = () => setSpeaking(false);
    setSpeaking(true); window.speechSynthesis.speak(u);
  }
  function stop() { if (supported) window.speechSynthesis.cancel(); setSpeaking(false); }

  if (!supported) return <div className="notice notice-warn">Your browser doesn't support speech synthesis.</div>;
  return (
    <div className="tool">
      <label className="fld">Text to read</label>
      <textarea className="textarea" style={{ minHeight: 120, fontFamily: "var(--sans)" }} value={text} onChange={(e) => setText(e.target.value)} />
      <div className="tool-controls">
        <label className="chk">Voice <select className="select" style={{ width: 180 }} value={voice} onChange={(e) => setVoice(e.target.value)}>{voices.map((v) => <option key={v.name} value={v.name}>{v.name}</option>)}</select></label>
        <label className="chk">Speed {rate.toFixed(1)} <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} /></label>
        <label className="chk">Pitch {pitch.toFixed(1)} <input type="range" min={0} max={2} step={0.1} value={pitch} onChange={(e) => setPitch(+e.target.value)} /></label>
      </div>
      <div className="tool-controls" style={{ marginTop: 4 }}>
        <button className="btn" onClick={speak}>▶ Speak</button>
        {speaking ? <button className="btn btn-outline" onClick={stop}>■ Stop</button> : null}
      </div>
    </div>
  );
}

/* ---------------- Morse Code ---------------- */
const MORSE = { A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..", 0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.", ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--", "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...", "'": ".----.", "=": "-...-", "+": ".-.-.", "-": "-....-", "@": ".--.-." };
const RMORSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));
export function MorseCode() {
  const [mode, setMode] = useState("encode");
  const [input, setInput] = useState("HELLO WORLD");
  const audioRef = useRef(null);
  let out = "";
  if (mode === "encode") out = input.toUpperCase().split("").map((c) => c === " " ? "/" : MORSE[c] ?? "").filter((x) => x !== "").join(" ");
  else out = input.trim().split(/\s+/).map((code) => code === "/" ? " " : RMORSE[code] ?? "").join("");

  async function play() {
    const code = mode === "encode" ? out : input;
    const ctx = audioRef.current || new (window.AudioContext || window.webkitAudioContext)();
    audioRef.current = ctx;
    let t = ctx.currentTime;
    const unit = 0.08;
    const beep = (dur) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = 600; o.connect(g); g.connect(ctx.destination); g.gain.setValueAtTime(0.3, t); o.start(t); o.stop(t + dur); t += dur + unit; };
    for (const ch of code) {
      if (ch === ".") beep(unit);
      else if (ch === "-") beep(unit * 3);
      else if (ch === " ") t += unit * 2;
      else if (ch === "/") t += unit * 4;
    }
  }
  return (
    <div className="tool">
      <div className="tool-controls">
        <div className="pill-group"><button className={mode === "encode" ? "on" : ""} onClick={() => setMode("encode")}>Text → Morse</button><button className={mode === "decode" ? "on" : ""} onClick={() => setMode("decode")}>Morse → Text</button></div>
      </div>
      <div className="tool-io">
        <div><label className="fld">{mode === "encode" ? "Text" : "Morse (space between letters, / for word)"}</label><textarea className="textarea" style={{ fontFamily: mode === "encode" ? "var(--sans)" : "var(--mono)" }} value={input} onChange={(e) => setInput(e.target.value)} /></div>
        <div><label className="fld">Result <CopyButton value={out} /></label><textarea className="textarea mono-out" readOnly value={out} /></div>
      </div>
      <button className="btn btn-sm" onClick={play}>🔊 Play beeps</button>
    </div>
  );
}
