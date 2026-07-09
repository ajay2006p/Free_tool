import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BLOCKED_MSG =
  "YouTube blocked this request — try again, or configure a downloader API in settings.";

function pickThumbnail(details) {
  const thumbs = details?.thumbnails || [];
  if (!thumbs.length) return "";
  // highest resolution = largest width
  return thumbs.reduce((best, t) => (t.width > (best?.width || 0) ? t : best), thumbs[0]).url;
}

export async function POST(request) {
  let url = "";
  try {
    url = String((await request.json())?.url || "").trim();
  } catch (e) {}

  if (!url) {
    return NextResponse.json({ error: "Enter a valid YouTube link." }, { status: 400 });
  }

  let ytdl;
  try {
    ytdl = (await import("@distube/ytdl-core")).default;
  } catch (e) {
    return NextResponse.json({ error: "Downloader engine unavailable." }, { status: 500 });
  }

  if (!ytdl.validateURL(url)) {
    return NextResponse.json({ error: "Enter a valid YouTube link." }, { status: 400 });
  }

  try {
    const info = await ytdl.getInfo(url);
    const details = info.videoDetails || {};
    const allFormats = info.formats || [];

    // (a) Progressive mp4 formats: video + audio in one file
    const progressive = allFormats
      .filter((f) => f.hasVideo && f.hasAudio)
      .map((f) => ({
        itag: f.itag,
        quality: f.qualityLabel || (f.height ? `${f.height}p` : "video"),
        container: f.container || "mp4",
        hasAudio: true,
        type: "video",
        size: f.contentLength || "",
        height: f.height || 0,
      }));

    // (b) Audio-only formats, prefer mp4/m4a containers
    const audio = allFormats
      .filter((f) => f.hasAudio && !f.hasVideo)
      .map((f) => ({
        itag: f.itag,
        quality: `${Math.round(f.audioBitrate || 0)}kbps`,
        container: f.container || "m4a",
        type: "audio",
        size: f.contentLength || "",
        height: 0,
        preferred: /mp4|m4a/i.test(f.container || ""),
      }));

    // Prefer m4a/mp4 audio, but keep others as fallback
    const preferredAudio = audio.filter((a) => a.preferred);
    const audioOut = (preferredAudio.length ? preferredAudio : audio).map(
      ({ preferred, ...rest }) => rest
    );

    // Dedupe by itag
    const seen = new Set();
    let formats = [...progressive, ...audioOut].filter((f) => {
      if (seen.has(f.itag)) return false;
      seen.add(f.itag);
      return true;
    });

    // Sort: videos by height desc first, then audio
    formats.sort((a, b) => {
      if (a.type !== b.type) return a.type === "video" ? -1 : 1;
      return (b.height || 0) - (a.height || 0);
    });

    formats = formats.map(({ height, ...rest }) => rest);

    return NextResponse.json({
      ok: true,
      title: details.title || "",
      thumbnail: pickThumbnail(details),
      duration: Number(details.lengthSeconds || 0),
      author: details.author?.name || details.ownerChannelName || "",
      formats,
    });
  } catch (e) {
    return NextResponse.json({ error: BLOCKED_MSG }, { status: 502 });
  }
}
