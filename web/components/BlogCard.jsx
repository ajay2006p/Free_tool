import Link from "next/link";
import { formatDate, readingTime } from "../lib/utils";

// Colour + emoji per category — used for a nice fallback cover when a post
// has no cover image, so every card looks intentional.
const CAT = {
  General: ["#6366f1", "📄"], Programming: ["#0ea5e9", "💻"], AI: ["#8b5cf6", "🤖"],
  Career: ["#059669", "🎯"], Tutorials: ["#f59e0b", "📘"], "Tech News": ["#ef4444", "📰"],
  "Web Dev": ["#ec4899", "🌐"], DevOps: ["#14b8a6", "⚙️"], Reviews: ["#f97316", "⭐"],
  Productivity: ["#3b82f6", "✅"],
};

export default function BlogCard({ post }) {
  const [color, emoji] = CAT[post.category] || ["#6366f1", "📝"];
  return (
    <Link href={`/blog/${post.slug}`} className="blog-card">
      {post.coverImage ? (
        <img className="bc-cover" src={post.coverImage} alt={post.title} loading="lazy" />
      ) : (
        <div className="bc-cover bc-fallback" style={{ height: 168, background: `linear-gradient(135deg, ${color}, ${color}bb)` }}>
          <span>{emoji}</span>
        </div>
      )}
      <div className="bc-body">
        <span className="badge badge-cat" style={{ alignSelf: "flex-start", marginTop: 0 }}>{post.category}</span>
        <h3 className="bc-title">{post.title}</h3>
        <p className="bc-excerpt">{post.excerpt}</p>
        <div className="bc-meta">
          <span>{post.author}</span><span>·</span><span>{formatDate(post.createdAt)}</span>
          <span>·</span><span>{readingTime(post.content)} min read</span>
        </div>
      </div>
    </Link>
  );
}
