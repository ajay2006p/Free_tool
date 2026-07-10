import Link from "next/link";
import { site } from "../../lib/site";

export const metadata = {
  title: "Contact",
  description: `Get in touch with the ${site.name} team - send feedback, report a bug or request a new tool. We read every message and usually reply within 1-2 business days.`,
  alternates: { canonical: `${site.url}/contact` },
};

export default function ContactPage() {
  return (
    <div className="container container-narrow article">
      <div className="crumbs">
        <Link href="/">Home</Link> / Contact
      </div>
      <h1>Contact us</h1>
      <p className="lead" style={{ color: "var(--ink-soft)" }}>
        {site.name} is built for the people who use it - so your feedback shapes
        what we build next. Whether something is broken, confusing, or you have a
        tool you wish existed, we want to hear it.
      </p>

      <div className="sheet" style={{ padding: 24, marginTop: 8 }}>
        <h2 style={{ marginTop: 0 }}>Email us directly</h2>
        <p className="muted" style={{ marginTop: 4 }}>
          The fastest way to reach a real person is email. Tell us as much as you
          can and we will get back to you.
        </p>
        <p style={{ margin: "16px 0" }}>
          <a
            className="btn"
            href={`mailto:${site.email}?subject=FreeTool%20feedback`}
          >
            ✉️ Email {site.email}
          </a>
        </p>
        <p className="muted" style={{ fontSize: 14 }}>
          Or copy it:{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </div>

      <div className="prose" style={{ marginTop: 28 }}>
        <h2>What to get in touch about</h2>
        <ul>
          <li>
            <strong>🐞 Bug reports</strong> - a tool giving a wrong result or not
            loading? Let us know the tool, your browser, and what you expected.
          </li>
          <li>
            <strong>💡 Feature &amp; tool requests</strong> - missing a tool you
            use every day? Suggest it and we may add it.
          </li>
          <li>
            <strong>💬 General feedback</strong> - ideas to make {site.name}
            faster, clearer or more useful are always welcome.
          </li>
          <li>
            <strong>🔒 Privacy questions</strong> - see our{" "}
            <Link href="/privacy">Privacy Policy</Link>, or just ask.
          </li>
        </ul>

        <h2>Response time</h2>
        <p>
          {site.name} is run by a small team, but we read every message. You can
          usually expect a reply within <strong>1-2 business days</strong>. Clear,
          detailed messages help us help you faster.
        </p>
      </div>
    </div>
  );
}
