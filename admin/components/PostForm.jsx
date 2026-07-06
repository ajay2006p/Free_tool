"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";
import RichEditor from "./RichEditor";

const CATEGORIES = ["General", "Programming", "AI", "Career", "Tutorials", "Tech News", "Web Dev", "DevOps", "Reviews"];

// The editor works in HTML. Older posts were written in Markdown, so convert
// them to HTML on load. If the text already contains tags, leave it as-is.
const looksLikeHtml = (s) => /<\/?[a-z][\s\S]*>/i.test(s);
const toHtml = (s) => (!s ? "" : looksLikeHtml(s) ? s : marked.parse(s));

export default function PostForm({ post }) {
  const isEdit = Boolean(post);
  const router = useRouter();
  const [form, setForm] = useState({
    title: post?.title || "", slug: post?.slug || "", category: post?.category || "General",
    excerpt: post?.excerpt || "", coverImage: post?.coverImage || "", author: post?.author || "Admin",
    content: toHtml(post?.content || ""), published: post ? post.published : true, featured: post ? post.featured : false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [aiTopic, setAiTopic] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiErr, setAiErr] = useState("");
  const up = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function generate() {
    if (!aiTopic.trim()) return;
    setAiBusy(true); setAiErr("");
    try {
      const res = await fetch("/api/generate-blog", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopic }),
      });
      const data = await res.json();
      if (data.error === "no_key") setAiErr("Add ANTHROPIC_API_KEY to admin/.env to enable AI blog generation, then restart the admin server.");
      else if (data.error) setAiErr(data.error);
      else if (data.post) {
        setForm((f) => ({ ...f, title: data.post.title || f.title, excerpt: data.post.excerpt || f.excerpt, category: data.post.category || f.category, content: data.post.content ? toHtml(data.post.content) : f.content, slug: "" }));
      }
    } catch (e) { setAiErr("Something went wrong."); }
    finally { setAiBusy(false); }
  }

  async function save(e) {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) { setError("Please add a title."); return; }
    setSaving(true);
    try {
      const res = await fetch(isEdit ? `/api/posts/${post.id}` : "/api/posts", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) { router.push("/"); router.refresh(); }
      else setError(data.error || "Could not save.");
    } catch (err) { setError("Something went wrong."); }
    finally { setSaving(false); }
  }

  async function remove() {
    if (!isEdit || !confirm("Delete this post permanently?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      if (res.ok) { router.push("/"); router.refresh(); }
      else { setError("Could not delete."); setSaving(false); }
    } catch (err) { setError("Something went wrong."); setSaving(false); }
  }

  return (
    <form onSubmit={save}>
      {error ? <div className="notice notice-error">{error}</div> : null}

      {!isEdit ? (
        <div className="card" style={{ marginBottom: 20, background: "var(--paper-2)", borderColor: "var(--accent-3)" }}>
          <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>✨ Write it for me (AI)</h3>
          <p className="muted" style={{ fontSize: 13, margin: "0 0 10px" }}>Enter a topic and let AI draft a professional, SEO-ready post you can review and publish.</p>
          <div className="flex-between" style={{ gap: 10 }}>
            <input className="input" style={{ flex: 1 }} value={aiTopic} onChange={(e) => setAiTopic(e.target.value)}
              placeholder="e.g. 10 free tools every web developer should bookmark" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); generate(); } }} />
            <button type="button" className="btn" onClick={generate} disabled={aiBusy}>{aiBusy ? "Writing…" : "Generate"}</button>
          </div>
          {aiErr ? <div className="notice notice-warn" style={{ marginTop: 10, marginBottom: 0 }}>{aiErr}</div> : null}
        </div>
      ) : null}

      <div className="grid grid-2">
        <div className="form-field"><label>Title</label>
          <input className="input" value={form.title} onChange={(e) => up("title", e.target.value)} placeholder="How to learn JavaScript in 2026" /></div>
        <div className="form-field"><label>Category</label>
          <select className="select" value={form.category} onChange={(e) => up("category", e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select></div>
      </div>
      <div className="form-field"><label>Excerpt (summary for cards &amp; SEO)</label>
        <input className="input" value={form.excerpt} onChange={(e) => up("excerpt", e.target.value)} placeholder="A beginner-friendly roadmap with free resources." /></div>
      <div className="grid grid-2">
        <div className="form-field"><label>Cover image URL (optional)</label>
          <input className="input" value={form.coverImage} onChange={(e) => up("coverImage", e.target.value)} placeholder="https://images.unsplash.com/..." /></div>
        <div className="form-field"><label>Author</label>
          <input className="input" value={form.author} onChange={(e) => up("author", e.target.value)} /></div>
      </div>
      <div className="form-field"><label>Slug (URL) — blank = auto from title</label>
        <input className="input" value={form.slug} onChange={(e) => up("slug", e.target.value)} placeholder="how-to-learn-javascript" /></div>
      <div className="form-field"><label>Content</label>
        <RichEditor value={form.content} onChange={(html) => up("content", html)}
          placeholder="Write your post here… use the toolbar above to format text, add headings, lists, links and images." />
        <div className="hint">Format with the toolbar (just like Blogger). Use the <strong>Compose</strong> tab to write visually, or <strong>HTML</strong> to edit the raw code.</div></div>
      <div className="flex-between">
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={form.published} onChange={(e) => up("published", e.target.checked)} /> Published</label>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={form.featured} onChange={(e) => up("featured", e.target.checked)} /> Featured</label>
      </div>
      <div className="flex-between mt-2">
        <div className="row-actions">
          <button className="btn" type="submit" disabled={saving}>{saving ? "Saving…" : isEdit ? "Update post" : "Publish post"}</button>
          <Link href="/" className="btn btn-outline">Cancel</Link>
        </div>
        {isEdit ? <button type="button" className="btn btn-accent" onClick={remove} disabled={saving}>Delete</button> : null}
      </div>
    </form>
  );
}
