// REMOVED: site-wide pop-under / social-bar ads.
//
// These loaded through effectivecpmnetwork.com (an Adsterra "pop" network) that
// served intrusive, scam-style overlays ("your account was hacked" fake alerts).
// That is a direct Google Safe Browsing + ad-quality / manual-action risk and
// erodes user trust, so it has been deleted entirely.
//
// This component is now a permanent no-op, kept only so existing imports never
// break. Do NOT re-add pop/interstitial ad scripts here. If you ever monetise,
// use a reputable in-page network (e.g. Google AdSense) via the AdSlot admin
// "custom code" path instead.
export default function SiteAds() {
  return null;
}
