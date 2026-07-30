import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db";
import { KINDS, MAX_RESPONSE_BYTES, isCode } from "../../../../../lib/hosted";

export const dynamic = "force-dynamic";

/* POST /api/hosted/<code>/respond — submit one survey response or one
   person's availability on a meeting poll. Open to anyone with the link;
   nobody can read back what others submitted from here. */
export async function POST(request, { params }) {
  if (!isCode(params.code)) return NextResponse.json({ error: "Not found." }, { status: 404 });

  let body = {};
  try {
    body = (await request.json()) || {};
  } catch (e) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const data = typeof body.data === "string" ? body.data : JSON.stringify(body.data ?? null);
  if (!data || data === "null") return NextResponse.json({ error: "Nothing to submit." }, { status: 400 });
  if (Buffer.byteLength(data, "utf8") > MAX_RESPONSE_BYTES) {
    return NextResponse.json({ error: "Your answers are too long to submit." }, { status: 413 });
  }
  try {
    JSON.parse(data);
  } catch (e) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const item = await prisma.hostedItem.findUnique({ where: { code: params.code } });
    if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const cfg = KINDS[item.kind];
    if (!cfg?.accepts) return NextResponse.json({ error: "This link does not take responses." }, { status: 400 });
    if (item.closed) return NextResponse.json({ error: "This is closed and no longer accepting responses." }, { status: 403 });

    // A per-item cap keeps one shared link from being used to fill the
    // database, without needing accounts or rate-limit infrastructure.
    const used = await prisma.hostedResponse.count({ where: { code: item.code } });
    if (used >= cfg.maxResponses) {
      return NextResponse.json({ error: "This has reached its response limit." }, { status: 429 });
    }

    await prisma.hostedResponse.create({ data: { code: item.code, data } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Could not submit your response." }, { status: 500 });
  }
}
