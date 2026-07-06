"use client";

import { useState, useRef, useEffect } from "react";

/* ---------------- Image Resizer ---------------- */
export function ImageResizer() {
  const [src, setSrc] = useState("");
  const [nat, setNat] = useState({ w: 0, h: 0 });
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const [lock, setLock] = useState(true);
  const [out, setOut] = useState("");
  const imgRef = useRef(null);

  function onFile(e) {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { setSrc(String(r.result)); setOut(""); };
    r.readAsDataURL(f);
  }
  function onLoad() {
    const im = imgRef.current;
    setNat({ w: im.naturalWidth, h: im.naturalHeight });
    setW(im.naturalWidth); setH(im.naturalHeight);
  }
  function setWidth(v) { v = +v || 0; setW(v); if (lock && nat.w) setH(Math.round(v * (nat.h / nat.w))); }
  function setHeight(v) { v = +v || 0; setH(v); if (lock && nat.h) setW(Math.round(v * (nat.w / nat.h))); }
  function resize() {
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    c.getContext("2d").drawImage(imgRef.current, 0, 0, w, h);
    setOut(c.toDataURL("image/png"));
  }
  return (
    <div className="tool">
      <input type="file" accept="image/*" className="input" onChange={onFile} />
      {src ? (
        <>
          <img ref={imgRef} src={src} onLoad={onLoad} alt="" style={{ display: "none" }} />
          <p className="hint">Original: {nat.w} × {nat.h}px</p>
          <div className="tool-controls">
            <label className="chk">Width <input className="input" style={{ width: 100 }} type="number" value={w} onChange={(e) => setWidth(e.target.value)} /></label>
            <label className="chk">Height <input className="input" style={{ width: 100 }} type="number" value={h} onChange={(e) => setHeight(e.target.value)} /></label>
            <label className="chk"><input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} /> Lock ratio</label>
            <button className="btn btn-sm" onClick={resize}>Resize</button>
          </div>
          {out ? <div className="center"><img src={out} alt="resized" style={{ maxWidth: "100%", maxHeight: 300, border: "1px solid var(--border)", borderRadius: 8 }} /><div style={{ marginTop: 8 }}><a className="btn btn-sm" href={out} download="resized.png">Download</a></div></div> : null}
        </>
      ) : <p className="hint">Choose an image. Resizing happens in your browser.</p>}
    </div>
  );
}

/* ---------------- Image Cropper ---------------- */
export function ImageCropper() {
  const [src, setSrc] = useState("");
  const [out, setOut] = useState("");
  const [box, setBox] = useState({ x: 30, y: 30, w: 160, h: 120 });
  const wrapRef = useRef(null);
  const imgRef = useRef(null);
  const drag = useRef(null);

  function onFile(e) {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => { setSrc(String(r.result)); setOut(""); }; r.readAsDataURL(f);
  }
  function onLoad() {
    const im = imgRef.current;
    setBox({ x: im.clientWidth * 0.2, y: im.clientHeight * 0.2, w: im.clientWidth * 0.5, h: im.clientHeight * 0.4 });
  }
  useEffect(() => {
    function move(e) {
      if (!drag.current) return;
      const im = imgRef.current; if (!im) return;
      const rect = im.getBoundingClientRect();
      const px = e.clientX - rect.left, py = e.clientY - rect.top;
      setBox((b) => {
        if (drag.current.type === "move") {
          let x = Math.max(0, Math.min(im.clientWidth - b.w, drag.current.bx + (px - drag.current.px)));
          let y = Math.max(0, Math.min(im.clientHeight - b.h, drag.current.by + (py - drag.current.py)));
          return { ...b, x, y };
        } else {
          let w = Math.max(30, Math.min(im.clientWidth - b.x, px - b.x));
          let h = Math.max(30, Math.min(im.clientHeight - b.y, py - b.y));
          return { ...b, w, h };
        }
      });
    }
    function up() { drag.current = null; }
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, []);
  function startMove(e) { const im = imgRef.current, rect = im.getBoundingClientRect(); drag.current = { type: "move", px: e.clientX - rect.left, py: e.clientY - rect.top, bx: box.x, by: box.y }; e.preventDefault(); }
  function startResize(e) { drag.current = { type: "resize" }; e.stopPropagation(); e.preventDefault(); }
  function crop() {
    const im = imgRef.current;
    const sx = im.naturalWidth / im.clientWidth, sy = im.naturalHeight / im.clientHeight;
    const c = document.createElement("canvas"); c.width = box.w * sx; c.height = box.h * sy;
    c.getContext("2d").drawImage(im, box.x * sx, box.y * sy, box.w * sx, box.h * sy, 0, 0, c.width, c.height);
    setOut(c.toDataURL("image/png"));
  }
  return (
    <div className="tool">
      <input type="file" accept="image/*" className="input" onChange={onFile} />
      {src ? (
        <>
          <div ref={wrapRef} style={{ position: "relative", display: "inline-block", marginTop: 12, userSelect: "none", maxWidth: "100%" }}>
            <img ref={imgRef} src={src} onLoad={onLoad} alt="" style={{ maxWidth: "100%", display: "block", borderRadius: 6 }} draggable={false} />
            <div onMouseDown={startMove} style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, border: "2px solid var(--accent)", boxShadow: "0 0 0 9999px rgba(0,0,0,.4)", cursor: "move" }}>
              <div onMouseDown={startResize} style={{ position: "absolute", right: -8, bottom: -8, width: 16, height: 16, background: "var(--accent)", borderRadius: "50%", cursor: "nwse-resize" }} />
            </div>
          </div>
          <div className="tool-controls" style={{ marginTop: 12 }}><button className="btn btn-sm" onClick={crop}>Crop</button></div>
          {out ? <div className="center"><img src={out} alt="cropped" style={{ maxWidth: "100%", maxHeight: 300, border: "1px solid var(--border)", borderRadius: 8 }} /><div style={{ marginTop: 8 }}><a className="btn btn-sm" href={out} download="cropped.png">Download</a></div></div> : null}
        </>
      ) : <p className="hint">Choose an image, drag the box to crop.</p>}
    </div>
  );
}
