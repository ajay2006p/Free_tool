import KeywordTracker from "../../../components/KeywordTracker";

export const metadata = { title: "Keywords" };

export default function KeywordsPage() {
  return (
    <div className="container">
      <div className="page-head">
        <div>
          <span className="kicker">Search rankings</span>
          <h1>Keywords</h1>
          <p className="sub">
            Where freetoolss.online ranks, and which searches are actually bringing people in.
          </p>
        </div>
      </div>
      <KeywordTracker />
    </div>
  );
}
