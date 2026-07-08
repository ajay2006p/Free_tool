import { visibleCategories, countTotal } from "../../lib/catalog";
import { site } from "../../lib/site";
import AdSlot from "../../components/AdSlot";
import ToolSearch from "../../components/ToolSearch";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Tools",
  description:
    "Every free tool on the platform - formatters, converters, calculators, SEO, social media and productivity apps.",
  alternates: { canonical: `${site.url}/services` },
};

export default function ServicesHub({ searchParams }) {
  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  return (
    <div className="container section">
      <div className="center" style={{ marginBottom: 22 }}>
        <span className="kicker">Everything, free</span>
        <h1 style={{ fontSize: 34, margin: "8px 0 4px" }}>All {countTotal()} tools</h1>
        <p className="muted">Search or browse by category - no signup, runs in your browser.</p>
      </div>
      <ToolSearch categories={visibleCategories} initialQuery={q} />
      <AdSlot label="Banner" />
    </div>
  );
}
