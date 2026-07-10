import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Analytics from "../components/Analytics";
import SiteFrame from "../components/SiteFrame";
import { site } from "../lib/site";
import { adsense } from "../lib/ads";

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

// `viewportFit: "cover"` lets the page paint under the notch / home indicator;
// the CSS then pads content back out with env(safe-area-inset-*). Zoom is left
// unrestricted on purpose — capping it fails WCAG 1.4.4.
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#4f46e5",
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
  email: site.email,
  foundingDate: "2026",
  contactPoint: {
    "@type": "ContactPoint",
    email: site.email,
    contactType: "customer support",
    url: `${site.url}/contact`,
    availableLanguage: "English",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Raw <script> rather than next/script: AdSense verification reads the
          server-rendered <head>, which `afterInteractive` never reaches. */}
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense.client}`}
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
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
