import HostedFill from "../../../components/hosted/HostedFill";

/* User-generated pages: never indexed, so someone else's form can't rank on
   (or dilute) this domain. `follow` is off too — these carry arbitrary
   third-party links. */
export const metadata = {
  title: "Open a shared form",
  robots: { index: false, follow: false },
};

export default function FillPage({ params }) {
  return <HostedFill code={params.code} />;
}
