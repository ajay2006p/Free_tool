import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../../../lib/db";
import PostForm from "../../../../../../components/admin/PostForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit post" };

export default async function EditPostPage({ params }) {
  const id = params.id;
  let post = null;
  try { post = await prisma.post.findUnique({ where: { id } }); } catch (e) { post = null; }
  if (!post) notFound();
  return (
    <div className="container">
      <Link href="/admin" className="muted" style={{ fontSize: 14 }}>← Back to dashboard</Link>
      <h1 style={{ fontSize: 30, margin: "10px 0 20px" }}>Edit post</h1>
      <div className="sheet" style={{ padding: 26 }}><PostForm post={post} /></div>
    </div>
  );
}
