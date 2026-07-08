import { prisma } from "../../lib/db";
import { site } from "../../lib/site";
import AdSlot from "../../components/AdSlot";
import BlogCard from "../../components/BlogCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog",
  description: "Articles, tutorials and tech news for developers, students and job seekers.",
  alternates: { canonical: `${site.url}/blog` },
};

async function getPosts() {
  try {
    return await prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } });
  } catch (e) {
    return [];
  }
}

export default async function BlogIndex() {
  const posts = await getPosts();
  return (
    <div className="container section">
      <div className="section-head">
        <h2>
          The Blog<span className="underline" />
        </h2>
        <p className="muted" style={{ fontFamily: "var(--sans)", fontSize: 15 }}>
          {posts.length} article{posts.length === 1 ? "" : "s"}
        </p>
      </div>
      {posts.length === 0 ? (
        <div className="sheet empty">No posts published yet.</div>
      ) : (
        <div className="blog-grid">
          {posts.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      )}
      <AdSlot label="In-feed banner" />
    </div>
  );
}
