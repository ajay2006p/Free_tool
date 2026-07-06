import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Normalizes different downloader-API responses into { title, thumbnail, medias:[{url,quality,type,ext}] }
function normalize(data) {
  const title = data.title || data.text || data.meta?.title || "";
  const thumbnail = data.thumbnail || data.thumb || data.cover || data.meta?.image || "";
  let arr = data.medias || data.links || data.formats || data.url || data.data || data.result || [];
  if (arr && !Array.isArray(arr) && Array.isArray(arr.medias)) arr = arr.medias;
  if (!Array.isArray(arr)) arr = [];
  const medias = arr.map((m) => ({
    url: m.url || m.link || m.download || m.src || "",
    quality: m.quality || m.label || m.resolution || m.format_id || "",
    type: (m.type || m.mediaType || (m.audio ? "audio" : "video")) + "",
    ext: m.extension || m.ext || m.format || "",
  })).filter((m) => m.url);
  return { title, thumbnail, medias };
}

export async function POST(request) {
  const apiUrl = process.env.SOCIAL_DL_API_URL;
  const key = process.env.SOCIAL_DL_API_KEY || "";
  const host = process.env.SOCIAL_DL_API_HOST || "";
  if (!apiUrl) return NextResponse.json({ error: "not_configured" });

  let url = "";
  try { url = String((await request.json())?.url || "").trim(); } catch (e) {}
  if (!/^https?:\/\//i.test(url)) return NextResponse.json({ error: "Paste a valid link (https://…)." }, { status: 400 });

  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (key) { headers["X-RapidAPI-Key"] = key; headers["x-rapidapi-key"] = key; headers["Authorization"] = `Bearer ${key}`; headers["x-api-key"] = key; }
  if (host) { headers["X-RapidAPI-Host"] = host; headers["x-rapidapi-host"] = host; }

  try {
    const method = (process.env.SOCIAL_DL_API_METHOD || "POST").toUpperCase();
    let res;
    if (method === "GET") {
      const u = new URL(apiUrl); u.searchParams.set("url", url);
      res = await fetch(u.toString(), { method: "GET", headers, cache: "no-store" });
    } else {
      res = await fetch(apiUrl, { method: "POST", headers, body: JSON.stringify({ url }), cache: "no-store" });
    }
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return NextResponse.json({ error: `Provider returned ${res.status}. ${txt.slice(0, 140)}` });
    }
    const data = await res.json();
    const out = normalize(data);
    if (!out.medias.length) return NextResponse.json({ error: "No downloadable media found for that link." });
    return NextResponse.json({ ok: true, ...out });
  } catch (e) {
    return NextResponse.json({ error: "Could not reach the downloader provider. Check SOCIAL_DL_API_URL." });
  }
}
