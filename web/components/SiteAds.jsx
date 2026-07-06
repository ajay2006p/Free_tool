"use client";

import Script from "next/script";

// Site-wide Adsterra units that inject themselves (Social Bar / Pop-under).
// Loaded once on every page via the root layout. They only serve real ads on
// the live, approved domain — not on localhost.
export default function SiteAds() {
  return (
    <>
      <Script
        src="https://pl30224168.effectivecpmnetwork.com/10/db/b1/10dbb1c350f3f01eede07b24af4245c7.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://pl30224171.effectivecpmnetwork.com/bb/e0/ab/bbe0ab20c793cd22b9a64b1d5a1951b3.js"
        strategy="afterInteractive"
      />
    </>
  );
}
