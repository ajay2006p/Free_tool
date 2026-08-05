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

  async headers() {
    /* RFC 8288 Link headers advertising the plain-text versions of the site.
       Both files are already announced with <link rel="alternate"> in the
       document head, but a response header is visible from a HEAD request — so
       an agent can discover them without fetching and parsing the HTML at all.

       rel="alternate" is used because these are genuinely alternate
       representations of the same content and it is a registered IANA relation.
       An invented relation name would simply be ignored. */
    const agentLinks = [
      {
        key: "Link",
        value:
          '</llms.txt>; rel="alternate"; type="text/plain"; title="llms.txt", ' +
          '</llms-full.txt>; rel="alternate"; type="text/plain"; title="llms-full.txt"',
      },
    ];

    return [
      // The root has no path segment, so the pattern below cannot match it.
      { source: "/", headers: agentLinks },
      /* Every other route except build assets and API responses — a Link header
         on a JS chunk is overhead on every request and helps nobody. The named
         parameter is required: Next.js resolves `source` with path-to-regexp,
         which does not accept a bare capture group. */
      { source: "/:path((?!_next|api).*)", headers: agentLinks },
    ];
  },
};

export default nextConfig;
