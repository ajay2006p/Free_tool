"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";
import { buildResumePdf, downloadBytes } from "../../lib/pdf";

/* ---------------- Salary Calculator ---------------- */
export function SalaryCalculator() {
  const [annual, setAnnual] = useState(60000);
  const [tax, setTax] = useState(20);
  const [hours, setHours] = useState(40);
  const net = annual * (1 - tax / 100);
  const rows = [
    ["Gross yearly", annual],
    ["Net yearly (after tax)", net],
    ["Net monthly", net / 12],
    ["Net weekly", net / 52],
    ["Gross hourly", annual / (hours * 52)],
  ];
  const money = (n) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return (
    <div className="tool">
      <div className="tool-controls">
        <label className="chk">Annual salary <input className="input" style={{ width: 130 }} type="number" value={annual} onChange={(e) => setAnnual(Number(e.target.value) || 0)} /></label>
        <label className="chk">Tax % <input className="input" style={{ width: 80 }} type="number" value={tax} onChange={(e) => setTax(Number(e.target.value) || 0)} /></label>
        <label className="chk">Hours/week <input className="input" style={{ width: 80 }} type="number" value={hours} onChange={(e) => setHours(Number(e.target.value) || 40)} /></label>
      </div>
      <div className="grid grid-2" style={{ gap: 10 }}>
        {rows.map(([label, val]) => (
          <div key={label} className="sheet flex-between" style={{ padding: "12px 16px" }}><span className="muted">{label}</span><strong style={{ fontSize: 18 }}>{money(val)}</strong></div>
        ))}
      </div>
      <p className="hint">Estimate only — tax is a flat rate, not real bracket calculations.</p>
    </div>
  );
}

/* ---------------- Cover Letter Builder ---------------- */
export function CoverLetterBuilder() {
  const [f, setF] = useState({ name: "Your Name", role: "Frontend Developer", company: "Acme Inc", skill: "React, TypeScript and building fast UIs", why: "your focus on great user experience" });
  const up = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const letter = `Dear Hiring Manager at ${f.company},

I'm excited to apply for the ${f.role} position. With strong experience in ${f.skill}, I'm confident I can make an immediate impact on your team.

What draws me to ${f.company} is ${f.why}. I thrive in environments where I can solve real problems, ship quickly, and keep learning — and I believe this role is a great match for my skills and ambitions.

I'd welcome the chance to discuss how I can contribute. Thank you for your time and consideration.

Sincerely,
${f.name}`;
  return (
    <div className="tool">
      <div className="grid grid-2" style={{ gap: 14 }}>
        <div><label className="fld">Your name</label><input className="input" value={f.name} onChange={(e) => up("name", e.target.value)} /></div>
        <div><label className="fld">Role</label><input className="input" value={f.role} onChange={(e) => up("role", e.target.value)} /></div>
        <div><label className="fld">Company</label><input className="input" value={f.company} onChange={(e) => up("company", e.target.value)} /></div>
        <div><label className="fld">Key skills</label><input className="input" value={f.skill} onChange={(e) => up("skill", e.target.value)} /></div>
      </div>
      <label className="fld" style={{ marginTop: 12 }}>Why this company</label>
      <input className="input" value={f.why} onChange={(e) => up("why", e.target.value)} />
      <label className="fld" style={{ marginTop: 16 }}>Your cover letter <CopyButton value={letter} /></label>
      <textarea className="textarea" style={{ fontFamily: "var(--serif)", minHeight: 260 }} readOnly value={letter} />
    </div>
  );
}

/* ---------------- Resume Builder ---------------- */
export function ResumeBuilder() {
  const [f, setF] = useState({
    name: "Ada Lovelace", title: "Software Engineer", email: "ada@example.com", phone: "+1 555 0100",
    location: "London, UK", summary: "Engineer with 5 years building web apps.",
    skills: "JavaScript, React, Node.js, SQL, Docker",
    experience: "Senior Engineer — Acme (2022–now)\nBuilt the design system and cut load time 40%.\n\nEngineer — Globex (2019–2022)\nShipped the billing platform used by 10k users.",
    education: "BSc Computer Science — University of London (2019)",
  });
  const up = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function download() {
    setBusy(true); setErr("");
    try {
      const bytes = await buildResumePdf(f);
      const fname = (f.name || "resume").trim().replace(/[^a-z0-9]+/gi, "-").toLowerCase() + "-resume.pdf";
      downloadBytes(bytes, fname);
    } catch (e) { setErr("Could not create the PDF. Please try again."); }
    finally { setBusy(false); }
  }
  return (
    <div className="tool">
      <div className="tool-io">
        <div>
          <div className="grid grid-2" style={{ gap: 10 }}>
            <div><label className="fld">Name</label><input className="input" value={f.name} onChange={(e) => up("name", e.target.value)} /></div>
            <div><label className="fld">Title</label><input className="input" value={f.title} onChange={(e) => up("title", e.target.value)} /></div>
            <div><label className="fld">Email</label><input className="input" value={f.email} onChange={(e) => up("email", e.target.value)} /></div>
            <div><label className="fld">Phone</label><input className="input" value={f.phone} onChange={(e) => up("phone", e.target.value)} /></div>
          </div>
          <label className="fld" style={{ marginTop: 10 }}>Location</label><input className="input" value={f.location} onChange={(e) => up("location", e.target.value)} />
          <label className="fld" style={{ marginTop: 10 }}>Summary</label><textarea className="textarea" style={{ minHeight: 70, fontFamily: "var(--sans)" }} value={f.summary} onChange={(e) => up("summary", e.target.value)} />
          <label className="fld" style={{ marginTop: 10 }}>Skills</label><input className="input" value={f.skills} onChange={(e) => up("skills", e.target.value)} />
          <label className="fld" style={{ marginTop: 10 }}>Experience</label><textarea className="textarea" style={{ minHeight: 120, fontFamily: "var(--sans)" }} value={f.experience} onChange={(e) => up("experience", e.target.value)} />
          <label className="fld" style={{ marginTop: 10 }}>Education</label><textarea className="textarea" style={{ minHeight: 60, fontFamily: "var(--sans)" }} value={f.education} onChange={(e) => up("education", e.target.value)} />
        </div>
        <div>
          <label className="fld">Live preview</label>
          <div className="sheet" style={{ padding: 22, fontFamily: "var(--serif)" }}>
            <h2 style={{ margin: 0, fontSize: 26 }}>{f.name}</h2>
            <div className="muted" style={{ fontFamily: "var(--sans)", fontSize: 13 }}>{f.title} · {f.email} · {f.phone} · {f.location}</div>
            <h3 style={{ fontSize: 15, textTransform: "uppercase", borderBottom: "1px solid var(--line)", marginTop: 16 }}>Summary</h3><p style={{ fontSize: 15 }}>{f.summary}</p>
            <h3 style={{ fontSize: 15, textTransform: "uppercase", borderBottom: "1px solid var(--line)" }}>Skills</h3><p style={{ fontSize: 15 }}>{f.skills}</p>
            <h3 style={{ fontSize: 15, textTransform: "uppercase", borderBottom: "1px solid var(--line)" }}>Experience</h3><p style={{ fontSize: 15, whiteSpace: "pre-wrap" }}>{f.experience}</p>
            <h3 style={{ fontSize: 15, textTransform: "uppercase", borderBottom: "1px solid var(--line)" }}>Education</h3><p style={{ fontSize: 15, whiteSpace: "pre-wrap" }}>{f.education}</p>
          </div>
          <div className="center mt-2">
            <button className="btn" onClick={download} disabled={busy}>{busy ? "Creating PDF…" : "⬇ Download PDF"}</button>
            {err ? <div className="notice notice-warn" style={{ marginTop: 10 }}>{err}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
