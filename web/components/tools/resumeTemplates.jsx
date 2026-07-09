"use client";

import { useEffect, useRef, useState } from "react";

/* ============================================================
   ResumeTemplateBuilder — advanced client-side resume/CV builder
   - Fill in your details, pick from 4 visual templates
   - Live A4 preview, accent-colour picker
   - Download a real multi-page PDF (html2canvas + jspdf)
   - Auto-saves to localStorage. 100% client-side; nothing uploaded.
   ============================================================ */

const LS_KEY = "rtb:data:v2";

const ACCENTS = [
  "#4f46e5", // indigo
  "#7c3aed", // violet
  "#2563eb", // blue
  "#0891b2", // cyan
  "#059669", // emerald
  "#db2777", // pink
  "#e11d48", // rose
  "#ea580c", // orange
  "#0f172a", // slate (ATS-safe)
];

const TEMPLATES = [
  { id: "modern", name: "Modern" },
  { id: "classic", name: "Classic" },
  { id: "minimal", name: "Minimal" },
  { id: "twocol", name: "Two-Column" },
];

const makeExp = () => ({ role: "", company: "", location: "", start: "", end: "", current: false, bullets: "" });
const makeEdu = () => ({ degree: "", school: "", year: "", details: "" });
const makeProj = () => ({ name: "", description: "" });

const EMPTY = {
  template: "modern",
  accent: "#4f46e5",
  personal: { fullName: "", jobTitle: "", email: "", phone: "", location: "", website: "" },
  summary: "",
  experience: [makeExp()],
  education: [makeEdu()],
  skills: "",
  projects: [],
  certifications: "",
};

const SAMPLE = {
  template: "modern",
  accent: "#4f46e5",
  personal: {
    fullName: "Ava Sinclair",
    jobTitle: "Senior Product Designer",
    email: "ava.sinclair@email.com",
    phone: "+1 (415) 555-0182",
    location: "San Francisco, CA",
    website: "avasinclair.design",
  },
  summary:
    "Product designer with 8+ years shaping intuitive, accessible digital products for millions of users. I pair sharp visual craft with data-driven decisions, and love turning ambiguous problems into elegant, shippable solutions.",
  experience: [
    {
      role: "Senior Product Designer",
      company: "Northwind Labs",
      location: "San Francisco, CA",
      start: "2021",
      end: "",
      current: true,
      bullets:
        "Led the redesign of the core dashboard, lifting task completion by 34%.\nBuilt and maintained a 120-component design system used by 40+ engineers.\nMentored 4 junior designers and ran a weekly design critique.",
    },
    {
      role: "Product Designer",
      company: "Brightwave",
      location: "Remote",
      start: "2018",
      end: "2021",
      current: false,
      bullets:
        "Shipped the mobile onboarding flow that cut drop-off by 22%.\nPartnered with research to run 30+ usability studies.\nDelivered pixel-perfect specs that reduced design QA cycles by half.",
    },
  ],
  education: [
    { degree: "B.F.A. Interaction Design", school: "Rhode Island School of Design", year: "2016", details: "Graduated with honours · Thesis on inclusive design" },
    { degree: "UX Certificate", school: "Nielsen Norman Group", year: "2019", details: "" },
  ],
  skills:
    "User Research, Figma, Design Systems, Prototyping, Accessibility (WCAG), Interaction Design, HTML/CSS, Usability Testing, Product Strategy",
  projects: [
    { name: "Open Palette", description: "An open-source accessible colour-contrast toolkit with 12k+ GitHub stars." },
    { name: "Craft Conf Talk", description: "Spoke to 600+ designers on scaling design systems without slowing teams down." },
  ],
  certifications:
    "Certified Professional in Accessibility Core Competencies (CPACC) — 2022\nGoogle UX Design Professional Certificate — 2020",
};

/* ---------- small helpers ---------- */
const bulletsOf = (str) => (str || "").split("\n").map((s) => s.trim()).filter(Boolean);
const listOf = (str) => (str || "").split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
const dateRange = (e) => {
  const end = e.current ? "Present" : (e.end || "").trim();
  const start = (e.start || "").trim();
  if (start && end) return `${start} – ${end}`;
  return start || end || "";
};
function tint(hex, a) {
  try {
    const h = (hex || "").replace("#", "");
    const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const r = parseInt(n.slice(0, 2), 16);
    const g = parseInt(n.slice(2, 4), 16);
    const b = parseInt(n.slice(4, 6), 16);
    if ([r, g, b].some((v) => Number.isNaN(v))) return `rgba(79,70,229,${a})`;
    return `rgba(${r},${g},${b},${a})`;
  } catch {
    return `rgba(79,70,229,${a})`;
  }
}

/* ---------- mini template swatch ---------- */
function MiniSwatch({ kind, accent }) {
  const bar = (w, c = "#cbd5e1", h = 4) => (
    <div style={{ height: h, width: w, background: c, borderRadius: 2 }} />
  );
  if (kind === "modern") {
    return (
      <div style={{ height: 78, background: "#fff", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 22, background: accent }} />
        <div style={{ padding: 8, display: "grid", gap: 5 }}>
          {bar("60%", accent, 3)}
          {bar("100%")}
          {bar("92%")}
          {bar("80%")}
        </div>
      </div>
    );
  }
  if (kind === "classic") {
    return (
      <div style={{ height: 78, background: "#fff", padding: 9, display: "grid", gap: 5, justifyItems: "center" }}>
        {bar("55%", "#334155", 4)}
        <div style={{ height: 1, width: "82%", background: accent }} />
        {bar("90%")}
        {bar("78%")}
        {bar("86%")}
      </div>
    );
  }
  if (kind === "minimal") {
    return (
      <div style={{ height: 78, background: "#fff", padding: 11, display: "grid", gap: 7 }}>
        {bar("48%", "#334155", 5)}
        {bar("28%", accent, 3)}
        <div style={{ height: 2 }} />
        {bar("82%")}
        {bar("62%")}
      </div>
    );
  }
  // twocol
  return (
    <div style={{ height: 78, background: "#fff", display: "grid", gridTemplateColumns: "34% 1fr" }}>
      <div style={{ background: accent }} />
      <div style={{ padding: 8, display: "grid", gap: 5 }}>
        {bar("72%", "#334155", 4)}
        {bar("100%")}
        {bar("86%")}
        {bar("92%")}
      </div>
    </div>
  );
}

export function ResumeTemplateBuilder() {
  const [state, setState] = useState(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const previewRef = useRef(null);

  /* restore on mount */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState((s) => ({ ...EMPTY, ...s, ...parsed, personal: { ...EMPTY.personal, ...(parsed.personal || {}) } }));
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  /* auto-save */
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {
      /* storage full / unavailable — ignore */
    }
  }, [state, hydrated]);

  /* ---------- updaters ---------- */
  const set = (patch) => setState((s) => ({ ...s, ...patch }));
  const setPersonal = (k, v) => setState((s) => ({ ...s, personal: { ...s.personal, [k]: v } }));
  const updateItem = (key, i, patch) =>
    setState((s) => ({ ...s, [key]: s[key].map((it, idx) => (idx === i ? { ...it, ...patch } : it)) }));
  const addItem = (key, factory) => setState((s) => ({ ...s, [key]: [...s[key], factory()] }));
  const removeItem = (key, i) => setState((s) => ({ ...s, [key]: s[key].filter((_, idx) => idx !== i) }));

  const loadSample = () => setState({ ...SAMPLE, template: state.template, accent: state.accent });
  const clearAll = () => {
    setState({ ...EMPTY, template: state.template, accent: state.accent });
    setErr("");
  };

  /* ---------- PDF download (exact tested pattern) ---------- */
  async function downloadPdf() {
    setBusy(true);
    setErr("");
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const node = previewRef.current;
      if (!node) throw new Error("preview not ready");
      const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const img = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = 210, pageH = 297;
      const imgW = pageW;
      const imgH = (canvas.height * imgW) / canvas.width;
      let heightLeft = imgH, position = 0;
      pdf.addImage(img, "JPEG", 0, position, imgW, imgH);
      heightLeft -= pageH;
      while (heightLeft > 0) {
        position = heightLeft - imgH;
        pdf.addPage();
        pdf.addImage(img, "JPEG", 0, position, imgW, imgH);
        heightLeft -= pageH;
      }
      pdf.save(`${(state.personal.fullName || "resume").replace(/[^\w.-]+/g, "_")}.pdf`);
    } catch (e) {
      setErr("Sorry — we couldn't build the PDF. Try again, or switch templates and retry.");
    } finally {
      setBusy(false);
    }
  }

  const accent = state.accent || "#4f46e5";

  /* ============================================================
     PREVIEW TEMPLATES
     ============================================================ */
  const p = state.personal;
  const name = p.fullName || "Your Name";
  const contact = [p.email, p.phone, p.location, p.website].filter(Boolean);
  const skills = listOf(state.skills);
  const certs = bulletsOf(state.certifications);
  const hasExp = state.experience.some((e) => e.role || e.company || e.bullets);
  const hasEdu = state.education.some((e) => e.degree || e.school);
  const hasProj = state.projects.some((x) => x.name || x.description);

  function ExpList({ roleColor, compColor, dateColor, bulletColor }) {
    return state.experience
      .filter((e) => e.role || e.company || e.bullets)
      .map((e, i) => (
        <div key={i} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "baseline" }}>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: roleColor }}>{e.role || "Role"}</div>
            <div style={{ fontSize: 12, color: dateColor, whiteSpace: "nowrap" }}>{dateRange(e)}</div>
          </div>
          <div style={{ fontSize: 13, color: compColor, fontWeight: 600 }}>
            {[e.company, e.location].filter(Boolean).join(" · ")}
          </div>
          {bulletsOf(e.bullets).length > 0 && (
            <ul style={{ margin: "6px 0 0", paddingLeft: 18, color: bulletColor }}>
              {bulletsOf(e.bullets).map((b, bi) => (
                <li key={bi} style={{ marginBottom: 3, fontSize: 13, lineHeight: 1.45 }}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      ));
  }

  function renderModern() {
    const H = ({ children }) => (
      <div style={{ fontSize: 12.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".07em", color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: 4, margin: "20px 0 10px" }}>{children}</div>
    );
    return (
      <div style={{ fontFamily: "var(--sans)", color: "#1f2937", fontSize: 14, lineHeight: 1.55 }}>
        <div style={{ background: accent, color: "#fff", padding: "clamp(20px,5%,32px)" }}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{name}</div>
          {p.jobTitle && <div style={{ fontSize: 15, fontWeight: 600, opacity: 0.92, marginTop: 4 }}>{p.jobTitle}</div>}
          {contact.length > 0 && (
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: "5px 16px", fontSize: 12.5, opacity: 0.96 }}>
              {contact.map((c, i) => <span key={i}>{c}</span>)}
            </div>
          )}
        </div>
        <div style={{ padding: "clamp(18px,5%,32px)", paddingTop: 4 }}>
          {state.summary && (<><H>Summary</H><p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55 }}>{state.summary}</p></>)}
          {hasExp && (<><H>Experience</H><ExpList roleColor="#111827" compColor={accent} dateColor="#6b7280" bulletColor="#374151" /></>)}
          {hasProj && (<><H>Projects</H>{state.projects.filter((x) => x.name || x.description).map((pr, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{pr.name}</span>
              {pr.description && <span style={{ fontSize: 13, color: "#374151" }}>{pr.name ? " — " : ""}{pr.description}</span>}
            </div>
          ))}</>)}
          {hasEdu && (<><H>Education</H>{state.education.filter((e) => e.degree || e.school).map((e, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{e.degree || "Degree"}</span>
                <span style={{ fontSize: 12, color: "#6b7280" }}>{e.year}</span>
              </div>
              <div style={{ fontSize: 13, color: accent, fontWeight: 600 }}>{e.school}</div>
              {e.details && <div style={{ fontSize: 12.5, color: "#4b5563" }}>{e.details}</div>}
            </div>
          ))}</>)}
          {skills.length > 0 && (<><H>Skills</H>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {skills.map((s, i) => (
                <span key={i} style={{ fontSize: 12.5, fontWeight: 600, color: accent, background: tint(accent, 0.12), padding: "4px 11px", borderRadius: 999 }}>{s}</span>
              ))}
            </div></>)}
          {certs.length > 0 && (<><H>Certifications</H>
            <ul style={{ margin: 0, paddingLeft: 18 }}>{certs.map((c, i) => <li key={i} style={{ fontSize: 13, marginBottom: 3 }}>{c}</li>)}</ul>
          </>)}
        </div>
      </div>
    );
  }

  function renderClassic() {
    const H = ({ children }) => (
      <div style={{ textAlign: "center", fontSize: 12.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".14em", color: "#1a1a1a", borderBottom: `1px solid ${accent}`, paddingBottom: 3, margin: "18px 0 10px" }}>{children}</div>
    );
    return (
      <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: "#1a1a1a", fontSize: 14, lineHeight: 1.5, padding: "clamp(24px,6%,44px)" }}>
        <div style={{ textAlign: "center", borderBottom: `2px solid ${accent}`, paddingBottom: 12, marginBottom: 2 }}>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: ".02em" }}>{name}</div>
          {p.jobTitle && <div style={{ fontSize: 15, fontStyle: "italic", color: "#444", marginTop: 2 }}>{p.jobTitle}</div>}
          {contact.length > 0 && <div style={{ marginTop: 8, fontSize: 12.5, color: "#333" }}>{contact.join("  •  ")}</div>}
        </div>
        {state.summary && (<><H>Profile</H><p style={{ margin: 0, fontSize: 13.5, textAlign: "justify" }}>{state.summary}</p></>)}
        {hasExp && (<><H>Experience</H><ExpList roleColor="#1a1a1a" compColor="#333" dateColor="#555" bulletColor="#2a2a2a" /></>)}
        {hasEdu && (<><H>Education</H>{state.education.filter((e) => e.degree || e.school).map((e, i) => (
          <div key={i} style={{ marginBottom: 8, textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{e.degree || "Degree"}{e.year ? `, ${e.year}` : ""}</div>
            <div style={{ fontSize: 13, fontStyle: "italic" }}>{e.school}</div>
            {e.details && <div style={{ fontSize: 12.5, color: "#444" }}>{e.details}</div>}
          </div>
        ))}</>)}
        {hasProj && (<><H>Projects</H>{state.projects.filter((x) => x.name || x.description).map((pr, i) => (
          <div key={i} style={{ marginBottom: 7 }}>
            <span style={{ fontWeight: 700 }}>{pr.name}</span>{pr.description ? <span>{pr.name ? " — " : ""}{pr.description}</span> : null}
          </div>
        ))}</>)}
        {skills.length > 0 && (<><H>Skills</H><p style={{ margin: 0, textAlign: "center", fontSize: 13.5 }}>{skills.join("  •  ")}</p></>)}
        {certs.length > 0 && (<><H>Certifications</H>{certs.map((c, i) => <div key={i} style={{ textAlign: "center", fontSize: 13, marginBottom: 3 }}>{c}</div>)}</>)}
      </div>
    );
  }

  function renderMinimal() {
    const H = ({ children }) => (
      <div style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".22em", color: "#9aa3af", margin: "26px 0 10px" }}>{children}</div>
    );
    return (
      <div style={{ fontFamily: "var(--sans)", color: "#2b2f36", fontSize: 13.5, lineHeight: 1.6, padding: "clamp(26px,7%,52px)" }}>
        <div style={{ fontSize: 34, fontWeight: 300, letterSpacing: "-0.01em", lineHeight: 1.1 }}>{name}</div>
        {p.jobTitle && <div style={{ fontSize: 14, color: accent, fontWeight: 600, marginTop: 3 }}>{p.jobTitle}</div>}
        {contact.length > 0 && <div style={{ fontSize: 12, color: "#8a919c", marginTop: 10 }}>{contact.join("   ·   ")}</div>}
        {state.summary && (<><H>About</H><p style={{ margin: 0 }}>{state.summary}</p></>)}
        {hasExp && (<><H>Experience</H><ExpList roleColor="#1c1f24" compColor="#6b7280" dateColor="#9aa3af" bulletColor="#3a3f47" /></>)}
        {hasProj && (<><H>Projects</H>{state.projects.filter((x) => x.name || x.description).map((pr, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 600 }}>{pr.name}</div>
            {pr.description && <div style={{ fontSize: 13, color: "#5b626c" }}>{pr.description}</div>}
          </div>
        ))}</>)}
        {hasEdu && (<><H>Education</H>{state.education.filter((e) => e.degree || e.school).map((e, i) => (
          <div key={i} style={{ marginBottom: 7 }}>
            <span style={{ fontWeight: 600 }}>{e.degree || "Degree"}</span>
            <span style={{ color: "#8a919c" }}>{e.school ? `  ·  ${e.school}` : ""}{e.year ? `  ·  ${e.year}` : ""}</span>
            {e.details && <div style={{ fontSize: 12.5, color: "#8a919c" }}>{e.details}</div>}
          </div>
        ))}</>)}
        {skills.length > 0 && (<><H>Skills</H><div style={{ fontSize: 13.5, color: "#3a3f47" }}>{skills.join("   ·   ")}</div></>)}
        {certs.length > 0 && (<><H>Certifications</H>{certs.map((c, i) => <div key={i} style={{ fontSize: 13, marginBottom: 3 }}>{c}</div>)}</>)}
      </div>
    );
  }

  function renderTwoCol() {
    const sideH = { fontSize: 11.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".09em", color: "#fff", opacity: 0.9, borderBottom: "1px solid rgba(255,255,255,.35)", paddingBottom: 4, margin: "20px 0 9px" };
    const mainH = { fontSize: 12.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".07em", color: accent, borderBottom: `2px solid ${tint(accent, 0.4)}`, paddingBottom: 4, margin: "18px 0 10px" };
    return (
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,34%) minmax(0,1fr)", minHeight: 980, fontFamily: "var(--sans)", fontSize: 13, lineHeight: 1.5 }}>
        {/* sidebar */}
        <div style={{ background: accent, color: "#fff", padding: "clamp(16px,4%,24px)" }}>
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.15 }}>{name}</div>
          {p.jobTitle && <div style={{ fontSize: 12.5, fontWeight: 600, opacity: 0.92, marginTop: 4 }}>{p.jobTitle}</div>}
          {contact.length > 0 && (<>
            <div style={sideH}>Contact</div>
            <div style={{ display: "grid", gap: 5, fontSize: 12, wordBreak: "break-word" }}>
              {contact.map((c, i) => <div key={i}>{c}</div>)}
            </div>
          </>)}
          {skills.length > 0 && (<>
            <div style={sideH}>Skills</div>
            <div style={{ display: "grid", gap: 5, fontSize: 12 }}>
              {skills.map((s, i) => <div key={i} style={{ display: "flex", gap: 7 }}><span style={{ opacity: 0.7 }}>▪</span><span>{s}</span></div>)}
            </div>
          </>)}
          {hasEdu && (<>
            <div style={sideH}>Education</div>
            {state.education.filter((e) => e.degree || e.school).map((e, i) => (
              <div key={i} style={{ marginBottom: 9, fontSize: 12 }}>
                <div style={{ fontWeight: 700 }}>{e.degree || "Degree"}</div>
                <div style={{ opacity: 0.9 }}>{e.school}{e.year ? ` · ${e.year}` : ""}</div>
                {e.details && <div style={{ opacity: 0.8, fontSize: 11.5 }}>{e.details}</div>}
              </div>
            ))}
          </>)}
          {certs.length > 0 && (<>
            <div style={sideH}>Certifications</div>
            {certs.map((c, i) => <div key={i} style={{ fontSize: 12, marginBottom: 5, opacity: 0.92 }}>{c}</div>)}
          </>)}
        </div>
        {/* main */}
        <div style={{ padding: "clamp(18px,4%,30px)", color: "#1f2937" }}>
          {state.summary && (<><div style={{ ...mainH, marginTop: 4 }}>Summary</div><p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55 }}>{state.summary}</p></>)}
          {hasExp && (<><div style={mainH}>Experience</div><ExpList roleColor="#111827" compColor={accent} dateColor="#6b7280" bulletColor="#374151" /></>)}
          {hasProj && (<><div style={mainH}>Projects</div>{state.projects.filter((x) => x.name || x.description).map((pr, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{pr.name}</div>
              {pr.description && <div style={{ fontSize: 13, color: "#374151" }}>{pr.description}</div>}
            </div>
          ))}</>)}
        </div>
      </div>
    );
  }

  function renderTemplate() {
    switch (state.template) {
      case "classic": return renderClassic();
      case "minimal": return renderMinimal();
      case "twocol": return renderTwoCol();
      default: return renderModern();
    }
  }

  /* ---------- reusable form entry card ---------- */
  const entryCard = (title, onRemove, canRemove, children) => (
    <div className="sheet rtb-entry" style={{ padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <strong style={{ fontSize: 13.5, color: "var(--text)" }}>{title}</strong>
        <button type="button" className="btn btn-outline btn-sm" onClick={onRemove} disabled={!canRemove} style={{ opacity: canRemove ? 1 : 0.5 }}>Remove</button>
      </div>
      {children}
    </div>
  );

  const taStyle = { minHeight: 70, fontFamily: "var(--sans)", fontSize: 14 };

  return (
    <div className="tool">
      <style>{`
        .rtb-wrap{display:grid;grid-template-columns:1fr;gap:20px;align-items:start}
        @media(min-width:920px){.rtb-wrap{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.rtb-preview-col{position:sticky;top:16px}}
        .rtb-tpl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
        @media(min-width:560px){.rtb-tpl{grid-template-columns:repeat(4,minmax(0,1fr))}}
        .rtb-tpl-btn{cursor:pointer;text-align:left;padding:0;border:2px solid var(--border-strong);border-radius:var(--radius-sm);background:var(--surface);overflow:hidden;transition:.15s;font-family:var(--sans)}
        .rtb-tpl-btn:hover{border-color:var(--accent)}
        .rtb-tpl-btn.active{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}
        .rtb-swatch{width:28px;height:28px;border-radius:50%;cursor:pointer;border:2px solid #fff;box-shadow:0 0 0 1px var(--border-strong);padding:0}
        .rtb-swatch.active{box-shadow:0 0 0 2px var(--accent)}
        .rtb-page-frame{background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius);padding:clamp(8px,3%,18px);overflow-x:auto}
      `}</style>

      {/* header + actions */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20 }}>Resume &amp; CV Builder</h2>
          <p className="hint" style={{ marginTop: 2 }}>Everything stays in your browser — nothing is uploaded.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" className="btn btn-outline btn-sm" onClick={loadSample}>Load sample</button>
          <button type="button" className="btn btn-outline btn-sm" onClick={clearAll}>Clear</button>
        </div>
      </div>

      {/* template picker */}
      <label className="fld">Choose a template</label>
      <div className="rtb-tpl" style={{ marginBottom: 16 }}>
        {TEMPLATES.map((t) => (
          <button key={t.id} type="button" className={`rtb-tpl-btn${state.template === t.id ? " active" : ""}`} onClick={() => set({ template: t.id })} aria-pressed={state.template === t.id}>
            <MiniSwatch kind={t.id} accent={accent} />
            <div style={{ padding: "7px 10px", fontSize: 12.5, fontWeight: 700, color: state.template === t.id ? "var(--accent)" : "var(--text)" }}>{t.name}</div>
          </button>
        ))}
      </div>

      {/* accent picker */}
      <label className="fld">Accent colour</label>
      <div className="tool-controls" style={{ marginTop: 0 }}>
        {ACCENTS.map((c) => (
          <button key={c} type="button" className={`rtb-swatch${accent.toLowerCase() === c.toLowerCase() ? " active" : ""}`} style={{ background: c }} onClick={() => set({ accent: c })} aria-label={`Accent ${c}`} title={c} />
        ))}
        <label className="chk" style={{ marginLeft: 4 }}>
          Custom
          <input type="color" value={accent} onChange={(e) => set({ accent: e.target.value })} style={{ width: 40, height: 30, padding: 0, border: "1px solid var(--border-strong)", borderRadius: 6, background: "none", cursor: "pointer" }} />
        </label>
      </div>

      {/* two-pane: form + preview */}
      <div className="rtb-wrap" style={{ marginTop: 8 }}>
        {/* ---------------- FORM ---------------- */}
        <div className="rtb-form-col">
          <label className="fld">Personal details</label>
          <div className="grid grid-2" style={{ gap: 10 }}>
            <div><label className="fld">Full name</label><input className="input" value={p.fullName} onChange={(e) => setPersonal("fullName", e.target.value)} placeholder="Ava Sinclair" /></div>
            <div><label className="fld">Job title</label><input className="input" value={p.jobTitle} onChange={(e) => setPersonal("jobTitle", e.target.value)} placeholder="Senior Product Designer" /></div>
            <div><label className="fld">Email</label><input className="input" value={p.email} onChange={(e) => setPersonal("email", e.target.value)} placeholder="you@email.com" /></div>
            <div><label className="fld">Phone</label><input className="input" value={p.phone} onChange={(e) => setPersonal("phone", e.target.value)} placeholder="+1 (000) 000-0000" /></div>
            <div><label className="fld">Location</label><input className="input" value={p.location} onChange={(e) => setPersonal("location", e.target.value)} placeholder="City, Country" /></div>
            <div><label className="fld">Website / portfolio</label><input className="input" value={p.website} onChange={(e) => setPersonal("website", e.target.value)} placeholder="yoursite.com" /></div>
          </div>

          <label className="fld" style={{ marginTop: 16 }}>Professional summary</label>
          <textarea className="textarea" style={taStyle} value={state.summary} onChange={(e) => set({ summary: e.target.value })} placeholder="A punchy 2–3 sentence pitch about who you are and what you do best." />
          <p className="hint">Keep it to 2–3 strong sentences.</p>

          {/* Experience */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
            <label className="fld" style={{ marginBottom: 0 }}>Work experience</label>
            <button type="button" className="btn btn-sm" onClick={() => addItem("experience", makeExp)}>+ Add role</button>
          </div>
          {state.experience.map((e, i) => entryCard(`Experience ${i + 1}`, () => removeItem("experience", i), state.experience.length > 1, (
            <>
              <div className="grid grid-2" style={{ gap: 10 }}>
                <div><label className="fld">Role / title</label><input className="input" value={e.role} onChange={(ev) => updateItem("experience", i, { role: ev.target.value })} placeholder="Product Designer" /></div>
                <div><label className="fld">Company</label><input className="input" value={e.company} onChange={(ev) => updateItem("experience", i, { company: ev.target.value })} placeholder="Northwind Labs" /></div>
                <div><label className="fld">Location</label><input className="input" value={e.location} onChange={(ev) => updateItem("experience", i, { location: ev.target.value })} placeholder="Remote" /></div>
                <div className="grid grid-2" style={{ gap: 8 }}>
                  <div><label className="fld">Start</label><input className="input" value={e.start} onChange={(ev) => updateItem("experience", i, { start: ev.target.value })} placeholder="2021" /></div>
                  <div><label className="fld">End</label><input className="input" value={e.end} disabled={e.current} onChange={(ev) => updateItem("experience", i, { end: ev.target.value })} placeholder="2023" style={{ opacity: e.current ? 0.5 : 1 }} /></div>
                </div>
              </div>
              <label className="chk" style={{ marginTop: 8 }}>
                <input type="checkbox" checked={e.current} onChange={(ev) => updateItem("experience", i, { current: ev.target.checked })} /> I currently work here
              </label>
              <label className="fld" style={{ marginTop: 10 }}>Achievements</label>
              <textarea className="textarea" style={taStyle} value={e.bullets} onChange={(ev) => updateItem("experience", i, { bullets: ev.target.value })} placeholder={"Led the dashboard redesign, lifting completion 34%\nMentored 4 junior designers"} />
              <p className="hint">One achievement per line — each becomes a bullet.</p>
            </>
          )))}

          {/* Education */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
            <label className="fld" style={{ marginBottom: 0 }}>Education</label>
            <button type="button" className="btn btn-sm" onClick={() => addItem("education", makeEdu)}>+ Add school</button>
          </div>
          {state.education.map((e, i) => entryCard(`Education ${i + 1}`, () => removeItem("education", i), state.education.length > 1, (
            <>
              <div className="grid grid-2" style={{ gap: 10 }}>
                <div><label className="fld">Degree / qualification</label><input className="input" value={e.degree} onChange={(ev) => updateItem("education", i, { degree: ev.target.value })} placeholder="B.F.A. Interaction Design" /></div>
                <div><label className="fld">School</label><input className="input" value={e.school} onChange={(ev) => updateItem("education", i, { school: ev.target.value })} placeholder="RISD" /></div>
                <div><label className="fld">Year</label><input className="input" value={e.year} onChange={(ev) => updateItem("education", i, { year: ev.target.value })} placeholder="2016" /></div>
                <div><label className="fld">Details (optional)</label><input className="input" value={e.details} onChange={(ev) => updateItem("education", i, { details: ev.target.value })} placeholder="Graduated with honours" /></div>
              </div>
            </>
          )))}

          {/* Skills */}
          <label className="fld" style={{ marginTop: 18 }}>Skills</label>
          <textarea className="textarea" style={taStyle} value={state.skills} onChange={(e) => set({ skills: e.target.value })} placeholder="Figma, Design Systems, Prototyping, Accessibility" />
          <p className="hint">Separate with commas or new lines.</p>

          {/* Projects */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
            <label className="fld" style={{ marginBottom: 0 }}>Projects <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
            <button type="button" className="btn btn-sm" onClick={() => addItem("projects", makeProj)}>+ Add project</button>
          </div>
          {state.projects.length === 0 && <p className="hint">No projects yet — add one to showcase side work, talks or open source.</p>}
          {state.projects.map((pr, i) => entryCard(`Project ${i + 1}`, () => removeItem("projects", i), true, (
            <>
              <div><label className="fld">Name</label><input className="input" value={pr.name} onChange={(ev) => updateItem("projects", i, { name: ev.target.value })} placeholder="Open Palette" /></div>
              <label className="fld" style={{ marginTop: 10 }}>Description</label>
              <textarea className="textarea" style={taStyle} value={pr.description} onChange={(ev) => updateItem("projects", i, { description: ev.target.value })} placeholder="An open-source accessible colour-contrast toolkit." />
            </>
          )))}

          {/* Certifications */}
          <label className="fld" style={{ marginTop: 18 }}>Certifications <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional)</span></label>
          <textarea className="textarea" style={taStyle} value={state.certifications} onChange={(e) => set({ certifications: e.target.value })} placeholder={"CPACC — 2022\nGoogle UX Design Certificate — 2020"} />
          <p className="hint">One per line.</p>
        </div>

        {/* ---------------- PREVIEW ---------------- */}
        <div className="rtb-preview-col">
          <label className="fld">Live preview</label>
          <div className="rtb-page-frame">
            <div ref={previewRef} style={{ width: "100%", maxWidth: 720, margin: "0 auto", background: "#ffffff", color: "#111827", minHeight: 980, boxShadow: "var(--shadow)", borderRadius: 6, overflow: "hidden" }}>
              {renderTemplate()}
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button type="button" className="btn" onClick={downloadPdf} disabled={busy} style={{ fontSize: 15.5, padding: "12px 26px" }}>
              {busy ? "Generating…" : "⬇ Download PDF"}
            </button>
          </div>
          {err ? <p className="hint" style={{ color: "#b91c1c", textAlign: "center", fontWeight: 600 }}>{err}</p>
            : <p className="hint" style={{ textAlign: "center" }}>Exports a print-ready A4 PDF. Auto-saved as you type.</p>}
        </div>
      </div>
    </div>
  );
}

export default ResumeTemplateBuilder;
