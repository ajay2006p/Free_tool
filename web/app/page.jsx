import Link from "next/link";
import { prisma } from "../lib/db";
import { visibleCategories, countTotal } from "../lib/catalog";
import { formatDate } from "../lib/utils";
import AdSlot from "../components/AdSlot";
import ToolSearch from "../components/ToolSearch";
import HeroShowcase from "../components/HeroShowcase";
import BlogCard from "../components/BlogCard";
import NativeAd from "../components/NativeAd";

export const dynamic = "force-dynamic";

const POPULAR = [
  ["📄 Resume Builder", "/career/resume-builder"],
  ["🧩 JSON Formatter", "/tools/json-formatter"],
  ["🔑 Password Generator", "/tools/password-generator"],
  ["🎮 Play 2048", "/games/game-2048"],
  ["🏠 Mortgage Calc", "/calculators/mortgage-calculator"],
  ["▶️ YouTube Thumbnail", "/social/youtube-thumbnail"],
  ["⌨️ Typing Test", "/productivity/typing-test"],
];

async function getLatestPosts() {
  try { return await prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 }); }
  catch (e) { return []; }
}

export default async function HomePage() {
  const posts = await getLatestPosts();
  const total = countTotal();

  return (
    <>
      <section className="hero hero-split container">
        <div className="hero-copy">
          <span className="kicker">{total} free tools · no signup</span>
          <h1>Every tool you need,<br /><span className="mark">in one place.</span></h1>
          <p className="lead">Formatters, converters, calculators, SEO & social media helpers and productivity apps — free, fast, and private in your browser.</p>
          <div className="chips">
            {POPULAR.map(([label, href]) => <Link key={href} href={href} className="chip">{label}</Link>)}
          </div>
        </div>
        <HeroShowcase />
      </section>

      <section className="container" style={{ paddingBottom: 10 }}>
        <ToolSearch categories={visibleCategories} />
      </section>

      <div className="container"><AdSlot label="Banner" /></div>

      <NativeAd />

      <section className="section container">
        <div className="section-head"><h2>From the blog</h2><Link href="/blog" className="btn btn-outline btn-sm">All posts</Link></div>
        {posts.length === 0 ? (
          <div className="sheet empty">No posts yet.</div>
        ) : (
          <div className="blog-grid">
            {posts.map((p) => <BlogCard key={p.id} post={p} />)}
          </div>
        )}
      </section>

      <div className="container"><AdSlot label="Footer banner" /></div>
    </>
  );
}
