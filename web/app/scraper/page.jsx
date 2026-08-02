import Scraper from "../../components/Scraper";
import AdSlot from "../../components/AdSlot";
import { site } from "../../lib/site";

export const metadata = {
  title: "Business Lead Scraper",
  description: "Search local businesses and export leads (name, address, phone, website) to CSV. Free account required.",
  alternates: { canonical: `${site.url}/scraper` },
};

export default function ScraperPage() {
  return (
    <div className="container section">
      <div style={{ marginBottom: 18 }}>
        <span className="kicker">Lead generation</span>
        <h1 style={{ fontSize: 34, margin: "6px 0 4px" }}>🔎 Business Lead Scraper</h1>
        <p className="muted">Find local businesses by keyword & location, then export the list to CSV.</p>
      </div>
      <AdSlot label="Banner" />
      <Scraper />
      <p className="hint" style={{ marginTop: 18 }}>
        Results come from a licensed data provider (configured by the site owner). Please use lead data responsibly and in line with privacy laws (GDPR/CCPA) and each platform's terms.
      </p>

      <section className="tool-seo">
        <div className="seo-about">
          <h2>About the business lead scraper</h2>
          <p>
            Search for businesses by keyword and location and export the results —
            name, address, phone number and website — as a CSV you can open in a
            spreadsheet or import into a CRM. It is aimed at the ordinary groundwork
            of local B2B sales: building a list of plumbers in a city, restaurants in
            a district, or agencies in a region, without copying entries out of a map
            one at a time.
          </p>
          <p>
            The data comes from a licensed provider rather than being scraped from
            search results, which matters both legally and practically. Scraping
            search pages directly breaches most platforms&rsquo; terms of service, and
            it also breaks constantly, because the page structure changes without
            notice. A licensed source is stable and the terms of use are clear.
          </p>
          <p>
            Expect business listings to be imperfect regardless of source. Companies
            close, move and rebrand faster than any directory updates, and a
            proportion of any list will be out of date on the day you download it.
            Verifying the highest-value entries before contacting them is worth the
            time — reaching out to a business that closed a year ago costs more in
            credibility than the minute it takes to check.
          </p>
        </div>

        <div className="seo-how">
          <h2>Using lead data lawfully</h2>
          <p>
            This is the part that matters most, and it is genuinely a legal question
            rather than a courtesy. Data protection law does not stop applying because
            a phone number was publicly listed — publicly available is not the same as
            free to use for any purpose.
          </p>
          <ol className="howto">
            <li id="step-1">
              Have a lawful basis before you contact anyone. Under GDPR, business-to-business
              outreach is often justified on legitimate interests, but that basis has to be
              genuine and documented rather than assumed. Rules for individuals and sole
              traders are stricter than for registered companies.
            </li>
            <li id="step-2">
              Identify yourself clearly in every message and say where you got their details.
              Concealing either is both a legal problem and the fastest route to being marked
              as spam.
            </li>
            <li id="step-3">
              Provide a working opt-out and honour it immediately. Keep a suppression list and
              check every future send against it — repeat contact after an opt-out is where
              complaints and penalties actually come from.
            </li>
            <li id="step-4">
              Check the marketing rules for the country you are contacting. Requirements differ
              substantially between the EU, the UK, the US and Canada, and unsolicited calls and
              texts are regulated far more tightly than email in most jurisdictions.
            </li>
          </ol>
        </div>

        <div className="seo-faq">
          <h2>Frequently asked questions</h2>
          <div className="faq-list">
            <details className="faq-item" open>
              <summary>Why does this tool need an account when others do not?</summary>
              <p>
                Because it draws on a paid third-party data provider with per-query costs,
                unlike the browser-based tools elsewhere on the site, which cost nothing to
                run. An account allows usage to be attributed and kept within limits.
              </p>
            </details>
            <details className="faq-item">
              <summary>Is scraping business listings legal?</summary>
              <p>
                Using licensed data under its provider&rsquo;s terms is straightforward.
                Scraping search results directly generally breaches platform terms of service,
                and how you then use the data is separately governed by data protection law —
                two different questions that are often conflated.
              </p>
            </details>
            <details className="faq-item">
              <summary>How accurate are the results?</summary>
              <p>
                Good but never perfect. Businesses close, relocate and rebrand faster than any
                directory reflects, so a share of any list will be stale on the day it is
                exported. Verify high-value leads before contacting them.
              </p>
            </details>
            <details className="faq-item">
              <summary>Can I email everyone on the exported list?</summary>
              <p>
                Not without checking the rules that apply. B2B outreach is often permissible
                under legitimate interests in the EU and UK, but you must identify yourself,
                explain where the details came from, and provide a working opt-out you honour.
                Requirements differ by country, and calls and texts are regulated more tightly
                than email almost everywhere.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
