import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic";

// Public: the website reads its live ad settings from here (set in the admin
// panel → Monetization). Falls back to the safe default below if nothing has
// been saved yet.
//
// Default is "none" — no third-party ad network is served. The old Adsterra
// default was removed for trust/Safe-Browsing reasons. AdSlot only ever renders
// mode:"custom" code that a site owner explicitly pastes (e.g. Google AdSense),
// so even a stale "adsterra" row in the DB will render nothing.
export async function GET() {
  const cfg = {
    enabled: true,
    mode: "none", // "none" | "custom"
    customCode: "",
    width: 728,
    height: 90,
  };
  try {
    const row = await prisma.setting.findUnique({ where: { key: "ads" } });
    if (row) Object.assign(cfg, JSON.parse(row.value));
  } catch (e) {}
  // Hard guard: never advertise a legacy network mode to the client.
  if (cfg.mode !== "custom") cfg.mode = "none";
  return NextResponse.json(cfg, { headers: { "Cache-Control": "public, max-age=30" } });
}
