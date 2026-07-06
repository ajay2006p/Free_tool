import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { isAuthed } from "../../../../lib/auth";
import { slugify } from "../../../../lib/utils";

const id = (p) => p.id;

export async function GET(_req, { params }) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const post = await prisma.post.findUnique({ where: { id: id(params) } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(request, { params }) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const postId = id(params);
  const existing = await prisma.post.findUnique({ where: { id: postId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let data;
  try { data = await request.json(); } catch (e) { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const title = (data.title ?? existing.title).trim();
  let slug = existing.slug;
  const wanted = slugify(data.slug || title);
  if (wanted && wanted !== existing.slug) {
    let base = wanted; slug = base; let n = 1;
    while (true) {
      const clash = await prisma.post.findUnique({ where: { slug } });
      if (!clash || clash.id === postId) break;
      slug = `${base}-${n++}`;
    }
  }

  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title, slug,
        excerpt: (data.excerpt ?? existing.excerpt).trim(),
        content: data.content ?? existing.content,
        coverImage: (data.coverImage ?? existing.coverImage).trim(),
        category: (data.category ?? existing.category).trim(),
        author: (data.author ?? existing.author).trim(),
        published: data.published !== undefined ? data.published !== false : existing.published,
        featured: data.featured !== undefined ? data.featured === true : existing.featured,
      },
    });
    return NextResponse.json({ ok: true, post });
  } catch (e) {
    return NextResponse.json({ error: "Could not update post" }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await prisma.post.delete({ where: { id: id(params) } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Could not delete post" }, { status: 500 });
  }
}
