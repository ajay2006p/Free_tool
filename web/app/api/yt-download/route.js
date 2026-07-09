import { Readable } from "stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function contentTypeFor(container) {
  switch ((container || "").toLowerCase()) {
    case "mp4":
      return "video/mp4";
    case "m4a":
      return "audio/mp4";
    case "webm":
      return "video/webm";
    case "mp3":
      return "audio/mpeg";
    default:
      return "application/octet-stream";
  }
}

function safeName(name) {
  return (name || "download")
    .replace(/[\\/:*?"<>|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120) || "download";
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = String(searchParams.get("url") || "").trim();
  const itag = String(searchParams.get("itag") || "").trim();
  const title = String(searchParams.get("title") || "video").trim();
  const container = String(searchParams.get("container") || "mp4").trim();

  if (!url) {
    return new Response("Missing url.", { status: 400 });
  }

  let ytdl;
  try {
    ytdl = (await import("@distube/ytdl-core")).default;
  } catch (e) {
    return new Response("Downloader engine unavailable.", { status: 500 });
  }

  if (!ytdl.validateURL(url)) {
    return new Response("Invalid YouTube link.", { status: 400 });
  }

  try {
    const options = itag ? { quality: itag } : { quality: "highest" };
    const nodeStream = ytdl(url, options);

    // Surface stream errors so they don't crash the process silently.
    nodeStream.on("error", () => {
      try {
        nodeStream.destroy();
      } catch (e) {}
    });

    const webStream = Readable.toWeb(nodeStream);
    const filename = `${safeName(title)}.${container || "mp4"}`;

    return new Response(webStream, {
      headers: {
        "Content-Type": contentTypeFor(container),
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return new Response("Could not start the download. Try again.", { status: 500 });
  }
}
