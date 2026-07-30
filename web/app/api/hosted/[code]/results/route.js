import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db";
import { isCode, tokenMatches } from "../../../../../lib/hosted";

export const dynamic = "force-dynamic";

/* GET /api/hosted/<code>/results?token=… — read the submissions.
 *
 * Surveys need the owner token: answers are private to whoever made the form.
 * Meeting polls are deliberately public — seeing when everyone else is free is
 * the entire point of the tool, and a per-person grid is only useful shared. */
export async function GET(request, { params }) {
  if (!isCode(params.code)) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const token = new URL(request.url).searchParams.get("token") || "";

  try {
    const item = await prisma.hostedItem.findUnique({ where: { code: params.code } });
    if (!item) return NextResponse.json({ error: "Not found." }, { status: 404 });

    const owner = tokenMatches(item.editToken, token);
    if (item.kind !== "poll" && !owner) {
      return NextResponse.json({ error: "Not authorised." }, { status: 403 });
    }

    const rows = await prisma.hostedResponse.findMany({
      where: { code: item.code },
      orderBy: { createdAt: "asc" },
      take: 5000,
    });

    return NextResponse.json({
      ok: true,
      owner,
      kind: item.kind,
      title: item.title,
      data: item.data,
      closed: item.closed,
      count: rows.length,
      responses: rows.map((r) => ({ at: r.createdAt, data: r.data })),
    });
  } catch (e) {
    return NextResponse.json({ error: "Could not load the responses." }, { status: 500 });
  }
}
