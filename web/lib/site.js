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
  // Google Tag Manager container. Same override rule as gaId.
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || "GTM-WBLDJN2M",
};
