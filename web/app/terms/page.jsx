import Link from "next/link";
import { site } from "../../lib/site";

export const metadata = {
  title: "Terms of Service",
  description: `The terms for using ${site.name}'s free online tools - provided "as is", with no warranty. Always verify important financial and health decisions independently.`,
  alternates: { canonical: `${site.url}/terms` },
};

export default function TermsPage() {
  return (
    <div className="container container-narrow article">
      <div className="crumbs">
        <Link href="/">Home</Link> / Terms of Service
      </div>
      <h1>Terms of Service</h1>
      <p className="meta">Last updated: 2026</p>
      <p className="lead" style={{ color: "var(--ink-soft)" }}>
        These terms cover your use of {site.name} and its tools. By using the
        site, you agree to them. We have kept the language as plain as possible -
        please read the sections on warranties and financial tools carefully.
      </p>

      <div className="prose">
        <h2>Tools provided &ldquo;as is&rdquo;</h2>
        <p>
          Every tool on {site.name} is offered free of charge and{" "}
          <strong>&ldquo;as is&rdquo;</strong>, without warranties of any kind,
          whether express or implied. We work hard to make our tools accurate and
          useful, but we cannot guarantee that any result will be error-free,
          complete, uninterrupted or fit for a particular purpose.
        </p>

        <h2>Financial &amp; health calculators - verify before you act</h2>
        <p>
          Our calculators (including the mortgage, tax, GST, loan, and any
          health or fitness calculators) are provided for general information and
          convenience only. They are <strong>not</strong> professional financial,
          legal, tax or medical advice. Rates, rules and formulas change, and your
          personal situation is unique. Before making any important decision -
          taking on a loan, filing taxes, or acting on a health estimate -{" "}
          <strong>independently verify the numbers</strong> and consult a
          qualified professional. You are solely responsible for decisions you make
          based on any tool.
        </p>

        <h2>Acceptable use</h2>
        <p>You agree to use {site.name} lawfully and fairly. In particular, you agree not to:</p>
        <ul>
          <li>Use the tools for anything illegal, harmful, fraudulent or abusive.</li>
          <li>Attempt to disrupt, overload, scrape at scale, or reverse-engineer the service or its infrastructure.</li>
          <li>Infringe anyone&rsquo;s intellectual property, privacy or other rights when using the tools.</li>
          <li>Upload malware or attempt to gain unauthorised access to the site or other users.</li>
        </ul>
        <p>We may restrict or block access if the site is misused.</p>

        <h2>Intellectual property</h2>
        <p>
          The {site.name} name, design, code and original content are ours and are
          protected by applicable laws. You may use the tools and their output for
          your own personal or commercial work. You may not copy or clone the site
          itself, or present it as your own service, without permission. Content
          and files you create with the tools remain entirely yours.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, {site.name} and its operators
          will not be liable for any indirect, incidental, special or consequential
          damages, or for any loss of data, profits, or goodwill, arising out of or
          in connection with your use of - or inability to use - the site or its
          tools. Because the service is provided free of charge, you use it at your
          own risk.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these terms from time to time as the site evolves. When we
          do, we will revise the &ldquo;Last updated&rdquo; date above. Continuing
          to use {site.name} after changes take effect means you accept the
          updated terms. We may also add, change or remove tools and features at
          any time.
        </p>

        <h2>Contact</h2>
        <p>
          Have a question about these terms? Email{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>{" "}
          or head to our <Link href="/contact">contact page</Link>. See also our{" "}
          <Link href="/privacy">Privacy Policy</Link> for how we handle data.
        </p>
      </div>
    </div>
  );
}
