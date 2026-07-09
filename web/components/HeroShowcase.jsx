"use client";

import { useEffect, useState } from "react";

/* A lightweight "product demo" that cycles through tools like a screen
   recording — no video file to host, instant load, zero bandwidth cost. */

const SCENES = [
  { key: "apps", tab: "All Tools", dot: "#0ea5e9", icon: "🧰" },
  { key: "json", tab: "JSON Formatter", dot: "#4f46e5", icon: "🧩" },
  { key: "pass", tab: "Password Generator", dot: "#059669", icon: "🔑" },
  { key: "words", tab: "Word Counter", dot: "#b45309", icon: "📝" },
  { key: "qr", tab: "QR Code Generator", dot: "#e11d48", icon: "▦" },
];

// icons that stand in for every category — lightweight "images", no files to load
const APPS = [
  ["🧩", "JSON"], ["🔑", "Password"], ["📝", "Words"], ["▦", "QR Code"],
  ["🎨", "Color"], ["📐", "Calc"], ["🔗", "URL"], ["📄", "Resume"],
  ["🔤", "Base64"], ["📊", "SEO"], ["#️⃣", "Hashtag"], ["🖼️", "Image"],
  ["⏱️", "Typing"], ["💱", "Convert"], ["▶️", "YouTube"], ["🎲", "More"],
];

export default function HeroShowcase() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % SCENES.length), 3200);
    return () => clearInterval(id);
  }, []);

  const scene = SCENES[active];

  return (
    <div className="hs-wrap" aria-hidden="true">
      <div className="hs-glow" />
      <div className="hs-window">
        <div className="hs-bar">
          <span className="hs-dot" style={{ background: "#ff5f57" }} />
          <span className="hs-dot" style={{ background: "#febc2e" }} />
          <span className="hs-dot" style={{ background: "#28c840" }} />
          <span className="hs-url">https://www.freetoolss.online<span className="hs-cursor" /></span>
        </div>

        <div className="hs-tabs">
          {SCENES.map((s, i) => (
            <span key={s.key} className={"hs-tab" + (i === active ? " on" : "")}>
              <span className="hs-tabico">{s.icon}</span>
              {s.tab}
            </span>
          ))}
        </div>

        <div className="hs-screen">
          {SCENES.map((s, i) => (
            <div key={s.key} className={"hs-scene" + (i === active ? " show" : "")}>
              <Scene which={s.key} live={i === active} />
            </div>
          ))}
        </div>
      </div>

      <span className="hs-float f1">🧩 Formatters</span>
      <span className="hs-float f2">🔑 Generators</span>
      <span className="hs-float f3">📊 Calculators</span>
    </div>
  );
}

function Scene({ which, live }) {
  if (which === "apps") {
    return (
      <div className={"hs-apps" + (live ? " go" : "")}>
        {APPS.map(([ico, name], i) => (
          <div className="hs-app" key={name} style={{ "--d": `${i * 45}ms` }}>
            <span className="hs-appico">{ico}</span>
            <span className="hs-appname">{name}</span>
          </div>
        ))}
      </div>
    );
  }

  if (which === "json") {
    return (
      <div className="hs-code">
        <div className="hs-line"><span className="hs-p">{"{"}</span></div>
        <div className="hs-line pad"><span className="hs-k">"app"</span>: <span className="hs-s">"AllTools"</span>,</div>
        <div className="hs-line pad"><span className="hs-k">"tools"</span>: <span className="hs-n">69</span>,</div>
        <div className="hs-line pad"><span className="hs-k">"free"</span>: <span className="hs-b">true</span></div>
        <div className="hs-line"><span className="hs-p">{"}"}</span><span className="hs-caret" /></div>
      </div>
    );
  }

  if (which === "pass") {
    return (
      <div className="hs-pass">
        <div className="hs-field">Kx9$mL2@qP7#vB</div>
        <div className="hs-meter"><span className={"hs-fill" + (live ? " go" : "")} /></div>
        <div className="hs-strong">Strong · uncrackable</div>
        <div className="hs-btn">Copy password</div>
      </div>
    );
  }

  if (which === "words") {
    return (
      <div className="hs-words">
        <p>Write your best work here. Paste any text and get an instant, private breakdown of length and reading time.</p>
        <div className="hs-stats">
          <div className="hs-stat"><b>128</b><span>words</span></div>
          <div className="hs-stat"><b>642</b><span>chars</span></div>
          <div className="hs-stat"><b>1m</b><span>read</span></div>
        </div>
      </div>
    );
  }

  // qr
  return (
    <div className="hs-qr">
      <div className={"hs-qrgrid" + (live ? " go" : "")}>
        {Array.from({ length: 49 }).map((_, i) => (
          <span key={i} className={QR[i] ? "on" : ""} />
        ))}
      </div>
      <div className="hs-qrlabel">Scan → your link</div>
    </div>
  );
}

// simple fixed pattern so the QR looks real without a library
const QR = [
  1,1,1,1,1,0,1,
  1,0,0,0,1,0,1,
  1,0,1,0,1,1,0,
  1,0,0,0,0,1,1,
  1,1,1,0,1,0,1,
  0,0,1,1,0,1,0,
  1,0,1,0,1,0,1,
];
