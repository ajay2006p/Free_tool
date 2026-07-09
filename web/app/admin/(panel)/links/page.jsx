import LinksTable from "../../../../components/admin/LinksTable";

export const metadata = { title: "Short Links" };

export default function LinksPage() {
  return (
    <div className="container">
      <div className="page-head">
        <div>
          <span className="kicker">URL shortener</span>
          <h1>Short Links</h1>
          <p className="sub">Every short link created on your site and how many clicks it got.</p>
        </div>
      </div>
      <LinksTable />
    </div>
  );
}
