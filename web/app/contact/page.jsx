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

        <h2>How to report a bug well</h2>
        <p>
          Most reports we cannot act on are missing the same few details. A tool
          that behaves differently on one device than another is usually a browser
          or operating system difference, and without knowing which you are using
          we often cannot reproduce the problem at all. The more of the following
          you can include, the more likely it is that the issue gets fixed rather
          than filed as unreproducible.
        </p>
        <ul>
          <li>
            <strong>Which tool</strong>, ideally the exact page address. Several
            tools do similar jobs and we want to look at the right one.
          </li>
          <li>
            <strong>What you expected and what happened instead.</strong> These
            are different things, and the gap between them is the actual bug.
          </li>
          <li>
            <strong>Your browser and device</strong> — Chrome on Windows, Safari
            on an iPhone, and so on. Browser differences cause a surprising share
            of reported problems.
          </li>
          <li>
            <strong>Sample input</strong> where it is safe to share. A tool that
            fails on one particular file or string is far easier to fix when we
            can try the same input. Never send us passwords, personal documents or
            anything confidential — a redacted example that still fails is ideal.
          </li>
        </ul>

        <h2>Requesting a new tool</h2>
        <p>
          Tool requests genuinely influence what gets built, and the ones that get
          built first tend to share a quality: they describe a specific task rather
          than a category. &ldquo;Something for images&rdquo; is hard to act on;
          &ldquo;convert a HEIC photo from my iPhone to JPG&rdquo; is a tool we can
          scope in an afternoon. Tell us what you were trying to do and what you
          ended up doing instead — the workaround you settled for is often the
          clearest description of what is missing.
        </p>

        <h2>Questions we are asked most</h2>
        <p>
          <strong>Are the tools really free?</strong> Yes. There is no trial, no
          paid tier and no watermark, and the site is funded by advertising rather
          than subscriptions. That is also why you will see ad slots on tool pages.
        </p>
        <p>
          <strong>Do I need an account?</strong> No, for almost everything. A small
          number of tools that publish something under your control — a short link,
          a shared form, a link-in-bio page — need an account so that you can manage
          and delete what you created. Everything else works with no signup at all.
        </p>
        <p>
          <strong>Where does my data go?</strong> For the large majority of tools,
          nowhere. Formatting, conversion, image and PDF work happens inside your
          browser, so files are never uploaded. The exceptions are the tools that
          genuinely need a server — the AI writers, the currency rates and the
          downloaders — and each of those says so on its own page. Our{" "}
          <Link href="/privacy">Privacy Policy</Link> sets out the detail.
        </p>
        <p>
          <strong>Can I use output commercially?</strong> Generally yes — anything
          you create with these tools is yours. Where third-party rights are
          involved, such as a downloaded video or a YouTube thumbnail, the original
          owner&rsquo;s copyright still applies and that is your responsibility to
          respect.
        </p>
        <p>
          <strong>Something is wrong on a page — who do I tell?</strong> Us, at the
          address above. That includes factual errors in the written guidance on a
          tool page, not just broken functionality. If we have explained something
          incorrectly we would rather know.
        </p>
      </div>
    </div>
  );
}
