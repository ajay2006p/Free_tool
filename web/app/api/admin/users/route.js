import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { isAuthed } from "../../../../lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    return NextResponse.json({ users });
  } catch (e) {
    return NextResponse.json({ error: String(e?.message || "Could not load users.") }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Could not delete user" }, { status: 500 });
  }
}
