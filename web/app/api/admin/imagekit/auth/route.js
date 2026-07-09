import { NextResponse } from "next/server";
import crypto from "crypto";
import { isAuthed } from "../../../../../lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

  if (!token || !publicKey) {
    return NextResponse.json({ error: "ImageKit is not configured" }, { status: 400 });
  }

  const expire = Math.floor(Date.now() / 1000) + 60 * 10;
  const oneTimeToken = crypto.randomUUID();
  const signature = crypto.createHmac("sha1", token).update(`${oneTimeToken}${expire}`).digest("hex");

  return NextResponse.json({ signature, expire, token: oneTimeToken, publicKey });
}
