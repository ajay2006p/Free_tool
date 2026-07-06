import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { hashPassword, makeToken, validEmail, USER_COOKIE } from "../../../../lib/userAuth";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch (e) { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const name = String(body.name || "").trim().slice(0, 60);

  if (!validEmail(email)) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    const user = await prisma.user.create({ data: { email, name, passwordHash: hashPassword(password) } });
    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
    res.cookies.set(USER_COOKIE, makeToken(user.id), { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 30 });
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }
}
