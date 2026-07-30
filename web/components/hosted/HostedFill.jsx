"use client";

/* ============================================================================
   The PUBLIC page behind a shared /f/<code> link. One component covers both
   things that take submissions:

     kind "survey" → answer the questions the creator built
     kind "poll"   → mark which of the proposed times you can make

   It fetches the item client-side (the payload is user-generated, so these
   pages are never statically built or indexed) and posts one response back.
   ========================================================================== */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PollGrid } from "./PollGrid";

function Shell({ children }) {
  return (
    <div className="container-narrow section">
      <div className="sheet" style={{ padding: "clamp(16px, 5vw, 30px)" }}>{children}</div>
    </div>
  );
}

function Missing({ message }) {
  return (
    <Shell>
      <h1 style={{ fontSize: 24, marginTop: 0 }}>Link not found</h1>
      <p className="muted">{message}</p>
      <Link className="btn" href="/">
        Go to {""}
        FreeTool →
      </Link>
    </Shell>
  );
}

export default function HostedFill({ code }) {
  const [state, setState] = useState({ status: "loading" });
  const [answers, setAnswers] = useState({});
  const [picks, setPicks] = useState({});
  const [who, setWho] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/hosted/${code}`);
        const json = await res.json();
        if (!alive) return;
        if (!res.ok || json.error) {
          setState({ status: "missing", message: json.error || "This link is no longer available." });
          return;
        }
        let data = null;
        try {
          data = JSON.parse(json.data);
        } catch (e) {
          data = null;
        }
        if (!data) {
          setState({ status: "missing", message: "This link's contents could not be read." });
          return;
        }
        setState({ status: "ready", item: json, data });
      } catch (e) {
        if (alive) setState({ status: "missing", message: "Could not reach the server. Check your connection." });
      }
    })();
    return () => {
      alive = false;
    };
  }, [code]);

  const submit = useCallback(
    async (payload) => {
      setSending(true);
      setErr("");
      try {
        const res = await fetch(`/api/hosted/${code}/respond`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: JSON.stringify(payload) }),
        });
        const json = await res.json();
        if (!res.ok || json.error) setErr(json.error || "Could not submit.");
        else setSent(true);
      } catch (e) {
        setErr("Could not reach the server. Please try again.");
      } finally {
        setSending(false);
      }
    },
    [code]
  );

  if (state.status === "loading") {
    return (
      <Shell>
        <p className="muted">Loading…</p>
      </Shell>
    );
  }
  if (state.status === "missing") return <Missing message={state.message} />;

  const { item, data } = state;
  const isPoll = item.kind === "poll";

  if (!item.accepts) return <Missing message="This link does not accept responses." />;

  if (sent) {
    return (
      <Shell>
        <div style={{ fontSize: 40, lineHeight: 1 }}>✅</div>
        <h1 style={{ fontSize: 24, margin: "10px 0 6px" }}>
          {isPoll ? "Your availability is in" : data.thankYou || "Thanks — your response was recorded"}
        </h1>
        <p className="muted">
          {isPoll
            ? "The organiser can now see which times work for you."
            : "You can close this page. Nothing else is needed."}
        </p>
        {isPoll ? (
          <Link className="btn" href={`/f/${code}/results`}>
            See everyone's availability →
          </Link>
        ) : null}
        <p className="hint" style={{ marginTop: 18 }}>
          Made with a free tool from <Link href="/">FreeTool</Link> — build your own, no signup.
        </p>
      </Shell>
    );
  }

  if (item.closed) {
    return <Missing message="This is closed and no longer accepting responses." />;
  }

  /* ---------------- meeting poll ---------------- */
  if (isPoll) {
    const slots = Array.isArray(data.slots) ? data.slots : [];
    const ready = who.trim() && slots.length > 0;
    return (
      <Shell>
        <h1 style={{ fontSize: 26, marginTop: 0 }}>{item.title}</h1>
        {data.description ? <p className="muted">{data.description}</p> : null}
        <p className="muted" style={{ fontSize: 14 }}>
          Mark every time you could make. {data.organiser ? `Organised by ${data.organiser}.` : ""}
        </p>

        <label className="fld" style={{ marginTop: 14 }}>Your name</label>
        <input
          className="input"
          value={who}
          onChange={(e) => setWho(e.target.value)}
          placeholder="e.g. Priya"
          maxLength={60}
        />

        <div style={{ marginTop: 16 }}>
          <PollGrid slots={slots} picks={picks} onPick={(i, v) => setPicks({ ...picks, [i]: v })} />
        </div>

        {err ? <div className="notice notice-warn" style={{ marginTop: 12 }}>{err}</div> : null}

        <button
          className="btn btn-accent"
          style={{ marginTop: 16 }}
          disabled={!ready || sending}
          onClick={() =>
            submit({
              name: who.trim().slice(0, 60),
              picks: slots.map((_, i) => picks[i] || "no"),
            })
          }
        >
          {sending ? "Sending…" : "Send my availability"}
        </button>
        {!who.trim() ? <p className="hint">Add your name so the organiser knows whose availability this is.</p> : null}
      </Shell>
    );
  }

  /* ---------------- survey ---------------- */
  const questions = Array.isArray(data.questions) ? data.questions : [];
  const missingRequired = questions.filter((q) => {
    if (!q.required) return false;
    const v = answers[q.id];
    if (q.type === "checkbox") return !Array.isArray(v) || v.length === 0;
    return v == null || String(v).trim() === "";
  });

  function setAnswer(id, value) {
    setAnswers((a) => ({ ...a, [id]: value }));
  }
  function toggleCheck(id, opt) {
    setAnswers((a) => {
      const cur = Array.isArray(a[id]) ? a[id] : [];
      return { ...a, [id]: cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt] };
    });
  }

  return (
    <Shell>
      <h1 style={{ fontSize: 26, marginTop: 0 }}>{item.title}</h1>
      {data.description ? <p className="muted">{data.description}</p> : null}

      <div className="stack-sm" style={{ marginTop: 18 }}>
        {questions.map((q, i) => (
          <div key={q.id} style={{ marginBottom: 20 }}>
            <label className="fld" style={{ display: "block", marginBottom: 6 }}>
              {i + 1}. {q.label}
              {q.required ? <span style={{ color: "var(--accent)" }}> *</span> : null}
            </label>

            {q.type === "long" ? (
              <textarea
                className="textarea"
                rows={4}
                value={answers[q.id] || ""}
                onChange={(e) => setAnswer(q.id, e.target.value)}
                maxLength={2000}
              />
            ) : q.type === "choice" ? (
              <div className="stack-sm">
                {(q.options || []).map((opt) => (
                  <label key={opt} className="chk">
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswer(q.id, opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            ) : q.type === "checkbox" ? (
              <div className="stack-sm">
                {(q.options || []).map((opt) => (
                  <label key={opt} className="chk">
                    <input
                      type="checkbox"
                      checked={Array.isArray(answers[q.id]) && answers[q.id].includes(opt)}
                      onChange={() => toggleCheck(q.id, opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            ) : q.type === "rating" ? (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setAnswer(q.id, n)}
                    style={{
                      cursor: "pointer",
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      fontWeight: 700,
                      border: "1px solid var(--border)",
                      background: answers[q.id] === n ? "var(--accent)" : "var(--surface-2)",
                      color: answers[q.id] === n ? "#fff" : "var(--text)",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            ) : (
              <input
                className="input"
                type={q.type === "number" ? "number" : q.type === "email" ? "email" : "text"}
                value={answers[q.id] || ""}
                onChange={(e) => setAnswer(q.id, e.target.value)}
                maxLength={500}
              />
            )}
          </div>
        ))}
      </div>

      {err ? <div className="notice notice-warn">{err}</div> : null}

      <button
        className="btn btn-accent"
        disabled={sending || missingRequired.length > 0}
        onClick={() => submit({ answers })}
      >
        {sending ? "Sending…" : "Submit response"}
      </button>
      {missingRequired.length ? (
        <p className="hint">Please answer the {missingRequired.length} required question{missingRequired.length > 1 ? "s" : ""} marked with *.</p>
      ) : null}

      <p className="hint" style={{ marginTop: 18 }}>
        This form was made with the free <Link href="/productivity/survey-maker">Survey Maker</Link> on FreeTool.
      </p>
    </Shell>
  );
}
