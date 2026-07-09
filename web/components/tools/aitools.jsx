"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";

/* ============================================================
   AI-style generator tools — 100% client-side, no API keys.
   Output is produced from rich word banks + varied templates
   with randomized selection so "Regenerate" changes results.
   IMPORTANT: no Math.random() during render (SSR-safe) — all
   randomness runs only inside click handlers, stored in state.
   ============================================================ */

/* ---------------- shared helpers ---------------- */
const rnd = (n) => Math.floor(Math.random() * n);
const pick = (a) => a[rnd(a.length)];
function shuffle(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = rnd(i + 1);
    const t = b[i];
    b[i] = b[j];
    b[j] = t;
  }
  return b;
}
const sample = (a, n) => shuffle(a).slice(0, n);
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const lc = (s) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);
const fill = (str, m) => str.replace(/\{(\w+)\}/g, (_, k) => (m[k] != null ? String(m[k]) : ""));
const clean = (s) => (s || "").trim();
const sanitizeFile = (s) => (clean(s) || "download").replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();

function downloadTxt(name, text) {
  if (typeof document === "undefined") return;
  try {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  } catch (e) {}
}

/* Fix casing on common brand / acronym terms so output looks polished. */
const TERMS = {
  instagram: "Instagram", facebook: "Facebook", twitter: "Twitter", linkedin: "LinkedIn",
  tiktok: "TikTok", youtube: "YouTube", pinterest: "Pinterest", snapchat: "Snapchat",
  seo: "SEO", sem: "SEM", crm: "CRM", cms: "CMS", kpi: "KPI", kpis: "KPIs", roi: "ROI",
  saas: "SaaS", b2b: "B2B", b2c: "B2C", api: "API", apis: "APIs", ui: "UI", ux: "UX",
  ai: "AI", sql: "SQL", aws: "AWS", ceo: "CEO", cfo: "CFO", hr: "HR", qa: "QA",
  ppc: "PPC", ga: "GA", google: "Google", shopify: "Shopify", wordpress: "WordPress",
};
function titleizeTerms(s) {
  return s.replace(/\b([a-z]+)\b/gi, (w) => {
    const hit = TERMS[w.toLowerCase()];
    return hit || w;
  });
}

/* ---------------- shared UI bits ---------------- */
function ToolHead({ icon, title, sub }) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 12, padding: "13px 16px",
        borderRadius: "var(--radius)", background: "linear-gradient(135deg,var(--accent),var(--accent-2))",
        color: "#fff", marginBottom: 16, boxShadow: "var(--shadow)",
      }}
    >
      <span style={{ fontSize: 26, lineHeight: 1 }} aria-hidden>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.01em" }}>{title}</div>
        {sub ? <div style={{ fontSize: 12.5, opacity: 0.9 }}>{sub}</div> : null}
      </div>
    </div>
  );
}

const genBtnStyle = { background: "linear-gradient(135deg,var(--accent),var(--accent-2))", border: "none", color: "#fff" };

function OutRow({ text }) {
  return (
    <div className="sheet" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "11px 14px" }}>
      <span style={{ fontSize: 14.5, lineHeight: 1.45 }}>{text}</span>
      <CopyButton value={text} />
    </div>
  );
}

/* Clickable chip that copies its own text (SSR-guarded). */
function CopyChip({ text }) {
  const [ok, setOk] = useState(false);
  async function copy() {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 1000);
      }
    } catch (e) {}
  }
  return (
    <button type="button" className="chip" style={{ cursor: "pointer", fontSize: 14 }} onClick={copy}>
      {text}
      <span style={{ color: ok ? "var(--green)" : "var(--muted)", fontWeight: 700, marginLeft: 4 }}>{ok ? "✓" : "⧉"}</span>
    </button>
  );
}

/* ============================================================
   1. AI COVER LETTER
   ============================================================ */
const CL_TONE = {
  Professional: {
    greet: ["Dear Hiring Manager,", "Dear {company} Hiring Team,", "Dear Hiring Committee,"],
    hook: [
      "I am writing to express my strong interest in the {role} position at {company}. With a track record of delivering results and a commitment to excellence, I am confident that my background aligns closely with what your team is seeking.",
      "Please accept my application for the {role} role at {company}. My experience has prepared me to make a meaningful contribution from day one, and I would be glad to bring that same dedication to your organization.",
      "I am excited to submit my application for the {role} position at {company}. I believe my skills and professional experience make me a strong fit for this opportunity and for the goals of your team.",
    ],
    bodyOpen: [
      "Throughout my career, I have focused on delivering measurable results while continually raising the standard of my work.",
      "In every role I have held, I have prioritized quality, reliability, and a proactive approach to solving problems.",
    ],
    bridge: [
      "Beyond my qualifications, I am drawn to {company} for its reputation and the impact its team continues to make, and I would be proud to contribute to that momentum.",
      "What draws me to {company} in particular is the opportunity to apply my strengths to work that genuinely matters, alongside a team known for its high standards.",
    ],
    close: [
      "I would welcome the opportunity to discuss how my background can support {company}'s continued success. Thank you for your time and consideration.",
      "I would appreciate the chance to speak further about how I can contribute to your team. Thank you for considering my application.",
    ],
    signoff: ["Sincerely,", "Best regards,", "Respectfully,"],
  },
  Enthusiastic: {
    greet: ["Dear {company} Team,", "Hello {company} Hiring Team,", "Dear Hiring Team,"],
    hook: [
      "The moment I saw the {role} opening at {company}, I knew I had to apply. This is exactly the kind of role where I can pour my energy and skills into work I genuinely care about.",
      "I am thrilled to apply for the {role} position at {company}! Everything about this opportunity — the team, the mission, and the work itself — lines up with where I want to take my career.",
      "I could not be more excited to submit my application for the {role} role at {company}. This is precisely the kind of opportunity I have been hoping to find.",
    ],
    bodyOpen: [
      "I bring not only the right skills but a real passion for doing work that makes a difference.",
      "What I offer is a rare mix of capability and genuine enthusiasm for the craft.",
    ],
    bridge: [
      "What excites me most about {company} is the chance to be part of something I truly believe in — and to grow alongside a team that clearly cares about doing great work.",
      "I have followed {company} for a while now, and the idea of contributing to what you are building genuinely energizes me.",
    ],
    close: [
      "I would love the chance to bring my energy to {company} and to talk more about how I can help. Thank you so much for considering my application!",
      "I cannot wait to hear about the next steps, and I would be delighted to discuss how I can contribute. Thank you for your time!",
    ],
    signoff: ["With enthusiasm,", "Warmly,", "With appreciation,"],
  },
  Confident: {
    greet: ["Dear Hiring Manager,", "Dear {company} Hiring Team,", "To the {company} Team,"],
    hook: [
      "When it comes to the {role} position at {company}, I am confident I am the candidate you have been looking for. I bring the skills, drive, and results-focused mindset this role demands.",
      "I am applying for the {role} role at {company} because I know I can deliver exactly the kind of impact your team needs.",
      "The {role} position at {company} is a natural fit for my strengths, and I am confident I can start adding value right away.",
    ],
    bodyOpen: [
      "I do not simply meet the requirements for this role — I have consistently exceeded them.",
      "I have built my career on taking ownership and delivering outcomes others can count on.",
    ],
    bridge: [
      "I have done my research on {company}, and I am certain my strengths line up with exactly what your team needs to keep moving forward.",
      "I know what it takes to succeed in a role like this, and I am confident I can bring that same level of performance to {company}.",
    ],
    close: [
      "I am confident I can hit the ground running at {company}, and I would welcome the chance to show you how. Thank you for your consideration.",
      "I am ready to make an immediate impact, and I would be glad to discuss how. Thank you for your time and consideration.",
    ],
    signoff: ["Best regards,", "Sincerely,", "With confidence,"],
  },
  Friendly: {
    greet: ["Hi there,", "Hello {company} Team,", "Hi {company} Team,"],
    hook: [
      "I would love to be considered for the {role} position at {company}. From everything I have learned about your team, it feels like a place where I could do my best work and genuinely enjoy the journey.",
      "When I came across the {role} opening at {company}, it immediately caught my eye — it is exactly the kind of role I have been hoping to find.",
      "I am reaching out because I would really love to join {company} as your next {role}. It seems like a wonderful fit on both sides.",
    ],
    bodyOpen: [
      "Here is a little about what I would bring to the team:",
      "Here is why I think we would be a great match:",
    ],
    bridge: [
      "On top of all that, {company} just feels like the right fit — the kind of team I would be proud to be part of and learn from every day.",
      "More than anything, I love the idea of working somewhere like {company}, where the people and the mission both feel worth showing up for.",
    ],
    close: [
      "I would really enjoy the chance to chat about how I can help the team at {company}. Thanks so much for taking the time to read my letter!",
      "I would love to talk more whenever works for you. Thank you so much for considering me — I hope we get the chance to connect!",
    ],
    signoff: ["Warm regards,", "All the best,", "Cheers,"],
  },
};

const CL_LEADINS = [
  "One accomplishment I am especially proud of",
  "A highlight from my experience",
  "To offer a concrete example",
  "Among my core strengths",
  "Something I bring to every role",
  "A recent win worth mentioning",
  "One area where I consistently deliver",
  "A skill I have sharpened over the years",
];

function buildCoverLetter(f) {
  const t = CL_TONE[f.tone] || CL_TONE.Professional;
  const map = {
    role: clean(f.role) || "the role",
    company: clean(f.company) || "your company",
    name: clean(f.name) || "Your Name",
  };
  const skills = clean(f.skills)
    .split("\n")
    .map((s) => s.trim().replace(/[.\s]+$/, ""))
    .filter(Boolean);

  const leads = shuffle(CL_LEADINS);
  let skillSentences;
  if (skills.length) {
    skillSentences = skills.map((s, i) => `${leads[i % leads.length]}: ${s}.`);
  } else {
    skillSentences = ["I bring a strong work ethic, quick adaptability, and a genuine drive to deliver results."];
  }
  const splitAt = Math.ceil(skillSentences.length / 2);
  const para1Skills = skillSentences.slice(0, splitAt).join(" ");
  const para2Skills = skillSentences.slice(splitAt).join(" ");

  const greeting = fill(pick(t.greet), map);
  const hook = fill(pick(t.hook), map);
  const bodyOpen = pick(t.bodyOpen);
  const bridge = fill(pick(t.bridge), map);
  const close = fill(pick(t.close), map);
  const signoff = pick(t.signoff);

  const paraA = `${bodyOpen} ${para1Skills}`.trim();
  const paraB = (para2Skills ? `${para2Skills} ${bridge}` : bridge).trim();

  return [greeting, "", hook, "", paraA, "", paraB, "", close, "", signoff, map.name].join("\n");
}

export function AiCoverLetter() {
  const [f, setF] = useState({
    name: "Alex Morgan",
    role: "Marketing Manager",
    company: "Nordic Labs",
    skills: "Grew organic traffic by 140% in 12 months\nLed a team of 5 across two product launches\nBuilt data-driven campaigns that lifted conversion 32%",
    tone: "Professional",
  });
  const [out, setOut] = useState("");
  const up = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const gen = () => setOut(buildCoverLetter(f));

  return (
    <div className="tool">
      <ToolHead icon="✍️" title="AI Cover Letter Writer" sub="A polished, tailored letter in seconds — click Regenerate for a fresh take." />
      <div className="grid grid-2" style={{ gap: 12 }}>
        <div><label className="fld">Your name</label><input className="input" value={f.name} onChange={(e) => up("name", e.target.value)} /></div>
        <div><label className="fld">Job title you are applying for</label><input className="input" value={f.role} onChange={(e) => up("role", e.target.value)} /></div>
        <div><label className="fld">Company</label><input className="input" value={f.company} onChange={(e) => up("company", e.target.value)} /></div>
        <div>
          <label className="fld">Tone</label>
          <select className="select" value={f.tone} onChange={(e) => up("tone", e.target.value)}>
            <option>Professional</option><option>Enthusiastic</option><option>Confident</option><option>Friendly</option>
          </select>
        </div>
      </div>
      <label className="fld" style={{ marginTop: 12 }}>Key skills / achievements (one per line)</label>
      <textarea className="textarea" style={{ minHeight: 110, fontFamily: "var(--sans)" }} value={f.skills} onChange={(e) => up("skills", e.target.value)} />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
        <button className="btn" style={genBtnStyle} onClick={gen}>{out ? "↻ Regenerate letter" : "✨ Generate letter"}</button>
        {out ? <CopyButton value={out} label="Copy letter" /> : null}
        {out ? <button className="btn btn-outline btn-sm" onClick={() => downloadTxt(sanitizeFile(f.name) + "-cover-letter.txt", out)}>⬇ Download .txt</button> : null}
      </div>
      {out ? (
        <div className="sheet" style={{ marginTop: 14, padding: 22, fontFamily: "var(--serif)", fontSize: 15.5, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{out}</div>
      ) : (
        <p className="hint" style={{ marginTop: 12 }}>Fill in the fields above and hit Generate. Every click produces a freshly worded letter.</p>
      )}
    </div>
  );
}

/* ============================================================
   2. RESUME BULLET GENERATOR
   ============================================================ */
const RB_VERBS = {
  "Entry-level": ["Coordinated", "Executed", "Delivered", "Maintained", "Built", "Developed", "Organized", "Managed", "Produced", "Handled", "Improved", "Streamlined", "Launched", "Implemented", "Supported"],
  "Mid-level": ["Managed", "Led", "Built", "Developed", "Streamlined", "Optimized", "Improved", "Delivered", "Launched", "Drove", "Boosted", "Coordinated", "Implemented", "Owned", "Executed", "Revamped"],
  "Senior": ["Spearheaded", "Drove", "Led", "Orchestrated", "Architected", "Streamlined", "Optimized", "Scaled", "Launched", "Delivered", "Transformed", "Established", "Directed", "Championed", "Accelerated"],
  "Leadership": ["Spearheaded", "Orchestrated", "Directed", "Championed", "Pioneered", "Drove", "Led", "Established", "Transformed", "Scaled", "Mobilized", "Oversaw", "Steered", "Founded", "Galvanized"],
};

const RB_TEMPLATES = [
  (v, o) => `${v} ${o}`,
  (v, o, s) => `${v} and ${s} ${o}`,
  (v, o) => `${v} ${o} from the ground up`,
  (v, o) => `${v} ${o} end to end`,
  (v, o) => `${v} ${o} to support key business objectives`,
  (v, o) => `${v} ${o}, consistently delivering high-quality results`,
  (v, o) => `${v} ${o} in a fast-paced, deadline-driven environment`,
  (v, o) => `${v} ${o} while improving efficiency and consistency`,
  (v, o) => `${v} ${o} across multiple teams and stakeholders`,
  (v, o) => `${v} ${o} with a focus on measurable impact`,
];

function normalizeDuty(raw) {
  let d = clean(raw).replace(/[.]+$/, "");
  if (!d) return "";
  const low = d.toLowerCase();
  const fillers = ["was responsible for", "responsible for", "in charge of", "tasked with", "duties included", "duty included", "helped to", "helped with", "worked on", "worked as", "assisted with", "was tasked with", "role involved", "job was to"];
  for (const p of fillers) {
    if (low.startsWith(p)) { d = d.slice(p.length).trim(); break; }
  }
  const verbs = ["managed", "handled", "oversaw", "led", "ran", "did", "created", "built", "made", "developed", "coordinated", "maintained", "organized", "produced", "executed", "delivered", "supported", "assisted", "worked", "improved", "launched", "designed"];
  const parts = d.split(/\s+/);
  if (parts.length > 1 && verbs.includes(parts[0].toLowerCase())) d = parts.slice(1).join(" ");
  d = lc(d);
  d = titleizeTerms(d);
  return d.trim();
}

function metricFragment(metric) {
  const m = clean(metric).replace(/[.]+$/, "");
  if (!m) return "";
  const numeric = /^[$£€]?\d/.test(m) || /^\d/.test(m);
  const opts = numeric
    ? [`, delivering ${m}`, `, driving ${m}`, `, resulting in ${m}`, `, achieving ${m}`, ` (${m})`]
    : [` — ${m}`, `, ${lc(m)}`, ` and ${lc(m)}`];
  return pick(opts);
}

function buildBullets(f) {
  const obj = normalizeDuty(f.duty) || "core team responsibilities";
  const pool = RB_VERBS[f.seniority] || RB_VERBS["Mid-level"];
  const verbs = sample(pool, 8);
  const templates = shuffle(RB_TEMPLATES);
  const secondary = ["streamlined", "enhanced", "refined", "optimized", "improved", "modernized"];
  const hasMetric = !!clean(f.metric);

  return verbs.map((v, i) => {
    const tpl = templates[i % templates.length];
    const sec = pick(secondary.filter((x) => x !== v.toLowerCase())) || "enhanced";
    let base = tpl(v, obj, sec);
    // add metric to most bullets when provided, but not every single one (feels natural)
    if (hasMetric && (i % 4 !== 3)) base += metricFragment(f.metric);
    return base.replace(/\s+/g, " ").trim() + ".";
  });
}

export function ResumeBulletGenerator() {
  const [f, setF] = useState({ duty: "managed the company instagram account", metric: "grew followers by 200%", seniority: "Mid-level" });
  const [bullets, setBullets] = useState([]);
  const up = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const gen = () => setBullets(buildBullets(f));
  const allText = bullets.map((b) => "• " + b).join("\n");

  return (
    <div className="tool">
      <ToolHead icon="📄" title="Resume Bullet Generator" sub="Turn a plain duty into 8 achievement-driven bullet points." />
      <div className="grid grid-2" style={{ gap: 12 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label className="fld">Task or duty (plain description)</label>
          <input className="input" value={f.duty} onChange={(e) => up("duty", e.target.value)} placeholder="e.g. managed the company instagram" />
        </div>
        <div><label className="fld">Metric / result (optional)</label><input className="input" value={f.metric} onChange={(e) => up("metric", e.target.value)} placeholder="e.g. 200% follower growth" /></div>
        <div>
          <label className="fld">Seniority</label>
          <select className="select" value={f.seniority} onChange={(e) => up("seniority", e.target.value)}>
            <option>Entry-level</option><option>Mid-level</option><option>Senior</option><option>Leadership</option>
          </select>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
        <button className="btn" style={genBtnStyle} onClick={gen}>{bullets.length ? "↻ Regenerate bullets" : "✨ Generate bullets"}</button>
        {bullets.length ? <CopyButton value={allText} label="Copy all" /> : null}
      </div>
      {bullets.length ? (
        <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
          {bullets.map((b, i) => <OutRow key={i} text={b} />)}
        </div>
      ) : (
        <p className="hint" style={{ marginTop: 12 }}>Describe a task and hit Generate for 8 polished, action-led bullets. Add a metric to make them even stronger.</p>
      )}
    </div>
  );
}

/* ============================================================
   3. AI EMAIL WRITER
   ============================================================ */
const EMAIL_TYPES = {
  "Follow-up after interview": {
    subject: ["Thank you for your time today", "Following up on our conversation", "Great speaking with you", "Thank you — following up on our interview"],
    open: [
      "Thank you so much for taking the time to meet with me. I really enjoyed our conversation and came away even more excited about the opportunity.",
      "I wanted to reach out and thank you for the chance to interview. It was great to learn more about the team and the role.",
      "Thank you again for meeting with me. Our discussion reinforced just how enthusiastic I am about this position.",
    ],
    lead: ["A few things stood out that I wanted to reiterate:", "Reflecting on our conversation, here is what excites me most:", "I especially wanted to follow up on a couple of points:"],
    close: [
      "Please don't hesitate to reach out if there is anything else I can provide. I look forward to hearing about the next steps.",
      "Thank you again for your time and consideration — I look forward to staying in touch.",
    ],
  },
  "Job application": {
    subject: ["Application for your open role", "Excited to apply to your team", "My application — enclosed", "Interested in joining your team"],
    open: [
      "I am writing to submit my application and to express my genuine interest in joining your team.",
      "I would love to be considered for your open role. I believe my background is a strong match for what you are looking for.",
      "Please accept this message and my attached resume as my application for the position.",
    ],
    lead: ["A few reasons I believe I am a great fit:", "Here is what I would bring to the role:", "In particular, I would like to highlight:"],
    close: [
      "I would welcome the chance to discuss how I can contribute. Thank you for your time and consideration.",
      "I have attached my resume for your review and would be glad to share more. Thank you for considering my application.",
    ],
  },
  "Meeting request": {
    subject: ["Request to connect", "Quick meeting request", "Could we find time to chat?", "Scheduling a time to meet"],
    open: [
      "I hope this message finds you well. I would like to request a short meeting to discuss a few items.",
      "I am reaching out to see whether we could set up a brief call in the coming days.",
      "I hope you are doing well. I would value the chance to connect for a short conversation.",
    ],
    lead: ["Specifically, I would love to cover:", "Here is what I would like to discuss:", "A few topics I hope we can walk through:"],
    close: [
      "Please let me know what times work best for you, and I will gladly work around your schedule.",
      "I am happy to meet whenever is convenient — just point me to a time that suits you.",
    ],
  },
  "Apology": {
    subject: ["My sincere apologies", "Apology and a path forward", "I owe you an apology", "Following up with an apology"],
    open: [
      "I want to sincerely apologize for the inconvenience this has caused. Please know that I take full responsibility.",
      "I am reaching out to offer my genuine apologies. I understand the impact this had, and I am sorry.",
      "Please accept my heartfelt apology. This should not have happened, and I want to make it right.",
    ],
    lead: ["Here is what happened and how I plan to make it right:", "To be transparent, here are the details:", "A few notes on next steps:"],
    close: [
      "Thank you for your patience and understanding. I am committed to making this right.",
      "I truly value our relationship and will do everything I can to regain your trust. Thank you.",
    ],
  },
  "Thank-you": {
    subject: ["Thank you!", "A heartfelt thank you", "Grateful for your support", "Thank you so much"],
    open: [
      "I just wanted to take a moment to say thank you. Your support genuinely made a difference.",
      "I am writing simply to express my gratitude. I truly appreciate everything you have done.",
      "Thank you — I do not say it often enough, and I wanted you to know how much it meant.",
    ],
    lead: ["In particular, I am grateful for:", "A few things I especially want to thank you for:", "I wanted to call out specifically:"],
    close: [
      "Thank you again — it truly means a lot. I look forward to staying in touch.",
      "With heartfelt thanks, I hope I can return the kindness one day soon.",
    ],
  },
  "Resignation": {
    subject: ["Notice of resignation", "Formal resignation notice", "Moving on — formal notice", "Resignation letter"],
    open: [
      "Please accept this message as formal notice of my resignation. This was not an easy decision, and I am grateful for the opportunities I have had here.",
      "I am writing to let you know that I will be resigning from my position. I have valued my time here immensely.",
      "After careful thought, I have decided to move on from my role. I wanted to share this with you directly and respectfully.",
    ],
    lead: ["A few notes as I transition out:", "To ensure a smooth handover, here is my plan:", "Some details to help with the transition:"],
    close: [
      "I am committed to ensuring a smooth handover and will do everything I can to support the team during this transition. Thank you for everything.",
      "I leave with only gratitude and wish the team continued success. Thank you for the support and mentorship.",
    ],
  },
  "Sales outreach": {
    subject: ["A quick idea for {recipient}", "Thought this might help", "Worth a quick chat?", "An idea for your team"],
    open: [
      "I will keep this brief. I reached out because I believe there is a real opportunity to help you and your team.",
      "I hope you don't mind the direct message — I think we may be able to make your work a little easier.",
      "I will get straight to the point: I have an idea that could be genuinely valuable for you.",
    ],
    lead: ["Here is how we could help:", "A few ways this could add value for you:", "In short, here is what we bring:"],
    close: [
      "Would you be open to a quick 15-minute call this week? I would love to learn more about your goals.",
      "If this sounds worth exploring, I am happy to share a few specifics. No pressure at all.",
    ],
  },
  "Networking intro": {
    subject: ["Great to connect", "Reaching out to introduce myself", "Would love to connect", "Hello — a quick introduction"],
    open: [
      "I hope you don't mind the cold message. I have been following your work and wanted to introduce myself.",
      "I am reaching out to connect — your background really stood out to me, and I would love to learn from your experience.",
      "I wanted to say hello and introduce myself, as I think we share some common ground professionally.",
    ],
    lead: ["A little about why I am reaching out:", "Some quick context on me:", "Here is what prompted me to connect:"],
    close: [
      "No pressure at all, but I would love to stay connected. Thanks so much for your time!",
      "Whether now or down the road, I would be glad to stay in touch. Thank you for reading!",
    ],
  },
  "Complaint": {
    subject: ["Regarding a recent issue", "Feedback on a recent experience", "An issue that needs attention", "Concern about my recent experience"],
    open: [
      "I am writing to bring an issue to your attention and to request a resolution. I have generally had a positive experience, which is why I wanted to raise this directly.",
      "I wanted to share some honest feedback about a recent experience that fell short of what I expected.",
      "I am reaching out because I ran into a problem that I believe deserves your attention.",
    ],
    lead: ["Here are the details of the issue:", "To be specific, here is what happened:", "The key points are as follows:"],
    close: [
      "I would appreciate your help in resolving this promptly. Thank you for looking into it — I look forward to your response.",
      "I trust this can be sorted out quickly and fairly. Thank you in advance for your attention to it.",
    ],
  },
};

const EMAIL_GREET = { Professional: "Dear {recipient},", Confident: "Dear {recipient},", Enthusiastic: "Hi {recipient},", Friendly: "Hi {recipient}," };
const EMAIL_SIGNOFF = {
  Professional: ["Best regards,", "Sincerely,", "Kind regards,"],
  Confident: ["Best regards,", "Sincerely,", "Respectfully,"],
  Enthusiastic: ["Warm regards,", "With appreciation,", "Best,"],
  Friendly: ["Cheers,", "All the best,", "Warmly,"],
};

function buildEmail(f) {
  const T = EMAIL_TYPES[f.type] || EMAIL_TYPES["Follow-up after interview"];
  const recipient = clean(f.recipient);
  const you = clean(f.you) || "Your Name";
  const map = { recipient: recipient || "you", you };

  const subject = fill(pick(T.subject), map);
  const greeting = recipient ? fill(EMAIL_GREET[f.tone] || EMAIL_GREET.Professional, map) : "Hello,";
  const open = pick(T.open);
  const close = pick(T.close);
  const signoff = pick(EMAIL_SIGNOFF[f.tone] || EMAIL_SIGNOFF.Professional);

  const points = clean(f.points).split("\n").map((s) => s.trim().replace(/^[-•]\s*/, "")).filter(Boolean);
  let pointsBlock = "";
  if (points.length === 1) {
    let p = points[0];
    if (!/[.!?]$/.test(p)) p += ".";
    pointsBlock = cap(p);
  } else if (points.length > 1) {
    pointsBlock = pick(T.lead) + "\n" + points.map((p) => "  • " + p).join("\n");
  }

  const body = [greeting, "", open];
  if (pointsBlock) { body.push("", pointsBlock); }
  body.push("", close, "", signoff, you);
  return { subject, text: body.join("\n") };
}

export function AiEmailWriter() {
  const [f, setF] = useState({
    type: "Follow-up after interview",
    recipient: "Jordan",
    you: "Alex Morgan",
    points: "I'm very excited about the role\nMy experience scaling teams fits your goals\nHappy to provide references",
    tone: "Professional",
  });
  const [out, setOut] = useState(null);
  const up = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const gen = () => setOut(buildEmail(f));
  const full = out ? `Subject: ${out.subject}\n\n${out.text}` : "";

  return (
    <div className="tool">
      <ToolHead icon="✉️" title="AI Email Writer" sub="Complete, ready-to-send emails with a subject line — tailored to the situation." />
      <div className="grid grid-2" style={{ gap: 12 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label className="fld">Email type</label>
          <select className="select" value={f.type} onChange={(e) => up("type", e.target.value)}>
            {Object.keys(EMAIL_TYPES).map((k) => <option key={k}>{k}</option>)}
          </select>
        </div>
        <div><label className="fld">Recipient name</label><input className="input" value={f.recipient} onChange={(e) => up("recipient", e.target.value)} placeholder="(optional)" /></div>
        <div><label className="fld">Your name</label><input className="input" value={f.you} onChange={(e) => up("you", e.target.value)} /></div>
        <div>
          <label className="fld">Tone</label>
          <select className="select" value={f.tone} onChange={(e) => up("tone", e.target.value)}>
            <option>Professional</option><option>Enthusiastic</option><option>Confident</option><option>Friendly</option>
          </select>
        </div>
      </div>
      <label className="fld" style={{ marginTop: 12 }}>Key points (one per line)</label>
      <textarea className="textarea" style={{ minHeight: 100, fontFamily: "var(--sans)" }} value={f.points} onChange={(e) => up("points", e.target.value)} />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
        <button className="btn" style={genBtnStyle} onClick={gen}>{out ? "↻ Regenerate email" : "✨ Generate email"}</button>
        {out ? <CopyButton value={full} label="Copy email" /> : null}
        {out ? <button className="btn btn-outline btn-sm" onClick={() => downloadTxt(sanitizeFile(f.type) + "-email.txt", full)}>⬇ Download .txt</button> : null}
      </div>
      {out ? (
        <div className="sheet" style={{ marginTop: 14, padding: 20 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-soft)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Subject</div>
          <div style={{ fontWeight: 700, fontSize: 16, margin: "4px 0 14px", paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>{out.subject}</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 15.5, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{out.text}</div>
        </div>
      ) : (
        <p className="hint" style={{ marginTop: 12 }}>Pick a type, add your key points, and Generate a complete email. Regenerate for a different phrasing.</p>
      )}
    </div>
  );
}

/* ============================================================
   4. BUSINESS NAME GENERATOR
   ============================================================ */
const NAME_STYLE = {
  Modern: { suf: ["ly", "ify", "io", "sy", "hq"], pre: ["Get", "Go", "Try"], nouns: ["Labs", "Studio", "Collective", "Loop", "Flow", "Base", "Works", "Space"], adj: ["Bright", "Bold", "Prime", "Swift", "True", "Peak", "Pure", "Clear"], invent: ["Neo", "Ever", "Vive"] },
  Playful: { suf: ["oo", "zy", "sy", "o", "ster"], pre: ["Hey", "Oh", "Yay", "Super"], nouns: ["Buddy", "Pop", "Bee", "Fox", "Panda", "Doodle", "Bloom", "Party"], adj: ["Happy", "Jolly", "Zippy", "Sunny", "Merry", "Cheeky", "Bouncy", "Snappy"], invent: ["Zim", "Boo", "Wiz"] },
  Premium: { suf: ["a", "o"], pre: ["The", "Maison"], nouns: ["& Co", "Atelier", "Reserve", "Society", "House", "Standard", "Crown", "Noble"], adj: ["Grand", "Regal", "Refined", "Elite", "Luxe", "Fine", "Golden", "Velvet"], invent: ["Auré", "Belle", "Mont"] },
  Techy: { suf: ["io", "ai", "ify", "stack", "hub"], pre: ["Get", "Go", "Dev"], nouns: ["Labs", "Systems", "Logic", "Core", "Node", "Stack", "Cloud", "Sync"], adj: ["Smart", "Quantum", "Hyper", "Neural", "Rapid", "Cyber", "Nano", "Meta"], invent: ["Byte", "Qubit", "Flux"] },
  Classic: { suf: ["s"], pre: ["The"], nouns: ["& Sons", "& Co", "Group", "Associates", "Partners", "Company", "Works", "Guild"], adj: ["Trusted", "Honest", "Classic", "Heritage", "Premier", "Reliable", "Standard", "Crest"], invent: ["Old", "Royal", "Union"] },
};
const VOWELS = "aeiou";

function generateNames(kwRaw, style) {
  const cfg = NAME_STYLE[style] || NAME_STYLE.Modern;
  const words = clean(kwRaw).split(/[,\s]+/).map((w) => w.replace(/[^a-zA-Z]/g, "")).filter(Boolean);
  const base = (words[0] || "brand").toLowerCase();
  const Base = cap(base);
  const second = words[1] ? cap(words[1].toLowerCase()) : null;
  const out = new Set();

  // suffix blends
  cfg.suf.forEach((sfx) => {
    let r = base;
    if (VOWELS.includes(r.slice(-1)) && VOWELS.includes(sfx[0])) r = r.slice(0, -1);
    out.add(cap(r) + sfx);
  });
  // prefixes
  cfg.pre.forEach((p) => {
    if (p === "The" || p === "Maison") out.add(p + " " + Base);
    else out.add(p + Base);
  });
  // compounds with style nouns (skip if the noun repeats the keyword, e.g. "CloudCloud")
  cfg.nouns.forEach((n) => {
    if (n.replace(/[^a-z]/gi, "").toLowerCase() === base) return;
    if (n.startsWith("&")) out.add(Base + " " + n);
    else out.add(Base + n);
  });
  // alliteration / descriptors
  cfg.adj.forEach((a) => out.add(a + " " + Base));
  // invented prefixes
  cfg.invent.forEach((v) => out.add(v + Base));
  // second keyword combos
  if (second) {
    out.add(Base + second);
    out.add(second + Base);
    out.add(Base + " " + second);
  }
  // a couple of vowel-trim invented forms
  const trimmed = VOWELS.includes(base.slice(-1)) ? base.slice(0, -1) : base;
  ["a", "o", "os", "ia"].forEach((e) => out.add(cap(trimmed) + e));

  const list = Array.from(out).filter((n) => n.length >= 3 && n.length <= 22);
  return sample(list, Math.min(22, list.length));
}

export function BusinessNameGenerator() {
  const [f, setF] = useState({ keyword: "coffee", style: "Modern" });
  const [names, setNames] = useState([]);
  const up = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const gen = () => setNames(generateNames(f.keyword, f.style));

  return (
    <div className="tool">
      <ToolHead icon="🏷️" title="Business Name Generator" sub="Two dozen brandable name ideas from smart naming strategies." />
      <div className="grid grid-2" style={{ gap: 12 }}>
        <div><label className="fld">Keyword(s) / industry</label><input className="input" value={f.keyword} onChange={(e) => up("keyword", e.target.value)} placeholder="e.g. coffee, roast" /></div>
        <div>
          <label className="fld">Style</label>
          <select className="select" value={f.style} onChange={(e) => up("style", e.target.value)}>
            <option>Modern</option><option>Playful</option><option>Premium</option><option>Techy</option><option>Classic</option>
          </select>
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <button className="btn" style={genBtnStyle} onClick={gen}>{names.length ? "↻ Regenerate names" : "✨ Generate names"}</button>
      </div>
      {names.length ? (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
            {names.map((n, i) => <CopyChip key={n + i} text={n} />)}
          </div>
          <p className="hint">Tap any name to copy it. Always check domain and trademark availability before committing to a name.</p>
        </>
      ) : (
        <p className="hint" style={{ marginTop: 12 }}>Enter a keyword, choose a style, and Generate. Each click mixes fresh naming ideas.</p>
      )}
    </div>
  );
}

/* ============================================================
   5. SLOGAN GENERATOR
   ============================================================ */
const SLOGAN_ADJ = ["better", "smarter", "brighter", "bolder", "simpler", "faster", "brilliant"];
const SLOGAN_TEMPLATES = [
  (b, k) => `${b}. ${cap(k)} made simple.`,
  (b, k) => `Experience ${k} like never before.`,
  (b, k) => `${b} — where ${k} comes to life.`,
  (b, k) => `The ${k} you deserve.`,
  (b, k) => `Think ${k}. Think ${b}.`,
  (b, k) => `${b}: ${cap(k)}, redefined.`,
  (b, k) => `Powered by ${k}. Perfected by ${b}.`,
  (b, k) => `Your ${k}, our passion.`,
  (b, k) => `${cap(k)} starts with ${b}.`,
  (b, k) => `Because ${k} matters.`,
  (b) => `${b}. Simply ${pick(SLOGAN_ADJ)}.`,
  (b) => `Do more with ${b}.`,
  (b, k) => `${cap(k)}, delivered.`,
  (b, k) => `Meet the future of ${k}.`,
  (b, k) => `${b} — ${k} without compromise.`,
  (b, k) => `Say hello to better ${k}.`,
  (b) => `Life's better with ${b}.`,
  (b, k) => `One brand. Endless ${k}.`,
  (b, k) => `Nobody does ${k} like ${b}.`,
  (b) => `Get more. Get ${b}.`,
  (b, k) => `${cap(k)} is our promise.`,
  (b, k) => `Fall in love with ${k} again.`,
];

function buildSlogans(brandRaw, benefitRaw) {
  const b = clean(brandRaw) || "Your Brand";
  const k = lc(clean(benefitRaw)) || "quality";
  const chosen = sample(SLOGAN_TEMPLATES, 16);
  const seen = new Set();
  const out = [];
  for (const t of chosen) {
    const s = t(b, k);
    if (!seen.has(s)) { seen.add(s); out.push(s); }
  }
  return out;
}

export function SloganGenerator() {
  const [f, setF] = useState({ brand: "BrewJoy", benefit: "great coffee" });
  const [slogans, setSlogans] = useState([]);
  const up = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const gen = () => setSlogans(buildSlogans(f.brand, f.benefit));

  return (
    <div className="tool">
      <ToolHead icon="💡" title="Slogan & Tagline Generator" sub="Catchy, on-brand taglines from a bank of proven templates." />
      <div className="grid grid-2" style={{ gap: 12 }}>
        <div><label className="fld">Brand / product name</label><input className="input" value={f.brand} onChange={(e) => up("brand", e.target.value)} /></div>
        <div><label className="fld">Keyword / benefit</label><input className="input" value={f.benefit} onChange={(e) => up("benefit", e.target.value)} placeholder="e.g. great coffee" /></div>
      </div>
      <div style={{ marginTop: 14 }}>
        <button className="btn" style={genBtnStyle} onClick={gen}>{slogans.length ? "↻ Regenerate slogans" : "✨ Generate slogans"}</button>
      </div>
      {slogans.length ? (
        <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
          {slogans.map((s, i) => <OutRow key={i} text={s} />)}
        </div>
      ) : (
        <p className="hint" style={{ marginTop: 12 }}>Add a brand name and a benefit, then Generate a batch of taglines. Regenerate for a whole new set.</p>
      )}
    </div>
  );
}
