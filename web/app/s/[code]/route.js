import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { site } from "../../../lib/site";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    const link = await prisma.shortLink.findUnique({ where: { code: params.code } });
    if (!link) return NextResponse.redirect(new URL("/", site.url));
    prisma.shortLink.update({ where: { id: link.id }, data: { clicks: { increment: 1 } } }).catch(() => {});
    return NextResponse.redirect(link.url);
  } catch (e) {
    return NextResponse.redirect(new URL("/", site.url));
  }
}
