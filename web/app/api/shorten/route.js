import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic";

const ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";
function code(len = 6) {
  const b = crypto.randomBytes(len);
  return [...b].map((n) => ALPHABET[n % ALPHABET.length]).join("");
}

export async function POST(request) {
  let url = "";
  try { url = String((await request.json())?.url || "").trim(); } catch (e) {}
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try { new URL(url); } catch (e) { return NextResponse.json({ error: "Enter a valid URL." }, { status: 400 }); }
  if (url.length > 2000) return NextResponse.json({ error: "URL is too long." }, { status: 400 });

  try {
    let c = code(), tries = 0;
    while (await prisma.shortLink.findUnique({ where: { code: c } })) { c = code(); if (++tries > 5) c = code(8); }
    const link = await prisma.shortLink.create({ data: { code: c, url } });
    return NextResponse.json({ ok: true, code: link.code });
  } catch (e) {
    return NextResponse.json({ error: "Could not shorten the link." }, { status: 500 });
  }
}
