"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Fires a lightweight page-view beacon on every route change. A random,
// non-identifying session id (stored in localStorage) lets the admin count
// unique visitors and "live" users without any cookies or personal data.
function sessionId() {
  try {
    let id = localStorage.getItem("dh_sid");
    if (!id) { id = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem("dh_sid", id); }
    return id;
  } catch (e) { return "anon"; }
}

export default function Analytics() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || pathname.startsWith("/api")) return;
    const body = JSON.stringify({ path: pathname, session: sessionId(), ref: document.referrer || "" });
    try {
      if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      else fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
    } catch (e) {}
  }, [pathname]);
  return null;
}
