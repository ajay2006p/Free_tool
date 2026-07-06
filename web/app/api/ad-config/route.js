import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic";

// Public: the website reads its live ad settings from here (set in the admin
// panel → Monetization). Falls back to env if nothing has been saved yet.
export async function GET() {
  const cfg = {
    enabled: true,
    mode: "adsterra",
    adsterraKey: process.env.NEXT_PUBLIC_ADSTERRA_KEY || "",
    width: Number(process.env.NEXT_PUBLIC_ADSTERRA_WIDTH || 728),
    height: Number(process.env.NEXT_PUBLIC_ADSTERRA_HEIGHT || 90),
    customCode: "",
  };
  try {
    const row = await prisma.setting.findUnique({ where: { key: "ads" } });
    if (row) Object.assign(cfg, JSON.parse(row.value));
  } catch (e) {}
  return NextResponse.json(cfg, { headers: { "Cache-Control": "public, max-age=30" } });
}
