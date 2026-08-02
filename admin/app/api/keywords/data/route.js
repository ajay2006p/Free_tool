import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { isAuthed } from "../../../../lib/auth";
import { queryRows, isConfigured, siteUrl } from "../../../../lib/gsc";

export const dynamic = "force-dynamic";

function normalise(s) {
  return String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
}

/* A query's "opportunity" — high impressions with a poor position is where the
   most traffic is available for the least work, because Google is already
   showing the page and users are already searching for it. Something on page 2
   with thousands of impressions is worth more attention than a number-3 ranking
   nobody searches for. */
function opportunity(row) {
  if (!row || !row.impressions) return 0;
  if (row.position <= 3) return 0; // already at the top; little left to win
  const positionWeight = Math.min(row.position, 40) / 40;
  return Math.round(row.impressions * positionWeight);
}

export async function GET(request) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const days = Math.min(90, Math.max(7, Number(searchParams.get("days")) || 28));
  const save = searchParams.get("save") === "1";

  if (!isConfigured()) {
    return NextResponse.json({
      configured: false,
      site: siteUrl(),
      tracked: [],
      discovered: [],
    });
  }

  let current, previous;
  try {
    // Current window and the equivalent window immediately before it, so every
    // number can be shown as a movement rather than a bare figure.
    [current, previous] = await Promise.all([
      queryRows({ days }),
      queryRows({ days, offset: days }),
    ]);
  } catch (e) {
    return NextResponse.json({ configured: true, error: e.message, site: siteUrl(), tracked: [], discovered: [] });
  }

  let watchlist = [];
  try {
    watchlist = await prisma.keyword.findMany({ orderBy: { createdAt: "desc" } });
  } catch (e) {
    /* watchlist is optional — discovery below still works without it */
  }

  const tracked = watchlist.map((k) => {
    const key = normalise(k.phrase);
    const now = current.get(key) || null;
    const before = previous.get(key) || null;
    return {
      id: k.id,
      phrase: k.phrase,
      note: k.note,
      ranking: Boolean(now),
      position: now ? now.position : null,
      clicks: now ? now.clicks : 0,
      impressions: now ? now.impressions : 0,
      ctr: now ? now.ctr : 0,
      // Position improves as it falls, so the delta is inverted to make a
      // positive number mean "better" everywhere in the UI.
      positionChange: now && before ? Number((before.position - now.position).toFixed(1)) : null,
      clicksChange: now && before ? now.clicks - before.clicks : null,
      isNew: Boolean(now && !before),
      lost: Boolean(!now && before),
    };
  });

  // Everything Search Console saw, whether or not it is on the watchlist. This
  // is the "which keywords are actually working" half of the page — the terms
  // you rank for are usually not the terms you thought you were targeting.
  const discovered = [...current.values()]
    .map((r) => {
      const before = previous.get(normalise(r.phrase)) || null;
      return {
        ...r,
        positionChange: before ? Number((before.position - r.position).toFixed(1)) : null,
        clicksChange: before ? r.clicks - before.clicks : null,
        isNew: !before,
        opportunity: opportunity(r),
        tracked: watchlist.some((k) => normalise(k.phrase) === normalise(r.phrase)),
      };
    })
    .sort((a, b) => b.impressions - a.impressions);

  // Optionally record this refresh so movement stays visible later — Search
  // Console will not tell you next month what a position was today.
  if (save) {
    try {
      const rows = tracked
        .filter((t) => t.ranking)
        .map((t) => ({
          phrase: normalise(t.phrase),
          position: t.position || 0,
          clicks: t.clicks || 0,
          impressions: t.impressions || 0,
          ctr: t.ctr || 0,
          rangeDays: days,
        }));
      if (rows.length) await prisma.keywordSnapshot.createMany({ data: rows });
    } catch (e) {
      /* snapshotting is best-effort; never fail the response over it */
    }
  }

  const totals = discovered.reduce(
    (acc, r) => {
      acc.clicks += r.clicks;
      acc.impressions += r.impressions;
      return acc;
    },
    { clicks: 0, impressions: 0 }
  );

  return NextResponse.json({
    configured: true,
    site: siteUrl(),
    days,
    tracked,
    discovered: discovered.slice(0, 200),
    totals: {
      ...totals,
      queries: discovered.length,
      avgPosition: discovered.length
        ? Number((discovered.reduce((s, r) => s + r.position, 0) / discovered.length).toFixed(1))
        : 0,
    },
  });
}
