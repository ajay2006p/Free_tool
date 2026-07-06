"use client";

import { useEffect, useState } from "react";

// One shared fetch of the ad config for all slots on a page.
let cfgPromise = null;
function getAdConfig() {
  if (!cfgPromise) cfgPromise = fetch("/api/ad-config").then((r) => r.json()).catch(() => null);
  return cfgPromise;
}

/**
 * Ad unit. ALWAYS shows a labelled placeholder so the ad area is visible, and
 * overlays the real ad on top when one is configured. On localhost (or before
 * the ad fills) the placeholder shows through; on your live domain the real ad
 * paints over it. Settings come from the admin panel → Monetization.
 */
export default function AdSlot({ label = "Advertisement", width, height }) {
  const [cfg, setCfg] = useState(null);

  useEffect(() => {
    let alive = true;
    getAdConfig().then((c) => { if (alive) setCfg(c); });
    return () => { alive = false; };
  }, []);

  const w = Number(width || cfg?.width || 728);
  const h = Number(height || cfg?.height || 90);
  const enabled = cfg && cfg.enabled;
  const wrap = (inner) => `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>${inner}</body></html>`;

  let srcDoc = null;
  if (enabled && cfg.mode === "custom" && cfg.customCode) srcDoc = wrap(cfg.customCode);
  else if (enabled && cfg.adsterraKey) {
    srcDoc = wrap(`<script type="text/javascript">atOptions={'key':'${cfg.adsterraKey}','format':'iframe','height':${h},'width':${w},'params':{}};<\/script><script type="text/javascript" src="//www.highperformanceformat.com/${cfg.adsterraKey}/invoke.js"><\/script>`);
  }

  return (
    <div className="ad-wrap" style={{ width: w, height: h, maxWidth: "100%" }}>
      <div className="ad-ph">
        <span className="ad-tag">Advertisement</span>
        <span className="ad-sub">{label} · {w}×{h}</span>
      </div>
      {srcDoc ? (
        <iframe title="Advertisement" srcDoc={srcDoc} scrolling="no" className="ad-frame" />
      ) : null}
    </div>
  );
}
