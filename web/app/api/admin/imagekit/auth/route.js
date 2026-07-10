import { NextResponse } from "next/server";
import crypto from "crypto";
import { isAuthed } from "../../../../../lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

  if (!privateKey || !publicKey) {
    return NextResponse.json({ error: "ImageKit is not configured" }, { status: 400 });
  }

  // ImageKit rejects the upload with an opaque 403 if these are swapped, so check
  // the prefixes here where we can say which key is in the wrong slot.
  if (!privateKey.startsWith("private_")) {
    return NextResponse.json({ error: "IMAGEKIT_PRIVATE_KEY must be the private_... key" }, { status: 500 });
  }
  if (!publicKey.startsWith("public_")) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY must be the public_... key from ImageKit > Developer options > API keys" },
      { status: 500 }
    );
  }

  const expire = Math.floor(Date.now() / 1000) + 60 * 10;
  const oneTimeToken = crypto.randomUUID();
  const signature = crypto.createHmac("sha1", privateKey).update(`${oneTimeToken}${expire}`).digest("hex");

  return NextResponse.json({ signature, expire, token: oneTimeToken, publicKey });
}
