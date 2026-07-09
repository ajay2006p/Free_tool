/* ============================================================================
   SEO content for tool pages: a short intro, "how to use" steps and an FAQ.

   Google ranks tool pages that explain what the tool does and answer real
   questions — not just a bare widget. This module gives EVERY tool unique,
   useful supporting content (generated from its catalog entry), with
   hand-written overrides for the highest-traffic tools.

   Pure functions, no I/O — so tool pages stay statically generated.
   ========================================================================== */

import { site } from "./site";
import { conversionsBySlug, convert } from "./conversions";

// Tools that talk to a server/API (so the "runs entirely in your browser /
// data never leaves your device" privacy line does NOT apply to them).
const SERVER_BACKED = new Set(["video-downloader", "url-shortener", "currency-converter"]);

// A friendly noun per category for titles ("… – Free Online Developer Tool").
const CATEGORY_NOUN = {
  tools: "Developer Tool",
  ai: "AI Tool",
  games: "Game",
  image: "Image Tool",
  files: "PDF Tool",
  text: "Text Tool",
  calculators: "Calculator",
  converters: "Converter",
  convert: "Converter",
  social: "Social Media Tool",
  seo: "SEO Tool",
  productivity: "App",
  career: "Career Tool",
  freelance: "Freelance Tool",
};

// ---- hand-written content for the most popular tools ----------------------
const OVERRIDES = {
  "json-formatter": {
    intro: [
      "The JSON Formatter beautifies, minifies and validates JSON right in your browser. Paste a messy or minified blob and get clean, indented, easy-to-read JSON — or collapse it back to a single line for production.",
      "It's perfect for debugging API responses, tidying config files and confirming a payload is valid before you ship it. Nothing is uploaded, so even sensitive data stays on your machine.",
    ],
    faqs: [
      { q: "How do I format JSON online?", a: "Paste your JSON into the box and it's instantly beautified with proper indentation. You can also minify it back to one line or validate it for errors." },
      { q: "Can this tool validate my JSON?", a: "Yes. If your JSON has a syntax error, the formatter points it out so you can fix it before using the data." },
      { q: "Is my JSON kept private?", a: "Completely. Formatting happens entirely in your browser — your JSON is never sent to or stored on any server." },
    ],
  },
  "password-generator": {
    intro: [
      "The Password Generator creates strong, random passwords that are hard to crack and easy to copy. Choose the length and whether to include uppercase letters, numbers and symbols to match any site's requirements.",
      "Strong, unique passwords are the single best defence against account takeovers. Every password is generated locally in your browser and is never transmitted or logged.",
    ],
    faqs: [
      { q: "Are these passwords secure?", a: "Yes. Passwords are generated with your browser's cryptographic randomness and never leave your device, so no one — including us — can ever see them." },
      { q: "How long should my password be?", a: "Aim for at least 12–16 characters with a mix of letters, numbers and symbols. Longer is always stronger." },
      { q: "Do you store the passwords I generate?", a: "Never. Nothing is saved or sent anywhere — close the tab and the password is gone unless you copied it." },
    ],
  },
  "resume-builder": {
    intro: [
      "The Resume Builder helps you create a clean, ATS-friendly resume in minutes and download it as a polished PDF. Fill in your experience, education and skills, and the tool handles the formatting for you.",
      "A well-structured, keyword-rich resume gets past applicant tracking systems and in front of real recruiters. Everything you type stays in your browser, so your personal details remain private.",
    ],
    faqs: [
      { q: "Is this resume builder really free?", a: "Yes — build and download as many resumes as you like with no signup, no watermark and no fees." },
      { q: "Is my resume ATS-friendly?", a: "Yes. The layout uses a clean, single-column structure with standard headings that applicant tracking systems can read reliably." },
      { q: "Can I download my resume as a PDF?", a: "Yes. One click generates a real, print-ready PDF you can attach to any application." },
    ],
  },
  "qr-code-generator": {
    intro: [
      "The QR Code Generator turns any link or text into a scannable QR code you can download and print. Great for menus, business cards, event posters, Wi-Fi sharing and product packaging.",
      "Just type your URL or text and your QR code appears instantly. It's generated in your browser, so your links are never stored or tracked.",
    ],
    faqs: [
      { q: "Do these QR codes expire?", a: "No. The QR codes are static, so they work forever and never expire or stop scanning." },
      { q: "Can I use the QR code commercially?", a: "Yes — the codes you generate are free to use on any personal or commercial material." },
      { q: "Is there a scan limit?", a: "None at all. Your QR code can be scanned an unlimited number of times." },
    ],
  },
  "word-counter": {
    intro: [
      "The Word & Character Counter instantly counts the words, characters and estimated reading time in any text. Ideal for essays, blog posts, social captions and anything with a length limit.",
      "Paste or type your text and the stats update live as you write. Everything runs in your browser, so your writing stays completely private.",
    ],
    faqs: [
      { q: "Does it count characters with and without spaces?", a: "Yes — you get both the word count and the character count so you can meet any limit precisely." },
      { q: "Is my text stored anywhere?", a: "No. Counting happens in your browser and your text is never uploaded or saved." },
      { q: "How is reading time calculated?", a: "Reading time is estimated from your word count using an average adult reading speed of around 200–250 words per minute." },
    ],
  },
  "video-downloader": {
    intro: [
      "The Social Media Downloader lets you save videos from YouTube, TikTok, Instagram, Facebook and X (Twitter) in a few clicks. Paste a link, pick the quality you want — from crisp HD video to audio-only — and download it straight to your device.",
      "It's the fastest way to keep a copy of clips you're allowed to save: your own uploads, Creative Commons videos, lecture recordings, or reels you want to watch offline. There's no signup, no watermark and no software to install — everything happens through your browser.",
      "For YouTube, a built-in engine reads the available formats directly. On some networks video sites rate-limit automated requests, so if a link ever stalls, try again or connect a downloader API in settings. Only download content you own or have the right to use, and always respect each platform's terms and copyright.",
    ],
    faqs: [
      { q: "Is this YouTube downloader free?", a: "Yes — it's completely free with no signup, no watermark and no daily limit." },
      { q: "Can I download just the audio (MP3/M4A)?", a: "Yes. When you paste a YouTube link you'll see audio-only options alongside the video formats, perfect for music, podcasts and interviews." },
      { q: "What video quality can I get?", a: "The built-in engine downloads ready-to-play formats (typically up to 720p with sound). Audio-only downloads are available too." },
      { q: "Is it legal to download videos?", a: "Only download videos you own or have permission to use, and follow each platform's terms of service and copyright rules." },
    ],
  },
  "image-to-text": {
    intro: [
      "The Image to Text (OCR) tool pulls the words out of any picture, screenshot, scanned page or photo — right inside your browser. Upload an image and it recognises the text so you can copy, edit and reuse it instead of retyping everything by hand.",
      "It supports multiple languages including English, Spanish, French, German, Hindi, Chinese and Arabic, and works on receipts, business cards, book pages, slides, signs and handwriting-style print. Because the recognition runs locally on your device, your images and their contents are never uploaded to a server.",
      "It's a huge time-saver for students digitising notes, professionals extracting text from PDFs and screenshots, and anyone who needs to grab a quote, code snippet or address from an image in seconds.",
    ],
    faqs: [
      { q: "Is this OCR tool free?", a: "Yes — extract text from as many images as you like, free, with no signup." },
      { q: "Are my images private?", a: "Completely. Recognition runs in your browser, so your images never leave your device." },
      { q: "Which languages are supported?", a: "English plus Spanish, French, German, Hindi, Simplified Chinese and Arabic — pick your language before extracting for the best accuracy." },
      { q: "Why does the first scan take a moment?", a: "The first run downloads a small language file once; after that, scans are fast." },
    ],
  },
  "speech-to-text": {
    intro: [
      "Speech to Text turns your voice into written words in real time. Press record, start talking, and watch your words appear instantly — no typing required. It's perfect for drafting notes, emails, essays and messages hands-free, or for anyone who thinks faster than they type.",
      "Choose from several languages and accents, dictate for as long as you like, then copy the transcript or download it as a text file. The whole thing runs through your browser's built-in speech engine, so it's fast and free.",
      "Voice typing is a genuine productivity boost for writers, students, busy professionals and people with accessibility needs — capture ideas the moment they arrive instead of losing them.",
    ],
    faqs: [
      { q: "Is Speech to Text free?", a: "Yes, completely free with no signup and no time limit." },
      { q: "Which browsers work best?", a: "It uses the Web Speech API, which works best in Google Chrome and Microsoft Edge on desktop and Android." },
      { q: "Can I edit the transcript?", a: "Yes — the transcript is fully editable, so you can fix any words before copying or downloading it." },
    ],
  },
  "currency-converter": {
    intro: [
      "The Currency Converter shows you live exchange rates for more than 30 major world currencies, including USD, EUR, GBP, INR, JPY, AUD and CAD. Type an amount, choose the currencies, and get an accurate, up-to-date conversion instantly.",
      "Rates are pulled from trusted daily reference data, so whether you're budgeting a trip, shopping from an overseas store, invoicing an international client or just curious, you'll always see a realistic figure. A quick reference table also shows your amount in several popular currencies at once.",
      "It's fast, free and works on any device — a handy companion for travellers, freelancers, online shoppers and anyone dealing with money across borders.",
    ],
    faqs: [
      { q: "Are the exchange rates live?", a: "Yes — rates come from daily reference data (European Central Bank), which updates every business day." },
      { q: "Is the currency converter free?", a: "Completely free, with no signup and no limits on conversions." },
      { q: "Which currencies are supported?", a: "Over 30 major currencies including USD, EUR, GBP, INR, JPY, AUD, CAD, CHF, CNY, SGD and many more." },
    ],
  },
  "meme-generator": {
    intro: [
      "The Meme Generator lets you turn any image into a classic meme in seconds. Upload a picture, add bold top and bottom captions in the iconic Impact style, tweak the size and colours, then download your creation as a ready-to-share PNG.",
      "There are no watermarks, no signups and no clunky editors — just fast, fun meme-making right in your browser. Everything stays on your device, so your images are completely private.",
      "It's perfect for social media managers, community admins, group chats and anyone who wants to jump on a trend or make their friends laugh without downloading an app.",
    ],
    faqs: [
      { q: "Is the Meme Generator free?", a: "Yes — make and download unlimited memes for free, with no watermark." },
      { q: "Can I use my own images?", a: "Absolutely. Upload any image from your device and add your captions on top." },
      { q: "Where are my images stored?", a: "Nowhere — meme creation happens entirely in your browser, so your images never leave your device." },
    ],
  },
  "barcode-generator": {
    intro: [
      "The Barcode Generator creates scannable barcodes in every popular format — CODE128, EAN-13, UPC, CODE39, ITF-14 and more. Enter your value, choose a format, customise the size and colours, and download the barcode as a crisp PNG or scalable SVG.",
      "It's ideal for retail products, inventory and warehouse labels, asset tracking, shipping and events. The barcodes are generated in your browser, so your data stays private and there's no signup or cost.",
      "Whether you're a small shop labelling stock, a maker packaging products, or a developer testing a scanner, you get print-ready barcodes in seconds.",
    ],
    faqs: [
      { q: "Which barcode formats are supported?", a: "CODE128, EAN-13, EAN-8, UPC, CODE39, ITF-14, MSI, pharmacode and codabar." },
      { q: "Can I download a vector (SVG) barcode?", a: "Yes — download as PNG for quick use or SVG for crisp, scalable printing." },
      { q: "Which format should I use?", a: "Use EAN/UPC for retail products, ITF-14 for shipping cartons, and CODE128 for general-purpose labels." },
    ],
  },
  "password-strength": {
    intro: [
      "The Password Strength Checker tells you how strong — and how crackable — a password really is. Type a password and instantly see a strength score, an estimate of how long it would take to crack, and specific tips to make it stronger.",
      "It checks length, character variety and common weak patterns like sequences, repeats and well-known passwords. Everything is calculated locally in your browser: your password is never sent anywhere, stored or logged.",
      "Use it to audit your important logins, teach good password habits, or sanity-check a new password before you rely on it.",
    ],
    faqs: [
      { q: "Is it safe to type my password here?", a: "Yes. The check runs entirely in your browser — nothing is uploaded, stored or logged, so your password stays private." },
      { q: "What makes a password strong?", a: "Length above all — aim for 12–16+ characters mixing upper and lower case, numbers and symbols, and avoid dictionary words and sequences." },
      { q: "Is this tool free?", a: "Yes, completely free with no signup." },
    ],
  },
  "favicon-generator": {
    intro: [
      "The Favicon Generator creates all the icon sizes a website needs — 16, 32, 48, 180, 192 and 512 pixels — from a single image or even just a letter. Upload a logo or type a character, pick your colours and shape, and download ready-to-use favicons plus the HTML code to add them.",
      "Everything is generated in your browser, so your artwork stays private and there's nothing to install. It's the quick, free way to give your site a polished, professional icon in the browser tab and on phone home screens.",
      "Perfect for developers, bloggers and small businesses launching a new site who want a proper favicon and Apple touch icon without opening a design app.",
    ],
    faqs: [
      { q: "What favicon sizes does it create?", a: "16×16, 32×32, 48×48, plus 180×180 (Apple touch icon), 192×192 and 512×512 for modern devices and PWAs." },
      { q: "Can I make a favicon from text?", a: "Yes — type a letter or emoji, choose a background and colour, and it becomes your icon." },
      { q: "Is it free?", a: "Yes, completely free with no signup or watermark." },
    ],
  },
  "json-to-typescript": {
    intro: [
      "JSON to TypeScript instantly turns any JSON into clean, ready-to-use TypeScript type definitions. Paste an API response or config object and get accurate interfaces — with nested objects, arrays and optional fields all handled for you.",
      "It saves developers from writing types by hand, cuts down on runtime bugs, and keeps your codebase strongly typed. The conversion runs entirely in your browser, so your data never leaves your machine.",
      "Choose between interfaces or type aliases, set a root name, and copy the result straight into your project — a real time-saver when working with third-party APIs.",
    ],
    faqs: [
      { q: "Does it handle nested objects and arrays?", a: "Yes — nested objects become their own named interfaces, and arrays infer their element type, merging keys across items where needed." },
      { q: "Is my JSON kept private?", a: "Yes. The conversion happens in your browser; nothing is uploaded." },
      { q: "Can I choose interface vs type?", a: "Yes — toggle between TypeScript interfaces and type aliases, and set the root type name." },
    ],
  },
  "ai-assistant": {
    intro: [
      "The AI Assistant is your friendly guide to 150+ free tools. Just tell it what you're trying to do — \"compress a photo\", \"make a resume\", \"download a video\" — and it instantly points you to the right tool, no menu-hunting required.",
      "It understands everyday language and synonyms, so you don't need to know the exact tool name. It also answers quick questions about how the site works. Everything runs in your browser: your messages are matched to tools locally and are never sent anywhere.",
      "Think of it as a shortcut through the whole toolbox — perfect when you know what you need to get done but not which tool does it.",
    ],
    faqs: [
      { q: "Is the AI Assistant free?", a: "Yes — it's completely free, with no signup." },
      { q: "Does it send my messages to a server?", a: "No. The assistant matches your request to our tools entirely in your browser; nothing is uploaded." },
      { q: "What can I ask it?", a: "Describe any task in plain words — like \"convert PDF\", \"check my password\", or \"make a QR code\" — and it recommends the best tools." },
    ],
  },
  "ai-cover-letter": {
    intro: [
      "The AI Cover Letter Generator writes a tailored, professional cover letter in seconds. Enter the job title, the company, and a few of your key skills, choose a tone, and get a complete, well-structured letter you can copy, tweak and send.",
      "It handles the hard part — a strong opening hook, body paragraphs that sell your strengths, and a confident close — using proven phrasing so you never stare at a blank page again. Everything is generated in your browser and nothing you type is stored.",
      "It's ideal for job seekers applying to lots of roles who want a polished, customised letter for each one without spending an hour on it.",
    ],
    faqs: [
      { q: "Is the AI Cover Letter Generator free?", a: "Yes — generate unlimited cover letters for free, with no signup." },
      { q: "Can I change the tone?", a: "Yes. Pick Professional, Enthusiastic, Confident or Friendly, and regenerate for fresh wording any time." },
      { q: "Should I edit the letter before sending?", a: "Always give it a quick read and add a personal detail or two — it gives you a strong, complete draft to build on." },
    ],
  },
  "ai-email-writer": {
    intro: [
      "The AI Email Writer drafts clear, professional emails for any situation — follow-ups, job applications, meeting requests, apologies, thank-yous, resignations, sales outreach and more. Pick the type, add your key points, choose a tone, and get a ready-to-send email with a subject line.",
      "It saves you from agonising over wording and gets the structure and etiquette right every time. The email is generated entirely in your browser, so your message stays private.",
      "Great for professionals, job seekers and small business owners who send a lot of email and want to sound polished without the effort.",
    ],
    faqs: [
      { q: "Is the AI Email Writer free?", a: "Yes — write unlimited emails for free, with no signup." },
      { q: "What kinds of emails can it write?", a: "Follow-ups, job applications, meeting requests, apologies, thank-yous, resignations, sales outreach, networking intros and complaints." },
      { q: "Is my email content private?", a: "Yes — everything is generated in your browser and never uploaded." },
    ],
  },
  "business-name-generator": {
    intro: [
      "The Business Name Generator sparks brandable name ideas for your startup, shop, app or side project. Enter a keyword or your industry, pick a style — Modern, Playful, Premium, Techy or Classic — and get a big list of creative names to choose from.",
      "It mixes smart strategies (prefixes, suffixes, blends, compounds and invented words) to give you names that actually sound like real brands. Everything runs in your browser, instantly and for free.",
      "Perfect for founders and creators in the naming stage — generate as many rounds as you like, then check domain and trademark availability before you commit.",
    ],
    faqs: [
      { q: "Is the Business Name Generator free?", a: "Yes — generate unlimited business name ideas for free, no signup." },
      { q: "Can I use a name I find here?", a: "Yes, but always check that the domain and trademark are available in your country before using a name commercially." },
      { q: "Can I get different styles?", a: "Yes — switch between Modern, Playful, Premium, Techy and Classic styles for very different vibes." },
    ],
  },
  "resume-template-builder": {
    intro: [
      "The Resume Template Builder lets you create a professional, recruiter-ready resume in minutes — just fill in your information, pick from several polished designs, and download a clean PDF. Switch between Modern, Classic, Minimal and Two-Column templates instantly to find the look that fits your industry.",
      "Everything updates in a live preview as you type, and you can recolour any template to match your style. Your details are saved in your browser and never uploaded, so building your resume is completely private and free — no signup, no watermark.",
      "Whether you're a student applying for your first job, a professional changing careers, or a freelancer polishing your profile, you get a beautiful, ATS-friendly resume you can download and send in one click.",
    ],
    faqs: [
      { q: "Is the Resume Template Builder free?", a: "Yes — build and download unlimited resumes for free, with no signup and no watermark." },
      { q: "Can I choose different resume designs?", a: "Yes. Switch instantly between Modern, Classic, Minimal and Two-Column templates, and pick your own accent colour." },
      { q: "Can I download my resume as a PDF?", a: "Yes — one click generates a clean, multi-page PDF you can attach to any application." },
      { q: "Is my information private?", a: "Completely. Your details are saved only in your browser and are never uploaded to any server." },
    ],
  },
  "wedding-hashtag-generator": {
    intro: [
      "The Wedding Hashtag Generator creates dozens of cute, custom hashtags for your big day from just your first names — plus your new last name and wedding year if you want. Enter the couple's names and instantly get playful, classic, funny and elegant options to choose from.",
      "A shared wedding hashtag is the easiest way to collect every guest's photos in one place: put it on your invitations, signage and place cards, and everyone's snaps land under a single tag on Instagram and TikTok. Pick one or two favourites and you're set.",
      "It's completely free with no signup, and everything is generated right in your browser — your names are never stored or shared. Perfect for couples, wedding planners and bridesmaids putting the finishing touches on the celebration.",
    ],
    faqs: [
      { q: "Is the Wedding Hashtag Generator free?", a: "Yes — generate unlimited wedding hashtags for free, with no signup." },
      { q: "How do I use my wedding hashtag?", a: "Choose one or two you love and add them to your invitations, signs and social posts so guests tag all their photos in one place." },
      { q: "Can I include our last name and year?", a: "Yes — add your shared last name and wedding year for even more personalised hashtag ideas." },
      { q: "Are my names stored anywhere?", a: "No. Hashtags are generated entirely in your browser, so your names never leave your device." },
    ],
  },
};

// ---- generic generator for every other tool -------------------------------
function kindOf(service, categorySlug) {
  const n = (service.slug + " " + service.name).toLowerCase();
  if (categorySlug === "games") return "game";
  if (/download/.test(n)) return "downloader";
  if (/generator|generate|maker|builder|build/.test(n)) return "generator";
  if (/formatter|format|minif|beautif|prettif/.test(n)) return "formatter";
  if (/convert|converter|encode|decode|\bto\b|-to-/.test(n)) return "converter";
  if (/calculator|calc/.test(n)) return "calculator";
  if (/counter|count|checker|check|tester|test|density|diff|compare|audit/.test(n)) return "analyzer";
  if (/notes|todo|kanban|timer|pomodoro|stopwatch|countdown|habit|goal|expense|bookmark|tracker/.test(n)) return "app";
  return "tool";
}

const HOWTO = {
  generator: ["Choose the options you want.", "Your result is generated instantly as you tweak the settings.", "Copy or download the output — it's ready to use."],
  formatter: ["Paste your code or text into the box.", "It's formatted and checked for errors automatically.", "Copy the clean, tidy result with one click."],
  converter: ["Enter or paste your input.", "Pick the format you want to convert to.", "Copy the converted result instantly."],
  calculator: ["Type your numbers into the fields.", "The result updates the moment you change a value.", "Adjust any input to compare different scenarios."],
  analyzer: ["Paste or type your text.", "See the breakdown update in real time.", "Use the insights to improve your content."],
  app: ["Add your first item to get started.", "Everything is saved in your browser automatically.", "Come back any time — your data is waiting for you."],
  downloader: ["Paste the link you want to download.", "Press the button to fetch the available files.", "Pick your quality and save it to your device."],
  game: ["Press start to begin playing.", "Use your keyboard or on-screen controls.", "Try to beat your best score!"],
  tool: ["Enter your input.", "Get your result instantly.", "Copy or reuse it however you like."],
};

function stripPeriod(s) {
  return (s || "").trim().replace(/\.$/, "");
}

function generate(service, category) {
  const kind = kindOf(service, category.slug);
  const clientSide = !SERVER_BACKED.has(service.slug);
  const name = service.name;

  const privacyLine = clientSide
    ? `Like every tool on ${site.name}, it runs right in your browser — no signup, no installs and no limits — so your data stays private on your device.`
    : `It's free to use with no signup and no limits, and works on any modern device.`;

  const WHY = {
    generator: `Whether you're building a website, prepping a design or just need a quick result, ${name} saves you from fiddly manual work and hands back a clean, copy-ready output every time.`,
    formatter: `It's a daily time-saver for developers — turn messy, minified or broken code into something clean, valid and easy to read in a single click.`,
    converter: `It's handy for students, developers, cooks, travellers and anyone who needs a quick, accurate answer without digging up a formula.`,
    calculator: `Use it to plan budgets, compare options and make smarter decisions in seconds, with clear numbers you can rely on.`,
    analyzer: `It's perfect for writers, students, marketers and developers who want fast, accurate insight into their content.`,
    app: `Your entries are saved locally in your browser, so your notes, tasks and progress are waiting for you whenever you come back — private and always on this device.`,
    downloader: `It's the quick way to keep a copy of content you're allowed to save, ready to watch or listen to offline, on any device.`,
    game: `It's a fun, quick break you can play anywhere, on any device, with nothing to install.`,
    tool: `It's a quick, reliable helper you can reach for whenever you need it, on desktop or mobile.`,
  };

  const intro = [
    `${name} is a free online ${CATEGORY_NOUN[category.slug]?.toLowerCase() || "tool"} that lets you ${stripPeriod(service.desc).toLowerCase() || "get the job done fast"}. It's fast, simple and works instantly — no downloads, no account and no cost.`,
    WHY[kind] || WHY.tool,
    privacyLine,
  ];

  const faqs = [
    { q: `Is ${name} free to use?`, a: `Yes. ${name} is 100% free with no signup, no watermarks and no usage limits.` },
  ];
  if (clientSide) {
    faqs.push({ q: "Is my data private?", a: `Yes. ${name} runs entirely in your browser, so nothing you enter is uploaded to or stored on our servers.` });
  }
  faqs.push({ q: "Do I need to create an account?", a: "No account is needed — just open the page and start using it right away." });

  // one kind-specific question for extra uniqueness
  if (kind === "converter") faqs.push({ q: "Are the conversions accurate?", a: `Yes — ${name} uses precise, standard formulas so you can trust every result.` });
  else if (kind === "calculator") faqs.push({ q: "Are the results accurate?", a: `Yes. ${name} uses standard formulas, but always double-check important financial or health decisions with a professional.` });
  else if (kind === "generator") faqs.push({ q: "Can I use the results commercially?", a: `Yes — anything you create with ${name} is yours to use in personal or commercial projects for free.` });
  else if (kind === "game") faqs.push({ q: "Do I need to install anything?", a: `No — ${name} plays instantly in your browser on desktop or mobile, with nothing to download.` });
  else faqs.push({ q: "Does it work on mobile?", a: `Yes. ${name} works in any modern browser on your phone, tablet or computer.` });

  return { intro, howto: HOWTO[kind], faqs };
}

// Unique content for each auto-generated "X to Y" conversion page. Uses the
// real conversion factor so all 100+ pages have genuinely different, useful
// copy (avoids Google's thin/duplicate-content penalty).
function singular(label) {
  return label.replace(/s$/, "").toLowerCase();
}
function convertContent(service) {
  const p = conversionsBySlug[service.slug];
  if (!p) return null;
  const { dim, from, to, fromLabel, toLabel, fu, tu } = p;
  const lo = fromLabel.toLowerCase();
  const to_ = toLabel.toLowerCase();
  const isTemp = dim === "temperature";

  let factorLine, formulaAnswer, factorFaq;
  if (isTemp) {
    factorLine = `Temperature scales don't use a single multiplier, so this converter applies the exact ${lo}-to-${to_} formula for you.`;
    formulaAnswer = `Enter a value above and the exact ${to_} temperature appears instantly, using the standard ${lo}-to-${to_} formula.`;
  } else {
    const f = convert(1, from, to, dim);
    factorLine = `The factor is simple: 1 ${fu} = ${f} ${tu}.`;
    formulaAnswer = `Multiply your ${lo} figure by ${f} to get ${to_} — or just type a value above and read the answer instantly.`;
    factorFaq = { q: `How many ${to_} are in one ${singular(fromLabel)}?`, a: `1 ${fu} = ${f} ${tu}.` };
  }

  const intro = [
    `Convert ${lo} to ${to_} instantly. Type any value in ${lo} and this free tool shows the exact equivalent in ${to_}, along with a reference table of common values. ${factorLine}`,
    `Whether you're studying, cooking, travelling, shipping a package or working on a project, an accurate ${fromLabel} → ${toLabel} conversion is one tap away — no formula to memorise and no maths to do by hand.`,
    `Everything runs right in your browser, so it's instant, free and private, and it works just as well on your phone as on your computer.`,
  ];
  const howto = [
    `Enter the number of ${lo} you want to convert.`,
    `The equivalent in ${to_} appears instantly — there's no button to press.`,
    `Check the reference table for common ${fromLabel} → ${toLabel} values.`,
  ];
  const faqs = [
    { q: `How do I convert ${lo} to ${to_}?`, a: formulaAnswer },
    ...(factorFaq ? [factorFaq] : []),
    { q: "Is this converter free and accurate?", a: "Yes. It's completely free, needs no signup, and uses precise standard conversion factors so you can rely on every result." },
    { q: "Does it work on mobile?", a: `Yes — the ${fromLabel} to ${toLabel} converter runs in any browser on your phone, tablet or computer.` },
  ];
  return {
    title: `${service.name} Converter – Free & Instant`,
    description: `Convert ${lo} to ${to_} instantly with a free online converter and reference table. Fast, accurate and no signup.`,
    intro,
    howto,
    faqs,
  };
}

/**
 * Returns SEO content for a tool page:
 *   { title, description, intro:[], howto:[], faqs:[{q,a}] }
 */
export function getToolContent(category, service) {
  if (category.slug === "convert") {
    const c = convertContent(service);
    if (c) return c;
  }
  const base = generate(service, category);
  const ov = OVERRIDES[service.slug] || {};
  const noun = CATEGORY_NOUN[category.slug] || "Tool";
  return {
    title: ov.title || `${service.name} – Free Online ${noun}`,
    description:
      ov.description ||
      `${stripPeriod(service.desc)}. Use ${service.name} free online — no signup, no install, works on any device.`,
    intro: ov.intro || base.intro,
    howto: ov.howto || base.howto,
    faqs: ov.faqs || base.faqs,
  };
}
