import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Analytics from "../components/Analytics";
import SiteFrame from "../components/SiteFrame";
import { site } from "../lib/site";
import { adsense } from "../lib/ads";
import { ORG_ID } from "../lib/seo";

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
// The @id is the anchor every other page's JSON-LD points at with `publisher`,
// so one entity is described once and referenced everywhere. `knowsAbout` gives
// answer engines an explicit topical scope — what this site is an authority on.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: site.name,
  alternateName: "freetoolss.online",
  url: site.url,
  logo: `${site.url}/icon.png`,
  image: `${site.url}/icon.png`,
  description: site.description,
  slogan: site.tagline,
  email: site.email,
  foundingDate: "2026",
  knowsAbout: [
    "free online tools",
    "developer utilities",
    "file and image conversion",
    "PDF tools",
    "SEO tools",
    "online calculators",
    "text and writing tools",
    "productivity apps",
  ],
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
      <head>
        {/* AdSense site verification. This meta tag and /ads.txt are each a
            complete verification method on their own — Google accepts the code
            snippet, the ads.txt entry, or this tag. Both are server-rendered
            here, which is what allows the loader script below to be deferred
            without putting the pending application at risk. */}
        <meta name="google-adsense-account" content={adsense.client} />
        {/* Point AI crawlers at the plain-text site map they can read cheaply.
            /llms.txt is the index; /llms-full.txt carries the actual tool copy,
            steps and FAQ answers so an engine can answer without rendering JS. */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="llms-full.txt" />
        {/* Resource hints only — no preconnect to the ad host any more. A
            preconnect opens a TCP+TLS handshake immediately, which is the right
            trade when a script is fetched during load and the wrong one now
            that it waits for idle: it would spend mobile bandwidth early to
            speed up something deliberately deferred. dns-prefetch is far
            cheaper and still removes the DNS lookup when the script does run. */}
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
        <link rel="dns-prefetch" href="https://tpc.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        {/* AdSense loader, deferred to idle.
            On a throttled mobile connection this script and its downstream ad
            requests competed for bandwidth with the HTML and CSS, pushing LCP to
            7.4s while desktop sat at 0.5s. Waiting for the load event and then
            for idle time keeps it entirely off the critical path.
            Verification is unaffected: the meta tag above and /ads.txt are both
            server-rendered and each verifies the site independently. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              `(function(){var s=${JSON.stringify(
                `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense.client}`
              )};` +
              `function go(){if(window.__adsLoaded)return;window.__adsLoaded=1;` +
              `var t=document.createElement('script');t.async=true;t.src=s;t.crossOrigin='anonymous';` +
              `document.head.appendChild(t);}` +
              // requestIdleCallback where supported, a short timeout elsewhere
              // (Safari). The load event alone can still coincide with LCP on a
              // slow connection, so idle time is the safer trigger.
              `function schedule(){'requestIdleCallback'in window?requestIdleCallback(go,{timeout:3000}):setTimeout(go,1500);}` +
              `document.readyState==='complete'?schedule():window.addEventListener('load',schedule,{once:true});})();`,
          }}
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
