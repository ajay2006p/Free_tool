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
    </div>
  );
}
