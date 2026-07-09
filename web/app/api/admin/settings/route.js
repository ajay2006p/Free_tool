import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { isAuthed } from "../../../../lib/adminAuth";

export const dynamic = "force-dynamic";

function defaults() {
  return {
    enabled: true,
    mode: "adsterra",
    adsterraKey: process.env.NEXT_PUBLIC_ADSTERRA_KEY || "",
    width: Number(process.env.NEXT_PUBLIC_ADSTERRA_WIDTH || 728),
    height: Number(process.env.NEXT_PUBLIC_ADSTERRA_HEIGHT || 90),
    customCode: "",
  };
}

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const row = await prisma.setting.findUnique({ where: { key: "ads" } });
    const cfg = row ? { ...defaults(), ...JSON.parse(row.value) } : defaults();
    return NextResponse.json({ ads: cfg });
  } catch (e) {
    return NextResponse.json({ ads: defaults() });
  }
}

export async function POST(request) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body;
  try { body = await request.json(); } catch (e) { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const cfg = {
    enabled: body.enabled !== false,
    mode: body.mode === "custom" ? "custom" : "adsterra",
    adsterraKey: String(body.adsterraKey || "").trim().slice(0, 100),
    width: Math.max(0, Math.min(2000, Number(body.width) || 728)),
    height: Math.max(0, Math.min(2000, Number(body.height) || 90)),
    customCode: String(body.customCode || "").slice(0, 20000),
  };
  try {
    await prisma.setting.upsert({ where: { key: "ads" }, update: { value: JSON.stringify(cfg) }, create: { key: "ads", value: JSON.stringify(cfg) } });
    return NextResponse.json({ ok: true, ads: cfg });
  } catch (e) {
    return NextResponse.json({ error: "Could not save the ad settings." }, { status: 500 });
  }
}
