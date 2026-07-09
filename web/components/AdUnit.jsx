"use client";

import { useEffect, useRef } from "react";
import { adsense } from "../lib/ads";

/**
 * A single Google AdSense unit. Renders the <ins> element and asks AdSense to
 * fill it. Renders nothing when AdSense isn't configured (no client id / no
 * slot id) so the page never shows a broken/empty ad box in production.
 *
 * The loader script (pagead...adsbygoogle.js) is injected once in the root
 * layout, gated on NEXT_PUBLIC_ADSENSE_CLIENT.
 */
export default function AdUnit({ slot, format = "auto", layout, responsive = true, style }) {
  const pushed = useRef(false);

  useEffect(() => {
    // Guard against double-push (React StrictMode / re-renders) — one fill per unit.
    if (pushed.current || !adsense.client || !slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      /* adsbygoogle not ready yet; a later mount/navigation will fill it */
    }
  }, [slot]);

  if (!adsense.client || !slot) return null;

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", width: "100%", ...style }}
      data-ad-client={adsense.client}
      data-ad-slot={slot}
      data-ad-format={format}
      {...(layout ? { "data-ad-layout": layout } : {})}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  );
}
