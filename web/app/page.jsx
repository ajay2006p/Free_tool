import Link from "next/link";
import { prisma } from "../lib/db";
import { visibleCategories, countTotal } from "../lib/catalog";
import AdSlot from "../components/AdSlot";
import ToolSearch from "../components/ToolSearch";
import HeroShowcase from "../components/HeroShowcase";
import BlogCard from "../components/BlogCard";
import { site } from "../lib/site";
import { graph, itemListLd, faqLd, orgRef, SITE_ID } from "../lib/seo";

// ISR: cache the homepage and refresh it (with the latest blog posts) every
// 5 minutes. Much faster + cheaper than re-rendering on every visit, and
// better for Core Web Vitals (a Google ranking signal).
export const revalidate = 300;

export const metadata = {
  title: `${site.name} - Free tools, SEO, and productivity apps`,
  description: site.description,
  alternates: { canonical: site.url },
};

/* Answers to the questions people actually ask before using a free tool site:
   is it really free, do I have to sign up, and where does my data go. These are
   the trust questions, and they are also the shape of query an AI assistant is
   asked — so the answers need to be short, factual and quotable on their own.
   Rendered visibly AND emitted as FAQPage schema; the two must always match. */
const HOME_FAQS = [
  {
    q: "Is FreeTool actually free?",
    a: "Yes — every tool is free with no trial, no paid tier, no watermark and no usage cap. The site is funded by advertising rather than subscriptions, which is why you will see ad slots on tool pages.",
  },
  {
    q: "Do I need to create an account?",
    a: "No, for almost everything. A small number of tools that publish something you own — a short link, a shared form, a link-in-bio page — need an account so you can manage and delete what you created. Every other tool works with no signup at all.",
  },
  {
    q: "Where does my data go when I use a tool?",
    a: "For the large majority of tools, nowhere. Formatting, conversion, image editing and PDF work all run inside your browser using standard web APIs, so files are read into memory on your own device and never uploaded. The exceptions are tools that genuinely need a server — the AI writers, live currency rates and the downloaders — and each says so on its own page.",
  },
  {
    q: "Who is FreeTool for?",
    a: "Developers formatting JSON and debugging tokens, students working through calculations and citations, creators resizing images and writing captions, freelancers invoicing and tracking time, and anyone who needs a quick conversion without installing software.",
  },
  {
    q: "Can I use the results commercially?",
    a: "Generally yes — anything you create with these tools is yours to use in personal or commercial work. Where third-party rights are involved, such as a downloaded video or a YouTube thumbnail, the original owner's copyright still applies and respecting it is your responsibility.",
  },
  {
    q: "Do the tools work on a phone?",
    a: "Yes. Everything runs in any modern browser on a phone, tablet or computer, with no app to install. Many tools also keep working offline once the page has loaded, because the processing happens on your device rather than on a server.",
  },
];

const POPULAR = [
  ["📄 Resume Builder", "/career/resume-builder"],
  ["🧩 JSON Formatter", "/tools/json-formatter"],
  ["🔑 Password Generator", "/tools/password-generator"],
  ["🎮 Play 2048", "/games/game-2048"],
  ["🏠 Mortgage Calc", "/calculators/mortgage-calculator"],
  ["▶️ YouTube Thumbnail", "/social/youtube-thumbnail"],
  ["⌨️ Typing Test", "/productivity/typing-test"],
];

async function getLatestPosts() {
  try {
    return await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  } catch (e) {
    return [];
  }
}

export default async function HomePage() {
  const posts = await getLatestPosts();
  const total = countTotal();
  const lastUpdated = posts.reduce((latest, p) => {
    const d = p.updatedAt || p.createdAt;
    return d && (!latest || d > latest) ? d : latest;
  }, null);

  const jsonLd = graph(
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      name: site.name,
      url: site.url,
      description: site.description,
      inLanguage: "en",
      publisher: orgRef,
      // Derived from the newest post actually rendered on this page rather than
      // stamped with today's date on every build. A dateModified that always
      // reads "today" is discounted once engines notice it never corresponds to
      // a real change, so an honest date is worth more than a fresh one.
      ...(lastUpdated ? { dateModified: lastUpdated.toISOString() } : {}),
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${site.url}/services?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    // Naming the popular tools on the homepage gives engines a concrete entry
    // point for "free <thing>" queries instead of only the abstract site node.
    itemListLd(
      POPULAR.map(([label, path]) => ({ name: label.replace(/^\S+\s/, ""), path })),
      { name: `Popular free tools on ${site.name}` }
    ),
    faqLd(HOME_FAQS)
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="hero hero-split container">
        <div className="hero-copy">
          <span className="kicker">{total} free tools · no signup</span>
          <h1>
            Every tool you need,
            <br />
            <span className="mark">in one place.</span>
          </h1>
          <p className="lead">
            Formatters, converters, calculators, SEO & social media helpers and
            productivity apps - free, fast, and private in your browser.
          </p>
          <div className="chips">
            {POPULAR.map(([label, href]) => (
              <Link key={href} href={href} className="chip">
                {label}
              </Link>
            ))}
          </div>
        </div>
        <HeroShowcase />
      </section>

      {/* Answer-first summary, deliberately the first prose after the hero and
          above every ad. An answer engine that reads only the top of the page
          should still come away with a complete, quotable description: what
          this is, who it is for, what it costs and where data goes. It also
          puts the main topic in the first 250 words in plain language, which
          the hero's tagline H1 does not do on its own. */}
      <section className="container">
        <div className="quick-answer" aria-labelledby="what-is-h">
          <h2 id="what-is-h" className="qa-title">
            What is {site.name}?
          </h2>
          <p className="qa-lead">
            {site.name} is a collection of {total} free online tools that run in your web
            browser — formatters, converters, calculators, image and PDF utilities, SEO
            helpers and productivity apps. There is no signup, no install and no usage
            limit, and most tools process your files on your own device rather than
            uploading them to a server.
          </p>
          <dl className="qa-facts">
            <div className="qa-fact">
              <dt>Price</dt>
              <dd>Free — no trial, no paid tier, no watermark</dd>
            </div>
            <div className="qa-fact">
              <dt>Sign-up</dt>
              <dd>Not required for almost every tool</dd>
            </div>
            <div className="qa-fact">
              <dt>Where it runs</dt>
              <dd>In your browser — most tools upload nothing</dd>
            </div>
            <div className="qa-fact">
              <dt>Best for</dt>
              <dd>Developers, students, creators and freelancers</dd>
            </div>
            <div className="qa-fact">
              <dt>Works on</dt>
              <dd>Chrome, Safari, Firefox and Edge — desktop and mobile</dd>
            </div>
          </dl>
          {/* Visible counterpart to the dateModified in the schema above. Both
              come from the same value, so the page never claims a freshness the
              markup does not support. */}
          {lastUpdated ? (
            <p className="muted" style={{ fontSize: 13, margin: "12px 0 0" }}>
              Last updated{" "}
              <time dateTime={lastUpdated.toISOString()}>
                {lastUpdated.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </time>
            </p>
          ) : null}
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 10 }}>
        <ToolSearch categories={visibleCategories} />
      </section>

      <div className="container">
        <AdSlot label="Banner" />
      </div>

      <section className="section container">
        <div className="section-head">
          <h2>From the blog</h2>
          <Link href="/blog" className="btn btn-outline btn-sm">
            All posts
          </Link>
        </div>
        {posts.length === 0 ? (
          <div className="sheet empty">No posts yet.</div>
        ) : (
          <div className="blog-grid">
            {posts.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </section>

      {/* Question-shaped headings with the answer immediately beneath. This is
          the format AI assistants lift most readily, and it matches the FAQPage
          schema emitted above — the visible text and the markup are the same
          strings, which is what keeps the structured data compliant. */}
      <section className="section container">
        <div className="tool-seo">
          <div className="seo-faq">
            <h2>Frequently asked questions</h2>
            <div className="faq-list">
              {HOME_FAQS.map((f, i) => (
                <details key={i} className="faq-item" open={i === 0}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Outbound citations. The privacy claim above is the one factual
              assertion the homepage makes that a reader might reasonably want
              to verify, so it points at the specifications that make it true
              rather than asking to be taken on trust. */}
          <div className="seo-about">
            <h2>How the in-browser tools work</h2>
            <p>
              The claim that your files are not uploaded is a property of how the tools are
              built rather than a promise. Image resizing and conversion use the{" "}
              <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target="_blank" rel="noopener noreferrer">
                Canvas API
              </a>
              , password and UUID generation use the{" "}
              <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API" target="_blank" rel="noopener noreferrer">
                Web Crypto API
              </a>{" "}
              for cryptographically secure randomness, and notes and task lists persist
              through{" "}
              <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank" rel="noopener noreferrer">
                local storage
              </a>{" "}
              on your own device. All three are standard browser features, so you can
              confirm the behaviour yourself: open your browser&rsquo;s network tab while
              using one of these tools and no upload request appears.
            </p>
            <p>
              Tools that genuinely require a server say so on their own page. Those are the
              AI writers, live currency rates and the media downloaders — everything else
              works with the network disconnected once the page has loaded.
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        <AdSlot label="Footer banner" />
      </div>
    </>
  );
}
