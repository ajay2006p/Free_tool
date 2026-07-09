import Link from "next/link";
import { prisma } from "../../../lib/db";
import { formatDate } from "../../../lib/adminUtils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

async function getData() {
  try {
    const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
    return { posts, error: null };
  } catch (e) {
    return { posts: [], error: e.message };
  }
}

export default async function Dashboard() {
  const { posts, error } = await getData();
  const published = posts.filter((p) => p.published).length;
  const drafts = posts.length - published;
  const views = posts.reduce((s, p) => s + (p.views || 0), 0);

  const STATS = [
    { ic: "📝", g: "g1", n: posts.length, l: "Total posts", trend: `${published} live` },
    { ic: "🌍", g: "g2", n: published, l: "Published", trend: `${drafts} draft${drafts === 1 ? "" : "s"}` },
    { ic: "👁️", g: "g3", n: views.toLocaleString(), l: "Total views", trend: "all time" },
    { ic: "✍️", g: "g4", n: drafts, l: "Drafts", trend: drafts ? "needs review" : "all clear" },
  ];

  return (
    <div className="container">
      <div className="page-head">
        <div>
          <span className="kicker">Control Center</span>
          <h1>Welcome <span className="grad">back</span> 👋</h1>
          <p className="sub">Everything about your website, in one place.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/admin/analytics" className="btn btn-outline">📈 Analytics</Link>
          <Link href="/admin/posts/new" className="btn">+ New post</Link>
        </div>
      </div>

      {error ? (
        <div className="notice notice-error">Database error: {error}. Check <code>DATABASE_URL</code> in web/.env and your MongoDB Atlas access.</div>
      ) : null}

      <div className="grid grid-4" style={{ marginBottom: 26 }}>
        {STATS.map((s, i) => (
          <div key={i} className={`stat reveal ${s.g}`}>
            <div className="s-top">
              <span className="s-ic">{s.ic}</span>
              <span className="s-trend">{s.trend}</span>
            </div>
            <h3>{s.n}</h3>
            <p>{s.l}</p>
          </div>
        ))}
      </div>

      <div className="flex-between" style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 20, margin: 0 }}>Recent posts</h2>
        <Link href="/admin/posts/new" className="btn btn-sm btn-outline">+ Add</Link>
      </div>

      <div className="sheet" style={{ padding: 8 }}>
        {posts.length === 0 ? (
          <div className="empty">No posts yet. <Link href="/admin/posts/new">Write your first post →</Link></div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Date</th><th>Views</th><th></th></tr></thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.title}</strong><div className="muted" style={{ fontSize: 12 }}>/blog/{p.slug}</div></td>
                    <td><span className="badge badge-cat">{p.category}</span></td>
                    <td><span className={`badge ${p.published ? "badge-live" : "badge-soon"}`}>{p.published ? "Published" : "Draft"}</span></td>
                    <td className="muted">{formatDate(p.createdAt)}</td>
                    <td className="muted">{p.views || 0}</td>
                    <td><div className="row-actions"><Link href={`/admin/posts/edit/${p.id}`} className="btn btn-sm btn-outline">Edit</Link></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
