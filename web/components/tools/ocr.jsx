"use client";

import { useState, useRef, useEffect } from "react";
import CopyButton from "../CopyButton";

/* ---------------- Image to Text (OCR) ---------------- */
const LANGS = [
  { code: "eng", label: "English" },
  { code: "spa", label: "Spanish" },
  { code: "fra", label: "French" },
  { code: "deu", label: "German" },
  { code: "hin", label: "Hindi" },
  { code: "chi_sim", label: "Chinese (Simplified)" },
  { code: "ara", label: "Arabic" },
];

export function ImageToText() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [lang, setLang] = useState("eng");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [prog, setProg] = useState({ status: "", pct: 0 });
  const [err, setErr] = useState("");
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);
  const urlRef = useRef("");

  // Revoke the last object URL when it changes or the component unmounts.
  useEffect(() => () => { if (urlRef.current) URL.revokeObjectURL(urlRef.current); }, []);

  function accept(f) {
    if (!f) return;
    if (!f.type.startsWith("image/")) { setErr("Please choose an image file (PNG, JPG, WebP…)."); return; }
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const u = URL.createObjectURL(f);
    urlRef.current = u;
    setFile(f);
    setPreview(u);
    setText("");
    setErr("");
    setProg({ status: "", pct: 0 });
  }

  function onDrop(e) {
    e.preventDefault();
    setDrag(false);
    accept(e.dataTransfer.files?.[0]);
  }

  async function extract() {
    if (!file) { setErr("Choose an image first."); return; }
    setBusy(true);
    setErr("");
    setText("");
    setProg({ status: "starting", pct: 0 });
    try {
      const Tesseract = await import("tesseract.js");
      const { data } = await Tesseract.recognize(file, lang, {
        logger: (m) =>
          setProg({
            status: m.status || "",
            pct: Math.round((m.progress || 0) * 100),
          }),
      });
      setText((data?.text || "").trim());
      setProg({ status: "done", pct: 100 });
    } catch (e) {
      setErr(e?.message || "Could not read text from this image.");
      setProg({ status: "", pct: 0 });
    } finally {
      setBusy(false);
    }
  }

  function downloadTxt() {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "extracted-text.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="tool">
      <div style={{ height: 5, borderRadius: 999, marginBottom: 16, background: "linear-gradient(135deg,var(--accent),var(--accent-2))" }} />

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        style={{
          cursor: "pointer",
          textAlign: "center",
          padding: preview ? 14 : "34px 18px",
          borderRadius: "var(--radius)",
          border: `2px dashed ${drag ? "var(--accent)" : "var(--border)"}`,
          background: drag
            ? "linear-gradient(135deg, color-mix(in srgb, var(--accent) 12%, transparent), color-mix(in srgb, var(--accent-2) 12%, transparent))"
            : "var(--surface-2)",
          transition: ".18s",
        }}
      >
        {preview ? (
          <img src={preview} alt="preview" style={{ maxWidth: "100%", maxHeight: 260, borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-sm)" }} />
        ) : (
          <>
            <div style={{ fontSize: 34, lineHeight: 1 }}>🖼️</div>
            <p style={{ margin: "10px 0 2px", fontWeight: 700, color: "var(--text)" }}>Tap to choose, or drag an image here</p>
            <p className="hint" style={{ margin: 0 }}>PNG, JPG, WebP — read 100% in your browser</p>
          </>
        )}
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => accept(e.target.files?.[0])} />
      </div>

      {/* Controls */}
      <div className="tool-controls" style={{ marginTop: 14, alignItems: "center" }}>
        <label className="chk">
          Language
          <select className="select" value={lang} onChange={(e) => setLang(e.target.value)} style={{ minWidth: 150 }}>
            {LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </label>
        <button
          className="btn"
          onClick={extract}
          disabled={busy || !file}
          style={{ background: "linear-gradient(135deg,var(--accent),var(--accent-2))", border: "none" }}
        >
          {busy ? "Reading…" : "Extract Text"}
        </button>
        {preview ? <button className="btn btn-sm btn-outline" onClick={() => inputRef.current?.click()}>Change image</button> : null}
      </div>

      {/* Progress */}
      {busy || prog.pct > 0 ? (
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 600, color: "var(--text-soft)", marginBottom: 6, textTransform: "capitalize" }}>
            <span>{prog.status || "working"}</span>
            <span>{prog.pct}%</span>
          </div>
          <div style={{ height: 10, borderRadius: 999, background: "var(--surface-2)", border: "1px solid var(--border)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${prog.pct}%`, borderRadius: 999, background: "linear-gradient(135deg,var(--accent),var(--accent-2))", transition: "width .25s" }} />
          </div>
        </div>
      ) : null}

      {err ? <p className="result-err hint" style={{ marginTop: 12 }}>✗ {err}</p> : null}

      {/* Result */}
      {text ? (
        <div style={{ marginTop: 16 }}>
          <label className="fld">
            Recognized text
            <span style={{ display: "inline-flex", gap: 8 }}>
              <CopyButton value={text} />
              <button className="btn btn-sm btn-outline" onClick={downloadTxt}>Download .txt</button>
            </span>
          </label>
          <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Recognized text appears here…" />
        </div>
      ) : null}

      <p className="hint" style={{ marginTop: 14 }}>
        The first run for each language downloads a small language model (a few MB) once, then it is cached for next time.
      </p>
    </div>
  );
}
