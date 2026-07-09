import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container container-narrow section center">
      <div className="sheet" style={{ padding: "clamp(24px, 7vw, 44px)" }}>
        <div style={{ fontSize: 54 }}>📄</div>
        <h1 style={{ fontSize: "clamp(30px, 8vw, 40px)" }}>404 - page not found</h1>
        <p className="muted" style={{ fontFamily: "var(--sans)" }}>
          This page seems to have been torn out of the notebook.
        </p>
        <div className="hero-actions mt-2">
          <Link href="/" className="btn">
            ← Home
          </Link>
          <Link href="/services" className="btn btn-outline">
            Browse services
          </Link>
        </div>
      </div>
    </div>
  );
}
