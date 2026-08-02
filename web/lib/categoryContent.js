/* ============================================================================
   Hand-written copy for each category hub.

   Category pages used to render a tool grid and nothing else — around 250 words
   of visible text, almost all of it shared navigation and footer chrome. That is
   thin content by any measure: an indexable page, one click from the homepage,
   with essentially nothing unique on it.

   Each entry below is written for its own category. The guidance is specific
   enough that it could not be swapped between two categories without reading
   wrongly — which is the whole point. Generic copy with the category name
   substituted in is what search engines and ad reviewers class as low-value,
   and it is worth less than no copy at all.
   ========================================================================== */

export const CATEGORY_CONTENT = {
  tools: {
    intro: [
      "Developer tools are the small utilities you reach for a dozen times a day and never think about until one is missing — pretty-printing a minified API response, decoding a JWT to see why an auth check is failing, generating a batch of UUIDs for test fixtures, or checking whether a colour pair actually passes contrast requirements.",
      "Every tool in this category runs entirely in your browser. That is a deliberate choice rather than a technical shortcut: the things developers paste into online formatters are frequently production API responses, staging tokens and config files containing real credentials. Pasting those into a server-side tool means handing them to someone else's log files. Here the parsing happens locally, so nothing is transmitted.",
      "If you are picking between similar tools: use the JSON Formatter when you need to validate as well as indent, since it reports the position of a syntax error rather than just failing. Use the JWT Decoder for inspecting claims and expiry, but remember it decodes rather than verifies — a decoded token tells you what it claims, not whether the signature is valid. Reach for the Hash Generator when comparing checksums, and the Color Contrast Checker before shipping any interface change that touches text colour.",
    ],
    faqs: [
      {
        q: "Is it safe to paste production data into an online formatter?",
        a: "Not usually — most online formatters post your input to a server, where it may be logged. The tools in this category are the exception: they run in your browser, so the data never leaves your machine. You can verify this by opening your browser's network tab and watching for outbound requests while you use one, or by disconnecting from the network and confirming the tool still works.",
      },
      {
        q: "Does the JWT Decoder verify the token signature?",
        a: "No, and no browser-based tool honestly can. Verifying a signature requires the signing secret or public key, which you should never paste into a web page. The decoder shows you the header, payload and expiry so you can debug what a token claims. Signature verification belongs in your backend.",
      },
      {
        q: "Which formatter should I use for a config file?",
        a: "Match the tool to the syntax: the YAML Formatter for Kubernetes manifests, CI pipelines and Docker Compose files; the XML Formatter for build files and legacy config; the JSON Formatter for package manifests and API payloads. Using a JSON formatter on YAML will simply fail, since indentation-significant syntax cannot be reformatted by a brace-aware parser.",
      },
      {
        q: "Are generated UUIDs and passwords genuinely random?",
        a: "They use the browser's Web Crypto API, which is a cryptographically secure random source — the same one used for real key generation, not Math.random(). That makes them suitable for production identifiers and passwords.",
      },
    ],
  },

  ai: {
    intro: [
      "These AI tools cover the writing tasks that are genuinely tedious rather than genuinely creative: a cover letter that has to be re-tailored for the fortieth application, an email declining something politely, resume bullets that turn 'responsible for the database' into something a recruiter will actually read, or a shortlist of business names when you have been staring at a blank page for an hour.",
      "None of them require an account or an API key, which is unusual and worth explaining. Most free AI tools are lead-generation funnels: three uses, then a signup wall, then a paid tier. These simply work. The trade-off is that they are aimed at short, well-defined tasks rather than long-form generation, and they do those tasks well.",
      "A practical note on using any of them: AI output is a first draft, not a finished document. The cover letter generator produces a structurally sound letter with your details in the right places, but a recruiter can spot unedited AI text quickly, and the specific detail that makes an application land — why this company, what you actually built — is the part only you can supply. Treat the output as scaffolding you then make true and specific.",
    ],
    faqs: [
      {
        q: "Do I need an API key or an account?",
        a: "No. There is no signup, no key and no usage counter. Open the tool and use it.",
      },
      {
        q: "Will a recruiter be able to tell my cover letter was AI-generated?",
        a: "If you submit it unedited, very possibly — AI drafts share recognisable rhythms and tend toward generic enthusiasm. The draft is most useful as structure. Replace the general claims with specific ones, cut anything that could appear in someone else's letter, and the result reads as yours because at that point it is.",
      },
      {
        q: "Is what I type kept private?",
        a: "Your input is sent to a server to generate the response, since language models cannot run locally in a browser tab. It is not stored or used for training. As a general rule, do not paste anything into any AI tool that you would not be comfortable sending in an email — that applies here and everywhere else.",
      },
      {
        q: "Why is the output sometimes different for the same input?",
        a: "Language models sample from a probability distribution rather than returning one fixed answer, so identical prompts produce varied results. If you get something you almost like, run it again — the second or third attempt is often closer.",
      },
    ],
  },

  games: {
    intro: [
      "A small collection of browser games for when you have five minutes and no desire to install anything: 2048, Snake, Tic-Tac-Toe against an AI that will not let you win, and a Would You Rather generator for when the group chat has gone quiet.",
      "They load instantly and run entirely on your device, which means they work on aeroplane wifi, on a locked-down work laptop, and on a phone with a nearly full storage volume. There are no accounts, no leaderboards harvesting an email address, and no thirty-second video between attempts.",
      "The Tic-Tac-Toe opponent deserves a warning: it plays a perfect game using minimax, which means it evaluates every possible continuation and picks an optimal move. Tic-Tac-Toe is a solved game, so perfect play from both sides always draws. You cannot beat it. You can force a draw every single time, and doing that reliably is a genuinely useful exercise in thinking a move ahead.",
    ],
    faqs: [
      {
        q: "Do these work offline?",
        a: "Once the page has loaded, yes — the game logic runs in your browser with no server round-trips. Reloading the tab while offline will not work, but an already-open game keeps playing.",
      },
      {
        q: "Is my high score saved?",
        a: "Scores are kept in your browser's local storage, so they persist on that device and that browser. They are not synced to an account, which also means clearing site data or using private browsing will reset them.",
      },
      {
        q: "Can I really not beat the Tic-Tac-Toe AI?",
        a: "No. It uses minimax to play optimally, and Tic-Tac-Toe is solved — with perfect play from both players the game is always a draw. A draw is the best available result, and getting one every time means you are also playing perfectly.",
      },
      {
        q: "What is the highest tile possible in 2048?",
        a: "In theory 131,072, though reaching even 8192 is rare. The standard win condition is 2048, after which you can keep merging. The core strategy is to keep your largest tile pinned in one corner and never move in the direction that would dislodge it.",
      },
    ],
  },

  image: {
    intro: [
      "Image tools for the everyday problems: a photo too large to email, a logo that needs a transparent background converted to the right format, a screenshot that has to fit an exact pixel size for an upload form, or a set of images that need to become a single PDF.",
      "Everything here processes in your browser using the Canvas API, which has a consequence worth understanding. Your images are never uploaded, so private photos, ID documents and unreleased design work stay on your device — but processing speed depends on your own hardware, and a very large batch on an old phone will be slower than a server-side equivalent. For the file sizes most people work with, the difference is imperceptible.",
      "Choosing a format matters more than most people expect. Use JPEG for photographs, where its lossy compression is nearly invisible and the file savings are large. Use PNG when you need transparency or crisp edges — logos, screenshots, anything with text or flat colour, where JPEG artefacts show badly. Use WebP when your target is the web and you control the audience: it is typically 25-35% smaller than an equivalent JPEG at matching quality, with support in every current browser. Converting a JPEG to PNG will not restore quality already lost; compression is one-directional.",
    ],
    faqs: [
      {
        q: "Are my images uploaded to a server?",
        a: "No. Resizing, cropping, compression and conversion all happen in your browser via the Canvas API. The file is read from disk into memory on your own machine and never transmitted, which is why these tools also work with the network disconnected.",
      },
      {
        q: "Should I use JPEG, PNG or WebP?",
        a: "JPEG for photographs. PNG when you need transparency or sharp edges such as logos, screenshots and text. WebP for the web, where it is usually 25-35% smaller than JPEG at the same visual quality. If a file must open in old or unusual software, JPEG and PNG are the safest choices.",
      },
      {
        q: "Why did compressing my image barely reduce the file size?",
        a: "It was probably already compressed. Running JPEG compression a second time removes little additional data while degrading quality further, because the information that compresses easily has already been discarded. Compressing repeatedly makes an image progressively worse without making it meaningfully smaller.",
      },
      {
        q: "Can I get quality back after compressing?",
        a: "No. Lossy compression permanently discards image data, so converting back to a lossless format preserves the degraded version rather than recovering the original. Always keep your originals and compress copies.",
      },
    ],
  },

  files: {
    intro: [
      "PDF tools that do what the desktop applications charge a subscription for: merging several documents into one, pulling specific pages out, shrinking a file until it fits an upload limit, adding a signature, and turning a folder of images into a single PDF.",
      "The privacy point matters more here than almost anywhere else on the site. PDFs are the format people use for exactly the documents they should be most careful with — signed contracts, bank statements, passport scans, medical letters, tax returns. Most free online PDF services upload your file to their servers, process it there, and keep it for some retention period described vaguely in a privacy policy. These tools use PDF-lib in your browser, so the document is read into memory on your own machine and never transmitted.",
      "Two practical limits worth knowing before you start. Compression works by re-encoding embedded images, so a PDF that is mostly scanned pages will shrink substantially while one that is mostly text will barely change — text is already efficiently stored, and there is little left to remove. And a drawn signature is a visual mark, not a cryptographic one: it is fine for the everyday agreements that ask you to sign and return a PDF, but it is not a digital certificate signature and will not satisfy a process that specifically requires one.",
    ],
    faqs: [
      {
        q: "Is my PDF uploaded anywhere?",
        a: "No. Merging, splitting, compressing and signing all run in your browser using PDF-lib. The file is never sent to a server, which is what makes these tools appropriate for contracts, financial statements and identity documents.",
      },
      {
        q: "Why did compressing my PDF barely shrink it?",
        a: "Compression mainly re-encodes embedded images. A scanned document is essentially a stack of images and can often be reduced dramatically. A text-based PDF exported from a word processor is already compact, so there is very little to remove.",
      },
      {
        q: "Is a signature added here legally binding?",
        a: "It adds a visual signature to the page, which is what most everyday agreements ask for and is widely accepted for them. It is not a cryptographic digital signature backed by a certificate authority. If a process explicitly requires a qualified or certified digital signature, use a service built for that.",
      },
      {
        q: "Is there a page or file size limit?",
        a: "There is no limit imposed by the tool. The practical ceiling is your device's available memory, since the whole document is held in browser memory while being processed. Very large files — hundreds of megabytes — may be slow or fail on a phone while working fine on a laptop.",
      },
    ],
  },

  text: {
    intro: [
      "Text tools for the manipulation jobs that are trivial in concept and miserable by hand: counting words against a strict limit, converting a list of names between naming conventions, finding what actually changed between two versions of a document, removing duplicate lines from an exported list, or sorting a few hundred rows alphabetically.",
      "The word counter is the one most people arrive for, and the distinction it draws matters. Word count and character count are not interchangeable limits. University essays, articles and reports are set in words. Meta descriptions, tweets, SMS messages and most database fields are limited in characters — including spaces. A 155-character meta description is roughly 25 words, and getting the wrong unit means finding out at submission time.",
      "The diff checker earns its place on the details humans reliably miss. Trailing whitespace, a tab where a space belongs, a straight quote replaced by a curly one during a paste from a web page, or a hyphen silently converted to an en-dash — each of these is invisible when reading side by side and each can break a config file, a CSV import or a code block. A character-level comparison finds them immediately.",
    ],
    faqs: [
      {
        q: "How is reading time calculated?",
        a: "From an average adult silent reading speed of roughly 200-250 words per minute for general prose. It is an estimate: dense technical material reads considerably slower, and light narrative faster. Use it as a rough guide rather than a precise figure.",
      },
      {
        q: "Does the character count include spaces?",
        a: "Both figures are shown, because different limits use different conventions. Twitter, SMS and most meta description limits count spaces. Some database fields and form validators do not. Check which convention applies before trusting a count against a hard limit.",
      },
      {
        q: "What is the difference between camelCase and snake_case, and when do I use each?",
        a: "camelCase joins words with capitals after the first (userProfileName) and is conventional for JavaScript variables. snake_case joins with underscores (user_profile_name) and is standard in Python and SQL column names. kebab-case uses hyphens (user-profile-name) and is used for URL slugs and CSS classes, where underscores are awkward or disallowed.",
      },
      {
        q: "Can the diff checker compare code?",
        a: "Yes. The comparison is plain-text and language-agnostic, so it works on any source file, config or markup. It marks changes within a line as well as whole added or removed lines, so a single altered character does not flag an entire paragraph.",
      },
    ],
  },

  calculators: {
    intro: [
      "Calculators for the arithmetic that is easy to get wrong under time pressure: percentage change, a loan repayment, compound growth on savings, a tip split between an awkward number of people, BMI, or how many days there are until a deadline.",
      "The financial calculators are the ones worth understanding rather than merely using. A loan or EMI calculation is not simply principal plus interest divided by months — it uses an amortisation formula in which every payment is split between interest and principal, and the interest portion is largest at the beginning. This is why paying an extra amount early in a mortgage reduces the total cost far more than the same amount paid in the final years, and why the total interest figure is often startling the first time someone sees it written down.",
      "Compound interest works in the same direction but in your favour, and rewards time more than it rewards contribution size. Regular monthly contributions started early beat larger contributions started late, frequently by a wide margin, because each year's growth compounds on every previous year's growth. The projection tool makes that concrete: change the start year rather than the amount and watch which one moves the final figure more.",
      "One honest caveat on the health calculators. BMI is a population-level screening measure derived from height and weight alone. It does not distinguish muscle from fat, and it systematically misclassifies muscular people as overweight and some sedentary people as healthy. It is a starting point for a conversation with a doctor, not a diagnosis.",
    ],
    faqs: [
      {
        q: "How is a loan or EMI payment actually calculated?",
        a: "Using the standard amortisation formula, where each payment covers the interest accrued that period plus a portion of the principal. Because interest is charged on the outstanding balance, early payments are mostly interest and later payments are mostly principal. That is why overpaying early saves disproportionately more than overpaying late.",
      },
      {
        q: "Why does compound interest grow so much faster than expected?",
        a: "Because each period's growth is calculated on the total including all previous growth, not just on your original deposit. The effect is modest over a few years and dramatic over a few decades, which is why the number of years invested usually matters more than the amount invested per month.",
      },
      {
        q: "Is BMI a reliable measure of health?",
        a: "Only loosely, and only at population scale. It uses height and weight alone and cannot distinguish muscle from fat, so athletes are routinely classified as overweight. Treat it as one rough indicator among several rather than a verdict, and discuss anything concerning with a doctor.",
      },
      {
        q: "Can I rely on these for a real financial decision?",
        a: "They use standard formulas and the arithmetic is correct, so they are reliable for comparing options and understanding the shape of a commitment. They do not account for fees, insurance, tax treatment, rate changes or early-repayment penalties, all of which vary by lender and country. Use them to inform a decision, then confirm the exact figures with the provider.",
      },
    ],
  },

  converters: {
    intro: [
      "Converters for the everyday translation problems that are not unit conversions: number bases, timestamps, Roman numerals, Morse code, colour formats and date arithmetic.",
      "The timestamp converter is the one developers reach for most. Unix time counts seconds since 1 January 1970 UTC, which is why logs, databases and APIs store it — one unambiguous integer, no timezone, no locale, no daylight-saving edge cases. It is also completely unreadable to a human, so debugging anything time-related means converting constantly. Watch the units: JavaScript's Date.now() returns milliseconds while most backends and Unix tools use seconds, and mixing the two produces dates in 1970 or in the year 56000.",
      "The base converter matters for the same category of work. Hexadecimal is compact for binary data because each digit maps to exactly four bits, which is why colours, memory addresses and byte values are written that way. Binary makes bit flags and permission masks legible. Octal survives almost entirely because Unix file permissions use it — the 755 in chmod 755 is three octal digits, each encoding read, write and execute as bits.",
    ],
    faqs: [
      {
        q: "Is a Unix timestamp in seconds or milliseconds?",
        a: "Traditionally seconds — the count since 1 January 1970 UTC. JavaScript is the common exception, since Date.now() returns milliseconds. A quick check: a current timestamp in seconds is about 10 digits, in milliseconds about 13. If your converted date lands in 1970 or thousands of years from now, you have mixed the two.",
      },
      {
        q: "Why do developers use hexadecimal?",
        a: "Because it maps cleanly onto binary: one hex digit is exactly four bits, so a byte is always two hex digits. That makes binary data compact and readable, which is why colour codes, memory addresses and byte dumps all use it.",
      },
      {
        q: "Why are Unix file permissions written in octal?",
        a: "Because permissions come in groups of three bits — read, write and execute — and one octal digit represents exactly three bits. So 755 means owner read/write/execute (7), group read/execute (5), others read/execute (5). It is a historical convention that survives because it maps perfectly onto the underlying bits.",
      },
      {
        q: "Do these conversions happen in my browser?",
        a: "Yes. Every converter here is pure arithmetic or string manipulation running locally, so nothing you enter is transmitted and all of them work offline once loaded.",
      },
    ],
  },

  convert: {
    intro: [
      "Direct unit conversions across length, weight, temperature, volume, area, speed, time and digital storage — each with its own page showing the exact conversion factor rather than only the answer.",
      "Showing the factor is deliberate. A converter that returns a number teaches you nothing and has to be revisited every time; one that shows 1 inch = 2.54 cm gives you something you can carry. That particular figure is worth remembering because it is exact by definition — the inch was formally defined as precisely 2.54 centimetres by international agreement in 1959, so it is not a rounded approximation.",
      "Temperature is the exception to how everything else here works. Length, weight and volume conversions are single multiplications because their scales share a zero point: zero metres is zero feet. Temperature scales do not. Zero Celsius is 32 Fahrenheit, so converting requires both a multiplication and an offset — multiply by 9/5, then add 32. This is also why a temperature difference converts differently from a temperature: a rise of 10°C is a rise of 18°F, not 50°F.",
      "For cooking conversions specifically, be careful with volume. A US cup is 236.6 ml, a metric cup is 250 ml, and an imperial cup is 284 ml. Recipes rarely state which they mean, and in baking the difference is enough to matter.",
    ],
    faqs: [
      {
        q: "Why does temperature conversion need a formula instead of a factor?",
        a: "Because Celsius and Fahrenheit do not share a zero point. Scales that start from the same zero — metres and feet, kilograms and pounds — convert with a single multiplication. Zero Celsius is 32 Fahrenheit, so the conversion needs both a multiplier (9/5) and an offset (+32).",
      },
      {
        q: "Is 1 inch exactly 2.54 cm or rounded?",
        a: "Exactly. The international yard and pound agreement of 1959 defined the inch as precisely 2.54 centimetres, so it is a definition rather than a measurement. Many other imperial-to-metric factors are similarly exact by definition.",
      },
      {
        q: "Which cup measurement do recipes mean?",
        a: "It depends on origin, and recipes rarely say. A US customary cup is 236.6 ml, a metric cup is 250 ml, and an imperial cup is 284 ml. For baking, where ratios matter, weighing ingredients in grams avoids the problem entirely and is more accurate regardless.",
      },
      {
        q: "Is a kilobyte 1000 or 1024 bytes?",
        a: "Both conventions are in use, which is why file sizes appear to disagree between operating systems. The SI definition is 1000 bytes; the binary convention used by much software is 1024, properly called a kibibyte (KiB). Storage manufacturers use 1000, which is why a advertised 1 TB drive shows as roughly 931 GB in an operating system counting in binary.",
      },
    ],
  },

  social: {
    intro: [
      "Tools for the small production tasks around posting: generating hashtags, converting text into the unicode styles that render as bold or italic in bios, resizing an image to each platform's expected dimensions, and pulling a thumbnail from a YouTube video.",
      "The image resizer solves a genuinely irritating problem, because every platform expects something different and crops without asking. Instagram feed posts are square at 1080x1080 or portrait at 1080x1350, stories and reels are 1080x1920, YouTube thumbnails are 1280x720, and a LinkedIn banner is 1584x396. Uploading the wrong aspect ratio means the platform crops it, usually through the middle of whatever mattered.",
      "One caution on the fancy text generator. It works by substituting unicode mathematical alphanumeric symbols that visually resemble styled Latin letters — the output is not really bold text, it is a different set of characters that look like bold. That renders correctly in most bios, but screen readers announce these characters individually or skip them, so a name written in unicode 'bold' can be unreadable to a blind visitor. Use it for occasional decoration, not for anything a reader needs to understand.",
    ],
    faqs: [
      {
        q: "What size should an Instagram post be?",
        a: "1080x1080 for square feed posts, 1080x1350 for portrait — which occupies more vertical space in the feed — and 1080x1920 for stories and reels. Uploading a different aspect ratio lets the platform crop it automatically, usually badly.",
      },
      {
        q: "Why does fancy text sometimes show as boxes?",
        a: "Because it uses unicode symbols that resemble styled letters, and any device without a font covering those code points renders them as placeholder boxes. Support is good on current phones and inconsistent on older devices and some desktop applications.",
      },
      {
        q: "Is fancy text bad for accessibility?",
        a: "Yes, meaningfully so. Screen readers announce these unicode symbols individually or skip them entirely, so a bio written in fancy text can be incomprehensible to a blind visitor. Keep your name and any essential information in plain text.",
      },
      {
        q: "Can I use a downloaded YouTube thumbnail in my own content?",
        a: "The thumbnail is the copyright of the video's owner. Referencing or linking is generally fine; republishing one inside your own content normally requires permission. Downloading for research or reference is a different matter from redistribution.",
      },
    ],
  },

  seo: {
    intro: [
      "Practical SEO utilities for the mechanical parts of on-page work: generating meta tags and Open Graph markup, writing a robots.txt, building clean URL slugs and producing structured data.",
      "The meta tag tools enforce the length limits that matter, because both ends are a real cost. Google truncates titles at roughly 600 pixels — around 55-60 characters — and descriptions at about 155-160. A title cut mid-phrase loses whatever differentiator you put at the end, which is usually the part that earns the click. A description of 70 characters wastes most of the space you were given.",
      "Open Graph tags are worth more attention than they usually get, and the failure mode is invisible to you. Without them, a link shared to Slack, WhatsApp, LinkedIn or X renders as a bare URL or pulls an arbitrary image from the page. You never see this, because you are not the one sharing it. The one detail people miss most often: og:image must be an absolute URL, and a relative path silently produces no image at all.",
      "On robots.txt, one correction that comes up constantly. Disallow prevents crawling, not indexing. A URL blocked in robots.txt can still appear in search results if other pages link to it — Google simply cannot see its content to describe it. To keep a page out of the index, allow the crawl and serve a noindex directive. Blocking it in robots.txt actually prevents Google from ever seeing the noindex.",
    ],
    faqs: [
      {
        q: "How long should a title tag and meta description be?",
        a: "Titles around 50-60 characters, since Google truncates near 600 pixels of width rather than a fixed character count. Descriptions around 140-160. Front-load the distinctive words in both, because the end is what gets cut.",
      },
      {
        q: "Does a meta description affect rankings?",
        a: "Not directly — it has not been a ranking factor for many years. It affects click-through rate, which is worth optimising for on its own terms. Google also frequently rewrites descriptions using text from the page when it judges that a better match for the query.",
      },
      {
        q: "Will robots.txt keep a page out of Google?",
        a: "No, and this is a common and costly misunderstanding. Disallow blocks crawling, not indexing — a blocked URL can still be listed if other pages link to it, just without a description. To exclude a page from the index, allow crawling and serve a noindex meta tag or header. If you block it in robots.txt, Google can never see the noindex.",
      },
      {
        q: "Why doesn't my link preview show an image when shared?",
        a: "Most often because og:image is a relative path. It must be an absolute URL including the protocol and domain. Also check that the image is publicly reachable without a login, and that it is large enough — platforms generally want at least 1200x630.",
      },
    ],
  },

  productivity: {
    intro: [
      "Small productivity apps that work the moment you open them: notes, to-do lists, a Pomodoro timer, a stopwatch, a countdown, habit tracking and flashcards.",
      "All of them store data in your browser's local storage, and it is worth being precise about what that means, because it is both the main feature and the main limitation. Your notes and tasks never reach a server, so there is no account, no sync delay and no privacy policy to read. But the data is tied to one browser on one device. It will not appear on your phone, it does not survive clearing site data, and it is not there in a private window. For a scratchpad, a timer or a working task list, that is exactly the right trade. For anything you would be upset to lose, export it or use something with real backups.",
      "The Pomodoro timer follows the standard technique: twenty-five minutes of focused work, a five-minute break, and a longer break after four cycles. The mechanism is less about the specific intervals than about making starting cheap. Twenty-five minutes is short enough to begin something you have been avoiding, and the timer converts an open-ended, unpleasant task into a bounded one. Adjust the intervals to whatever holds your attention — the numbers are a convention, not a finding.",
    ],
    faqs: [
      {
        q: "Where are my notes and tasks stored?",
        a: "In your browser's local storage on the device you are using. They never reach a server, which is why there is no account and no sync. It also means they exist only in that browser on that device.",
      },
      {
        q: "Will I lose my data?",
        a: "It persists across visits and restarts, but it is removed if you clear browsing data or site storage, and it does not exist in a private window after that window closes. Browsers may also evict local storage under severe disk pressure. Export anything you cannot afford to lose.",
      },
      {
        q: "Can I sync between my phone and laptop?",
        a: "No. Local storage is per-device and per-browser by design — that is the same property that keeps the data private with no account. Cross-device sync would require a server holding your notes.",
      },
      {
        q: "Why twenty-five minutes for a Pomodoro?",
        a: "It is a convention from the original technique rather than a research finding. It works largely because it is short enough to make starting easy and bounded enough to make an unpleasant task feel finite. Many people do better at forty or fifty minutes once they are in the habit — adjust it to your own attention span.",
      },
    ],
  },

  career: {
    intro: [
      "Job-hunting tools covering the documents and decisions the process demands: building a resume that survives automated screening, drafting a cover letter, estimating a salary, and preparing for interviews.",
      "The resume builder is shaped around applicant tracking systems, which is the constraint most people underestimate. A large share of applications at medium and large companies are parsed by software before a person reads them, and ATS parsers are not sophisticated. They fail on multi-column layouts by reading straight across and interleaving unrelated text. They fail on text inside images and on unusual section headings. They frequently fail on tables. The template here is deliberately plain, single-column and conventionally headed, because a design that impresses a human is worthless if it never reaches one.",
      "Two things reliably improve a resume more than formatting. First, replace responsibilities with outcomes: 'responsible for the reporting pipeline' says nothing, while 'rebuilt the reporting pipeline, cutting month-end close from four days to six hours' says everything. Numbers do disproportionate work. Second, mirror the language of the specific posting — if it says 'stakeholder management' and your resume says 'client liaison', both a keyword filter and a hurried human may miss the match.",
      "On salary figures: treat any single estimate as one data point. Real compensation varies enormously by city, company size, industry and negotiating position, and published ranges lag the market. Triangulate across several sources before anchoring yourself to a number in a conversation.",
    ],
    faqs: [
      {
        q: "What makes a resume ATS-friendly?",
        a: "A single-column layout, standard section headings such as Experience and Education, real selectable text rather than text inside images, and no critical information locked inside tables or headers. Multi-column designs are the most common failure, because parsers read across the page and interleave unrelated content.",
      },
      {
        q: "Should my resume be one page or two?",
        a: "One page for early career, up to two once you have roughly a decade of relevant experience. Beyond two, the marginal page is rarely read. Cut oldest and least relevant material first — nobody needs the detail of a role from fifteen years ago.",
      },
      {
        q: "Do I need a different cover letter for every application?",
        a: "The specific parts, yes — why this company and why this role. Those are exactly the sentences that make it worth reading, and a generic letter is often worse than none. The structure and your own background can be reused; only the targeting needs rewriting each time.",
      },
      {
        q: "How accurate are salary estimates?",
        a: "Directionally useful, precisely unreliable. Compensation varies widely by location, company size, industry and individual negotiation, and public data lags the market. Use several sources to establish a range rather than treating one figure as the answer.",
      },
    ],
  },

  freelance: {
    intro: [
      "Two tools for the administrative side of freelancing that nobody enjoys: producing invoices and tracking billable time.",
      "The invoice generator covers the fields a professional invoice actually needs, and the omissions cause real problems. A unique invoice number is required for your own accounting and for most tax regimes, and duplicated numbers cause genuine trouble at year end. An explicit issue date and due date matter because 'due on receipt' is unenforceably vague — 'payable within 14 days, by 15 August 2026' gives you something concrete to reference when chasing. Full contact details for both parties, a clear line-item breakdown, and the correct tax treatment complete it.",
      "On tax: requirements differ by country and by your own registration status, and getting it wrong is expensive. Whether you must charge VAT or GST, at what rate, and whether a reverse-charge applies to a client in another country are questions with country-specific answers. The generator gives you the fields; what belongs in them depends on where you and your client are registered. Confirm it once with an accountant and reuse the answer.",
      "For time tracking, the practical advice is to record as you work rather than reconstructing at the end of the week. Retrospective estimates are consistently wrong, and almost always in the direction of undercounting — the ten minutes here and twenty minutes there vanish entirely, which is precisely the time freelancers most often fail to bill.",
    ],
    faqs: [
      {
        q: "What has to be on an invoice?",
        a: "A unique invoice number, the issue date, a clear payment due date, full contact and address details for both you and the client, an itemised breakdown of work with rates, the total, any applicable tax with the rate stated separately, and your payment details. Requirements vary by country, so confirm the specifics for yours.",
      },
      {
        q: "Do I need to charge VAT or GST?",
        a: "It depends on your country, your registration status and where your client is based. Cross-border work often involves reverse-charge rules that shift the obligation to the client. This is worth confirming once with an accountant for your specific situation, then applying consistently.",
      },
      {
        q: "What payment terms should I set?",
        a: "Fourteen or thirty days from the invoice date is standard, stated as an explicit date rather than a phrase like 'on receipt'. A concrete date makes following up straightforward and removes any ambiguity about when payment became late.",
      },
      {
        q: "Is my invoice and client data stored anywhere?",
        a: "No. Invoices are generated in your browser and any saved entries stay in your browser's local storage on that device. Client details and rates are never transmitted to a server.",
      },
    ],
  },
};

export function getCategoryContent(slug) {
  return CATEGORY_CONTENT[slug] || null;
}
