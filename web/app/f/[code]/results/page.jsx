import HostedResults from "../../../../components/hosted/HostedResults";

export const metadata = {
  title: "Responses",
  robots: { index: false, follow: false },
};

export default function ResultsPage({ params }) {
  return <HostedResults code={params.code} />;
}
