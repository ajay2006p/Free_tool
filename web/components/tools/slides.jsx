"use client";

/* ============================================================================
   Presentation Maker — type an outline, get a deck you can present or export.

   Outline-first rather than drag-and-drop on purpose: writing "# Slide title"
   and a few bullets is faster than positioning text boxes, works on a phone,
   and keeps the whole deck in one textarea that autosaves.

   Present mode uses the Fullscreen API with arrow-key navigation; export goes
   through pdf-lib so the download works on mobile (no blocked print dialog).
   ========================================================================== */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { buildSlidesPdf, downloadBytes } from "../../lib/pdf";

const THEMES = [
  { key: "indigo", name: "Indigo", bg: "#111827", panel: "#1f2937", text: "#f9fafb", accent: "#818cf8", pdfBg: "#111827", pdfText: "#f9fafb", pdfAccent: "#818cf8" },
  { key: "clean", name: "Clean", bg: "#ffffff", panel: "#f3f4f6", text: "#111827", accent: "#4f46e5", pdfBg: "#ffffff", pdfText: "#111827", pdfAccent: "#4f46e5" },
  { key: "warm", name: "Warm", bg: "#fffbeb", panel: "#fef3c7", text: "#451a03", accent: "#d97706", pdfBg: "#fffbeb", pdfText: "#451a03", pdfAccent: "#d97706" },
  { key: "forest", name: "Forest", bg: "#052e2b", panel: "#134e4a", text: "#ecfdf5", accent: "#34d399", pdfBg: "#052e2b", pdfText: "#ecfdf5", pdfAccent: "#34d399" },
  { key: "berry", name: "Berry", bg: "#2e1065", panel: "#4c1d95", text: "#f5f3ff", accent: "#c4b5fd", pdfBg: "#2e1065", pdfText: "#f5f3ff", pdfAccent: "#c4b5fd" },
];

const SAMPLE = `# Free Online Tools
A quick look at what we built
Presented by your team

# The problem
- Good tools sit behind signups and paywalls
- Free tiers add watermarks
- Students and freelancers pay the most

# What we made
- 150+ tools, no account needed
- Everything runs in the browser
- Nothing is uploaded or stored

# The numbers
- 0 signups required
- 0 watermarks
- 100% free, forever

# Thank you
Questions?`;

/** Parse the outline. A "# " line starts a slide; every other line is a bullet. */
export function parseOutline(text) {
  const slides = [];
  let current = null;

  for (const raw of String(text || "").split("\n")) {
    const line = raw.trim();
    if (!line) continue;

    const heading = /^#{1,3}\s+(.*)$/.exec(line);
    if (heading) {
      if (current) slides.push(current);
      current = { title: heading[1].trim(), bullets: [] };
      continue;
    }
    // Text before the first heading still deserves a slide.
    if (!current) current = { title: line.replace(/^[-*•]\s*/, ""), bullets: [] };
    else current.bullets.push(line.replace(/^[-*•]\s*/, ""));
  }
  if (current) slides.push(current);

  // A first slide with no bullets, or one holding only a subtitle, reads as a
  // title card — centre it rather than bulleting it.
  return slides.map((s, i) => ({
    ...s,
    layout: i === 0 && s.bullets.length <= 2 ? "title" : "body",
  }));
}

function Slide({ slide, theme, scale = 1, index, total }) {
  if (!slide) return null;
  const isTitle = slide.layout === "title";
  const pad = 40 * scale;
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "16 / 9",
        width: "100%",
        background: theme.bg,
        color: theme.text,
        borderLeft: `${6 * scale}px solid ${theme.accent}`,
        padding: pad,
        display: "flex",
        flexDirection: "column",
        justifyContent: isTitle ? "center" : "flex-start",
        overflow: "hidden",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: `${(isTitle ? 40 : 30) * scale}px`,
          lineHeight: 1.15,
          fontWeight: 800,
        }}
      >
        {slide.title}
      </h2>

      {!isTitle ? (
        <div style={{ width: 70 * scale, height: 3 * scale, background: theme.accent, margin: `${14 * scale}px 0 ${18 * scale}px` }} />
      ) : (
        <div style={{ height: 10 * scale }} />
      )}

      <ul
        style={{
          margin: 0,
          padding: isTitle ? 0 : `0 0 0 ${20 * scale}px`,
          listStyle: isTitle ? "none" : "disc",
          fontSize: `${(isTitle ? 18 : 19) * scale}px`,
          lineHeight: 1.6,
          opacity: isTitle ? 0.85 : 1,
        }}
      >
        {slide.bullets.map((b, i) => (
          <li key={i} style={{ marginBottom: 8 * scale }}>
            {b}
          </li>
        ))}
      </ul>

      {!isTitle && total ? (
        <span style={{ position: "absolute", right: pad, bottom: pad / 2, fontSize: 12 * scale, color: theme.accent }}>
          {index + 1}
        </span>
      ) : null}
    </div>
  );
}

export function PresentationMaker() {
  const [outline, setOutline] = useLocalStorage("dh_deck_outline", SAMPLE);
  const [themeKey, setThemeKey] = useLocalStorage("dh_deck_theme", "indigo");
  const [at, setAt] = useState(0);
  const [presenting, setPresenting] = useState(false);
  const [busy, setBusy] = useState(false);
  const stageRef = useRef(null);

  const slides = useMemo(() => parseOutline(outline), [outline]);
  const theme = THEMES.find((t) => t.key === themeKey) || THEMES[0];
  const current = slides[Math.min(at, Math.max(0, slides.length - 1))];

  const go = useCallback(
    (delta) => setAt((i) => Math.max(0, Math.min(slides.length - 1, i + delta))),
    [slides.length]
  );

  // Arrow keys / space drive the deck while presenting; Escape exits.
  useEffect(() => {
    if (!presenting) return;
    function onKey(e) {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Escape") {
        setPresenting(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [presenting, go]);

  // Keep our state in step with the browser's own fullscreen exit (Esc, gestures).
  useEffect(() => {
    function onFs() {
      if (!document.fullscreenElement) setPresenting(false);
    }
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  async function present() {
    setPresenting(true);
    try {
      await stageRef.current?.requestFullscreen?.();
    } catch (e) {
      // Fullscreen can be refused (iOS Safari); the overlay still works inline.
    }
  }
  function stopPresenting() {
    setPresenting(false);
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  }

  async function exportPdf() {
    if (!slides.length) return;
    setBusy(true);
    try {
      const bytes = await buildSlidesPdf(slides, theme);
      const name = (slides[0]?.title || "presentation").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
      downloadBytes(bytes, `${name}.pdf`);
    } catch (e) {
      // Swallowed on purpose: a failed export must not blank the editor.
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="tool">
      <div className="grid-2" style={{ gap: 18, alignItems: "start" }}>
        {/* ---------------- outline editor ---------------- */}
        <div>
          <div className="flex-between" style={{ flexWrap: "wrap", gap: 8 }}>
            <label className="fld">Your outline</label>
            <span className="muted" style={{ fontSize: 12 }}>
              {slides.length} slide{slides.length === 1 ? "" : "s"}
            </span>
          </div>
          <textarea
            className="textarea"
            rows={16}
            value={outline}
            onChange={(e) => setOutline(e.target.value)}
            placeholder={"# Slide title\n- A bullet point\n- Another point\n\n# Next slide"}
            style={{ fontFamily: "var(--mono, ui-monospace), monospace", fontSize: 14 }}
          />
          <p className="hint">
            Start a line with <code>#</code> for a new slide title. Every other line becomes a bullet. Your outline
            autosaves in this browser.
          </p>

          <div className="fld" style={{ marginTop: 14 }}>Theme</div>
          <div className="chips">
            {THEMES.map((t) => (
              <button
                key={t.key}
                className="chip"
                onClick={() => setThemeKey(t.key)}
                style={themeKey === t.key ? { borderColor: "var(--accent)", fontWeight: 800 } : undefined}
              >
                <span
                  style={{
                    display: "inline-block", width: 10, height: 10, borderRadius: 3,
                    background: t.accent, marginRight: 6,
                  }}
                />
                {t.name}
              </button>
            ))}
          </div>

          <div className="tool-controls" style={{ marginTop: 16, flexWrap: "wrap" }}>
            <button className="btn btn-accent" onClick={present} disabled={!slides.length}>
              ▶ Present
            </button>
            <button className="btn btn-outline" onClick={exportPdf} disabled={!slides.length || busy}>
              {busy ? "Building…" : "Download PDF"}
            </button>
            <button className="btn btn-outline" onClick={() => setOutline(SAMPLE)}>
              Load example
            </button>
            <button className="btn btn-outline" onClick={() => { setOutline(""); setAt(0); }}>
              Clear
            </button>
          </div>
        </div>

        {/* ---------------- preview ---------------- */}
        <div>
          <div className="fld">Preview</div>
          <div style={{ borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)" }}>
            {current ? (
              <Slide slide={current} theme={theme} scale={0.72} index={at} total={slides.length} />
            ) : (
              <div className="center" style={{ padding: 40 }}>
                <p className="muted">Write an outline to see your first slide.</p>
              </div>
            )}
          </div>

          {slides.length > 1 ? (
            <div className="tool-controls" style={{ marginTop: 10, justifyContent: "space-between" }}>
              <button className="btn btn-sm btn-outline" onClick={() => go(-1)} disabled={at === 0}>← Prev</button>
              <span className="muted" style={{ fontSize: 13 }}>
                Slide {Math.min(at + 1, slides.length)} / {slides.length}
              </span>
              <button className="btn btn-sm btn-outline" onClick={() => go(1)} disabled={at >= slides.length - 1}>Next →</button>
            </div>
          ) : null}

          {slides.length ? (
            <div className="stack-sm" style={{ marginTop: 14 }}>
              <div className="fld">Slides</div>
              {slides.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setAt(i)}
                  style={{
                    display: "block", width: "100%", textAlign: "left", cursor: "pointer",
                    padding: "8px 11px", marginBottom: 5, borderRadius: 8, fontSize: 14,
                    border: `1px solid ${i === at ? "var(--accent)" : "var(--border)"}`,
                    background: i === at ? "var(--surface-2)" : "transparent",
                    color: "var(--text)", fontWeight: i === at ? 700 : 500,
                  }}
                >
                  {i + 1}. {s.title || "(untitled)"}{" "}
                  <span className="muted" style={{ fontSize: 12 }}>
                    {s.bullets.length ? `· ${s.bullets.length} bullets` : ""}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* ---------------- present overlay ---------------- */}
      <div
        ref={stageRef}
        style={{
          position: presenting ? "fixed" : "static",
          inset: 0,
          zIndex: presenting ? 9999 : "auto",
          display: presenting ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          background: theme.bg,
        }}
      >
        {presenting ? (
          <>
            <div style={{ width: "min(100vw, 177.78vh)" }}>
              <Slide slide={current} theme={theme} scale={1.6} index={at} total={slides.length} />
            </div>
            <div style={{ position: "absolute", bottom: 18, right: 18, display: "flex", gap: 8 }}>
              <button className="btn btn-sm" onClick={() => go(-1)} disabled={at === 0}>←</button>
              <button className="btn btn-sm" onClick={() => go(1)} disabled={at >= slides.length - 1}>→</button>
              <button className="btn btn-sm btn-outline" onClick={stopPresenting}>Exit</button>
            </div>
            <div style={{ position: "absolute", bottom: 22, left: 20, color: theme.accent, fontSize: 13 }}>
              {at + 1} / {slides.length} · arrow keys to move, Esc to exit
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
