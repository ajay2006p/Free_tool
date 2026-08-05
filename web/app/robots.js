import { site } from "../lib/site";

// Explicitly welcome every major search engine AND AI/LLM crawler, so the site
// can be indexed and cited by ChatGPT, Claude, Gemini, Perplexity, Copilot, etc.
// A wildcard "*" already allows them, but naming each one makes the intent
// explicit and defeats any host/CDN default that quietly blocks AI bots.
const AI_AND_SEARCH_BOTS = [
  // OpenAI — ChatGPT (crawl, user browsing, SearchGPT)
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  // Anthropic — Claude
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  // Google — Search + Gemini AI training
  "Googlebot",
  "Google-Extended",
  // Microsoft — Bing + Copilot
  "bingbot",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Apple Intelligence
  "Applebot",
  "Applebot-Extended",
  // Common Crawl (feeds many LLM datasets)
  "CCBot",
  // Meta AI
  "meta-externalagent",
  "FacebookBot",
  // DuckDuckGo (Bing-backed) + others
  "DuckDuckBot",
  "Amazonbot",
  "YandexBot",
  "Bytespider",
  "cohere-ai",
  "MistralAI-User",
];

// User-generated pages (shared forms, availability polls, published link-in-bio
// pages) and the admin area. These are not ours to rank: they hold visitors'
// own content and arbitrary outbound links, so keeping them out of the index
// protects the domain's quality signals. Each page is also noindex'd directly.
const PRIVATE_PATHS = ["/f/", "/p/", "/admin", "/api/"];

export default function robots() {
  return {
    rules: [
      // Every named AI + search crawler: full access to the real site.
      { userAgent: AI_AND_SEARCH_BOTS, allow: "/", disallow: PRIVATE_PATHS },
      // Everyone else (any other bot): same deal.
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
