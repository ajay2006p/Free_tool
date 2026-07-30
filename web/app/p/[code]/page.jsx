import MiniSite from "../../../components/hosted/MiniSite";

export const metadata = {
  title: "Shared page",
  robots: { index: false, follow: false },
};

export default function PublishedSitePage({ params }) {
  return <MiniSite code={params.code} />;
}
