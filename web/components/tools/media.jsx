"use client";

import { useState, useRef } from "react";
import CopyButton from "../CopyButton";

/* ---------------- Screen Recorder ---------------- */
export function ScreenRecorder() {
  const [recording, setRecording] = useState(false);
  const [url, setUrl] = useState("");
  const [mic, setMic] = useState(false);
  const [err, setErr] = useState("");
  const rec = useRef(null);
  const chunks = useRef([]);
  const streams = useRef([]);
  const supported = typeof navigator !== "undefined" && navigator.mediaDevices?.getDisplayMedia;

  async function start() {
    setErr(""); setUrl("");
    try {
      const display = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: true });
      streams.current = [display];
      let tracks = [...display.getTracks()];
      if (mic) {
        try { const m = await navigator.mediaDevices.getUserMedia({ audio: true }); streams.current.push(m); tracks = tracks.concat(m.getAudioTracks()); } catch (e) {}
      }
      const stream = new MediaStream(tracks);
      const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
      const r = new MediaRecorder(stream, { mimeType: mime });
      chunks.current = [];
      r.ondataavailable = (e) => { if (e.data.size) chunks.current.push(e.data); };
      r.onstop = () => { const blob = new Blob(chunks.current, { type: "video/webm" }); setUrl(URL.createObjectURL(blob)); streams.current.forEach((s) => s.getTracks().forEach((t) => t.stop())); };
      display.getVideoTracks()[0].onended = () => stop();
      rec.current = r; r.start(); setRecording(true);
    } catch (e) { setErr("Screen capture was blocked or cancelled."); }
  }
  function stop() { if (rec.current && rec.current.state !== "inactive") rec.current.stop(); setRecording(false); }

  if (!supported) return <div className="notice notice-warn">Your browser doesn't support screen recording. Try Chrome or Edge on desktop.</div>;
  return (
    <div className="tool center">
      {!recording ? (
        <>
          <label className="chk" style={{ justifyContent: "center", marginBottom: 12 }}><input type="checkbox" checked={mic} onChange={(e) => setMic(e.target.checked)} /> Also record my microphone</label>
          <button className="btn" onClick={start}>🔴 Start recording</button>
          <p className="hint">Records your screen (and system/mic audio) right in the browser — nothing is uploaded.</p>
        </>
      ) : (
        <><div style={{ fontSize: 40 }}>🔴</div><p style={{ fontWeight: 700 }}>Recording…</p><button className="btn btn-accent" onClick={stop}>■ Stop</button></>
      )}
      {err ? <div className="notice notice-warn" style={{ marginTop: 12 }}>{err}</div> : null}
      {url ? (
        <div style={{ marginTop: 16 }}>
          <video src={url} controls style={{ width: "100%", maxWidth: 560, borderRadius: 8, border: "1px solid var(--border)" }} />
          <div style={{ marginTop: 8 }}><a className="btn btn-sm" href={url} download="recording.webm">Download recording</a></div>
        </div>
      ) : null}
    </div>
  );
}

/* ---------------- Keyword Density Checker ---------------- */
const STOP = new Set("the a an and or but of to in for on at is are was were be been by with as it its this that these those from your you we our i he she they them his her their".split(" "));
export function KeywordDensity() {
  const [text, setText] = useState("");
  const [ignoreStop, setIgnoreStop] = useState(true);
  const words = (text.toLowerCase().match(/[a-z0-9']+/g) || []).filter((w) => w.length > 1 && (!ignoreStop || !STOP.has(w)));
  const total = words.length;
  const counts = {};
  words.forEach((w) => { counts[w] = (counts[w] || 0) + 1; });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 20);
  return (
    <div className="tool">
      <label className="fld">Paste your content</label>
      <textarea className="textarea" style={{ minHeight: 160, fontFamily: "var(--sans)" }} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste an article or page copy…" />
      <div className="tool-controls">
        <label className="chk"><input type="checkbox" checked={ignoreStop} onChange={(e) => setIgnoreStop(e.target.checked)} /> Ignore common words</label>
        <span className="hint" style={{ margin: 0 }}>{total} keywords counted</span>
      </div>
      {top.length ? (
        <div className="sheet" style={{ padding: 14 }}>
          {top.map(([w, c]) => (
            <div key={w} style={{ marginBottom: 8 }}>
              <div className="flex-between" style={{ fontSize: 14 }}><strong>{w}</strong><span className="muted">{c} · {((c / total) * 100).toFixed(1)}%</span></div>
              <div style={{ height: 6, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden" }}><div style={{ width: `${(c / top[0][1]) * 100}%`, height: "100%", background: "var(--accent)" }} /></div>
            </div>
          ))}
        </div>
      ) : <p className="hint">Top keywords and their density will appear here.</p>}
    </div>
  );
}
