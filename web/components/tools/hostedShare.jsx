"use client";

/* ============================================================================
   Publishing plumbing shared by the Survey Maker, Meeting Scheduler and
   Link-in-Bio builder: POST the payload, keep the owner token in this browser,
   and show the creator their links.

   The token is stored locally (never in the URL bar alone) so returning to the
   results page in the same browser just works, while the copyable results link
   carries the token for use elsewhere.
   ========================================================================== */

import { useCallback, useState } from "react";
import CopyButton from "../CopyButton";

const OWNED_KEY = "dh_hosted_owned";

function remember(entry) {
  try {
    const all = JSON.parse(localStorage.getItem(OWNED_KEY) || "[]");
    localStorage.setItem(OWNED_KEY, JSON.stringify([entry, ...all.filter((x) => x.code !== entry.code)].slice(0, 50)));
  } catch (e) {}
}

export function loadOwned(kind) {
  try {
    const all = JSON.parse(localStorage.getItem(OWNED_KEY) || "[]");
    return kind ? all.filter((x) => x.kind === kind) : all;
  } catch (e) {
    return [];
  }
}

export function usePublish(kind) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [result, setResult] = useState(null);

  const publish = useCallback(
    async (title, data) => {
      setBusy(true);
      setErr("");
      try {
        const res = await fetch("/api/hosted", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind, title, data: JSON.stringify(data) }),
        });
        const json = await res.json();
        if (!res.ok || json.error) {
          setErr(json.error || "Could not publish.");
          return null;
        }
        const entry = { kind, code: json.code, editToken: json.editToken, title, at: new Date().toISOString() };
        remember(entry);
        setResult(entry);
        return entry;
      } catch (e) {
        setErr("Could not reach the server. Please try again.");
        return null;
      } finally {
        setBusy(false);
      }
    },
    [kind]
  );

  const reset = useCallback(() => {
    setResult(null);
    setErr("");
  }, []);

  return { publish, busy, err, result, reset };
}

/** Close a survey/poll to new responses (owner token required). */
export async function closeItem(code, token, closed = true) {
  try {
    const res = await fetch(`/api/hosted/${code}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, closed }),
    });
    const json = await res.json();
    return Boolean(res.ok && !json.error);
  } catch (e) {
    return false;
  }
}

/**
 * The "it's live" panel. `publicPath` is where visitors go; `resultsPath` is
 * the private link (omit it for tools with nothing to collect).
 */
export function ShareBox({ entry, publicPath, resultsPath, publicLabel = "Share this link", children }) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const pub = `${origin}${publicPath}`;
  const res = resultsPath ? `${origin}${resultsPath}` : "";

  return (
    <div className="notice notice-ok" style={{ display: "block" }}>
      <strong style={{ display: "block", marginBottom: 10 }}>✅ It's live!</strong>

      <div className="fld">{publicLabel}</div>
      <div className="tool-controls" style={{ marginBottom: 12 }}>
        <input className="input" style={{ flex: 1 }} readOnly value={pub} onFocus={(e) => e.target.select()} />
        <CopyButton value={pub} />
        <a className="btn btn-sm btn-outline" href={publicPath} target="_blank" rel="noreferrer">
          Open
        </a>
      </div>

      {res ? (
        <>
          <div className="fld">Your private results link — keep this one to yourself</div>
          <div className="tool-controls" style={{ marginBottom: 6 }}>
            <input className="input" style={{ flex: 1 }} readOnly value={res} onFocus={(e) => e.target.select()} />
            <CopyButton value={res} />
            <a className="btn btn-sm btn-outline" href={resultsPath} target="_blank" rel="noreferrer">
              View
            </a>
          </div>
          <p className="hint" style={{ marginTop: 0 }}>
            Save the results link now. It contains the only key to your responses — we can't recover it for you.
          </p>
        </>
      ) : null}

      {children}
    </div>
  );
}

/** A list of things this browser has published, so creators can find them again. */
export function OwnedList({ kind, publicPath, resultsPath, emptyHint }) {
  const [items] = useState(() => (typeof window === "undefined" ? [] : loadOwned(kind)));
  if (!items.length) return emptyHint ? <p className="hint">{emptyHint}</p> : null;
  return (
    <div style={{ marginTop: 20 }}>
      <div className="fld" style={{ marginBottom: 8 }}>Published from this browser</div>
      <div className="stack-sm">
        {items.map((it) => (
          <div key={it.code} className="sheet flex-between" style={{ padding: "10px 14px", marginBottom: 6, gap: 10, flexWrap: "wrap" }}>
            <div style={{ minWidth: 0 }}>
              <strong style={{ fontSize: 15 }}>{it.title || "Untitled"}</strong>
              <div className="muted" style={{ fontSize: 12 }}>{new Date(it.at).toLocaleString()}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <a className="btn btn-sm btn-outline" href={publicPath(it)} target="_blank" rel="noreferrer">Open</a>
              {resultsPath ? (
                <a className="btn btn-sm" href={resultsPath(it)} target="_blank" rel="noreferrer">Results</a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
