import { NextResponse } from "next/server";
import { SESSION_COOKIE, sessionToken } from "../../../lib/auth";

export async function POST(request) {
  let password = "";
  try { password = (await request.json())?.password || ""; } catch (e) {}

  const expected = process.env.ADMIN_PASSWORD || "admin123";
  if (password !== expected) {
    return NextResponse.json({ ok: false, error: "Wrong password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, sessionToken(), {
    httpOnly: true, sameSite: "lax", path: "/",
    secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
