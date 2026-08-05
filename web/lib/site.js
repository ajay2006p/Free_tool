export const site = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "FreeTool",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.freetoolss.online",
  email: "freetoolss.online@gmail.com",
  tagline: "Free online tools for developers, creators & students",
  description:
    "Free online tools in one place - formatters, converters, calculators, PDF & image tools, SEO, social media and productivity apps. Fast, private and no signup.",
  // Google Analytics 4 measurement id. Overridable per-environment so preview
  // deploys can point at a separate property (or be left blank to disable).
  gaId: process.env.NEXT_PUBLIC_GA_ID || "G-Y323Y7Z3FP",
  /* Google Tag Manager container — disabled.
   *
   * The container was never configured, so it loaded an empty container on
   * every page while GA4 already loads directly from the tag below it.
   * Lighthouse attributed roughly 468ms of main-thread time to it: the single
   * largest contributor to Total Blocking Time, in exchange for nothing.
   *
   * The integration in layout.jsx is intact and gated on this value, so setting
   * NEXT_PUBLIC_GTM_ID re-enables it without a code change. If you ever do,
   * remember the hard-coded gtag block is still there — adding a GA4 tag for
   * the same measurement id inside GTM would double-count every pageview. */
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",
};
