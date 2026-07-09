import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { isAuthed } from "../../../../lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const links = await prisma.shortLink.findMany({ orderBy: { createdAt: "desc" }, take: 500 });
    return NextResponse.json({ links });
  } catch (e) {
    return NextResponse.json({ error: String(e?.message || "Could not load links.") }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  try {
    await prisma.shortLink.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Could not delete link" }, { status: 500 });
  }
}
