"use client";

/* ============================================================================
   Meeting Scheduler — propose times, share one link, see when everyone's free.

   No accounts and no calendar connection: you list candidate slots, each person
   marks yes/maybe/no, and the grid scores the winner. Availability is public to
   anyone with the link, which is what makes it useful for a group.
   ========================================================================== */

import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { usePublish, ShareBox, OwnedList } from "./hostedShare";
import { slotLabel } from "../hosted/PollGrid";

const EMPTY = { title: "", organiser: "", description: "", slots: [] };

/** "2026-08-03T14:30" in local time — the exact format <input type="datetime-local"> wants. */
function toLocalInput(d) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function MeetingScheduler() {
  const [draft, setDraft] = useLocalStorage("dh_poll_draft", EMPTY);
  const [next, setNext] = useState("");
  const { publish, busy, err, result, reset } = usePublish("poll");

  // Default the picker to tomorrow at 10:00. Done in an effect, never during
  // render, so the server and client markup can't disagree.
  useEffect(() => {
    if (next) return;
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    setNext(toLocalInput(d));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slots = draft.slots || [];
  const canPublish = draft.title.trim() && slots.length > 0;

  function set(patch) {
    setDraft({ ...draft, ...patch });
  }
  function addSlot(value) {
    const v = String(value || "").trim();
    if (!v || slots.includes(v)) return;
    set({ slots: [...slots, v].sort() });
  }
  function removeSlot(v) {
    set({ slots: slots.filter((s) => s !== v) });
  }

  /** Same time of day, on each of the next N working days. */
  function addWeekdays(count) {
    const base = next ? new Date(next) : new Date();
    if (Number.isNaN(base.getTime())) return;
    const out = [];
    const d = new Date(base);
    while (out.length < count) {
      const day = d.getDay();
      if (day !== 0 && day !== 6) out.push(toLocalInput(d));
      d.setDate(d.getDate() + 1);
    }
    set({ slots: [...new Set([...slots, ...out])].sort() });
  }

  /** A morning / midday / afternoon option on the selected day. */
  function addDayOptions() {
    if (!next) return;
    const base = new Date(next);
    if (Number.isNaN(base.getTime())) return;
    const out = [9, 13, 16].map((h) => {
      const d = new Date(base);
      d.setHours(h, 0, 0, 0);
      return toLocalInput(d);
    });
    set({ slots: [...new Set([...slots, ...out])].sort() });
  }

  if (result) {
    return (
      <div className="tool">
        <ShareBox
          entry={result}
          publicPath={`/f/${result.code}`}
          resultsPath={`/f/${result.code}/results`}
          publicLabel="Send this to everyone you're inviting"
        >
          <p className="hint" style={{ marginTop: 10, marginBottom: 0 }}>
            Everyone with the link can see the group's availability — that's how they pick a time together.
          </p>
        </ShareBox>
        <div className="tool-controls" style={{ marginTop: 14 }}>
          <button className="btn btn-outline" onClick={reset}>Back to the editor</button>
          <button className="btn btn-outline" onClick={() => { setDraft(EMPTY); reset(); }}>
            Start a new poll
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tool">
      <label className="fld">What's the meeting?</label>
      <input
        className="input"
        value={draft.title}
        onChange={(e) => set({ title: e.target.value })}
        placeholder="e.g. Q3 planning call"
        maxLength={160}
      />

      <div className="grid-2" style={{ gap: 12, marginTop: 12 }}>
        <div>
          <label className="fld">Your name (optional)</label>
          <input
            className="input"
            value={draft.organiser}
            onChange={(e) => set({ organiser: e.target.value })}
            placeholder="e.g. Ajay"
            maxLength={60}
          />
        </div>
        <div>
          <label className="fld">Note for invitees (optional)</label>
          <input
            className="input"
            value={draft.description}
            onChange={(e) => set({ description: e.target.value })}
            placeholder="e.g. 45 minutes, video call"
            maxLength={300}
          />
        </div>
      </div>

      <div className="fld" style={{ marginTop: 18 }}>Propose your times</div>
      <div className="tool-controls">
        <input className="input" type="datetime-local" value={next} onChange={(e) => setNext(e.target.value)} />
        <button className="btn" onClick={() => addSlot(next)} disabled={!next}>
          Add time
        </button>
      </div>
      <div className="chips" style={{ marginTop: 8 }}>
        <button className="chip" onClick={addDayOptions} disabled={!next}>+ Morning, midday & afternoon that day</button>
        <button className="chip" onClick={() => addWeekdays(5)} disabled={!next}>+ Same time, next 5 weekdays</button>
      </div>

      {slots.length ? (
        <div className="stack-sm" style={{ marginTop: 14 }}>
          {slots.map((s) => (
            <div key={s} className="sheet flex-between" style={{ padding: "9px 13px", marginBottom: 5 }}>
              <strong style={{ fontSize: 15 }}>{slotLabel(s)}</strong>
              <button className="btn btn-sm btn-outline" onClick={() => removeSlot(s)}>✕</button>
            </div>
          ))}
          <p className="hint">
            Times are shown to each invitee in their own timezone, so nobody has to do the maths.
          </p>
        </div>
      ) : (
        <p className="hint" style={{ marginTop: 12 }}>Add two or more options so people have a real choice.</p>
      )}

      {err ? <div className="notice notice-warn" style={{ marginTop: 14 }}>{err}</div> : null}

      <div className="tool-controls" style={{ marginTop: 18 }}>
        <button
          className="btn btn-accent"
          disabled={!canPublish || busy}
          onClick={() =>
            publish(draft.title, {
              organiser: draft.organiser.trim(),
              description: draft.description.trim(),
              slots,
            })
          }
        >
          {busy ? "Publishing…" : "Create poll & get my link"}
        </button>
        {slots.length ? (
          <button className="btn btn-outline" onClick={() => setDraft(EMPTY)}>Clear</button>
        ) : null}
      </div>

      <OwnedList
        kind="poll"
        publicPath={(it) => `/f/${it.code}`}
        resultsPath={(it) => `/f/${it.code}/results`}
      />
    </div>
  );
}
