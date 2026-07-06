import { NextResponse } from "next/server";
import { getUser } from "../../../lib/userAuth";

export const dynamic = "force-dynamic";

// Normalizes different providers' responses into a common shape.
function normalize(data) {
  const arr = Array.isArray(data) ? data
    : data.results || data.data || data.items || data.places || data.businesses || [];
  if (!Array.isArray(arr)) return [];
  return arr.slice(0, 200).map((r) => ({
    name: r.name || r.title || r.business_name || r.company || "",
    address: r.address || r.full_address || r.formatted_address || r.location || "",
    phone: r.phone || r.phone_number || r.phoneNumber || r.telephone || "",
    website: r.website || r.site || r.url || r.domain || "",
    email: r.email || (Array.isArray(r.emails) ? r.emails[0] : "") || "",
    rating: r.rating || r.stars || r.score || "",
    category: r.category || r.type || r.categories || "",
  }));
}

export async function POST(request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "login_required" }, { status: 401 });

  const url = process.env.SCRAPER_API_URL;
  const key = process.env.SCRAPER_API_KEY || "";
  if (!url) return NextResponse.json({ error: "not_configured" });

  let body;
  try { body = await request.json(); } catch (e) { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const query = String(body.query || "").trim();
  const location = String(body.location || "").trim();
  const limit = Math.min(200, Math.max(1, Number(body.limit) || 20));
  if (!query) return NextResponse.json({ error: "Enter a search query." }, { status: 400 });

  try {
    // The uploaded provider decides the exact request shape. We send both a JSON
    // body and query-string params so most providers (Outscraper/SerpApi/Apify/
    // RapidAPI-style) work; adjust here if yours differs.
    const method = (process.env.SCRAPER_API_METHOD || "GET").toUpperCase();
    const headers = { Accept: "application/json" };
    if (key) { headers["X-API-Key"] = key; headers["Authorization"] = `Bearer ${key}`; headers["apikey"] = key; }

    let res;
    if (method === "POST") {
      headers["Content-Type"] = "application/json";
      res = await fetch(url, { method: "POST", headers, body: JSON.stringify({ query, location, limit, q: query }), cache: "no-store" });
    } else {
      const u = new URL(url);
      u.searchParams.set("query", query);
      u.searchParams.set("q", query);
      if (location) u.searchParams.set("location", location);
      u.searchParams.set("limit", String(limit));
      if (key && !u.searchParams.has("api_key")) u.searchParams.set("api_key", key);
      res = await fetch(u.toString(), { method: "GET", headers, cache: "no-store" });
    }

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return NextResponse.json({ error: `Provider returned ${res.status}. ${txt.slice(0, 160)}` });
    }
    const data = await res.json();
    const results = normalize(data);
    return NextResponse.json({ ok: true, results, count: results.length });
  } catch (e) {
    return NextResponse.json({ error: "Could not reach the scraper provider. Check SCRAPER_API_URL." });
  }
}
