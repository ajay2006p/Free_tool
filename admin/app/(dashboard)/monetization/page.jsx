import AdsManager from "../../../components/AdsManager";

export const metadata = { title: "Monetization" };

export default function MonetizationPage() {
  return (
    <div className="container">
      <div className="page-head">
        <div>
          <span className="kicker">Ads &amp; revenue</span>
          <h1>Monetization</h1>
          <p className="sub">Set up your ads here — saves instantly to your live website. No code editing.</p>
        </div>
      </div>
      <AdsManager />
      <div className="card" style={{ marginTop: 20 }}>
        <h3 style={{ marginTop: 0, fontSize: 16 }}>Where your ads appear</h3>
        <p className="muted" style={{ fontSize: 14, margin: 0 }}>Homepage, every tool page, blog list & articles, and category pages. One saved ad unit is shown in all slots — for different sizes/placements, create more ad units and swap the key/code here.</p>
      </div>
    </div>
  );
}
