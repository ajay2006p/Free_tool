"use client";

import { useState } from "react";

/* Wedding Hashtag Generator — a rising niche query ("wedding hashtag generator
   free"). Builds cute, custom hashtags from the couple's names entirely in the
   browser. No API, no signup. */

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "");
const clean = (s) => cap(String(s || "").trim().replace(/[^a-zA-Z]/g, ""));

// A→"A" portmanteau blend of two names (e.g. Brad+Angelina → Brangelina).
function blend(a, b) {
  if (!a || !b) return "";
  const x = a.slice(0, Math.ceil(a.length / 2));
  const y = b.slice(Math.floor(b.length / 2));
  return cap(x + y);
}

function buildHashtags({ n1, n2, last, year }) {
  const out = { Cute: [], Classic: [], Funny: [], Elegant: [] };
  if (!n1 || !n2) return out;
  const Y = year ? String(year).replace(/[^0-9]/g, "").slice(0, 4) : "";
  const L = last || "";
  const B = blend(n1, n2);

  out.Cute.push(`#${n1}And${n2}`, `#${n1}Loves${n2}`, `#${n1}Hearts${n2}`);
  if (B) out.Cute.push(`#${B}${Y || "Forever"}`);
  out.Cute.push(`#TwoHeartsOneStory`, `#MeantToBe${Y}`.replace(/2$/, "2"));

  out.Classic.push(`#${n1}Weds${n2}`, `#${n2}Weds${n1}`);
  if (L) out.Classic.push(`#The${L}Wedding`, `#The${L}s`, `#MrAndMrs${L}`);
  if (Y) out.Classic.push(`#${n1}${n2}${Y}`);
  out.Classic.push(`#TyingTheKnot${Y}`.replace(/Knot$/, "Knot"));

  out.Funny.push(`#Finally${L || n2}`, `#He${n1 ? "Put" : "Put"}ARingOnIt`, `#Team${L || n1}`);
  if (B) out.Funny.push(`#Operation${B}`);
  out.Funny.push(`#${n1}${n2}TieTheKnot`, `#GameOfLoveWon`);

  out.Elegant.push(`#HappilyEver${L || n2}`, `#ForeverStartsNow`, `#SealedWithA${L ? L : "Kiss"}`);
  if (Y) out.Elegant.push(`#OnceUponA${Y}`);
  out.Elegant.push(`#TogetherForever${Y}`, `#OneLove${Y}`);

  // de-dupe + trim empties per bucket
  for (const k of Object.keys(out)) {
    out[k] = [...new Set(out[k].filter((t) => t && !/#\s*$/.test(t) && t.length > 2))];
  }
  return out;
}

export function WeddingHashtag() {
  const [n1, setN1] = useState("");
  const [n2, setN2] = useState("");
  const [last, setLast] = useState("");
  const [year, setYear] = useState("");
  const [copied, setCopied] = useState("");

  const groups = buildHashtags({ n1: clean(n1), n2: clean(n2), last: clean(last), year });
  const total = Object.values(groups).reduce((a, b) => a + b.length, 0);
  const ready = clean(n1) && clean(n2);

  function copy(tag) {
    navigator.clipboard?.writeText(tag).then(() => {
      setCopied(tag);
      setTimeout(() => setCopied(""), 1200);
    });
  }
  function copyAll() {
    const all = Object.values(groups).flat().join(" ");
    navigator.clipboard?.writeText(all).then(() => {
      setCopied("__all__");
      setTimeout(() => setCopied(""), 1400);
    });
  }

  const GROUP_ICON = { Cute: "💕", Classic: "💍", Funny: "😄", Elegant: "✨" };

  return (
    <div className="tool">
      <div className="grid-2" style={{ gap: 12 }}>
        <label className="chk" style={{ flexDirection: "column", alignItems: "stretch", gap: 4 }}>
          <span className="fld">Partner 1 first name</span>
          <input className="input" value={n1} onChange={(e) => setN1(e.target.value)} placeholder="e.g. Priya" />
        </label>
        <label className="chk" style={{ flexDirection: "column", alignItems: "stretch", gap: 4 }}>
          <span className="fld">Partner 2 first name</span>
          <input className="input" value={n2} onChange={(e) => setN2(e.target.value)} placeholder="e.g. Arjun" />
        </label>
        <label className="chk" style={{ flexDirection: "column", alignItems: "stretch", gap: 4 }}>
          <span className="fld">Shared / new last name (optional)</span>
          <input className="input" value={last} onChange={(e) => setLast(e.target.value)} placeholder="e.g. Sharma" />
        </label>
        <label className="chk" style={{ flexDirection: "column", alignItems: "stretch", gap: 4 }}>
          <span className="fld">Wedding year (optional)</span>
          <input className="input" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2026" inputMode="numeric" />
        </label>
      </div>

      {!ready ? (
        <p className="hint" style={{ marginTop: 14 }}>Enter both first names to generate dozens of custom wedding hashtags. 💍</p>
      ) : (
        <>
          <div className="flex-between" style={{ margin: "16px 0 8px", flexWrap: "wrap", gap: 8 }}>
            <strong>{total} hashtags ready</strong>
            <button className="btn btn-sm" onClick={copyAll}>
              {copied === "__all__" ? "Copied all ✓" : "Copy all"}
            </button>
          </div>

          {Object.entries(groups).map(([group, tags]) =>
            tags.length ? (
              <div key={group} style={{ marginBottom: 14 }}>
                <div className="fld" style={{ marginBottom: 8 }}>{GROUP_ICON[group]} {group}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => copy(tag)}
                      title="Click to copy"
                      style={{
                        cursor: "pointer",
                        border: "1px solid var(--border)",
                        background: copied === tag ? "var(--accent)" : "var(--surface-2)",
                        color: copied === tag ? "#fff" : "var(--text)",
                        borderRadius: 999,
                        padding: "8px 14px",
                        fontWeight: 600,
                        fontSize: 14,
                        transition: "all .15s ease",
                      }}
                    >
                      {copied === tag ? "Copied ✓" : tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : null
          )}
          <p className="hint" style={{ marginTop: 10 }}>
            Tip: pick 1–2 favourites and share them on your invites and signage so guests tag every photo. Everything is generated in your browser — nothing is stored.
          </p>
        </>
      )}
    </div>
  );
}
