"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";

/* ---------------- Box Shadow Generator ---------------- */
export function BoxShadowGenerator() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(10);
  const [blur, setBlur] = useState(25);
  const [spread, setSpread] = useState(-5);
  const [color, setColor] = useState("#334155");
  const [alpha, setAlpha] = useState(30);
  const rgba = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${alpha / 100})`;
  const css = `box-shadow: ${x}px ${y}px ${blur}px ${spread}px ${rgba};`;
  const Ctrl = ({ label, val, set, min, max }) => (
    <label className="chk" style={{ width: "100%" }}>{label}: {val}px <input type="range" min={min} max={max} value={val} onChange={(e) => set(Number(e.target.value))} style={{ flex: 1 }} /></label>
  );
  return (
    <div className="tool">
      <div className="tool-io">
        <div>
          <Ctrl label="X offset" val={x} set={setX} min={-50} max={50} />
          <Ctrl label="Y offset" val={y} set={setY} min={-50} max={50} />
          <Ctrl label="Blur" val={blur} set={setBlur} min={0} max={100} />
          <Ctrl label="Spread" val={spread} set={setSpread} min={-50} max={50} />
          <div className="tool-controls">
            <label className="chk">Color <input type="color" value={color} onChange={(e) => setColor(e.target.value)} /></label>
            <label className="chk">Opacity {alpha}% <input type="range" min={0} max={100} value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} /></label>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--paper-2)", borderRadius: 8, minHeight: 200 }}>
          <div style={{ width: 130, height: 90, background: "var(--surface)", borderRadius: 8, boxShadow: `${x}px ${y}px ${blur}px ${spread}px ${rgba}` }} />
        </div>
      </div>
      <label className="fld" style={{ marginTop: 12 }}>CSS <CopyButton value={css} /></label>
      <div className="sheet mono-out" style={{ padding: 12 }}>{css}</div>
    </div>
  );
}

/* ---------------- Border Radius Generator ---------------- */
export function BorderRadiusGenerator() {
  const [tl, setTl] = useState(20);
  const [tr, setTr] = useState(20);
  const [br, setBr] = useState(20);
  const [bl, setBl] = useState(20);
  const radius = `${tl}px ${tr}px ${br}px ${bl}px`;
  const css = `border-radius: ${radius};`;
  const C = ({ label, val, set }) => (<label className="chk" style={{ width: "100%" }}>{label}: {val}px <input type="range" min={0} max={100} value={val} onChange={(e) => set(Number(e.target.value))} style={{ flex: 1 }} /></label>);
  return (
    <div className="tool">
      <div className="tool-io">
        <div>
          <C label="Top-left" val={tl} set={setTl} />
          <C label="Top-right" val={tr} set={setTr} />
          <C label="Bottom-right" val={br} set={setBr} />
          <C label="Bottom-left" val={bl} set={setBl} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--paper-2)", borderRadius: 8, minHeight: 200 }}>
          <div style={{ width: 140, height: 110, background: "linear-gradient(135deg, var(--accent), var(--accent-2))", borderRadius: radius }} />
        </div>
      </div>
      <label className="fld" style={{ marginTop: 12 }}>CSS <CopyButton value={css} /></label>
      <div className="sheet mono-out" style={{ padding: 12 }}>{css}</div>
    </div>
  );
}

/* ---------------- Image to Base64 ---------------- */
export function ImageToBase64() {
  const [data, setData] = useState("");
  const [name, setName] = useState("");
  function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setName(file.name);
    const reader = new FileReader();
    reader.onload = () => setData(String(reader.result));
    reader.readAsDataURL(file);
  }
  return (
    <div className="tool">
      <input type="file" accept="image/*" className="input" onChange={onFile} />
      {data ? (
        <>
          <div className="tool-io" style={{ marginTop: 12 }}>
            <div><label className="fld">Preview ({name})</label><img src={data} alt="preview" style={{ maxHeight: 180, borderRadius: 6, border: "1px solid var(--line)" }} /></div>
            <div><label className="fld">Data URI <CopyButton value={data} /></label><textarea className="textarea" readOnly value={data} /></div>
          </div>
          <p className="hint">Paste the data URI straight into <code>src="…"</code> or CSS <code>url(…)</code>. Best for small icons.</p>
        </>
      ) : <p className="hint">Choose an image to get a Base64 data URI. Runs entirely in your browser.</p>}
    </div>
  );
}
