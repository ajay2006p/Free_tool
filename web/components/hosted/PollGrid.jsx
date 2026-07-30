"use client";

/* The availability picker shared by the meeting poll's fill page and the
   organiser's own preview. Three states per slot so "maybe" is possible —
   a yes/no-only poll usually stalls on one person's soft conflict. */

export const CHOICES = [
  { key: "yes", label: "Yes", icon: "✓", color: "#16a34a" },
  { key: "maybe", label: "Maybe", icon: "~", color: "#d97706" },
  { key: "no", label: "No", icon: "✕", color: "#64748b" },
];

/** Slots are stored as plain strings — either an ISO datetime the creator
 *  picked, or free text like "Tue morning". Render whichever it is. */
export function slotLabel(slot) {
  const s = String(slot || "");
  const d = new Date(s);
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s) && !Number.isNaN(d.getTime())) {
    return d.toLocaleString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return s;
}

export function PollGrid({ slots, picks, onPick }) {
  return (
    <div className="stack-sm">
      {slots.map((slot, i) => (
        <div
          key={i}
          className="flex-between"
          style={{
            gap: 10,
            flexWrap: "wrap",
            padding: "10px 12px",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            background: "var(--surface-2)",
            marginBottom: 6,
          }}
        >
          <strong style={{ fontSize: 15 }}>{slotLabel(slot)}</strong>
          <div style={{ display: "flex", gap: 6 }}>
            {CHOICES.map((c) => {
              const on = (picks[i] || "") === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => onPick(i, c.key)}
                  aria-pressed={on}
                  style={{
                    cursor: "pointer",
                    padding: "7px 14px",
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: 13,
                    border: `1px solid ${on ? c.color : "var(--border)"}`,
                    background: on ? c.color : "transparent",
                    color: on ? "#fff" : "var(--text)",
                  }}
                >
                  {c.icon} {c.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
