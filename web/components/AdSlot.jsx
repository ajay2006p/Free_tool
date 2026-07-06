"use client";

import { useEffect, useState } from "react";

// One shared fetch of the ad config (admin override) for all slots on a page.
let cfgPromise = null;
function getAdConfig() {
  if (!cfgPromise) cfgPromise = fetch("/api/ad-config").then((r) => r.json()).catch(() => null);
  return cfgPromise;
}

// Adsterra banner units (from the site owner's Adsterra account).
const DESKTOP = { key: "182b78be1cdd342d54f47b5c251ab1f8", w: 728, h: 90 };
const MOBILE = { key: "6afc4fbbcd356c9dd92929cb14e82acf", w: 320, h: 50 };

const wrap = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>${inner}</body></html>`;
const bannerDoc = (key, w, h) => wrap(`<script type="text/javascript">atOptions={'key':'${key}','format':'iframe','height':${h},'width':${w},'params':{}};<\/script><script type="text/javascript" src="//www.highperformanceformat.com/${key}/invoke.js"><\/script>`);

function Slot({ doc, w, h, label }) {
  return (
    <div className="ad-wrap" style={{ width: w, height: h, maxWidth: "100%" }}>
      <div className="ad-ph"><span className="ad-tag">Advertisement</span><span className="ad-sub">{label} · {w}×{h}</span></div>
      {doc ? <iframe title="Advertisement" srcDoc={doc} scrolling="no" className="ad-frame" /> : null}
    </div>
  );
}

/**
 * Responsive ad unit: a 728x90 banner on desktop, a 320x50 banner on mobile.
 * A labelled placeholder always shows (so the ad area is visible on localhost /
 * before fill); the real ad overlays on top on your live domain.
 * The admin panel (Monetization → "custom code") can override with any code.
 */
export default function AdSlot({ label = "Advertisement" }) {
  const [cfg, setCfg] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    getAdConfig().then((c) => { if (alive) { setCfg(c); setReady(true); } });
    return () => { alive = false; };
  }, []);

  // Optional override set in the admin Ads Manager (custom code mode).
  if (ready && cfg?.enabled && cfg.mode === "custom" && cfg.customCode) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Slot doc={wrap(cfg.customCode)} w={cfg.width || 728} h={cfg.height || 90} label={label} />
      </div>
    );
  }

  return (
    <>
      <div className="ad-desktop"><Slot doc={ready ? bannerDoc(DESKTOP.key, DESKTOP.w, DESKTOP.h) : null} w={DESKTOP.w} h={DESKTOP.h} label={label} /></div>
      <div className="ad-mobile"><Slot doc={ready ? bannerDoc(MOBILE.key, MOBILE.w, MOBILE.h) : null} w={MOBILE.w} h={MOBILE.h} label={label} /></div>
    </>
  );
}
