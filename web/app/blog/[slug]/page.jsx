import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { prisma } from "../../../lib/db";
import { site } from "../../../lib/site";
import { formatDate, readingTime } from "../../../lib/utils";
import AdSlot from "../../../components/AdSlot";

export const dynamic = "force-dynamic";

async function getPost(slug) {
  try { return await prisma.post.findUnique({ where: { slug } }); }
  catch (e) { return null; }
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${site.url}/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article", images: post.coverImage ? [post.coverImage] : [] },
  };
}

export default async function PostPage({ params }) {
  const post = await getPost(params.slug);
  if (!post || !post.published) notFound();

  prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {});
  const html = marked.parse(post.content || "");

  const jsonLd = {
    "@context": "https://schema.org", "@type": "BlogPosting",
    headline: post.title, description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    image: post.coverImage || undefined,
  };

  return (
    <article className="container container-narrow article">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="crumbs"><Link href="/">Home</Link> / <Link href="/blog">Blog</Link> / {post.category}</div>
      <div><span className="badge badge-cat">{post.category}</span></div>
      <h1>{post.title}</h1>
      <div className="meta">By {post.author} · {formatDate(post.createdAt)} · {readingTime(post.content)} min read</div>
      {post.coverImage ? <img className="cover" style={{ height: "auto", maxHeight: 420, marginTop: 18 }} src={post.coverImage} alt={post.title} /> : null}
      <AdSlot label="Top of article" />
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      <AdSlot label="End of article" />
      <div className="center mt-4"><Link href="/blog" className="btn btn-outline">← More articles</Link></div>
    </article>
  );
}
