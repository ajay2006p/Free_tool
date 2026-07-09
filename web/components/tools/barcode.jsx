"use client";

import { useState, useRef, useEffect } from "react";
import CopyButton from "../CopyButton";

/* ---------------- Barcode Generator ---------------- */
const FORMATS = [
  { v: "CODE128", label: "CODE128 (general)" },
  { v: "EAN13", label: "EAN-13 (retail)" },
  { v: "EAN8", label: "EAN-8 (retail, small)" },
  { v: "UPC", label: "UPC-A (retail US)" },
  { v: "CODE39", label: "CODE39 (industrial)" },
  { v: "ITF14", label: "ITF-14 (logistics)" },
  { v: "MSI", label: "MSI (inventory)" },
  { v: "pharmacode", label: "Pharmacode (pharma)" },
  { v: "codabar", label: "Codabar (libraries)" },
];

// Friendlier messages than jsbarcode's raw throw for the common formats.
const FORMAT_HINTS = {
  EAN13: "EAN-13 needs 12–13 digits (0–9 only).",
  EAN8: "EAN-8 needs 7–8 digits (0–9 only).",
  UPC: "UPC-A needs 11–12 digits (0–9 only).",
  ITF14: "ITF-14 needs 13–14 digits (0–9 only).",
  CODE39: "CODE39 allows A–Z, 0–9, and - . $ / + % space.",
  MSI: "MSI allows digits (0–9) only.",
  pharmacode: "Pharmacode needs a number from 3 to 131070.",
  codabar: "Codabar allows digits and - $ : / . + (often wrapped in A/B/C/D).",
};

export function BarcodeGenerator() {
  const [value, setValue] = useState("012345678905");
  const [format, setFormat] = useState("CODE128");
  const [lineColor, setLineColor] = useState("#111827");
  const [background, setBackground] = useState("#ffffff");
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);
  const [err, setErr] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function render() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (!value) {
        setErr("Enter a value to encode.");
        canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      try {
        const JsBarcode = (await import("jsbarcode")).default;
        if (cancelled) return;
        let ok = true;
        JsBarcode(canvas, value, {
          format,
          lineColor,
          background,
          width: Number(width) || 1,
          height: Number(height) || 100,
          displayValue,
          margin: 12,
          valid: (v) => { ok = v; }, // jsbarcode reports invalid input here
        });
        if (!ok) throw new Error(FORMAT_HINTS[format] || `"${value}" is not valid for ${format}.`);
        setErr("");
      } catch (e) {
        setErr(e?.message || FORMAT_HINTS[format] || `"${value}" is not valid for ${format}.`);
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    render();
    return () => { cancelled = true; };
  }, [value, format, lineColor, background, width, height, displayValue]);

  function downloadPng() {
    const canvas = canvasRef.current;
    if (!canvas || err) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `barcode-${format}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  async function downloadSvg() {
    if (err) return;
    try {
      const JsBarcode = (await import("jsbarcode")).default;
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      let ok = true;
      JsBarcode(svg, value, {
        format,
        lineColor,
        background,
        width: Number(width) || 1,
        height: Number(height) || 100,
        displayValue,
        margin: 12,
        valid: (v) => { ok = v; },
      });
      if (!ok) throw new Error("Invalid input for this format.");
      const markup = '<?xml version="1.0" encoding="UTF-8"?>\n' + svg.outerHTML;
      const blob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `barcode-${format}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setErr(e?.message || "Could not export SVG.");
    }
  }

  return (
    <div className="tool">
      <div style={{ height: 5, borderRadius: 999, marginBottom: 16, background: "linear-gradient(135deg,var(--accent),var(--accent-2))" }} />

      {/* Inputs */}
      <div className="grid grid-2" style={{ gap: 12 }}>
        <label className="fld">
          Value
          <input className="input" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Text or digits to encode" />
        </label>
        <label className="fld">
          Format
          <select className="select" value={format} onChange={(e) => setFormat(e.target.value)}>
            {FORMATS.map((f) => <option key={f.v} value={f.v}>{f.label}</option>)}
          </select>
        </label>
      </div>

      {/* Options */}
      <div className="tool-controls" style={{ marginTop: 12, alignItems: "center" }}>
        <label className="chk">Bars <input type="color" value={lineColor} onChange={(e) => setLineColor(e.target.value)} /></label>
        <label className="chk">Background <input type="color" value={background} onChange={(e) => setBackground(e.target.value)} /></label>
        <label className="chk">Bar width
          <input type="range" min={1} max={5} step={1} value={width} onChange={(e) => setWidth(Number(e.target.value))} style={{ width: 90 }} />
          <b style={{ minWidth: 14 }}>{width}</b>
        </label>
        <label className="chk">Height
          <input type="range" min={40} max={200} step={5} value={height} onChange={(e) => setHeight(Number(e.target.value))} style={{ width: 90 }} />
          <b style={{ minWidth: 30 }}>{height}px</b>
        </label>
        <label className="chk"><input type="checkbox" checked={displayValue} onChange={(e) => setDisplayValue(e.target.checked)} /> Show value</label>
      </div>

      {/* Preview */}
      <div
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 140,
          padding: 16,
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
          background: "var(--surface-2)",
          overflowX: "auto",
        }}
      >
        <canvas ref={canvasRef} style={{ maxWidth: "100%", display: err ? "none" : "block", borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-sm)" }} />
        {err ? <p className="result-err hint" style={{ margin: 0, textAlign: "center" }}>✗ {err}</p> : null}
      </div>

      {/* Actions */}
      <div className="tool-controls" style={{ marginTop: 14 }}>
        <button className="btn" onClick={downloadPng} disabled={!!err} style={{ background: "linear-gradient(135deg,var(--accent),var(--accent-2))", border: "none" }}>Download PNG</button>
        <button className="btn btn-outline" onClick={downloadSvg} disabled={!!err}>Download SVG</button>
        <CopyButton value={value} label="Copy value" />
      </div>

      <p className="hint" style={{ marginTop: 14 }}>
        Pick a format for the job: <b>retail products</b> use EAN-13 / EAN-8 / UPC-A, <b>logistics &amp; shipping cartons</b> use ITF-14, and for <b>anything general</b> (URLs, SKUs, text) CODE128 packs the most into the least space.
      </p>
    </div>
  );
}
