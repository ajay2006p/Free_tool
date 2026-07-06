import LiveStats from "../../../components/LiveStats";

export const metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <div className="container">
      <div className="page-head">
        <div>
          <span className="kicker">Live traffic &amp; revenue</span>
          <h1>Analytics</h1>
          <p className="sub">Real-time visitors, earnings and top pages.</p>
        </div>
      </div>
      <LiveStats />
    </div>
  );
}
