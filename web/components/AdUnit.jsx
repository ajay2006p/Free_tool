"use client";

import { useEffect, useRef } from "react";
import { adsense } from "../lib/ads";

/* Injects the AdSense loader, once per page, the first time an ad unit is
   actually close to being seen.

   It used to load in the root layout — first during initial page load, then at
   idle. Both were wasteful, because the loader is ~230 KiB of script that does
   nothing at all unless an ad unit exists to fill. No slot id is configured
   today, so AdUnit renders null everywhere and the script was being downloaded
   and executed on every page view for literally no output.

   Requesting it from the unit that needs it means the cost is paid only when
   there is something to gain, and only as the ad approaches the viewport.
   Verification is untouched: the google-adsense-account meta tag and /ads.txt
   are server-rendered in the layout and each verifies the site on its own. */
let scriptRequested = false;
function ensureAdsScript(client) {
  if (scriptRequested || typeof document === "undefined") return;
  scriptRequested = true;
  const s = document.createElement("script");
  s.async = true;
  s.crossOrigin = "anonymous";
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
  document.head.appendChild(s);
}

/**
 * A single Google AdSense unit. Renders the <ins> element and asks AdSense to
 * fill it. Renders nothing when AdSense isn't configured (no client id / no
 * slot id) so the page never shows a broken/empty ad box in production.
 *
 * The loader script is fetched lazily by this component — see ensureAdsScript.
 */
export default function AdUnit({ slot, format = "auto", layout, responsive = true, style }) {
  const pushed = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    // Guard against double-push (React StrictMode / re-renders) — one fill per unit.
    if (pushed.current || !adsense.client || !slot) return;
    const el = ref.current;
    if (!el) return;

    const fill = () => {
      if (pushed.current) return;
      ensureAdsScript(adsense.client);
      try {
        // The queueing form: if the loader has not arrived yet the push is held
        // in the array and processed when it does, so ordering does not matter.
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch (e) {
        /* a later mount or navigation will retry */
      }
    };

    if (typeof IntersectionObserver === "undefined") { fill(); return; }

    /* 600px of margin so the request starts before the unit is on screen and
       the slot is filled by the time it scrolls into view. */
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) { io.disconnect(); fill(); }
      },
      { rootMargin: "600px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [slot]);

  if (!adsense.client || !slot) return null;

  return (
    <ins
      ref={ref}
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
