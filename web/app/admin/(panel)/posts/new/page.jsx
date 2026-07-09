import Link from "next/link";
import PostForm from "../../../../../components/admin/PostForm";

export const metadata = { title: "New post" };

export default function NewPostPage() {
  return (
    <div className="container">
      <Link href="/admin" className="muted" style={{ fontSize: 14 }}>← Back to dashboard</Link>
      <h1 style={{ fontSize: 30, margin: "10px 0 20px" }}>Write a new post</h1>
      <div className="sheet" style={{ padding: 26 }}><PostForm /></div>
    </div>
  );
}
