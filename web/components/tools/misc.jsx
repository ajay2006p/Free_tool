"use client";

import { useState, useEffect, useRef } from "react";
import CopyButton from "../CopyButton";

/* ---------------- Text to Speech ----------------
   Two tiers:
   • Free — the browser's Web Speech API. No cost, private, works offline.
     Adds a voice picker grouped by language, rate/pitch/volume, real
     play / pause / resume / stop, and live word highlighting.
   • HD  — optional neural voices via /api/tts. Returns a real MP3 that can
     be played and downloaded. Stays hidden until the backend key is set
     (the route replies "hd_disabled"), so the tool never ships a dead
     button. Web Speech audio can't be captured to a file, which is why
     download lives on the HD tier only. */
const HD_MAX = 600;

export function TextToSpeech() {
  const [text, setText] = useState("Hello! Type anything here and press Speak to hear it read aloud in a natural voice.");
  const [voices, setVoices] = useState([]);
  const [voice, setVoice] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [mark, setMark] = useState(null); // { start, end } of the word being spoken

  // HD tier state
  const [hdLoading, setHdLoading] = useState(false);
  const [hdError, setHdError] = useState("");
  const [hdUrl, setHdUrl] = useState("");
  const [hdDisabled, setHdDisabled] = useState(false);

  const hdUrlRef = useRef("");
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!supported) return;
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
      if (v.length && !voice) {
        const def = v.find((x) => x.default) || v.find((x) => x.lang?.startsWith("en")) || v[0];
        setVoice(def.name);
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { try { window.speechSynthesis.cancel(); } catch (e) {} };
  }, []); // eslint-disable-line

  // revoke the HD object URL when it changes or on unmount
  useEffect(() => {
    hdUrlRef.current = hdUrl;
    return () => { if (hdUrlRef.current) URL.revokeObjectURL(hdUrlRef.current); };
  }, [hdUrl]);

  function speak() {
    if (!supported || !text.trim()) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = voices.find((x) => x.name === voice);
    if (v) { u.voice = v; u.lang = v.lang; }
    u.rate = rate; u.pitch = pitch; u.volume = volume;
    u.onboundary = (e) => {
      if (e.name === "word" || e.charLength) {
        const start = e.charIndex;
        const len = e.charLength || (text.slice(start).match(/^\S+/) || [""])[0].length;
        setMark({ start, end: start + len });
      }
    };
    u.onend = () => { setSpeaking(false); setPaused(false); setMark(null); };
    u.onerror = () => { setSpeaking(false); setPaused(false); setMark(null); };
    setSpeaking(true); setPaused(false);
    window.speechSynthesis.speak(u);
  }
  function pauseResume() {
    if (!supported) return;
    if (paused) { window.speechSynthesis.resume(); setPaused(false); }
    else { window.speechSynthesis.pause(); setPaused(true); }
  }
  function stop() {
    if (supported) window.speechSynthesis.cancel();
    setSpeaking(false); setPaused(false); setMark(null);
  }

  async function speakHd() {
    if (!text.trim()) return;
    setHdError(""); setHdLoading(true);
    if (hdUrl) { URL.revokeObjectURL(hdUrl); setHdUrl(""); }
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      if (res.status === 503) { setHdDisabled(true); setHdLoading(false); return; }
      if (!res.ok) {
        let msg = "HD voice failed. Try the free voice.";
        try { msg = (await res.json())?.error || msg; } catch (e) {}
        setHdError(msg); setHdLoading(false); return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setHdUrl(url);
      const audio = new Audio(url);
      audio.play().catch(() => {});
    } catch (e) {
      setHdError("Could not reach the HD voice service.");
    }
    setHdLoading(false);
  }

  if (!supported) {
    return (
      <div className="notice notice-warn">
        <strong>Your browser doesn't support speech synthesis.</strong> The free voice uses the
        Web Speech API, which works best in Google Chrome, Microsoft Edge and Safari.
      </div>
    );
  }

  // group voices by language for a usable picker
  const grouped = {};
  for (const v of voices) {
    const key = v.lang || "other";
    (grouped[key] = grouped[key] || []).push(v);
  }
  const langKeys = Object.keys(grouped).sort();

  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const before = mark ? text.slice(0, mark.start) : text;
  const active = mark ? text.slice(mark.start, mark.end) : "";
  const after = mark ? text.slice(mark.end) : "";

  return (
    <div className="tool">
      <label className="fld">
        Text to read{" "}
        <span className="muted" style={{ fontWeight: 500 }}>({words} words · {chars} chars)</span>
      </label>
      <textarea
        className="textarea"
        style={{ minHeight: 130, fontFamily: "var(--sans)" }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste text to hear it spoken aloud…"
      />

      {speaking && mark ? (
        <div className="sheet" style={{ padding: "10px 14px", marginTop: 8, fontFamily: "var(--sans)", lineHeight: 1.6 }}>
          {before}
          <mark style={{ background: "var(--accent-soft)", color: "var(--accent)", borderRadius: 4, padding: "0 2px" }}>{active}</mark>
          {after}
        </div>
      ) : null}

      <div className="tool-controls" style={{ marginTop: 10 }}>
        <label className="chk">Voice
          <select className="select" style={{ width: 210 }} value={voice} onChange={(e) => setVoice(e.target.value)}>
            {langKeys.map((k) => (
              <optgroup key={k} label={k}>
                {grouped[k].map((v) => <option key={v.name} value={v.name}>{v.name}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
        <label className="chk">Speed {rate.toFixed(1)}× <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} /></label>
        <label className="chk">Pitch {pitch.toFixed(1)} <input type="range" min={0} max={2} step={0.1} value={pitch} onChange={(e) => setPitch(+e.target.value)} /></label>
        <label className="chk">Volume {Math.round(volume * 100)}% <input type="range" min={0} max={1} step={0.05} value={volume} onChange={(e) => setVolume(+e.target.value)} /></label>
      </div>

      <div className="tool-controls" style={{ marginTop: 4 }}>
        <button className="btn" onClick={speak}>▶ Speak</button>
        {speaking ? <button className="btn btn-outline" onClick={pauseResume}>{paused ? "▶ Resume" : "⏸ Pause"}</button> : null}
        {speaking ? <button className="btn btn-outline" onClick={stop}>■ Stop</button> : null}
      </div>

      {/* HD tier — only surfaced once the backend key is configured */}
      {!hdDisabled ? (
        <div className="sheet" style={{ padding: 14, marginTop: 14, borderStyle: "dashed" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <strong>✨ HD voice</strong>
            <span className="muted" style={{ fontSize: 13 }}>
              Natural neural voice — plays and downloads as MP3. Up to {HD_MAX} characters.
            </span>
          </div>
          <div className="tool-controls" style={{ marginTop: 10 }}>
            <button className="btn btn-sm" onClick={speakHd} disabled={hdLoading || chars > HD_MAX}>
              {hdLoading ? "Generating…" : "✨ Generate HD audio"}
            </button>
            {hdUrl ? <a className="btn btn-outline btn-sm" href={hdUrl} download="speech.mp3">⬇ Download MP3</a> : null}
            {chars > HD_MAX ? <span className="muted" style={{ fontSize: 13 }}>Text is over {HD_MAX} chars for HD.</span> : null}
          </div>
          {hdUrl ? <audio controls src={hdUrl} style={{ width: "100%", marginTop: 10 }} /> : null}
          {hdError ? <div className="notice notice-error" style={{ marginTop: 10 }}>{hdError}</div> : null}
        </div>
      ) : null}

      <p className="hint">
        The free voice runs entirely in your browser using the Web Speech API — nothing is
        uploaded, and it works offline. Available voices depend on your device and browser;
        Chrome and Edge on desktop usually offer the widest choice.
      </p>
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
