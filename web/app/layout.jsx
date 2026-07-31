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
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name} — free online tools` }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/og.png"],
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
        <meta name="google-adsense-account" content={adsense.client} />
        {/* Resource hints: open the connection to the heaviest third parties
            (AdSense loader + ad servers, and the blog image CDNs) before the
            browser parses the tags that need them. Shaves DNS + TCP + TLS
            setup off the critical path — the main safe perf win on a site
            whose biggest cost is the ad script we can't remove. */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
        <link rel="dns-prefetch" href="https://tpc.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense.client}`}
          crossOrigin="anonymous"
        />
        {/* Google Analytics 4. `send_page_view: false` because App Router
            navigations don't reload the page — <Analytics> fires every view,
            including the first, so nothing is counted twice. */}
        {site.gaId ? (
          <>
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.gaId}',{send_page_view:false});`,
              }}
            />
          </>
        ) : null}
        {/* Google Tag Manager — loads its own container alongside the hard-coded
            GA4 tag above. If you ever add a GA4 tag for the SAME measurement id
            inside GTM, remove the gtag block above or views get counted twice. */}
        {site.gtmId ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${site.gtmId}');`,
            }}
          />
        ) : null}
      </head>
      <body>
        {/* GTM fallback for users with JS disabled. Must be the first thing in
            <body> per Google's install instructions. */}
        {site.gtmId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${site.gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
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
