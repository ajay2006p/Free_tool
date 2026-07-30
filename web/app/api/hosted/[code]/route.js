import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { KINDS, isCode, titleOf, tokenMatches } from "../../../../lib/hosted";

export const dynamic = "force-dynamic";

/* GET /api/hosted/<code> — the PUBLIC view: what the item is, never its
   answers. Surveys and polls expose only their questions here. */
export async function GET(_request, { params }) {
  if (!isCode(params.code)) return NextResponse.json({ error: "Not found." }, { status: 404 });
  try {
    const item = await prisma.hostedItem.findUnique({ where: { code: params.code } });
    if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
    prisma.hostedItem
      .update({ where: { id: item.id }, data: { views: { increment: 1 } } })
      .catch(() => {});
    return NextResponse.json({
      ok: true,
      kind: item.kind,
      title: item.title,
      data: item.data,
      closed: item.closed,
      accepts: Boolean(KINDS[item.kind]?.accepts),
    });
  } catch (e) {
    return NextResponse.json({ error: "Could not load this item." }, { status: 500 });
  }
}

/* PATCH /api/hosted/<code> — owner-only: edit the payload/title, or stop
   accepting new responses. Requires the token handed out at create time. */
export async function PATCH(request, { params }) {
  if (!isCode(params.code)) return NextResponse.json({ error: "Not found." }, { status: 404 });
  let body = {};
  try {
    body = (await request.json()) || {};
  } catch (e) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const item = await prisma.hostedItem.findUnique({ where: { code: params.code } });
    if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });
    if (!tokenMatches(item.editToken, body.token)) {
      return NextResponse.json({ error: "Not authorised." }, { status: 403 });
    }

    const patch = {};
    if (body.title != null) patch.title = titleOf(body.title, item.title);
    if (body.closed != null) patch.closed = Boolean(body.closed);
    if (body.data != null) {
      const data = typeof body.data === "string" ? body.data : JSON.stringify(body.data);
      if (Buffer.byteLength(data, "utf8") > KINDS[item.kind].maxData) {
        return NextResponse.json({ error: "This is too large to save." }, { status: 413 });
      }
      try {
        JSON.parse(data);
      } catch (e) {
        return NextResponse.json({ error: "Invalid request." }, { status: 400 });
      }
      patch.data = data;
    }
    if (!Object.keys(patch).length) return NextResponse.json({ ok: true });

    await prisma.hostedItem.update({ where: { id: item.id }, data: patch });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Could not save changes." }, { status: 500 });
  }
}
