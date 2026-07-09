"use client";

import { useEffect, useState } from "react";
import { adsense } from "../lib/ads";
import AdUnit from "./AdUnit";

// One shared fetch of the ad config (admin override / global on-off) per page.
let cfgPromise = null;
function getAdConfig() {
  if (!cfgPromise) cfgPromise = fetch("/api/ad-config").then((r) => r.json()).catch(() => null);
  return cfgPromise;
}

const wrap = (inner) =>
  `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>${inner}</body></html>`;

/**
 * A labelled ad placement.
 *
 * Priority: admin custom code  →  Google AdSense unit  →  (localhost) placeholder
 *           →  nothing.
 *
 * variant "display"    = responsive banner (top of page, between sections, footer)
 * variant "in-article" = native in-content fluid unit (highest earning, least intrusive)
 *
 * Every ad is captioned "Advertisement" for transparency — good for user trust
 * and fully AdSense-compliant.
 */
export default function AdSlot({ label = "Advertisement", variant = "display" }) {
  const [cfg, setCfg] = useState(null);
  const [ready, setReady] = useState(false);
  const [isLocal, setIsLocal] = useState(false);

  useEffect(() => {
    let alive = true;
    setIsLocal(
      /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/.test(location.hostname) ||
        location.hostname.endsWith(".local")
    );
    getAdConfig().then((c) => { if (alive) { setCfg(c); setReady(true); } });
    return () => { alive = false; };
  }, []);

  // Global kill-switch (admin panel → Monetization → disable).
  if (ready && cfg && cfg.enabled === false) return null;

  // 1) Admin custom code override (a site owner can paste vetted ad code).
  if (ready && cfg && cfg.mode === "custom" && cfg.customCode) {
    return (
      <div className="ad-unit">
        <span className="ad-label">Advertisement</span>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <iframe
            title={label}
            srcDoc={wrap(cfg.customCode)}
            scrolling="no"
            style={{ width: cfg.width || 728, height: cfg.height || 90, maxWidth: "100%", border: 0, overflow: "hidden" }}
          />
        </div>
      </div>
    );
  }

  // 2) Google AdSense unit — the proper, trusted setup.
  const isArticle = variant === "in-article";
  const slot = isArticle ? adsense.slots.inArticle : adsense.slots.display;
  if (adsense.client && slot) {
    return (
      <div className="ad-unit">
        <span className="ad-label">Advertisement</span>
        <AdUnit
          slot={slot}
          format={isArticle ? "fluid" : "auto"}
          layout={isArticle ? "in-article" : undefined}
          style={isArticle ? { textAlign: "center" } : undefined}
        />
      </div>
    );
  }

  // 3) Localhost only: a labelled placeholder so you can see where ads appear.
  if (ready && isLocal) {
    return (
      <div
        className="ad-unit"
        style={{
          display: "grid",
          placeItems: "center",
          minHeight: isArticle ? 120 : 90,
          border: "1px dashed var(--border-strong)",
          borderRadius: 8,
          background: "var(--surface-2)",
          color: "var(--muted)",
          textAlign: "center",
          padding: 10,
        }}
      >
        <div>
          <div style={{ fontWeight: 800, letterSpacing: ".12em", fontSize: 11, textTransform: "uppercase" }}>
            Advertisement
          </div>
          <div style={{ fontSize: 11 }}>{label} · AdSense {isArticle ? "in-article" : "display"} slot not set</div>
        </div>
      </div>
    );
  }

  // 4) Nothing configured on production → render nothing (never a broken box).
  return null;
}
