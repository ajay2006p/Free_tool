// Google AdSense — the ONLY ad network on the site. Kept clean, labelled and
// non-intrusive on purpose (protects trust + Safe Browsing standing). No
// pop-unders, no interstitials, no third-party "cpm" networks.
//
// Fill these from your AdSense dashboard, then redeploy:
//   NEXT_PUBLIC_ADSENSE_CLIENT   -> "ca-pub-XXXXXXXXXXXXXXXX"  (Account → Settings)
//   NEXT_PUBLIC_AD_SLOT_DISPLAY  -> the numeric data-ad-slot of a "Display" unit
//   NEXT_PUBLIC_AD_SLOT_INARTICLE-> the numeric data-ad-slot of an "In-article" unit
//
// Until the client id + a slot id are set, ad areas render NOTHING in
// production (and a labelled placeholder on localhost) — the site never breaks.

export const adsense = {
  client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
  slots: {
    // Responsive display banner — top of page, between sections, footer.
    display: process.env.NEXT_PUBLIC_AD_SLOT_DISPLAY || "",
    // Native "in-article" fluid unit — sits inside content, highest earning + least intrusive.
    inArticle: process.env.NEXT_PUBLIC_AD_SLOT_INARTICLE || "",
  },
};

// True once a publisher id exists (the loader script in the layout is gated on this too).
export const adsReady = Boolean(adsense.client);
