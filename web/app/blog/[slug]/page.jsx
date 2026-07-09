import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { prisma } from "../../../lib/db";
import { site } from "../../../lib/site";
import { formatDate, readingTime } from "../../../lib/utils";
import AdSlot from "../../../components/AdSlot";

export const dynamic = "force-dynamic";

const looksLikeHtml = (s) => /<\/?[a-z][\s\S]*>/i.test(s);
const toHtml = (s) => (!s ? "" : looksLikeHtml(s) ? s : marked.parse(s));

// A clean meta description: strip HTML, collapse whitespace, cap near Google's
// ~155-char truncation point at a word boundary. Prevents the full multi-hundred
// -char excerpt from being emitted as the <meta description>/og:description.
function metaDescription(raw, max = 155) {
  const text = String(raw || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const at = cut.lastIndexOf(" ");
  return (at > 60 ? cut.slice(0, at) : cut).replace(/[\s,;:.\-]+$/, "") + "…";
}

// Keep exactly one <h1> per page (the post title, rendered by the page itself).
// Drop empty headings left by rich-text editors and demote any stray <h1> in the
// body to <h2> so the document outline stays valid.
function fixHeadings(html) {
  return String(html || "")
    .replace(/<h([1-6])[^>]*>(?:\s|<br\s*\/?>|&nbsp;)*<\/h\1>/gi, "")
    .replace(/<(\/?)h1(\s[^>]*)?>/gi, (_m, slash, attrs) => `<${slash}h2${attrs || ""}>`);
}

async function getPost(slug) {
  try {
    return await prisma.post.findUnique({ where: { slug } });
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post not found" };
  const description = metaDescription(post.excerpt);
  return {
    title: post.title,
    description,
    alternates: { canonical: `${site.url}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `${site.url}/blog/${post.slug}`,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function PostPage({ params }) {
  const post = await getPost(params.slug);
  if (!post || !post.published) notFound();

  prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {});
  const html = fixHeadings(toHtml(post.content || ""));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    image: post.coverImage || undefined,
  };

  return (
    <article className="container container-narrow article">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="crumbs">
        <Link href="/">Home</Link> / <Link href="/blog">Blog</Link> / {post.category}
      </div>
      <div>
        <span className="badge badge-cat">{post.category}</span>
      </div>
      <h1>{post.title}</h1>
      <div className="meta">
        By {post.author} · {formatDate(post.createdAt)} · {readingTime(post.content)} min read
      </div>
      {post.coverImage ? (
        <img
          className="cover"
          style={{ height: "auto", maxHeight: 420, marginTop: 18 }}
          src={post.coverImage}
          alt={post.title}
        />
      ) : null}
      <AdSlot label="Top of article" />
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      <AdSlot label="End of article" />
      <div className="center mt-4">
        <Link href="/blog" className="btn btn-outline">
          ← More articles
        </Link>
      </div>
    </article>
  );
}
