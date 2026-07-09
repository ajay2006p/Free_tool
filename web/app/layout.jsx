import "./globals.css";
import Script from "next/script";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Analytics from "../components/Analytics";
import SiteFrame from "../components/SiteFrame";
import { site } from "../lib/site";

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} - ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "free online tools",
    "developer tools",
    "json formatter",
    "password generator",
    "pdf tools",
    "image compressor",
    "unit converter",
    "online calculators",
    "seo tools",
    "resume builder",
    "qr code generator",
  ],
  alternates: { canonical: site.url },
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

// Site-wide Organization structured data — tells Google & AI engines who runs
// the site (counters the hidden-WHOIS trust gap) and can power richer results.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/icon.png`,
  image: `${site.url}/icon.png`,
  description: site.description,
  email: "anaagathumanpower@gmail.com",
  foundingDate: "2026",
  contactPoint: {
    "@type": "ContactPoint",
    email: "anaagathumanpower@gmail.com",
    contactType: "customer support",
    url: `${site.url}/contact`,
    availableLanguage: "English",
  },
};

export default function RootLayout({ children }) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        {adsenseClient ? (
          <Script
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        ) : null}
        <SiteFrame
          header={<Header />}
          footer={<Footer />}
          extras={<Analytics />}
        >
          {children}
        </SiteFrame>
      </body>
    </html>
  );
}
