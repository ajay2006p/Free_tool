/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      /* Search Console reported "Sitemap is HTML". The sitemap at /sitemap.xml
         was always correct — application/xml, valid, 200. The problem was that
         /sitemap without the extension falls through to the Next.js 404 page,
         which is HTML, so submitting that URL made Search Console read markup
         where it expected a sitemap.

         Redirecting the conventional variants to the real file means the same
         mistake cannot be made again, whether from Search Console, a pasted
         link, or a crawler guessing at a path. */
      { source: "/sitemap", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap-index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/robots", destination: "/robots.txt", permanent: true },
    ];
  },
};

export default nextConfig;
