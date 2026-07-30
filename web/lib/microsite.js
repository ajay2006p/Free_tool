/* Themes for the Link-in-Bio builder. Shared by the builder's live preview and
   the published /p/<code> page so the two always match exactly.

   Colours are literal (not CSS variables) because a published page must look
   the way its creator designed it, not follow each visitor's colour scheme.
   Every pair here clears WCAG AA for body text. */

export const THEMES = [
  { key: "midnight", name: "Midnight", bg: "#0f172a", card: "#1e293b", text: "#f8fafc", accent: "#6366f1" },
  { key: "sunset", name: "Sunset", bg: "linear-gradient(160deg,#7c2d12,#be185d)", card: "rgba(255,255,255,.14)", text: "#fff7ed", accent: "#fb923c" },
  { key: "mint", name: "Mint", bg: "#ecfdf5", card: "#ffffff", text: "#064e3b", accent: "#10b981" },
  { key: "paper", name: "Paper", bg: "#faf7f2", card: "#ffffff", text: "#1c1917", accent: "#a8a29e" },
  { key: "ocean", name: "Ocean", bg: "linear-gradient(160deg,#0c4a6e,#0891b2)", card: "rgba(255,255,255,.15)", text: "#f0f9ff", accent: "#38bdf8" },
  { key: "grape", name: "Grape", bg: "linear-gradient(160deg,#3b0764,#7e22ce)", card: "rgba(255,255,255,.14)", text: "#faf5ff", accent: "#c084fc" },
];
