"use client";

/* ============================================================================
   /f/<code>/results — the answers behind a shared link.

   Survey: owner-only. The token comes from ?token= in the URL, or from the
   copy the builder saved in this browser's localStorage when it published.
   Poll: public, because a shared availability grid is the whole point.
   ========================================================================== */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CHOICES, slotLabel } from "./PollGrid";

const OWNED_KEY = "dh_hosted_owned";

function readSavedToken(code) {
  try {
    const all = JSON.parse(localStorage.getItem(OWNED_KEY) || "[]");
    const hit = all.find((x) => x.code === code);
    return hit?.editToken || "";
  } catch (e) {
    return "";
  }
}

function csvCell(v) {
  const s = Array.isArray(v) ? v.join("; ") : v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function download(name, text, type = "text/csv;charset=utf-8") {
  try {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  } catch (e) {}
}

export default function HostedResults({ code }) {
  const [state, setState] = useState({ status: "loading" });
  const [token, setToken] = useState(null); // null = not resolved yet

  // Resolve the token before the first fetch so we don't 403 needlessly.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("token") || "";
    setToken(fromUrl || readSavedToken(code));
  }, [code]);

  useEffect(() => {
    if (token === null) return;
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/hosted/${code}/results?token=${encodeURIComponent(token)}`);
        const json = await res.json();
        if (!alive) return;
        if (!res.ok || json.error) {
          setState({ status: "error", code: res.status, message: json.error || "Could not load." });
          return;
        }
        let data = null;
        try {
          data = JSON.parse(json.data);
        } catch (e) {}
        setState({
          status: "ready",
          meta: json,
          data: data || {},
          responses: json.responses.map((r) => {
            try {
              return { at: r.at, ...JSON.parse(r.data) };
            } catch (e) {
              return { at: r.at };
            }
          }),
        });
      } catch (e) {
        if (alive) setState({ status: "error", message: "Could not reach the server." });
      }
    })();
    return () => {
      alive = false;
    };
  }, [code, token]);

  if (state.status === "loading" || token === null) {
    return (
      <div className="container-narrow section">
        <p className="muted">Loading responses…</p>
      </div>
    );
  }

  if (state.status === "error") {
    const forbidden = state.code === 403;
    return (
      <div className="container-narrow section">
        <div className="sheet" style={{ padding: "clamp(16px, 5vw, 30px)" }}>
          <h1 style={{ fontSize: 24, marginTop: 0 }}>{forbidden ? "Results are private" : "Not available"}</h1>
          <p className="muted">
            {forbidden
              ? "Only the person who created this form can see its responses. Open the results link you saved when you published it — it contains your private key."
              : state.message}
          </p>
          <Link className="btn" href="/productivity/survey-maker">
            Make your own form →
          </Link>
        </div>
      </div>
    );
  }

  const { meta, data, responses } = state;
  return meta.kind === "poll" ? (
    <PollResults meta={meta} data={data} responses={responses} code={code} />
  ) : (
    <SurveyResults meta={meta} data={data} responses={responses} />
  );
}

/* ---------------------------- meeting poll ------------------------------- */

function PollResults({ meta, data, responses, code }) {
  const slots = Array.isArray(data.slots) ? data.slots : [];

  // Score each slot: a "yes" is worth a full point, a "maybe" half. The winner
  // is the slot the most people can actually make.
  const scores = slots.map((_, i) => {
    let yes = 0, maybe = 0, no = 0;
    for (const r of responses) {
      const v = Array.isArray(r.picks) ? r.picks[i] : undefined;
      if (v === "yes") yes++;
      else if (v === "maybe") maybe++;
      else no++;
    }
    return { i, yes, maybe, no, score: yes + maybe * 0.5 };
  });
  const best = scores.slice().sort((a, b) => b.score - a.score || b.yes - a.yes)[0];

  return (
    <div className="container section">
      <h1 style={{ fontSize: 28, marginTop: 0 }}>{meta.title}</h1>
      <p className="muted">
        {responses.length} {responses.length === 1 ? "person has" : "people have"} replied.
        {data.organiser ? ` Organised by ${data.organiser}.` : ""}
      </p>

      {responses.length && best ? (
        <div className="notice notice-ok" style={{ marginBottom: 16 }}>
          <strong>Best time: {slotLabel(slots[best.i])}</strong> — {best.yes} yes
          {best.maybe ? `, ${best.maybe} maybe` : ""}
          {best.no ? `, ${best.no} can't` : ""}.
        </div>
      ) : (
        <div className="notice">No replies yet. Share the link to start collecting availability.</div>
      )}

      {responses.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Time</th>
                {responses.map((r, i) => (
                  <th key={i}>{r.name || "Anonymous"}</th>
                ))}
                <th>Yes</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot, si) => (
                <tr key={si} style={best && best.i === si ? { background: "rgba(22,163,74,.08)" } : undefined}>
                  <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{slotLabel(slot)}</td>
                  {responses.map((r, ri) => {
                    const v = Array.isArray(r.picks) ? r.picks[si] : "no";
                    const c = CHOICES.find((x) => x.key === v) || CHOICES[2];
                    return (
                      <td key={ri} style={{ textAlign: "center", color: c.color, fontWeight: 700 }} title={c.label}>
                        {c.icon}
                      </td>
                    );
                  })}
                  <td style={{ textAlign: "center", fontWeight: 700 }}>{scores[si].yes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="tool-controls" style={{ marginTop: 16 }}>
        <Link className="btn btn-outline" href={`/f/${code}`}>
          Add my availability
        </Link>
        <Link className="btn" href="/productivity/meeting-scheduler">
          Make your own poll →
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------- survey ---------------------------------- */

function SurveyResults({ meta, data, responses }) {
  const questions = useMemo(() => (Array.isArray(data.questions) ? data.questions : []), [data]);

  function exportCsv() {
    const header = ["Submitted at", ...questions.map((q) => q.label)];
    const rows = responses.map((r) => [
      new Date(r.at).toLocaleString(),
      ...questions.map((q) => (r.answers ? r.answers[q.id] : "")),
    ]);
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    download(`${(meta.title || "survey").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-responses.csv`, csv);
  }

  return (
    <div className="container section">
      <div className="flex-between" style={{ flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 28, margin: 0 }}>{meta.title}</h1>
          <p className="muted" style={{ margin: "4px 0 0" }}>
            {responses.length} response{responses.length === 1 ? "" : "s"}
            {meta.closed ? " · closed" : ""}
          </p>
        </div>
        {responses.length ? (
          <button className="btn btn-sm" onClick={exportCsv}>
            Download CSV
          </button>
        ) : null}
      </div>

      {!responses.length ? (
        <div className="notice" style={{ marginTop: 16 }}>
          No responses yet. Share your form link and they'll appear here.
        </div>
      ) : (
        <div style={{ marginTop: 20 }}>
          {questions.map((q, qi) => {
            const values = responses.map((r) => (r.answers ? r.answers[q.id] : undefined));
            const answered = values.filter((v) => (Array.isArray(v) ? v.length : v != null && String(v).trim() !== ""));

            // Choice-style answers are far more useful as a tally than a list.
            const tallied = q.type === "choice" || q.type === "checkbox" || q.type === "rating";
            let buckets = [];
            if (tallied) {
              const opts = q.type === "rating" ? [1, 2, 3, 4, 5] : q.options || [];
              buckets = opts.map((opt) => ({
                label: String(opt),
                n: values.filter((v) =>
                  Array.isArray(v) ? v.includes(opt) : q.type === "rating" ? Number(v) === opt : v === opt
                ).length,
              }));
            }
            const top = Math.max(1, ...buckets.map((b) => b.n));

            return (
              <div key={q.id} className="sheet" style={{ padding: "14px 16px", marginBottom: 14 }}>
                <div className="fld" style={{ marginBottom: 8 }}>
                  {qi + 1}. {q.label}
                </div>

                {tallied ? (
                  <div className="stack-sm">
                    {buckets.map((b) => (
                      <div key={b.label} style={{ marginBottom: 7 }}>
                        <div className="flex-between" style={{ fontSize: 14, marginBottom: 3 }}>
                          <span>{b.label}</span>
                          <span className="muted">
                            {b.n} ({responses.length ? Math.round((b.n / responses.length) * 100) : 0}%)
                          </span>
                        </div>
                        <div style={{ height: 8, borderRadius: 999, background: "var(--surface-2)", overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${(b.n / top) * 100}%`,
                              background: "linear-gradient(90deg,var(--accent),var(--accent-2))",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : answered.length ? (
                  <div className="stack-sm">
                    {answered.slice(0, 200).map((v, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "8px 10px",
                          borderRadius: 8,
                          background: "var(--surface-2)",
                          marginBottom: 5,
                          fontSize: 14,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {Array.isArray(v) ? v.join(", ") : String(v)}
                      </div>
                    ))}
                    {answered.length > 200 ? (
                      <p className="hint">Showing the first 200 — download the CSV for all of them.</p>
                    ) : null}
                  </div>
                ) : (
                  <p className="hint">No answers to this question yet.</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="hint" style={{ marginTop: 18 }}>
        Keep this page's link private — it's the only way to read these answers.{" "}
        <Link href="/productivity/survey-maker">Make another form →</Link>
      </p>
    </div>
  );
}
