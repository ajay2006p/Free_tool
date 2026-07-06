import { NextResponse } from "next/server";
import { getUser } from "../../../../lib/userAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getUser();
  return NextResponse.json({ user });
}
