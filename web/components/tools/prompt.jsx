"use client";

import { useState } from "react";
import CopyButton from "../CopyButton";

const FORMAT_HINT = {
  "Auto": "",
  "Bulleted list": "Format the answer as a clear bulleted list.",
  "Numbered steps": "Give the answer as numbered, actionable steps.",
  "Table": "Present the answer as a Markdown table.",
  "Paragraphs": "Write in clear, well-structured paragraphs.",
  "JSON": "Return only valid JSON, no extra text.",
  "Code": "Return clean, commented code with a short usage note.",
};

export function PromptOptimizer() {
  const [idea, setIdea] = useState("write a cold email to get freelance clients");
  const [role, setRole] = useState("an expert copywriter");
  const [tone, setTone] = useState("Professional");
  const [format, setFormat] = useState("Auto");
  const [audience, setAudience] = useState("");
  const [length, setLength] = useState("Medium");

  const lines = [
    `Act as ${role || "an expert assistant"}.`,
    ``,
    `# Task`,
    idea.trim() || "(describe your task)",
    ``,
    `# Context`,
    audience.trim() ? `Audience: ${audience.trim()}.` : `Assume a general but informed audience.`,
    `Tone: ${tone}. Length: ${length}.`,
    ``,
    `# Requirements`,
    `- Be specific, accurate and genuinely useful — avoid filler and clichés.`,
    `- Use concrete examples where they help.`,
    FORMAT_HINT[format] ? `- ${FORMAT_HINT[format]}` : `- Choose the clearest format for the answer.`,
    `- If any critical detail is missing, ask me one clarifying question before answering.`,
    ``,
    `Think step by step, then give your best answer.`,
  ];
  const out = lines.join("\n");

  return (
    <div className="tool">
      <label className="fld">Your rough idea / prompt</label>
      <textarea className="textarea" style={{ minHeight: 90, fontFamily: "var(--sans)" }} value={idea} onChange={(e) => setIdea(e.target.value)} />
      <div className="grid grid-3" style={{ gap: 12, marginTop: 12 }}>
        <div><label className="fld">Act as…</label><input className="input" value={role} onChange={(e) => setRole(e.target.value)} /></div>
        <div><label className="fld">Tone</label><select className="select" value={tone} onChange={(e) => setTone(e.target.value)}>{["Professional", "Friendly", "Persuasive", "Casual", "Formal", "Confident"].map((t) => <option key={t}>{t}</option>)}</select></div>
        <div><label className="fld">Output format</label><select className="select" value={format} onChange={(e) => setFormat(e.target.value)}>{Object.keys(FORMAT_HINT).map((t) => <option key={t}>{t}</option>)}</select></div>
        <div><label className="fld">Audience (optional)</label><input className="input" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. small business owners" /></div>
        <div><label className="fld">Length</label><select className="select" value={length} onChange={(e) => setLength(e.target.value)}>{["Short", "Medium", "Detailed"].map((t) => <option key={t}>{t}</option>)}</select></div>
      </div>
      <label className="fld" style={{ marginTop: 16 }}>Optimized prompt <CopyButton value={out} label="Copy prompt" /></label>
      <div className="sheet" style={{ padding: 14, whiteSpace: "pre-wrap", fontFamily: "var(--mono)", fontSize: 13.5 }}>{out}</div>
      <p className="hint">Paste this into ChatGPT, Claude, Gemini or any AI for much better results. Works entirely in your browser.</p>
    </div>
  );
}
