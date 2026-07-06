import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic";

// Records a page view into the shared DB. Called by the client on each route
// change. Best-effort — never throws to the visitor.
export async function POST(request) {
  try {
    const { path, session, ref } = await request.json();
    if (!path || !session) return new Response(null, { status: 204 });
    await prisma.visit.create({
      data: {
        path: String(path).slice(0, 300),
        session: String(session).slice(0, 60),
        ref: String(ref || "").slice(0, 300),
      },
    });
  } catch (e) {}
  return new Response(null, { status: 204 });
}
