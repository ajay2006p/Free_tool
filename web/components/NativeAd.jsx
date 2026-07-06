"use client";

import Script from "next/script";

// Adsterra Native Banner — the script fills the container div. Use it ONCE per
// page (the container id must be unique on the page).
export default function NativeAd() {
  return (
    <div className="container" style={{ margin: "10px auto" }}>
      <Script
        src="https://pl30224169.effectivecpmnetwork.com/eaa0bbb9ef2333c880c138aadb28a324/invoke.js"
        strategy="afterInteractive"
        data-cfasync="false"
      />
      <div id="container-eaa0bbb9ef2333c880c138aadb28a324" />
    </div>
  );
}
