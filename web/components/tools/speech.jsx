"use client";

import { useEffect, useRef, useState } from "react";
import CopyButton from "../CopyButton";

const LANGS = [
  ["en-US", "🇺🇸 English (US)"],
  ["en-GB", "🇬🇧 English (UK)"],
  ["es-ES", "🇪🇸 Español"],
  ["fr-FR", "🇫🇷 Français"],
  ["de-DE", "🇩🇪 Deutsch"],
  ["hi-IN", "🇮🇳 हिन्दी"],
  ["pt-BR", "🇧🇷 Português (BR)"],
  ["ar-SA", "🇸🇦 العربية"],
  ["zh-CN", "🇨🇳 中文"],
];

const RTL = new Set(["ar-SA"]);

export function SpeechToText() {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState("en-US");
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [error, setError] = useState("");

  const recRef = useRef(null);
  const listeningRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(!!SR);
  }, []);

  // keep the live language in sync with a running session
  useEffect(() => {
    if (recRef.current) recRef.current.lang = lang;
  }, [lang]);

  // stop cleanly on unmount
  useEffect(() => {
    return () => {
      listeningRef.current = false;
      if (recRef.current) {
        try { recRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  function buildRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = lang;

    rec.onresult = (e) => {
      let finalChunk = "";
      let interimChunk = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalChunk += res[0].transcript;
        else interimChunk += res[0].transcript;
      }
      if (finalChunk) {
        setTranscript((t) => {
          const sep = !t || /\s$/.test(t) ? "" : " ";
          return t + sep + finalChunk.trim() + " ";
        });
      }
      setInterim(interimChunk);
    };

    rec.onerror = (e) => {
      if (e.error === "no-speech") return;
      if (e.error === "aborted") return;
      setError(
        e.error === "not-allowed" || e.error === "service-not-allowed"
          ? "Microphone access was blocked. Allow it in your browser and try again."
          : "Recognition error: " + e.error
      );
    };

    rec.onend = () => {
      // continuous mode still ends on silence — restart while the user wants to listen
      if (listeningRef.current) {
        try { rec.start(); } catch (e) {}
      } else {
        setInterim("");
      }
    };

    return rec;
  }

  function start() {
    if (typeof window === "undefined" || listeningRef.current) return;
    setError("");
    const rec = buildRecognition();
    if (!rec) { setSupported(false); return; }
    recRef.current = rec;
    listeningRef.current = true;
    setListening(true);
    try { rec.start(); } catch (e) {}
  }

  function stop() {
    listeningRef.current = false;
    setListening(false);
    if (recRef.current) {
      try { recRef.current.stop(); } catch (e) {}
    }
    setInterim("");
  }

  function clearAll() {
    setTranscript("");
    setInterim("");
    setError("");
  }

  function download() {
    if (typeof window === "undefined") return;
    const text = (transcript + interim).trim();
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcript.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const fullText = (transcript + interim).trim();
  const words = fullText ? fullText.split(/\s+/).length : 0;
  const isRtl = RTL.has(lang);

  if (!supported) {
    return (
      <div className="tool">
        <div className="notice notice-warn">
          <strong>Speech recognition isn't available here.</strong> This tool uses the
          browser's built-in Web Speech API, which currently works best in{" "}
          <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong> on desktop
          and Android. Open this page in one of those browsers to dictate with your voice.
        </div>
        <p className="hint">Everything runs on-device — no audio ever leaves your browser.</p>
      </div>
    );
  }

  return (
    <div className="tool">
      <style>{`
        @keyframes stt-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(225, 29, 72, .55); }
          70%  { box-shadow: 0 0 0 12px rgba(225, 29, 72, 0); }
          100% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); }
        }
        .stt-dot--live { animation: stt-pulse 1.35s ease-out infinite; }
      `}</style>

      <div
        className="sheet"
        style={{
          padding: 16,
          marginBottom: 14,
          background: "linear-gradient(135deg, var(--accent-soft), var(--accent-2-soft))",
          border: "1px solid var(--border)",
        }}
      >
        <div className="tool-controls" style={{ margin: 0 }}>
          <label className="chk" style={{ fontWeight: 600 }}>
            🌐 Language
            <select
              className="select"
              style={{ width: 190 }}
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              {LANGS.map(([code, label]) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
          </label>

          {!listening ? (
            <button className="btn" onClick={start} style={{ background: "var(--red)", borderColor: "var(--red)" }}>
              ● Start recording
            </button>
          ) : (
            <button className="btn btn-outline" onClick={stop}>
              ■ Stop
            </button>
          )}

          <span
            className="chk"
            style={{
              fontWeight: 700,
              color: listening ? "var(--red)" : "var(--muted)",
              gap: 8,
            }}
          >
            <span
              className={listening ? "stt-dot--live" : ""}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: listening ? "var(--red)" : "var(--border-strong)",
                display: "inline-block",
              }}
            />
            {listening ? "Listening…" : "Idle"}
          </span>
        </div>
      </div>

      {error ? <div className="notice notice-error">{error}</div> : null}

      <label className="fld">
        Transcript — editable{" "}
        <span className="muted" style={{ fontWeight: 500 }}>
          ({words} word{words === 1 ? "" : "s"})
        </span>
      </label>
      <textarea
        className="textarea"
        dir={isRtl ? "rtl" : "ltr"}
        style={{ fontFamily: "var(--sans)", minHeight: 180 }}
        placeholder="Press Start recording and begin speaking — your words appear here. You can also type or edit freely."
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
      />

      {interim ? (
        <div
          className="sheet"
          dir={isRtl ? "rtl" : "ltr"}
          style={{
            padding: "10px 14px",
            marginTop: 8,
            color: "var(--muted)",
            fontStyle: "italic",
            borderStyle: "dashed",
          }}
        >
          {interim}
        </div>
      ) : null}

      <div className="tool-controls" style={{ marginTop: 14 }}>
        <CopyButton value={fullText} label="📋 Copy text" />
        <button className="btn btn-outline btn-sm" onClick={download} disabled={!fullText}>
          ⬇ Download .txt
        </button>
        <button className="btn btn-outline btn-sm" onClick={clearAll} disabled={!fullText && !error}>
          ✕ Clear
        </button>
      </div>

      <p className="hint">
        Tip: speak naturally — say "comma", "period" or "new line" in supported
        languages for punctuation. Recognition runs in your browser (Chrome/Edge work best)
        and no audio is uploaded or stored.
      </p>
    </div>
  );
}
