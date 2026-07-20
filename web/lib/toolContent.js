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
  "pdf-merge": {
    intro: [
      "Merge PDF combines several PDF files into one document, in the order you choose. Drag your files in, reorder them until the sequence is right, and download a single merged PDF — page sizes, orientation and embedded fonts are all preserved exactly as they were.",
      "The merge happens inside your browser using the PDF's own page objects, which means two things worth knowing: nothing is uploaded to a server, and the pages are copied rather than re-rendered, so there is no quality loss and no re-compression. A scanned page merged today looks identical to the original.",
      "It's the tool you want when a form arrives as five separate attachments, when you're assembling a portfolio from individual exports, or when a submission portal accepts exactly one file and you have six.",
    ],
    howto: [
      "Drop in two or more PDF files, or click to browse for them.",
      "Drag the thumbnails to set the page order — the merged file follows this sequence.",
      "Click Merge and download the combined PDF.",
    ],
    faqs: [
      { q: "Is there a file size or page limit?", a: "There's no hard limit, but very large files are held in your device's memory while merging. On a phone, keep the combined total under roughly 100 MB; on a desktop you can go considerably higher." },
      { q: "Will merging reduce the quality of my PDFs?", a: "No. Pages are copied across as-is rather than re-encoded, so text stays selectable, images keep their original resolution and fonts stay embedded." },
      { q: "Are my documents uploaded anywhere?", a: "No — the merge runs entirely in your browser. Your files never leave your device, which matters when the PDFs are contracts, medical records or ID documents." },
      { q: "Can I merge password-protected PDFs?", a: "Not directly. Remove the password in your PDF reader first, then merge — encrypted files can't be read without the password." },
    ],
  },
  "pdf-split": {
    intro: [
      "Split PDF pulls a large document apart — extract a single page, pick a range like 4-9, or break every page into its own file. Load the PDF, choose what you need, and download the result without touching the rest of the document.",
      "Extracted pages keep their original quality, text layer and dimensions, because the pages are lifted out rather than re-rendered. Selectable text stays selectable and searchable after the split.",
      "Useful when you only need chapter three of a 200-page manual, when one page of a bank statement is all a form requires, or when a scanner has handed you a single file that should have been twenty.",
    ],
    howto: [
      "Upload the PDF you want to split.",
      "Enter a page range (for example 4-9), a single page number, or choose to split every page.",
      "Download the extracted pages as a new PDF.",
    ],
    faqs: [
      { q: "Can I extract non-consecutive pages?", a: "Yes — enter them comma-separated, like 1, 4, 9-12, and they'll be pulled into a single output PDF in that order." },
      { q: "Does splitting affect text or image quality?", a: "No. Pages are extracted intact, so text remains selectable and images keep their original resolution — nothing is re-compressed." },
      { q: "Is my PDF uploaded to a server?", a: "No. Everything happens in your browser, so confidential documents stay on your device." },
    ],
  },
  "pdf-compress": {
    intro: [
      "Compress PDF shrinks an oversized document so it fits an email attachment limit or an upload cap. Most of the weight in a large PDF is images, so that's where the savings come from — the images are re-encoded at a lower quality while the text layer is left untouched and stays perfectly sharp.",
      "How much you save depends entirely on what's inside. A text-heavy report may barely shrink because there was little to remove. A file full of phone photos or scanned pages often drops by 60-90%, because camera images carry far more pixel data than a printed page needs.",
      "Worth knowing: compression is lossy for images and can't be undone, so keep your original if the document is going to print. For email, web upload or archiving, the difference is usually invisible.",
    ],
    faqs: [
      { q: "Why did my PDF barely get smaller?", a: "It was probably already efficient — a text-only PDF has little to compress. The big wins come from documents containing photos or scanned pages, where the image data dominates the file size." },
      { q: "Will the text become blurry?", a: "No. Text in a PDF is stored as vector glyphs, not pixels, so it stays sharp at any zoom. Only embedded images are re-encoded." },
      { q: "Can I undo the compression?", a: "No — image compression discards data permanently. Keep your original file if you may need full quality later, for example for professional printing." },
      { q: "Is my file uploaded?", a: "No. Compression runs in your browser and your document never leaves your device." },
    ],
  },
  "images-to-pdf": {
    intro: [
      "Images to PDF turns a pile of photos or scans into one tidy PDF document. Add JPG, PNG or WebP files, drag them into the right order, and download a single PDF with one image per page.",
      "This is the fix for the very common problem of a form or portal that insists on a PDF when what you have is photos — a passport scan, receipts for an expense claim, handwritten notes, or a set of ID documents. Rather than pasting images into a word processor and exporting, you get a clean PDF directly.",
      "The conversion runs entirely in your browser, so photos of personal documents are never uploaded anywhere. Images keep their original resolution, and each page is sized to its image so nothing is cropped or stretched.",
    ],
    howto: [
      "Add your images — JPG, PNG or WebP, as many as you need.",
      "Drag the thumbnails to set the page order.",
      "Download the finished PDF, one image per page.",
    ],
    faqs: [
      { q: "What image formats can I use?", a: "JPG, PNG and WebP. You can mix formats freely in the same document." },
      { q: "Will my images be cropped or resized?", a: "No — each page is sized to fit its image, so nothing is cropped and the original resolution is preserved." },
      { q: "Can I control the page order?", a: "Yes. Drag the thumbnails before converting; the PDF follows the order you set." },
      { q: "Are my photos uploaded?", a: "Never. Everything runs in your browser — important when the images are ID documents or personal paperwork." },
    ],
  },
  "image-compressor": {
    intro: [
      "The Image Compressor makes photos dramatically smaller while keeping them looking the same. Drop an image in, adjust the quality slider, and watch the file size update live next to a preview so you can see exactly what you're trading away before you download.",
      "The saving comes from JPEG's quality setting, and the curve is steeply in your favour: dropping from 100% to around 80% typically cuts file size by 60-70% with almost no visible difference, because the discarded detail sits in frequencies your eye barely registers. Below about 60% you'll start to see blocking around sharp edges and text.",
      "Smaller images are the single easiest page-speed win on most websites, and they matter for Core Web Vitals. They're also the difference between an email attachment that sends and one that bounces.",
    ],
    faqs: [
      { q: "What quality setting should I use?", a: "80% is the sweet spot for photos — usually a 60-70% size reduction with no visible loss. Use 90% for images with text or sharp graphics, and don't go below 60% unless file size really matters more than looks." },
      { q: "Does compressing reduce the image dimensions?", a: "No — the pixel dimensions stay the same. It's the amount of data used to describe those pixels that shrinks. Use the Image Resizer if you want fewer pixels." },
      { q: "Can I compress PNG images?", a: "Yes, though PNG is lossless and compresses less dramatically. For photographs, converting to JPEG usually saves far more than compressing the PNG." },
      { q: "Are my images uploaded?", a: "No. Compression happens in your browser using a canvas, so your photos never leave your device." },
    ],
  },
  "image-resizer": {
    intro: [
      "The Image Resizer changes an image's pixel dimensions — to hit an exact upload requirement, to fit a layout, or simply to stop a 4000-pixel-wide camera photo being used where 800 would do. Enter a width or height, keep the aspect ratio locked, and download the result.",
      "Resizing down is safe and often improves quality-per-byte, since you're discarding pixels you weren't displaying anyway. Resizing up is a different matter: enlarging can't invent detail that was never captured, so a small image scaled up will look soft no matter what tool does it. Start from the largest original you have.",
      "Handy for profile pictures with a fixed size requirement, product photos that need consistent dimensions, and shrinking camera images before putting them on a website.",
    ],
    howto: [
      "Upload your image.",
      "Enter the width or height you need — leave the ratio locked to avoid distortion.",
      "Download the resized image.",
    ],
    faqs: [
      { q: "Will resizing distort my image?", a: "Not if you keep the aspect ratio locked — set one dimension and the other follows. Unlock it only when you deliberately need a fixed non-proportional size." },
      { q: "Can I make a small image bigger without losing quality?", a: "Not really. Enlarging stretches existing pixels and can't recover detail that was never in the file, so the result looks soft. Always start from the largest original available." },
      { q: "What's the difference between resizing and compressing?", a: "Resizing changes how many pixels the image has. Compressing keeps the pixel count and reduces the data used to store them. For a smaller file, resizing down first and then compressing gives the best result." },
    ],
  },
  "bmi-calculator": {
    intro: [
      "The BMI Calculator works out your Body Mass Index from your height and weight, in either metric or imperial units, and shows where it falls on the standard World Health Organization scale.",
      "The formula is weight in kilograms divided by height in metres squared. The WHO bands are: under 18.5 underweight, 18.5-24.9 healthy weight, 25-29.9 overweight, and 30 or above obese. Those thresholds are population-level guidance drawn from large studies, not a diagnosis of any individual.",
      "It's worth understanding the limits, because BMI is widely misread. It takes no account of body composition, so muscular people are routinely classed as overweight despite low body fat — this is a well-known issue with athletes. It's also less reliable for older adults, pregnant people, and children, who need age- and sex-specific percentile charts rather than the adult formula.",
    ],
    faqs: [
      { q: "What is a healthy BMI range?", a: "The WHO defines 18.5 to 24.9 as the healthy range for adults. Below 18.5 is classed as underweight, 25 to 29.9 as overweight, and 30 or above as obese." },
      { q: "Why does BMI say I'm overweight when I'm fit?", a: "BMI can't distinguish muscle from fat, and muscle is denser. Athletes and regular strength trainers often land in the overweight band with low body fat. Waist circumference or a body composition measurement gives a far better picture." },
      { q: "Is BMI accurate for children?", a: "No — children need age- and sex-specific percentile charts, because healthy body composition changes throughout growth. Ask a paediatrician rather than applying the adult formula." },
      { q: "How is BMI calculated?", a: "Weight in kilograms divided by height in metres squared. In imperial units it's weight in pounds divided by height in inches squared, multiplied by 703." },
    ],
  },
  "loan-calculator": {
    intro: [
      "The Loan / EMI Calculator shows your monthly repayment on any loan, plus the total interest you'll pay across its full term. Enter the amount, the annual interest rate and the number of years, and the figures update as you type.",
      "It uses the standard amortisation formula: EMI = P x r x (1+r)^n / ((1+r)^n - 1), where P is the principal, r is the monthly interest rate and n is the number of monthly payments. That's the same calculation banks use, so the monthly figure should match a lender's quote closely.",
      "The number most people find revealing isn't the monthly payment but the total interest. Stretching a loan over a longer term lowers the monthly figure while quietly increasing what you pay overall — sometimes substantially. Comparing a 5-year and a 7-year term on the same amount makes that trade-off concrete.",
    ],
    faqs: [
      { q: "What is EMI?", a: "Equated Monthly Instalment — the fixed amount you pay each month, covering both interest and principal. Early payments are mostly interest; later ones are mostly principal, though the total stays the same each month." },
      { q: "Why does a longer loan term cost more overall?", a: "Interest accrues on the outstanding balance for longer. A lower monthly payment feels easier, but you're borrowing the money for more months and paying interest on each of them." },
      { q: "Does this include fees and insurance?", a: "No — it calculates principal and interest only. Lenders often add processing fees, insurance or administration charges, so ask for the APR, which includes them." },
      { q: "Will my bank's figure match exactly?", a: "It should be very close. Small differences come from rounding, day-count conventions, and whether the first payment is due immediately or after a month." },
    ],
  },
  "compound-interest": {
    intro: [
      "The Compound Interest Calculator projects how an investment grows when returns are earned on top of previous returns. Enter your starting amount, rate, time period and compounding frequency to see the final balance and how much of it is interest rather than your own contributions.",
      "The formula is A = P(1 + r/n)^(nt) — principal, annual rate, compounds per year, and years. What makes compounding powerful isn't the rate so much as the exponent: time is doing most of the work. The same rate over 30 years produces a dramatically different outcome than over 10, and the gap widens the longer you leave it.",
      "A useful mental shortcut is the Rule of 72: divide 72 by your annual rate and you get the rough number of years for the money to double. At 6%, that's about 12 years; at 9%, about 8. It's an approximation, but a good one for quick comparisons.",
    ],
    faqs: [
      { q: "How does compounding frequency affect the result?", a: "More frequent compounding earns slightly more, because interest starts earning interest sooner. The jump from annual to monthly is noticeable; from monthly to daily it's marginal — the rate and the time period matter far more." },
      { q: "What's the difference between simple and compound interest?", a: "Simple interest is calculated only on your original principal. Compound interest is calculated on the principal plus all interest already earned, which is why the growth curve steepens over time." },
      { q: "Does this account for inflation or tax?", a: "No — these are nominal figures. Real purchasing power grows more slowly than the numbers suggest, and returns may be taxable depending on the account and your country." },
      { q: "What is the Rule of 72?", a: "Divide 72 by your annual return to estimate the years needed to double your money. At 8% that's roughly 9 years. It's approximate but close enough for comparing options." },
    ],
  },
  "percentage-calculator": {
    intro: [
      "The Percentage Calculator handles the three percentage questions that actually come up, without you having to remember which way round the formula goes: what is X% of Y, X is what percent of Y, and what's the percentage change from X to Y.",
      "That third one causes the most confusion, because percentage increase and decrease aren't symmetrical. A price that rises 50% and then falls 50% does not return to where it started — it ends up 25% below, because the decrease applies to the larger number. This catches people out constantly with discounts and investment returns.",
      "Useful for working out discounts, tips, tax, exam marks, commission, and any figure quoted as a percentage change in a report or headline.",
    ],
    faqs: [
      { q: "How do I calculate a percentage increase?", a: "Subtract the old value from the new one, divide by the old value, and multiply by 100. Going from 40 to 50 is (50-40)/40 x 100 = 25% increase." },
      { q: "Why doesn't a 50% rise then a 50% fall get me back to the start?", a: "Each percentage applies to a different base. 100 rises 50% to 150; 50% of 150 is 75, so you land at 75 — not 100. The fall is calculated on the bigger number." },
      { q: "How do I work out the original price before a discount?", a: "Divide the sale price by (1 minus the discount as a decimal). An item costing 80 after 20% off was originally 80 / 0.8 = 100." },
    ],
  },
  "age-calculator": {
    intro: [
      "The Age Calculator gives your exact age from a date of birth — years, months and days — along with your total days lived and how long until your next birthday. It also works for any two dates, so you can measure the gap between events.",
      "Date arithmetic is fiddlier than it looks, which is why doing it in your head goes wrong. Months have different lengths, leap years add a day every four years (but not in century years unless divisible by 400), and the answer depends on whether you count from the start or end of a month. The calculator handles all of that.",
      "Common uses: confirming eligibility ages for schemes and documents, filling in forms that want an exact age in years and months, calculating a child's age in months for medical or developmental milestones, and settling arguments about who is older by how much.",
    ],
    faqs: [
      { q: "How are leap years handled?", a: "They're counted properly. A year is a leap year if it's divisible by 4, except century years, which must be divisible by 400 — so 2000 was a leap year but 1900 wasn't." },
      { q: "When is a 29 February birthday celebrated?", a: "Legally it varies by country — some treat 1 March as the birthday in common years, others 28 February. This calculator counts the actual elapsed days, which is unambiguous." },
      { q: "Can I calculate the time between two arbitrary dates?", a: "Yes — set both dates and you'll get the exact span in years, months and days, plus the total in days." },
    ],
  },
  "base64-encoder": {
    intro: [
      "Base64 Encode / Decode converts text and binary data to and from Base64, the encoding used whenever binary content has to travel through a text-only channel — data URIs in CSS, email attachments, JSON payloads, JWT segments and HTTP basic auth headers.",
      "The scheme is defined in RFC 4648. It maps every 3 bytes onto 4 printable ASCII characters, which is why encoded output is always about 33% larger than the input, and why you often see one or two '=' characters padding the end when the input length isn't a multiple of three.",
      "One thing worth being clear about, because it's a genuinely common and costly misunderstanding: Base64 is an encoding, not encryption. It's trivially reversible by anyone, offers no security whatsoever, and must never be used to protect passwords, tokens or personal data.",
    ],
    faqs: [
      { q: "Is Base64 a form of encryption?", a: "No. It's a reversible encoding with no key and no secrecy — anyone can decode it instantly. Never use it to protect sensitive data; use real encryption for that." },
      { q: "Why is my encoded string longer than the original?", a: "Base64 represents every 3 bytes as 4 ASCII characters, so output is roughly 133% of the input size. That overhead is the cost of making binary data safe for text-only transport." },
      { q: "What are the '=' characters at the end?", a: "Padding. When the input length isn't a multiple of 3, one or two '=' characters are appended so the output length is a multiple of 4." },
      { q: "Does it handle Unicode and emoji?", a: "Yes — text is converted to UTF-8 bytes before encoding, so accented characters, non-Latin scripts and emoji all round-trip correctly." },
    ],
  },
  "hash-generator": {
    intro: [
      "The Hash Generator produces SHA-1, SHA-256, SHA-384 and SHA-512 digests from any text. Hashing is one-way: the same input always yields the same fixed-length output, but there's no way to work backwards from a hash to the original.",
      "The everyday use is integrity checking. Download a file, hash it, compare against the published checksum — if a single byte differs anywhere, the hash changes completely. That avalanche property is what makes hashes useful for detecting tampering or corruption.",
      "Two important cautions. SHA-1 is cryptographically broken — practical collisions were demonstrated in 2017 — so use it only for checksums against legacy systems, never for signatures or security. And no SHA variant is appropriate for storing passwords: they're designed to be fast, which is exactly wrong for password hashing. Use bcrypt, scrypt or Argon2, which are deliberately slow and salted.",
    ],
    faqs: [
      { q: "Which hash algorithm should I use?", a: "SHA-256 for almost everything — it's the current standard, widely supported and has no known practical attacks. Use SHA-512 if you specifically need a longer digest, and avoid SHA-1 for anything security-related." },
      { q: "Can a hash be reversed?", a: "Not by computation. But short or common inputs can be found by brute force or rainbow tables, which is why passwords need a salt and a deliberately slow algorithm." },
      { q: "Why shouldn't I hash passwords with SHA-256?", a: "Because it's fast, and speed helps attackers. Modern hardware tries billions of SHA-256 guesses per second. Password hashing needs bcrypt, scrypt or Argon2 — built to be slow and salted by design." },
      { q: "Is my text sent to a server?", a: "No. Hashing uses the browser's built-in Web Crypto API, so your input never leaves your device." },
    ],
  },
  "regex-tester": {
    intro: [
      "The Regex Tester lets you build and debug a regular expression against sample text, with matches highlighted live as you type. Capture groups are broken out separately, so you can see exactly what each part of your pattern caught.",
      "It uses the JavaScript RegExp engine, which matters when you're copying patterns between languages. JavaScript has no lookbehind in older browsers, doesn't support recursive patterns at all, and treats named groups with the (?<name>...) syntax. A pattern lifted from a PCRE or Python example may behave differently or fail outright.",
      "The flags do most of the practical work: g finds every match rather than just the first, i makes matching case-insensitive, and m makes ^ and $ match at line boundaries instead of only at the start and end of the whole string.",
    ],
    howto: [
      "Type or paste your regular expression.",
      "Add sample text underneath — matches highlight as you type.",
      "Toggle the g, i and m flags and inspect the capture groups below.",
    ],
    faqs: [
      { q: "Which regex flavour does this use?", a: "JavaScript's RegExp engine. Patterns written for PCRE, Python or Java mostly transfer, but recursion isn't supported and some lookbehind syntax varies by browser." },
      { q: "What do the g, i and m flags do?", a: "g returns all matches rather than stopping at the first; i ignores case; m makes ^ and $ match at the start and end of each line instead of the whole string." },
      { q: "Why does my pattern match more than I expected?", a: "Quantifiers are greedy by default — .* takes as much as it can. Add a ? to make it lazy (.*?) so it stops at the first possible match." },
      { q: "Is my text private?", a: "Yes — matching runs entirely in your browser and nothing is uploaded." },
    ],
  },
  "case-converter": {
    intro: [
      "The Case Converter rewrites text into any case you need — UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case and kebab-case — without retyping a word.",
      "The programming cases are the ones that save the most time. Converting 'user profile image' into userProfileImage, UserProfileImage, user_profile_image or user-profile-image by hand is tedious and easy to get subtly wrong, especially across a long list of variable or column names.",
      "Title Case deserves a note: it capitalises the significant words and leaves short articles, conjunctions and prepositions in lower case, which is the convention most style guides follow for headlines. Sentence case capitalises only the first word, as in ordinary prose.",
    ],
    faqs: [
      { q: "What's the difference between camelCase and PascalCase?", a: "camelCase starts with a lower-case letter (userName); PascalCase capitalises the first letter too (UserName). JavaScript conventionally uses camelCase for variables and PascalCase for classes and components." },
      { q: "When would I use snake_case or kebab-case?", a: "snake_case is standard in Python and SQL column names. kebab-case is used for URL slugs, CSS class names and HTML attributes, where underscores are awkward or disallowed." },
      { q: "Does it handle accented characters?", a: "Yes — case conversion is Unicode-aware, so accented Latin characters and other scripts convert correctly." },
    ],
  },
  "text-diff": {
    intro: [
      "The Text Diff Checker compares two blocks of text and highlights exactly what changed — additions, deletions and edits — so you can spot differences that are effectively invisible when reading side by side.",
      "It's built for the cases where a single character matters: two versions of a contract, a config file that worked yesterday and doesn't today, a document returned with untracked edits, or two API responses that should be identical. The comparison works line by line and marks changes within a line, so a single altered word doesn't flag the whole paragraph.",
      "It's particularly good at catching the differences human eyes skip — trailing whitespace, a swapped hyphen and en-dash, straight versus curly quotes, or a stray non-breaking space pasted in from a web page.",
    ],
    faqs: [
      { q: "Does it detect whitespace differences?", a: "Yes, including trailing spaces and tab-versus-space changes — exactly the kind of difference that breaks a config file while looking identical on screen." },
      { q: "Can I compare code?", a: "Yes. The comparison is plain-text and language-agnostic, so it works on any source file, config or markup." },
      { q: "Is my text uploaded?", a: "No — the comparison runs entirely in your browser, so contracts and private documents stay on your device." },
    ],
  },
  "youtube-thumbnail": {
    intro: [
      "The YouTube Thumbnail Downloader grabs the cover image from any YouTube video in every resolution YouTube stores. Paste a video URL and you'll see the available sizes with direct download links.",
      "YouTube generates a fixed set of thumbnails for each upload: maxresdefault at 1280x720, sddefault at 640x480, hqdefault at 480x360, mqdefault at 320x180 and default at 120x90. Not every video has all of them — maxresdefault only exists if the video was uploaded in HD, which is why it sometimes 404s on older or low-resolution uploads.",
      "Handy for designers referencing thumbnail styles, creators researching what performs in their niche, and anyone building a link preview or presentation slide that needs the video's cover image.",
    ],
    faqs: [
      { q: "Why is the maximum resolution version missing?", a: "maxresdefault is only generated for videos uploaded in HD. Older or lower-resolution uploads simply don't have one, so the next size down is the best available." },
      { q: "Does this work for Shorts and unlisted videos?", a: "Shorts work — they use the same thumbnail URLs. Unlisted videos work if you have the link. Private videos don't, since their thumbnails aren't publicly served." },
      { q: "Can I use downloaded thumbnails in my own content?", a: "Thumbnails are the copyright of the video's owner. Referencing or linking is generally fine, but reusing one in your own published content needs the owner's permission." },
    ],
  },
  "typing-test": {
    intro: [
      "The Typing Speed Test measures how fast and how accurately you type, reporting words per minute alongside an accuracy percentage. Start typing the displayed text and the timer begins automatically.",
      "WPM uses the standard definition where a 'word' is five characters including spaces — so 250 characters in a minute is 50 WPM, regardless of the actual words. This is the convention every typing test uses, which is what makes scores comparable between them.",
      "For context: around 40 WPM is average for an adult, 65-80 is comfortably fast, and above 100 is genuinely rare. Accuracy matters more than raw speed, though — typing quickly and correcting constantly is slower in practice than a steady pace with few errors, because backspacing costs more time than it saves.",
    ],
    faqs: [
      { q: "What is a good typing speed?", a: "Around 40 WPM is average. 65-80 WPM is fast and more than sufficient for most professional work. Above 100 WPM is uncommon and rarely necessary." },
      { q: "How is WPM calculated?", a: "Characters typed divided by five (the standard word length, including spaces), divided by elapsed minutes. It's the same formula every typing test uses, so results are comparable." },
      { q: "Should I focus on speed or accuracy?", a: "Accuracy. Errors cost more time to fix than fast typing saves, and speed rises naturally as accuracy becomes automatic. Practise at a pace where you make almost no mistakes." },
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
 * True when a tool page carries hand-written content rather than the generic
 * `generate()` boilerplate.
 *
 * This is the site's indexing gate. Pages built from a template — the 100
 * "X to Y" conversion pages and every tool without an OVERRIDES entry — read
 * as near-duplicates of each other, which is what got the site flagged for
 * thin content. Those pages stay live and usable; they are just kept out of
 * the sitemap and marked noindex.
 *
 * Deliberately keyed off OVERRIDES so the rule maintains itself: write real
 * content for a tool and its page becomes indexable on the next deploy. No
 * separate allow-list to drift out of sync.
 */
export function hasRichContent(category, service) {
  if (category.slug === "convert") return false;
  return Boolean(OVERRIDES[service.slug]);
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
