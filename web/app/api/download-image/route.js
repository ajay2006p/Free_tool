import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Same-origin proxy so cross-origin images (QR API, YouTube thumbnails, …)
// download as a real file instead of opening in a new tab. Browsers ignore the
// `download` attribute on cross-origin links; streaming the bytes back from our
// own origin with Content-Disposition: attachment forces the save on desktop
// and mobile alike. Host-allowlisted so this can't be used as an open proxy.
const ALLOWED = new Set([
  "api.qrserver.com",
  "img.youtube.com",
  "i.ytimg.com",
  "i9.ytimg.com",
]);

const EXT = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif", "image/svg+xml": "svg" };

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("url") || "";
  let name = (searchParams.get("name") || "download").replace(/[^\w.\-]/g, "_").slice(0, 80);

  let u;
  try { u = new URL(target); } catch { return new NextResponse("Bad url", { status: 400 }); }
  if (u.protocol !== "https:" || !ALLOWED.has(u.hostname)) {
    return new NextResponse("Host not allowed", { status: 403 });
  }

  try {
    const res = await fetch(u.toString(), { cache: "no-store" });
    if (!res.ok) return new NextResponse(`Upstream ${res.status}`, { status: 502 });
    const type = res.headers.get("content-type") || "application/octet-stream";
    if (!/^image\//i.test(type)) return new NextResponse("Not an image", { status: 502 });
    // Ensure the filename carries a sensible extension.
    const ext = EXT[type.split(";")[0].trim().toLowerCase()];
    if (ext && !new RegExp(`\\.${ext}$`, "i").test(name)) name += `.${ext}`;
    const buf = await res.arrayBuffer();
    return new NextResponse(buf, {
      headers: {
        "Content-Type": type,
        "Content-Disposition": `attachment; filename="${name}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new NextResponse("Fetch failed", { status: 502 });
  }
}
