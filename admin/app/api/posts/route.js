import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { isAuthed } from "../../../lib/auth";
import { slugify } from "../../../lib/utils";

const toText = (value) =>
  (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ posts });
}

export async function POST(request) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let data;
  try { data = await request.json(); } catch (e) { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const title = (data.title || "").trim();
  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  let base = slugify(data.slug || title) || "post";
  let slug = base, n = 1;
  while (await prisma.post.findUnique({ where: { slug } })) slug = `${base}-${n++}`;

  try {
    const post = await prisma.post.create({
      data: {
        title, slug,
        excerpt: (data.excerpt || "").trim(),
        content: toText(data.content),
        coverImage: (data.coverImage || "").trim(),
        category: (data.category || "General").trim(),
        author: (data.author || "Admin").trim(),
        published: data.published !== false,
        featured: data.featured === true,
      },
    });
    return NextResponse.json({ ok: true, post }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Could not create post" }, { status: 500 });
  }
}
