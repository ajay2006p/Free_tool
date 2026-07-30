import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { KINDS, isKind, makeCode, makeToken, titleOf } from "../../../lib/hosted";

export const dynamic = "force-dynamic";

/* POST /api/hosted — publish a survey, a meeting poll or a mini site.
   Returns the public code plus the owner token (shown to the creator once). */
export async function POST(request) {
  let body = {};
  try {
    body = (await request.json()) || {};
  } catch (e) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const kind = String(body.kind || "");
  if (!isKind(kind)) return NextResponse.json({ error: "Unknown item type." }, { status: 400 });

  const data = typeof body.data === "string" ? body.data : JSON.stringify(body.data ?? null);
  if (!data || data === "null") return NextResponse.json({ error: "Nothing to publish." }, { status: 400 });
  if (Buffer.byteLength(data, "utf8") > KINDS[kind].maxData) {
    return NextResponse.json({ error: "This is too large to publish. Try trimming it down." }, { status: 413 });
  }
  try {
    JSON.parse(data);
  } catch (e) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const title = titleOf(body.title, "Untitled");
  const editToken = makeToken();

  try {
    let code = makeCode();
    let tries = 0;
    while (await prisma.hostedItem.findUnique({ where: { code } })) {
      code = makeCode();
      if (++tries > 5) code = makeCode(9);
    }
    await prisma.hostedItem.create({ data: { code, kind, title, data, editToken } });
    return NextResponse.json({ ok: true, code, editToken });
  } catch (e) {
    return NextResponse.json({ error: "Could not publish. Please try again." }, { status: 500 });
  }
}
