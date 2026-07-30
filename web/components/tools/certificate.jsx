"use client";

/* ============================================================================
   Certificate Generator — fill in the details, download a print-ready PDF.

   Batch mode is the point of difference: paste a list of names and you get one
   multi-page PDF, which is what a teacher or course organiser actually needs.
   All rendering is local (pdf-lib), so names never leave the browser.
   ========================================================================== */

import { useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { buildCertificatePdf, downloadBytes } from "../../lib/pdf";

const STYLES = [
  { key: "classic", name: "Classic navy", bg: "#f8fafc", panel: "#ffffff", text: "#0f172a", accent: "#1e3a8a", pdfBg: "#f8fafc", pdfText: "#0f172a", pdfAccent: "#1e3a8a" },
  { key: "gold", name: "Gold", bg: "#fffdf5", panel: "#ffffff", text: "#3f2d0b", accent: "#b45309", pdfBg: "#fffdf5", pdfText: "#3f2d0b", pdfAccent: "#b45309" },
  { key: "emerald", name: "Emerald", bg: "#f4fdf8", panel: "#ffffff", text: "#052e26", accent: "#047857", pdfBg: "#f4fdf8", pdfText: "#052e26", pdfAccent: "#047857" },
  { key: "rose", name: "Rose", bg: "#fff5f7", panel: "#ffffff", text: "#4c0519", accent: "#be123c", pdfBg: "#fff5f7", pdfText: "#4c0519", pdfAccent: "#be123c" },
  { key: "slate", name: "Minimal slate", bg: "#ffffff", panel: "#ffffff", text: "#1e293b", accent: "#475569", pdfBg: "#ffffff", pdfText: "#1e293b", pdfAccent: "#475569" },
];

const PRESETS = {
  achievement: {
    heading: "Certificate of Achievement",
    subheading: "This certificate is proudly presented to",
    reason: "in recognition of outstanding achievement and dedicated effort.",
    leftLabel: "Date",
    rightLabel: "Signature",
  },
  completion: {
    heading: "Certificate of Completion",
    subheading: "This is to certify that",
    reason: "has successfully completed the course and met all its requirements.",
    leftLabel: "Date",
    rightLabel: "Instructor",
  },
  participation: {
    heading: "Certificate of Participation",
    subheading: "Awarded to",
    reason: "for active participation and valuable contribution to the event.",
    leftLabel: "Date",
    rightLabel: "Organiser",
  },
  appreciation: {
    heading: "Certificate of Appreciation",
    subheading: "Presented with gratitude to",
    reason: "in sincere appreciation of generous support and commitment.",
    leftLabel: "Date",
    rightLabel: "Signature",
  },
  employee: {
    heading: "Employee of the Month",
    subheading: "Awarded to",
    reason: "for exceptional performance, initiative and teamwork this month.",
    leftLabel: "Date",
    rightLabel: "Manager",
  },
};

const EMPTY = {
  ...PRESETS.achievement,
  recipient: "",
  org: "",
  signer: "",
  date: "",
  serial: "",
  bulk: "",
  style: "classic",
};

export function CertificateGenerator() {
  const [f, setF, ready] = useLocalStorage("dh_cert", EMPTY);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  // Default the date to today, but only after mount (no SSR mismatch) and only
  // if the user hasn't set one.
  useEffect(() => {
    if (!ready) return;
    if (!f.date) set({ date: new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const style = STYLES.find((s) => s.key === f.style) || STYLES[0];

  const names = useMemo(
    () =>
      String(f.bulk || "")
        .split(/[\n,;]+/)
        .map((n) => n.trim())
        .filter(Boolean),
    [f.bulk]
  );
  const batch = names.length > 0;
  const previewName = batch ? names[0] : f.recipient.trim() || "Recipient Name";
  const canDownload = batch || f.recipient.trim();

  function set(patch) {
    setF((prev) => ({ ...prev, ...patch }));
  }

  async function download() {
    setBusy(true);
    setNote("");
    try {
      const bytes = await buildCertificatePdf(
        { ...f, recipients: batch ? names : [f.recipient.trim()] },
        style
      );
      const base = batch ? "certificates" : f.recipient.trim().replace(/[^a-z0-9]+/gi, "-").toLowerCase();
      downloadBytes(bytes, `${base || "certificate"}.pdf`);
      setNote(batch ? `Downloaded a ${names.length}-page PDF — one certificate per name.` : "Downloaded.");
      setTimeout(() => setNote(""), 5000);
    } catch (e) {
      setNote("Could not build the PDF. Try shortening the text fields.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="tool">
      <div className="fld">Certificate type</div>
      <div className="chips" style={{ marginBottom: 16 }}>
        {Object.entries(PRESETS).map(([key, p]) => (
          <button
            key={key}
            className="chip"
            onClick={() => set(p)}
            style={f.heading === p.heading ? { borderColor: "var(--accent)", fontWeight: 800 } : undefined}
          >
            {p.heading.replace("Certificate of ", "")}
          </button>
        ))}
      </div>

      <div className="grid-2" style={{ gap: 18, alignItems: "start" }}>
        {/* ---------------- form ---------------- */}
        <div>
          <label className="fld">Recipient name</label>
          <input
            className="input"
            value={f.recipient}
            onChange={(e) => set({ recipient: e.target.value })}
            placeholder="e.g. Priya Sharma"
            disabled={batch}
            maxLength={80}
          />
          {batch ? <p className="hint">Using the {names.length} names from the batch list below.</p> : null}

          <label className="fld" style={{ marginTop: 12 }}>Title</label>
          <input className="input" value={f.heading} onChange={(e) => set({ heading: e.target.value })} maxLength={60} />

          <label className="fld" style={{ marginTop: 12 }}>Line above the name</label>
          <input className="input" value={f.subheading} onChange={(e) => set({ subheading: e.target.value })} maxLength={90} />

          <label className="fld" style={{ marginTop: 12 }}>Reason / description</label>
          <textarea
            className="textarea"
            rows={2}
            value={f.reason}
            onChange={(e) => set({ reason: e.target.value })}
            maxLength={220}
          />

          <div className="grid-2" style={{ gap: 12, marginTop: 12 }}>
            <div>
              <label className="fld">Organisation (optional)</label>
              <input className="input" value={f.org} onChange={(e) => set({ org: e.target.value })} maxLength={70} />
            </div>
            <div>
              <label className="fld">Certificate ID (optional)</label>
              <input className="input" value={f.serial} onChange={(e) => set({ serial: e.target.value })} placeholder="e.g. 2026-DS-014" maxLength={40} />
            </div>
            <div>
              <label className="fld">{f.leftLabel || "Date"}</label>
              <input className="input" value={f.date} onChange={(e) => set({ date: e.target.value })} maxLength={40} />
            </div>
            <div>
              <label className="fld">{f.rightLabel || "Signature"} name</label>
              <input className="input" value={f.signer} onChange={(e) => set({ signer: e.target.value })} placeholder="e.g. A. Kumar" maxLength={50} />
            </div>
          </div>

          <div className="fld" style={{ marginTop: 16 }}>Style</div>
          <div className="chips">
            {STYLES.map((s) => (
              <button
                key={s.key}
                className="chip"
                onClick={() => set({ style: s.key })}
                style={f.style === s.key ? { borderColor: "var(--accent)", fontWeight: 800 } : undefined}
              >
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: s.accent, marginRight: 6 }} />
                {s.name}
              </button>
            ))}
          </div>

          <label className="fld" style={{ marginTop: 18 }}>
            Batch mode — one certificate per name (optional)
          </label>
          <textarea
            className="textarea"
            rows={3}
            value={f.bulk}
            onChange={(e) => set({ bulk: e.target.value })}
            placeholder={"Paste one name per line:\nPriya Sharma\nJohn Adeyemi\nLi Wei"}
          />
          {batch ? (
            <p className="hint">{names.length} names → a single {names.length}-page PDF.</p>
          ) : (
            <p className="hint">Leave empty to make just one certificate.</p>
          )}
        </div>

        {/* ---------------- preview ---------------- */}
        <div>
          <div className="fld">Preview</div>
          <div
            style={{
              aspectRatio: "1.414 / 1",
              background: style.bg,
              color: style.text,
              border: `3px solid ${style.accent}`,
              borderRadius: 6,
              padding: "5% 7%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              boxShadow: "var(--shadow)",
              position: "relative",
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            <div style={{ position: "absolute", inset: 8, border: `1px solid ${style.accent}`, borderRadius: 3, pointerEvents: "none" }} />
            {f.org ? (
              <div style={{ fontSize: "clamp(9px,1.4vw,12px)", fontWeight: 700, color: style.accent, marginBottom: "3%" }}>{f.org}</div>
            ) : null}
            <div style={{ fontSize: "clamp(14px,2.6vw,26px)", fontWeight: 800, color: style.accent, letterSpacing: 1, textTransform: "uppercase", lineHeight: 1.2 }}>
              {f.heading}
            </div>
            <div style={{ fontSize: "clamp(8px,1.3vw,13px)", fontStyle: "italic", margin: "3% 0 2%", opacity: 0.85 }}>{f.subheading}</div>
            <div style={{ fontSize: "clamp(16px,3vw,32px)", fontWeight: 800, lineHeight: 1.15, wordBreak: "break-word" }}>{previewName}</div>
            <div style={{ width: "68%", height: 1, background: style.accent, margin: "2.5% 0 3%" }} />
            <div style={{ fontSize: "clamp(8px,1.25vw,13px)", lineHeight: 1.5, maxWidth: "82%", opacity: 0.9 }}>{f.reason}</div>
            <div style={{ display: "flex", gap: "10%", marginTop: "6%", width: "80%", justifyContent: "space-between" }}>
              {[
                { label: f.leftLabel || "Date", value: f.date },
                { label: f.rightLabel || "Signature", value: f.signer },
              ].map((b) => (
                <div key={b.label} style={{ flex: 1 }}>
                  <div style={{ fontSize: "clamp(8px,1.2vw,13px)", minHeight: "1.2em", fontStyle: b.label === (f.rightLabel || "Signature") ? "italic" : "normal" }}>
                    {b.value}
                  </div>
                  <div style={{ height: 1, background: style.accent, margin: "4px 0 3px" }} />
                  <div style={{ fontSize: "clamp(6px,0.95vw,10px)", textTransform: "uppercase", letterSpacing: 1, color: style.accent }}>{b.label}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="hint">A4 landscape — the PDF is print-ready at full resolution.</p>
        </div>
      </div>

      {note ? <div className="notice notice-ok" style={{ marginTop: 14 }}>{note}</div> : null}

      <div className="tool-controls" style={{ marginTop: 18 }}>
        <button className="btn btn-accent" onClick={download} disabled={!canDownload || busy}>
          {busy ? "Building PDF…" : batch ? `Download ${names.length} certificates (PDF)` : "Download PDF"}
        </button>
        <button className="btn btn-outline" onClick={() => setF({ ...EMPTY, date: f.date })}>
          Reset
        </button>
      </div>
      {!canDownload ? <p className="hint">Enter a recipient name, or paste a list in batch mode.</p> : null}
    </div>
  );
}
