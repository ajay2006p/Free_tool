import Link from "next/link";
import { site } from "../../lib/site";

export const metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} handles your data - most tools run entirely in your browser, so your data never leaves your device. Read our plain-language privacy policy.`,
  alternates: { canonical: `${site.url}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="container container-narrow article">
      <div className="crumbs">
        <Link href="/">Home</Link> / Privacy Policy
      </div>
      <h1>Privacy Policy</h1>
      <p className="meta">Last updated: 2026</p>
      <p className="lead" style={{ color: "var(--ink-soft)" }}>
        {site.name} is built around a simple idea: your data is yours. Most of our
        tools run 100% inside your browser, so the things you type, upload or
        calculate never reach our servers. This page explains, in plain English,
        exactly what we do and do not collect.
      </p>

      <div className="prose">
        <h2>What we collect</h2>
        <p>
          For the vast majority of tools on {site.name} - formatters, converters,
          calculators (including mortgage, tax and GST), password generators,
          image and PDF tools and more - <strong>everything happens on your
          device</strong>. The text you paste, the files you drop and the numbers
          you enter are processed locally in your browser and are never uploaded
          to us. When you close the tab, that data is gone.
        </p>
        <p>
          We do collect a small amount of anonymous, aggregate usage information
          so we can understand which tools are popular and keep the site fast and
          reliable. This includes basic analytics events (such as page views) and
          a simple, self-hosted visit counter. We do not ask for your name, we do
          not require an account to use any tool, and we do not sell personal
          data - ever.
        </p>

        <h2>Cookies &amp; ads</h2>
        <p>
          {site.name} is free to use. We have removed the intrusive pop-up /
          pop-under ad network that was previously used. If we display ads at all,
          we use only reputable, mainstream networks (such as Google AdSense), and
          those providers may set cookies or use similar technologies to measure
          and personalise the ads you see. We also use Google Analytics, which
          sets cookies to help us measure traffic in aggregate.
        </p>
        <p>
          You can clear or block cookies at any time in your browser settings, and
          you can use browser-level tracking protection or an ad blocker without
          losing access to the tools. Blocking cookies will not stop the tools
          from working.
        </p>

        <h2>Third-party services</h2>
        <p>
          A small number of tools need to talk to outside services to do their
          job. For example, the currency converter fetches live exchange rates, the
          media/downloader tools contact the relevant source, and the business
          scraper queries public data sources. When you use one of these specific
          tools, the minimum request needed to return your result is sent to that
          third party. We keep this list short and only reach out to external
          services when a tool genuinely requires it.
        </p>
        <p>
          The third parties we rely on include Google Analytics (measurement),
          Google AdSense (advertising, only if ads are enabled) and the specific
          data providers behind the tools mentioned above. Each has its own privacy
          policy governing how it handles requests.
        </p>

        <h2>Your data &amp; rights</h2>
        <p>
          Because tools run client-side, there is usually no personal data of
          yours sitting on our servers to export or delete. Using our tools does
          not require an account. Optional free accounts exist for a few features,
          and if you create one we store only what is needed to run it (such as
          your email). You can ask us to delete your account and its data at any
          time by emailing us. Depending on where you live, you may have rights to
          access, correct or erase your personal data - we are happy to honour
          reasonable requests.
        </p>

        <h2>Children</h2>
        <p>
          {site.name} is a general-audience tools site and is not directed at
          children under 13. We do not knowingly collect personal information from
          children. If you believe a child has provided us personal data, please
          contact us and we will remove it.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about privacy? We would genuinely like to hear from you. Email{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>{" "}
          or visit our <Link href="/contact">contact page</Link>. We may update
          this policy occasionally; the &ldquo;Last updated&rdquo; date above
          always reflects the current version.
        </p>
      </div>
    </div>
  );
}
