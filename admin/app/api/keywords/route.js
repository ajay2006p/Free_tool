import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { isAuthed } from "../../../lib/auth";

export const dynamic = "force-dynamic";

// Normalise before storing and before matching. Search Console reports queries
// lowercased with collapsed whitespace, so storing "JSON  Formatter" would
// never match the "json formatter" that comes back and the keyword would look
// permanently unranked.
function normalise(s) {
  return String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
}

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const keywords = await prisma.keyword.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ keywords });
  } catch (e) {
    return NextResponse.json({ keywords: [], error: e.message });
  }
}

export async function POST(request) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({}));

  // Accept a pasted block as well as a single term — adding keywords one at a
  // time is the main reason a watchlist never gets populated.
  const raw = String(body.phrase || "");
  const phrases = [...new Set(raw.split(/[\n,]/).map(normalise).filter(Boolean))];
  if (!phrases.length) return NextResponse.json({ error: "Enter at least one keyword." }, { status: 400 });

  const note = String(body.note || "").slice(0, 300);
  let added = 0;
  const skipped = [];

  // Check before inserting rather than relying on the @unique constraint alone.
  // On MongoDB that constraint is enforced by an index that only exists once
  // `prisma db push` has run, so a fresh database would silently accept
  // duplicates and the watchlist would fill with repeats.
  let existing = new Set();
  try {
    const rows = await prisma.keyword.findMany({ select: { phrase: true } });
    existing = new Set(rows.map((r) => normalise(r.phrase)));
  } catch (e) {
    return NextResponse.json({ error: `Database unavailable: ${e.message}` }, { status: 500 });
  }

  for (const phrase of phrases) {
    if (phrase.length > 200) { skipped.push(phrase.slice(0, 40) + "…"); continue; }
    if (existing.has(phrase)) { skipped.push(phrase); continue; }
    try {
      await prisma.keyword.create({ data: { phrase, note } });
      existing.add(phrase);
      added++;
    } catch (e) {
      // Lost a race, or the unique index rejected it — already tracked either way.
      skipped.push(phrase);
    }
  }
  return NextResponse.json({ added, skipped });
}

export async function DELETE(request) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  try {
    await prisma.keyword.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
