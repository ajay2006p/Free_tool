import Link from "next/link";
import { site } from "../../lib/site";
import { visibleCategories, countTotal } from "../../lib/catalog";

export const metadata = {
  title: "About",
  description: `About ${site.name} - ${countTotal()} free online tools for developers, students and professionals.`,
  alternates: { canonical: `${site.url}/about` },
};

export default function AboutPage() {
  return (
    <div className="container container-narrow article">
      <h1>About {site.name}</h1>
      <p className="lead" style={{ color: "var(--ink-soft)" }}>
        {site.name} is a growing collection of {countTotal()} free online tools -
        no signup, no limits, all running in your browser.
      </p>
      <div className="prose">
        <p>
          Instead of hopping between a dozen websites, you get formatters,
          converters, calculators, SEO helpers and productivity apps in one
          clean place. Most tools never send your data anywhere - everything
          happens on your device.
        </p>

        <h2>Our mission</h2>
        <p>
          Good tools should be free, fast and private - without an account, a
          paywall, or a wall of pop-ups. That is the whole idea behind{" "}
          {site.name}. We bring {countTotal()} genuinely useful tools together in
          one place so you can get a job done in seconds and get on with your day.
          No sign-up, no daily limits, no &ldquo;upgrade to continue.&rdquo;
        </p>

        <h2>Private by design</h2>
        <p>
          Privacy is not an afterthought here - it is how the tools are built. The
          vast majority of them run <strong>entirely in your browser</strong>, so
          the text you paste, the files you drop and the numbers you calculate
          never leave your device. When a tool does need an outside service (like
          live currency rates), we only send the minimum needed. You can read the
          details in our <Link href="/privacy">Privacy Policy</Link>.
        </p>

        <h2>Who it&rsquo;s for</h2>
        <p>
          {site.name} is for everyone who works on a screen: developers formatting
          JSON or generating passwords, students converting units and building
          resumes, creators making QR codes and compressing images, and everyday
          people running the numbers on a mortgage, loan or tax. If you have found
          yourself searching &ldquo;free online [something] tool,&rdquo; this site
          is built for you.
        </p>
        <p className="notice notice-warn">
          A quick note: our financial and health calculators are for information
          only, not professional advice. Always double-check important numbers -
          see our <Link href="/terms">Terms</Link> for details.
        </p>

        <h2>Who runs {site.name}</h2>
        <p>
          {site.name} is an independent project, built and maintained by a solo
          developer - not a faceless content farm. There is a real person behind
          the site who reads every message, fixes bugs and adds the tools people
          ask for. We deliberately keep it simple, ad-light and privacy-first.
        </p>
        <p>
          Questions, bug reports, or a tool you wish existed? Email us at{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>{" "}
          or use the <Link href="/contact">contact page</Link> - you can usually
          expect a reply within 1-2 business days. For how we handle data and the
          rules of use, see our <Link href="/privacy">Privacy Policy</Link> and{" "}
          <Link href="/terms">Terms of Service</Link>.
        </p>

        <h2>Categories</h2>
        <ul>
          {visibleCategories.map((c) => (
            <li key={c.slug}>
              {c.icon} <strong><Link href={`/${c.slug}`}>{c.name}</Link></strong> -{" "}
              {c.tagline}
            </li>
          ))}
        </ul>
      </div>
      <div className="center mt-4">
        <Link href="/services" className="btn">
          Browse all tools →
        </Link>
      </div>
    </div>
  );
}
