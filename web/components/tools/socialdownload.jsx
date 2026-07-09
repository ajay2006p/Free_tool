"use client";

import { useState } from "react";

const PLATFORMS = [
  ["youtube", "▶️ YouTube", /youtube\.com|youtu\.be/i],
  ["tiktok", "🎵 TikTok", /tiktok\.com/i],
  ["instagram", "📸 Instagram", /instagram\.com/i],
  ["facebook", "📘 Facebook", /facebook\.com|fb\.watch/i],
  ["twitter", "𝕏 Twitter/X", /twitter\.com|x\.com/i],
  ["pinterest", "📌 Pinterest", /pinterest\./i],
];

function fmtDuration(secs) {
  const s = Math.max(0, Math.floor(Number(secs) || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(r)}` : `${m}:${pad(r)}`;
}

function fmtSize(bytes) {
  const b = Number(bytes) || 0;
  if (!b) return "";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let v = b;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export function SocialMediaDownloader() {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [yt, setYt] = useState(null); // YouTube built-in result
  const [res, setRes] = useState(null); // external proxy result

  const detected = PLATFORMS.find(([, , re]) => re.test(url));
  const isYouTube = detected && detected[0] === "youtube";

  async function run() {
    if (!url.trim()) return;
    setBusy(true);
    setErr("");
    setYt(null);
    setRes(null);
    try {
      if (isYouTube) {
        const r = await fetch("/api/yt-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const data = await r.json();
        if (data.error) setErr(data.error);
        else if (!data.formats || !data.formats.length)
          setErr("No downloadable formats found for that video.");
        else setYt(data);
      } else {
        const r = await fetch("/api/social-download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const data = await r.json();
        if (data.error === "not_configured") setErr("not_configured");
        else if (data.error) setErr(data.error);
        else setRes(data);
      }
    } catch (e) {
      setErr("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function ytDownloadHref(f) {
    const params = new URLSearchParams({
      url,
      itag: String(f.itag),
      title: yt?.title || "video",
      container: f.container || "mp4",
    });
    return `/api/yt-download?${params.toString()}`;
  }

  return (
    <div className="tool">
      {/* Input row */}
      <div
        className="tool-controls"
        style={{
          background:
            "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
          padding: 6,
          borderRadius: "var(--radius)",
          gap: 6,
        }}
      >
        <input
          className="input"
          style={{ flex: 1, minWidth: 0 }}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run()}
          placeholder="Paste a video / reel / short link…"
          inputMode="url"
          autoComplete="off"
        />
        <button
          className="btn"
          onClick={run}
          disabled={busy}
          style={{ fontWeight: 800, whiteSpace: "nowrap" }}
        >
          {busy ? "⏳ Fetching…" : "⚡ Fetch"}
        </button>
      </div>

      {/* Platform detection badges */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "10px 0" }}>
        {PLATFORMS.map(([k, label]) => {
          const active = detected && detected[0] === k;
          return (
            <span
              key={k}
              className="badge"
              style={{
                background: active
                  ? "linear-gradient(135deg, var(--accent), var(--accent-2))"
                  : "var(--surface-2)",
                color: active ? "#fff" : "var(--text-soft)",
                border: "1px solid var(--border)",
                fontWeight: active ? 800 : 500,
                transform: active ? "scale(1.05)" : "none",
                transition: "all .15s ease",
              }}
            >
              {label}
              {active ? " ✓" : ""}
            </span>
          );
        })}
      </div>

      {/* Engine mode hint */}
      {url.trim() ? (
        <p className="hint" style={{ marginTop: 0 }}>
          {isYouTube ? (
            <>
              <strong style={{ color: "var(--accent)" }}>Built-in engine</strong> — no
              API key needed for YouTube.
            </>
          ) : detected ? (
            <>
              Using the connected downloader API for{" "}
              <strong>{detected[1].replace(/^[^\s]+\s/, "")}</strong>.
            </>
          ) : (
            "Paste a link from YouTube, TikTok, Instagram, Facebook, X or Pinterest."
          )}
        </p>
      ) : null}

      {/* Errors / notices */}
      {err === "not_configured" ? (
        <div className="notice notice-warn">
          <strong>Almost ready.</strong> Connect a downloader API to switch on
          non-YouTube platforms (free tier available):
          <ol style={{ margin: "8px 0 0 18px", fontSize: 13 }}>
            <li>Get a free key on RapidAPI (search "Social Media Video Downloader").</li>
            <li>
              Put it in <code>web/.env</code> → <code>SOCIAL_DL_API_URL</code>,{" "}
              <code>SOCIAL_DL_API_KEY</code>, <code>SOCIAL_DL_API_HOST</code>.
            </li>
            <li>Restart the site — this tool works instantly.</li>
          </ol>
        </div>
      ) : err ? (
        <div className="result-err">{err}</div>
      ) : null}

      {/* YouTube built-in result */}
      {yt ? (
        <div className="sheet" style={{ padding: 0, overflow: "hidden" }}>
          {/* Header with thumbnail */}
          <div
            style={{
              display: "flex",
              gap: 14,
              padding: 16,
              flexWrap: "wrap",
              background:
                "linear-gradient(135deg, var(--surface-2), var(--surface))",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {yt.thumbnail ? (
              <img
                src={yt.thumbnail}
                alt=""
                style={{
                  width: 180,
                  maxWidth: "100%",
                  aspectRatio: "16 / 9",
                  objectFit: "cover",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)",
                }}
              />
            ) : null}
            <div style={{ flex: 1, minWidth: 200 }}>
              {yt.title ? (
                <p style={{ fontWeight: 800, fontSize: 16, margin: "0 0 8px" }}>
                  {yt.title}
                </p>
              ) : null}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {yt.duration ? (
                  <span className="badge" style={{ background: "var(--surface-2)" }}>
                    ⏱ {fmtDuration(yt.duration)}
                  </span>
                ) : null}
                {yt.author ? (
                  <span className="badge" style={{ background: "var(--surface-2)" }}>
                    👤 {yt.author}
                  </span>
                ) : null}
                <span
                  className="badge"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent-2))",
                    color: "#fff",
                  }}
                >
                  {yt.formats.length} formats
                </span>
              </div>
            </div>
          </div>

          {/* Format list */}
          <div style={{ padding: "4px 16px 12px" }}>
            {yt.formats.map((f) => (
              <div
                key={f.itag}
                className="flex-between"
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid var(--border)",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>
                    {f.type === "audio" ? "🎵" : "🎬"}
                  </span>
                  <span>
                    <strong style={{ fontSize: 15 }}>{f.quality}</strong>
                    <span
                      style={{
                        color: "var(--text-soft)",
                        fontSize: 13,
                        marginLeft: 8,
                      }}
                    >
                      {(f.container || "").toUpperCase()}
                      {f.type === "video" ? " · with sound" : " · audio only"}
                      {fmtSize(f.size) ? ` · ${fmtSize(f.size)}` : ""}
                    </span>
                  </span>
                </span>
                <a
                  className="btn btn-sm"
                  href={ytDownloadHref(f)}
                  download
                  style={{ fontWeight: 700, whiteSpace: "nowrap" }}
                >
                  ⬇ Download
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* External proxy result (non-YouTube) */}
      {res ? (
        <div className="sheet" style={{ padding: 16 }}>
          {res.thumbnail ? (
            <img
              src={res.thumbnail}
              alt=""
              style={{
                maxHeight: 180,
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
              }}
            />
          ) : null}
          {res.title ? (
            <p style={{ fontWeight: 800, margin: "10px 0" }}>{res.title}</p>
          ) : null}
          <div>
            {res.medias.map((m, i) => (
              <div
                key={i}
                className="flex-between"
                style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}
              >
                <span style={{ fontSize: 14 }}>
                  {m.type === "audio" ? "🎵" : "🎬"} {m.quality || m.type}{" "}
                  {m.ext ? `· ${m.ext}` : ""}
                </span>
                <a
                  className="btn btn-sm"
                  href={m.url}
                  target="_blank"
                  rel="noreferrer"
                  download
                >
                  ⬇ Download
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Honest engine note */}
      <p className="hint" style={{ marginTop: 12 }}>
        ℹ️ The built-in YouTube engine works best from your own machine or a
        residential IP. On some cloud hosts YouTube may rate-limit requests — if that
        happens, connect a downloader API in settings as a fallback.
      </p>
      <p className="hint">
        Only download content you own or have the right to use. Respect each
        platform's terms and copyright.
      </p>
    </div>
  );
}
