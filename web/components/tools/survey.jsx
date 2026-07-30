"use client";

/* ============================================================================
   Survey Maker — build a form, publish it to a short link, collect responses.

   The draft lives in localStorage while you build, so a refresh never loses
   work. Publishing writes it to the server (that's the only way a shared link
   can collect answers from other people) and hands back a private results link.
   ========================================================================== */

import { useState } from "react";
import { useLocalStorage, uid } from "./useLocalStorage";
import { usePublish, ShareBox, OwnedList } from "./hostedShare";

const TYPES = [
  { key: "short", name: "Short text", icon: "▭" },
  { key: "long", name: "Paragraph", icon: "▤" },
  { key: "choice", name: "Multiple choice (pick one)", icon: "◉" },
  { key: "checkbox", name: "Checkboxes (pick many)", icon: "☑" },
  { key: "rating", name: "Rating 1–5", icon: "★" },
  { key: "email", name: "Email", icon: "✉" },
  { key: "number", name: "Number", icon: "#" },
];

const NEEDS_OPTIONS = new Set(["choice", "checkbox"]);

const TEMPLATES = {
  blank: { title: "", description: "", questions: [] },
  satisfaction: {
    title: "Customer satisfaction survey",
    description: "A few quick questions — it takes under a minute. Thank you!",
    questions: [
      { type: "rating", label: "Overall, how satisfied are you with us?", required: true },
      { type: "choice", label: "How likely are you to recommend us to a friend?", required: true, options: ["Very likely", "Likely", "Neutral", "Unlikely", "Very unlikely"] },
      { type: "checkbox", label: "What do we do well?", options: ["Price", "Quality", "Speed", "Support", "Ease of use"] },
      { type: "long", label: "What is the one thing we could improve?" },
    ],
  },
  event: {
    title: "Event feedback",
    description: "Thanks for coming! Tell us how it went so the next one is better.",
    questions: [
      { type: "rating", label: "How would you rate the event overall?", required: true },
      { type: "choice", label: "Was the length about right?", options: ["Too short", "Just right", "Too long"] },
      { type: "short", label: "Which session was your favourite?" },
      { type: "long", label: "Anything else you'd like us to know?" },
    ],
  },
  research: {
    title: "Quick market research",
    description: "Help us understand what you need. All answers are anonymous.",
    questions: [
      { type: "choice", label: "How often do you face this problem?", required: true, options: ["Daily", "Weekly", "Monthly", "Rarely", "Never"] },
      { type: "choice", label: "What do you use today to solve it?", options: ["A paid tool", "A free tool", "Spreadsheets", "Nothing"] },
      { type: "number", label: "What would you pay per month to fix it? (in your currency)" },
      { type: "long", label: "Describe the last time this cost you time or money." },
    ],
  },
  rsvp: {
    title: "RSVP",
    description: "Please let us know if you can make it.",
    questions: [
      { type: "short", label: "Your name", required: true },
      { type: "choice", label: "Will you attend?", required: true, options: ["Yes, I'll be there", "No, sorry", "Maybe"] },
      { type: "number", label: "How many guests are you bringing?" },
      { type: "short", label: "Any dietary requirements?" },
    ],
  },
};

function hydrate(t) {
  return {
    title: t.title,
    description: t.description,
    questions: t.questions.map((q) => ({
      id: uid(),
      type: q.type,
      label: q.label,
      required: Boolean(q.required),
      options: q.options ? q.options.slice() : NEEDS_OPTIONS.has(q.type) ? ["Option 1", "Option 2"] : [],
    })),
  };
}

const EMPTY = { title: "", description: "", questions: [] };

export function SurveyMaker() {
  const [draft, setDraft] = useLocalStorage("dh_survey_draft", EMPTY);
  const [preview, setPreview] = useState(false);
  const { publish, busy, err, result, reset } = usePublish("survey");

  const questions = draft.questions || [];
  const canPublish = draft.title.trim() && questions.length > 0 && questions.every((q) => q.label.trim());

  function set(patch) {
    setDraft({ ...draft, ...patch });
  }
  function setQ(id, patch) {
    set({ questions: questions.map((q) => (q.id === id ? { ...q, ...patch } : q)) });
  }
  function addQ(type = "short") {
    set({
      questions: [
        ...questions,
        { id: uid(), type, label: "", required: false, options: NEEDS_OPTIONS.has(type) ? ["Option 1", "Option 2"] : [] },
      ],
    });
  }
  function removeQ(id) {
    set({ questions: questions.filter((q) => q.id !== id) });
  }
  function move(id, dir) {
    const i = questions.findIndex((q) => q.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= questions.length) return;
    const next = questions.slice();
    [next[i], next[j]] = [next[j], next[i]];
    set({ questions: next });
  }
  function changeType(id, type) {
    const q = questions.find((x) => x.id === id);
    setQ(id, {
      type,
      options: NEEDS_OPTIONS.has(type) ? (q.options?.length ? q.options : ["Option 1", "Option 2"]) : [],
    });
  }

  if (result) {
    return (
      <div className="tool">
        <ShareBox
          entry={result}
          publicPath={`/f/${result.code}`}
          resultsPath={`/f/${result.code}/results?token=${result.editToken}`}
          publicLabel="Send this link to the people you want answers from"
        />
        <div className="tool-controls" style={{ marginTop: 14 }}>
          <button className="btn btn-outline" onClick={reset}>
            Back to the editor
          </button>
          <button
            className="btn btn-outline"
            onClick={() => {
              setDraft(EMPTY);
              reset();
            }}
          >
            Start a new form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tool">
      {/* templates */}
      <div className="fld">Start from a template</div>
      <div className="chips" style={{ marginBottom: 16 }}>
        {[
          ["satisfaction", "😊 Customer satisfaction"],
          ["event", "🎪 Event feedback"],
          ["research", "🔍 Market research"],
          ["rsvp", "✉️ RSVP"],
          ["blank", "➕ Blank"],
        ].map(([key, label]) => (
          <button key={key} className="chip" onClick={() => setDraft(hydrate(TEMPLATES[key]))}>
            {label}
          </button>
        ))}
      </div>

      <label className="fld">Form title</label>
      <input
        className="input"
        value={draft.title}
        onChange={(e) => set({ title: e.target.value })}
        placeholder="e.g. Customer satisfaction survey"
        maxLength={160}
      />

      <label className="fld" style={{ marginTop: 12 }}>Description (optional)</label>
      <textarea
        className="textarea"
        rows={2}
        value={draft.description}
        onChange={(e) => set({ description: e.target.value })}
        placeholder="Shown at the top of your form."
        maxLength={600}
      />

      <div className="flex-between" style={{ margin: "20px 0 10px", flexWrap: "wrap", gap: 8 }}>
        <strong>
          {questions.length} question{questions.length === 1 ? "" : "s"}
        </strong>
        <button className="btn btn-sm btn-outline" onClick={() => setPreview(!preview)} disabled={!questions.length}>
          {preview ? "Back to editing" : "Preview form"}
        </button>
      </div>

      {preview ? (
        <SurveyPreview draft={draft} />
      ) : (
        <>
          {questions.map((q, i) => (
            <div key={q.id} className="sheet" style={{ padding: "12px 14px", marginBottom: 10 }}>
              <div className="flex-between" style={{ gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <span className="muted" style={{ fontWeight: 700 }}>Q{i + 1}</span>
                <div style={{ display: "flex", gap: 4 }}>
                  <button className="btn btn-sm btn-outline" onClick={() => move(q.id, -1)} disabled={i === 0} title="Move up">↑</button>
                  <button className="btn btn-sm btn-outline" onClick={() => move(q.id, 1)} disabled={i === questions.length - 1} title="Move down">↓</button>
                  <button className="btn btn-sm btn-outline" onClick={() => removeQ(q.id)} title="Delete question">✕</button>
                </div>
              </div>

              <input
                className="input"
                value={q.label}
                onChange={(e) => setQ(q.id, { label: e.target.value })}
                placeholder="Type your question…"
                maxLength={300}
              />

              <div className="tool-controls" style={{ marginTop: 8 }}>
                <select className="input" value={q.type} onChange={(e) => changeType(q.id, e.target.value)}>
                  {TYPES.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.icon}  {t.name}
                    </option>
                  ))}
                </select>
                <label className="chk">
                  <input type="checkbox" checked={q.required} onChange={(e) => setQ(q.id, { required: e.target.checked })} />
                  <span>Required</span>
                </label>
              </div>

              {NEEDS_OPTIONS.has(q.type) ? (
                <div style={{ marginTop: 10 }}>
                  <div className="fld">Options</div>
                  {(q.options || []).map((opt, oi) => (
                    <div className="tool-controls" key={oi} style={{ marginBottom: 5 }}>
                      <input
                        className="input"
                        style={{ flex: 1 }}
                        value={opt}
                        onChange={(e) => {
                          const next = q.options.slice();
                          next[oi] = e.target.value;
                          setQ(q.id, { options: next });
                        }}
                        maxLength={160}
                      />
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => setQ(q.id, { options: q.options.filter((_, x) => x !== oi) })}
                        disabled={q.options.length <= 1}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => setQ(q.id, { options: [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`] })}
                  >
                    + Add option
                  </button>
                </div>
              ) : null}
            </div>
          ))}

          <div className="chips" style={{ marginTop: 8 }}>
            {TYPES.map((t) => (
              <button key={t.key} className="chip" onClick={() => addQ(t.key)}>
                + {t.name}
              </button>
            ))}
          </div>
        </>
      )}

      {err ? <div className="notice notice-warn" style={{ marginTop: 14 }}>{err}</div> : null}

      <div className="tool-controls" style={{ marginTop: 18 }}>
        <button
          className="btn btn-accent"
          disabled={!canPublish || busy}
          onClick={() =>
            publish(draft.title, {
              description: draft.description,
              questions: questions.map((q) => ({
                id: q.id,
                type: q.type,
                label: q.label.trim(),
                required: Boolean(q.required),
                options: NEEDS_OPTIONS.has(q.type) ? (q.options || []).map((o) => o.trim()).filter(Boolean) : undefined,
              })),
              thankYou: "Thanks — your response was recorded",
            })
          }
        >
          {busy ? "Publishing…" : "Publish & get my link"}
        </button>
        {questions.length ? (
          <button className="btn btn-outline" onClick={() => setDraft(EMPTY)}>
            Clear
          </button>
        ) : null}
      </div>
      {!canPublish ? (
        <p className="hint">Add a title and at least one question (each with text) to publish.</p>
      ) : (
        <p className="hint">Your draft is saved in this browser as you type.</p>
      )}

      <OwnedList
        kind="survey"
        publicPath={(it) => `/f/${it.code}`}
        resultsPath={(it) => `/f/${it.code}/results?token=${it.editToken}`}
      />
    </div>
  );
}

/* A read-only render of the form as respondents will see it. */
function SurveyPreview({ draft }) {
  return (
    <div className="sheet" style={{ padding: "16px 18px" }}>
      <h3 style={{ margin: "0 0 4px" }}>{draft.title || "Untitled form"}</h3>
      {draft.description ? <p className="muted" style={{ marginTop: 0 }}>{draft.description}</p> : null}
      {(draft.questions || []).map((q, i) => (
        <div key={q.id} style={{ marginTop: 16 }}>
          <div className="fld">
            {i + 1}. {q.label || "(no question text)"}
            {q.required ? <span style={{ color: "var(--accent)" }}> *</span> : null}
          </div>
          {q.type === "long" ? (
            <textarea className="textarea" rows={3} disabled />
          ) : q.type === "rating" ? (
            <div style={{ fontSize: 22, letterSpacing: 4 }}>★★★★★</div>
          ) : NEEDS_OPTIONS.has(q.type) ? (
            <div className="stack-sm">
              {(q.options || []).map((o) => (
                <label key={o} className="chk">
                  <input type={q.type === "choice" ? "radio" : "checkbox"} disabled />
                  <span>{o}</span>
                </label>
              ))}
            </div>
          ) : (
            <input className="input" disabled />
          )}
        </div>
      ))}
      <p className="hint" style={{ marginTop: 16 }}>This is a preview — nothing here is saved.</p>
    </div>
  );
}
