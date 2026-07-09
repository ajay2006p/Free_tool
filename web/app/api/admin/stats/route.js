import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { isAuthed } from "../../../../lib/adminAuth";

export const dynamic = "force-dynamic";

function dayKey(d) { return d.toISOString().slice(0, 10); }

async function adsterraEarnings() {
  const token = process.env.ADSTERRA_API_TOKEN;
  if (!token) return { connected: false };
  try {
    const now = new Date();
    const start = new Date(Date.now() - 6 * 86400000);
    const url = `https://api3.adsterratools.com/publisher/stats.json?start_date=${dayKey(start)}&finish_date=${dayKey(now)}&group_by[]=date`;
    const res = await fetch(url, { headers: { "X-API-Key": token, Accept: "application/json" }, cache: "no-store" });
    if (!res.ok) return { connected: false, error: `Adsterra API ${res.status}` };
    const data = await res.json();
    const items = data.items || data.dates || [];
    let revenue = 0, impressions = 0;
    for (const it of items) { revenue += Number(it.revenue || 0); impressions += Number(it.impression || it.impressions || 0); }
    return { connected: true, revenue, impressions };
  } catch (e) {
    return { connected: false, error: "Adsterra request failed" };
  }
}

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const emptyStats = (error = "") => NextResponse.json({
    totalViews: 0,
    todayViews: 0,
    uniqueVisitors: 0,
    liveUsers: 0,
    days: Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - (6 - i) * 86400000);
      return { key: dayKey(d), label: d.toLocaleDateString("en-US", { weekday: "short" }), count: 0 };
    }),
    topPages: [],
    referrers: [],
    earnings: {
      connected: false,
      cpm: Number(process.env.ADSTERRA_CPM || 0.6),
      estimated: 0,
      error: error || "Database unavailable",
    },
    at: new Date().toISOString(),
    error: error || "Database unavailable",
  });

  try {
    const now = Date.now();
    const fiveMin = new Date(now - 5 * 60000);
    const weekAgo = new Date(now - 7 * 86400000);
    const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);

    const [totalViews, todayViews, distinctAll, distinctLive, recent, topPages, refs] = await Promise.all([
      prisma.visit.count(),
      prisma.visit.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.visit.findMany({ distinct: ["session"], select: { session: true } }),
      prisma.visit.findMany({ where: { createdAt: { gte: fiveMin } }, distinct: ["session"], select: { session: true } }),
      prisma.visit.findMany({ where: { createdAt: { gte: weekAgo } }, select: { createdAt: true } }),
      prisma.visit.groupBy({ by: ["path"], _count: { path: true }, orderBy: { _count: { path: "desc" } }, take: 8 }),
      prisma.visit.groupBy({ by: ["ref"], _count: { ref: true }, where: { ref: { not: "" } }, orderBy: { _count: { ref: "desc" } }, take: 6 }),
    ]);

    // last 7 days buckets
    const days = [];
    for (let i = 6; i >= 0; i--) { const d = new Date(now - i * 86400000); days.push({ key: dayKey(d), label: d.toLocaleDateString("en-US", { weekday: "short" }), count: 0 }); }
    const idx = Object.fromEntries(days.map((d, i) => [d.key, i]));
    recent.forEach((v) => { const k = dayKey(new Date(v.createdAt)); if (k in idx) days[idx[k]].count++; });

    const uniqueVisitors = distinctAll.length;
    const liveUsers = distinctLive.length;

    const earnings = await adsterraEarnings();
    const cpm = Number(process.env.ADSTERRA_CPM || 0.6);
    const estRevenue = (totalViews / 1000) * cpm;

    return NextResponse.json({
      totalViews, todayViews, uniqueVisitors, liveUsers,
      days,
      topPages: topPages.map((p) => ({ path: p.path, count: p._count.path })),
      referrers: refs.map((r) => ({ ref: r.ref, count: r._count.ref })),
      earnings: {
        ...earnings,
        cpm,
        estimated: estRevenue,
      },
      at: new Date().toISOString(),
    });
  } catch (e) {
    const message = String(e?.message || "Database unavailable");
    return emptyStats(message);
  }
}
