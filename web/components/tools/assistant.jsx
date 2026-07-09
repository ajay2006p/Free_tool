"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { allTools } from "../../lib/catalog";

/* ============================================================================
   AI Assistant — a friendly, 100% client-side "smart tool finder".
   It never sends your message anywhere: it keyword-matches your request
   against the tool catalog (name + desc + keywords) with a synonym map and
   a small scoring engine, then replies with the best matching tool cards.
   ========================================================================== */

// --- Language helpers -------------------------------------------------------

const tokenize = (str) => (String(str).toLowerCase().match(/[a-z0-9]+/g) || []);

// Words we drop from the user's query so verbs/filler don't pollute matching.
const STOP = new Set([
  "a", "an", "the", "to", "for", "of", "my", "me", "i", "is", "it", "im", "am",
  "and", "with", "how", "do", "does", "can", "could", "would", "you", "your",
  "want", "wanna", "need", "please", "make", "makes", "making", "get", "got",
  "getting", "create", "creating", "some", "this", "that", "these", "those",
  "on", "in", "at", "help", "helps", "tool", "tools", "app", "apps", "site",
  "website", "online", "free", "best", "good", "quick", "easy", "simple", "new",
  "any", "there", "here", "using", "use", "way", "ways", "give", "show", "find",
  "looking", "look", "trying", "try", "please", "hey", "just", "about", "into",
]);

// Synonym / concept map. Each user word expands to related catalog words so
// "photo" also finds "image", "cv" finds "resume", "yt" finds "video", etc.
const SYN = {
  photo: ["image", "picture", "pic", "jpg", "png"],
  photos: ["image", "picture", "pics"],
  pic: ["image", "picture", "photo"],
  pics: ["image", "picture"],
  picture: ["image", "photo"],
  pictures: ["image", "photo"],
  image: ["photo", "picture"],
  images: ["photo", "picture"],
  compress: ["compressor", "reduce", "shrink", "smaller", "optimize"],
  compressor: ["compress", "reduce", "shrink"],
  shrink: ["compress", "reduce", "smaller"],
  reduce: ["compress", "smaller", "shrink"],
  resize: ["resizer", "dimensions", "scale", "size"],
  resizer: ["resize", "dimensions"],
  crop: ["cropper", "trim"],
  cropper: ["crop"],
  cv: ["resume", "curriculum", "vitae"],
  resume: ["cv", "curriculum", "vitae"],
  ocr: ["image", "text", "extract", "scan"],
  scan: ["ocr", "text", "extract"],
  download: ["downloader", "save", "grab"],
  downloader: ["download", "save"],
  youtube: ["video", "yt", "downloader", "thumbnail"],
  yt: ["youtube", "video", "downloader"],
  video: ["youtube", "downloader", "tiktok", "reel", "mp4"],
  videos: ["youtube", "downloader", "video"],
  tiktok: ["video", "downloader"],
  instagram: ["video", "downloader", "hashtag", "reel"],
  insta: ["instagram", "hashtag"],
  reel: ["video", "instagram", "downloader"],
  facebook: ["video", "downloader"],
  money: ["salary", "income", "currency", "expense", "invoice", "loan"],
  salary: ["pay", "wage", "income", "salary"],
  pay: ["salary", "wage", "income"],
  wage: ["salary", "hourly", "income"],
  income: ["salary", "tax", "wage"],
  tax: ["income", "gst", "vat"],
  currency: ["exchange", "money", "forex", "usd", "eur"],
  exchange: ["currency", "forex"],
  invoice: ["bill", "billing"],
  expense: ["budget", "spending", "money"],
  qr: ["qr", "code", "qrcode"],
  qrcode: ["qr", "code"],
  barcode: ["code", "ean", "upc"],
  password: ["passphrase", "secure", "strong", "random"],
  pass: ["password"],
  pdf: ["pdf", "document", "file"],
  merge: ["combine", "join", "merger"],
  combine: ["merge", "join"],
  split: ["separate", "extract", "splitter"],
  sign: ["signature", "esign", "esignature"],
  signature: ["sign", "esign"],
  convert: ["converter", "conversion", "change"],
  converter: ["convert", "conversion"],
  translate: ["translator", "convert", "morse"],
  qrcodes: ["qr", "code"],
  hashtag: ["hashtags", "tags", "instagram", "tiktok"],
  hashtags: ["hashtag", "tags"],
  tag: ["tags", "hashtag", "meta"],
  tags: ["tag", "hashtag", "meta"],
  count: ["counter", "words", "characters"],
  counter: ["count", "words", "characters"],
  word: ["words", "counter", "character"],
  words: ["word", "counter", "character"],
  timer: ["countdown", "pomodoro", "stopwatch"],
  countdown: ["timer", "count"],
  todo: ["task", "checklist", "list"],
  task: ["todo", "checklist"],
  note: ["notes", "memo"],
  notes: ["note", "memo"],
  loan: ["emi", "mortgage", "interest"],
  emi: ["loan", "mortgage"],
  mortgage: ["loan", "home", "interest"],
  bmi: ["weight", "height", "body"],
  calorie: ["calories", "tdee", "bmr", "diet"],
  calories: ["calorie", "tdee"],
  age: ["birthday", "birth", "dob"],
  percent: ["percentage"],
  percentage: ["percent"],
  discount: ["sale", "off", "coupon"],
  tip: ["gratuity", "bill"],
  color: ["colour", "hex", "rgb", "palette"],
  colour: ["color", "hex", "rgb"],
  hex: ["color", "rgb"],
  gradient: ["css", "color"],
  json: ["format", "beautify", "formatter"],
  format: ["formatter", "beautify", "prettify"],
  beautify: ["format", "prettify"],
  minify: ["minifier", "compress"],
  regex: ["regexp", "pattern"],
  emoji: ["emojis", "symbol", "icon"],
  emojis: ["emoji", "symbol"],
  speech: ["voice", "audio", "speak", "dictate"],
  voice: ["speech", "audio", "dictate"],
  audio: ["speech", "voice", "sound"],
  handwriting: ["handwritten", "text"],
  meme: ["memes", "caption", "funny"],
  favicon: ["icon", "ico"],
  screen: ["record", "recorder", "capture"],
  record: ["recorder", "screen", "capture"],
  wheel: ["spinner", "random", "picker"],
  spin: ["wheel", "spinner", "random"],
  dice: ["roll", "coin", "random"],
  random: ["generator", "picker"],
  seo: ["meta", "schema", "sitemap", "keyword"],
  meta: ["seo", "tags", "opengraph"],
  schema: ["seo", "jsonld", "structured"],
  sitemap: ["seo", "xml"],
  slug: ["url", "seo"],
  kanban: ["board", "task"],
  habit: ["tracker", "streak"],
  goal: ["tracker", "goals"],
  gpa: ["grade", "school", "college"],
  typing: ["type", "wpm", "keyboard"],
  markdown: ["md", "format"],
  base64: ["encode", "decode"],
  encode: ["base64", "url", "encoder"],
  decode: ["base64", "url", "decoder"],
  uuid: ["guid", "id"],
  hash: ["sha", "md5", "checksum"],
  jwt: ["token", "auth"],
  cron: ["schedule", "crontab"],
  wedding: ["hashtag", "marriage"],
  thumbnail: ["youtube", "image"],
};

// A curated "popular tools" set used when nothing matches.
const POPULAR = [
  "image-compressor", "video-downloader", "resume-builder", "qr-code-generator",
  "password-generator", "pdf-merge", "word-counter", "currency-converter",
];

// Quick-reply chips shown to kick off a conversation.
const CHIPS = [
  "Compress a photo", "Make a resume", "Download a video",
  "Convert a file", "Generate a password", "Make a QR code",
];

const GREET = "Hi! I'm your FreeTool assistant 🤖 Tell me what you're trying to do and I'll find the right tool.";

// Expand a raw query into weighted tokens (original words + synonyms + a
// tiny singular-stem so "images" also matches "image").
function expandQuery(q) {
  const base = tokenize(q).filter((t) => t.length > 1 && !STOP.has(t));
  const weights = new Map();
  const add = (t, w) => { if (t) weights.set(t, Math.max(weights.get(t) || 0, w)); };
  for (const t of base) {
    add(t, 1);
    if (t.length > 3 && t.endsWith("s")) add(t.slice(0, -1), 0.9);
    const syns = SYN[t];
    if (syns) for (const s of syns) add(s, 0.7);
  }
  return [...weights.entries()].map(([tok, w]) => ({ tok, w }));
}

// Detect common non-tool questions so we can answer them directly.
function detectIntent(raw) {
  const s = " " + raw.toLowerCase().trim() + " ";
  const has = (...ws) => ws.some((w) => s.includes(w));
  if (/^\s*(hi|hey|hello|yo|hiya|howdy|sup|hola|greetings|good (morning|afternoon|evening))\b/.test(raw.toLowerCase().trim()))
    return "greeting";
  if (has(" thank", " thanks", " cheers", " appreciate")) return "thanks";
  if (has(" free ", " cost", " price", " how much", " charge", " pay for", " subscription", " sign up", " signup", " login", " register", " account "))
    return "free";
  if (has(" safe", " secure", " privacy", " private", " gdpr", " data ", " track", " spy", " upload my", " store my", " keep my"))
    return "safe";
  if (has(" who made", " who built", " who created", " who owns", " who are you", " about you", " contact", " email you", " reach you", " support", " get in touch", " owner", " about page"))
    return "contact";
  return null;
}

export function AiAssistant() {
  const [messages, setMessages] = useState([{ id: 0, role: "assistant", text: GREET }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const idRef = useRef(1);
  const timerRef = useRef(null);
  const scrollRef = useRef(null);

  // Pre-index the catalog once (token sets per tool) for fast, smart scoring.
  const index = useMemo(
    () =>
      allTools.map((t) => {
        const name = t.name.toLowerCase();
        const kw = (t.kw || "").toLowerCase();
        const desc = (t.desc || "").toLowerCase();
        return {
          tool: t,
          name, kw, desc,
          nameSet: new Set(tokenize(name)),
          kwSet: new Set(tokenize(kw)),
          descSet: new Set(tokenize(desc)),
          catSet: new Set(tokenize(t.categoryName + " " + t.category)),
        };
      }),
    []
  );

  const popularTools = useMemo(() => {
    const bySlug = new Map(allTools.map((t) => [t.slug, t]));
    return POPULAR.map((sl) => bySlug.get(sl)).filter(Boolean);
  }, []);

  // Score every tool against the query; return the best few.
  const searchTools = (raw) => {
    const qtokens = expandQuery(raw);
    if (!qtokens.length) return [];
    const rawLower = raw.toLowerCase().trim();
    const scored = index.map((it) => {
      let s = 0;
      for (const { tok, w } of qtokens) {
        if (it.nameSet.has(tok)) s += 6 * w;
        else if (it.kwSet.has(tok)) s += 4 * w;
        else if (it.descSet.has(tok)) s += 2 * w;
        else if (it.catSet.has(tok)) s += 1.5 * w;
        else if (it.name.includes(tok)) s += 3 * w;
        else if (it.kw.includes(tok)) s += 1.5 * w;
        else if (it.desc.includes(tok)) s += 0.8 * w;
      }
      if (rawLower.length > 3 && it.name.includes(rawLower)) s += 5; // phrase bonus
      return { tool: it.tool, score: s };
    });
    return scored
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  // Build the assistant's reply for a query.
  const buildReply = (raw) => {
    const matches = searchTools(raw);
    const strong = matches.length > 0 && matches[0].score >= 5;
    const intent = detectIntent(raw);

    if (intent && !strong) {
      if (intent === "greeting")
        return {
          text: "Hey there! 👋 I'm your FreeTool assistant. Tell me what you're trying to do — like “compress a photo” or “make a resume” — and I'll point you to the perfect tool.",
        };
      if (intent === "thanks")
        return { text: "You're welcome! 😊 Anything else you're trying to get done? Just tell me and I'll find the tool." };
      if (intent === "free")
        return {
          text: "Great news — every tool on FreeTools is 100% free, forever. No sign-up, no login, no credit card. Use as many as you like! 🎉",
          links: [{ href: "/services", label: "Browse all tools" }],
        };
      if (intent === "safe")
        return {
          text: "Your privacy comes first 🔒 Most tools run entirely in your browser, so your files and text never leave your device — nothing is uploaded to a server.",
        };
      if (intent === "contact")
        return {
          text: "This site is a big collection of free web tools. You can learn more about it, or reach out any time — happy to help!",
          links: [{ href: "/about", label: "About" }, { href: "/contact", label: "Contact" }],
        };
    }

    if (matches.length)
      return {
        text: matches.length === 1 ? "Here's the tool for that:" : "Here are the best tools for that:",
        tools: matches.map((m) => m.tool),
      };

    // Nothing matched — help the user rephrase and show popular picks.
    return {
      text: "Hmm, I couldn't find an exact match for that. Try describing it a little differently — e.g. “resize an image”, “convert PDF” or “split the bill”. Meanwhile, here are some popular tools:",
      tools: popularTools.slice(0, 4),
      links: [{ href: "/services", label: "See all 150+ tools" }],
    };
  };

  const send = (text) => {
    const q = (text != null ? text : input).trim();
    if (!q || thinking) return;
    const userMsg = { id: idRef.current++, role: "user", text: q };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const reply = buildReply(q);
      setMessages((m) => [...m, { id: idRef.current++, role: "assistant", ...reply }]);
      setThinking(false);
    }, 420);
  };

  // Auto-scroll to the newest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  // Clean up the pending reply timer on unmount.
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const AV = "linear-gradient(135deg,var(--accent),var(--accent-2))";

  return (
    <div className="tool">
      <style>{`
        .aia-wrap{display:flex;flex-direction:column;overflow:hidden;border-radius:var(--radius);border:1px solid var(--border);box-shadow:var(--shadow-sm);background:var(--surface);}
        .aia-head{display:flex;align-items:center;gap:11px;padding:13px 16px;color:#fff;background:${AV};}
        .aia-head .av{width:38px;height:38px;flex:0 0 auto;display:grid;place-items:center;font-size:20px;border-radius:12px;background:rgba(255,255,255,.18);}
        .aia-head .dot{width:8px;height:8px;border-radius:50%;background:#4ade80;display:inline-block;margin-right:5px;box-shadow:0 0 0 3px rgba(74,222,128,.25);}
        .aia-feed{background:var(--surface-2);padding:14px;display:flex;flex-direction:column;gap:12px;min-height:300px;max-height:56vh;overflow-y:auto;}
        .aia-msg{display:flex;gap:9px;align-items:flex-start;animation:aia-in .25s ease both;}
        .aia-msg.user{justify-content:flex-end;}
        .aia-ava{width:30px;height:30px;flex:0 0 auto;display:grid;place-items:center;font-size:16px;border-radius:50%;background:${AV};color:#fff;box-shadow:var(--shadow-sm);}
        .aia-col{max-width:84%;min-width:0;display:flex;flex-direction:column;gap:8px;}
        .aia-bub{padding:10px 13px;border-radius:14px;font-size:14.5px;line-height:1.5;word-break:break-word;}
        .aia-bub.bot{background:var(--surface);border:1px solid var(--border);color:var(--text);border-top-left-radius:4px;}
        .aia-bub.you{color:#fff;background:${AV};border-top-right-radius:4px;box-shadow:var(--shadow-sm);}
        .aia-cards{display:flex;flex-direction:column;gap:8px;}
        .aia-card{display:flex;gap:11px;align-items:center;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 12px;text-decoration:none;transition:transform .15s,box-shadow .15s,border-color .15s;}
        .aia-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-sm);border-color:var(--accent);text-decoration:none;}
        .aia-card:hover .aia-ic{background:${AV};color:#fff;transform:scale(1.05);}
        .aia-ic{flex:0 0 auto;width:40px;height:40px;display:grid;place-items:center;font-size:20px;background:var(--surface-2);border-radius:11px;transition:background .15s,color .15s,transform .15s;}
        .aia-tx{min-width:0;}
        .aia-nm{font-weight:700;font-size:14px;color:var(--text);display:block;}
        .aia-ds{font-size:12.5px;color:var(--text-soft);display:block;line-height:1.4;}
        .aia-go{margin-left:auto;font-size:12px;font-weight:800;color:var(--accent);white-space:nowrap;padding-left:6px;}
        .aia-links{display:flex;flex-wrap:wrap;gap:8px;}
        .aia-chips{display:flex;flex-wrap:wrap;gap:8px;padding:12px 14px 4px;}
        .aia-chip{border:1px solid var(--border);background:var(--surface);color:var(--text);border-radius:999px;padding:7px 13px;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;}
        .aia-chip:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-soft);}
        .aia-form{display:flex;gap:9px;padding:12px 14px;border-top:1px solid var(--border);background:var(--surface);}
        .aia-form .input{flex:1;min-width:0;}
        .aia-typing{display:inline-flex;align-items:center;gap:4px;height:10px;}
        .aia-typing span{width:7px;height:7px;border-radius:50%;background:var(--text-soft);display:inline-block;animation:aia-blink 1.2s infinite;}
        .aia-typing span:nth-child(2){animation-delay:.2s}
        .aia-typing span:nth-child(3){animation-delay:.4s}
        @keyframes aia-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        @keyframes aia-blink{0%,60%,100%{opacity:.25}30%{opacity:1}}
      `}</style>

      <div className="aia-wrap">
        <div className="aia-head">
          <span className="av">🤖</span>
          <div style={{ lineHeight: 1.3 }}>
            <strong style={{ fontSize: 15.5 }}>FreeTool Assistant</strong>
            <div style={{ fontSize: 12, opacity: 0.92 }}><span className="dot" />Online · finds the right tool for you</div>
          </div>
        </div>

        <div className="aia-feed" ref={scrollRef}>
          {messages.map((m) =>
            m.role === "user" ? (
              <div className="aia-msg user" key={m.id}>
                <div className="aia-col" style={{ alignItems: "flex-end" }}>
                  <div className="aia-bub you">{m.text}</div>
                </div>
              </div>
            ) : (
              <div className="aia-msg" key={m.id}>
                <span className="aia-ava">🤖</span>
                <div className="aia-col">
                  <div className="aia-bub bot">{m.text}</div>
                  {m.tools && m.tools.length > 0 && (
                    <div className="aia-cards">
                      {m.tools.map((t) => (
                        <a className="aia-card" key={t.slug} href={t.href}>
                          <span className="aia-ic">{t.icon}</span>
                          <span className="aia-tx">
                            <span className="aia-nm">{t.name}</span>
                            <span className="aia-ds">{t.desc}</span>
                          </span>
                          <span className="aia-go">Open →</span>
                        </a>
                      ))}
                    </div>
                  )}
                  {m.links && m.links.length > 0 && (
                    <div className="aia-links">
                      {m.links.map((l) => (
                        <a className="btn btn-outline btn-sm" key={l.href} href={l.href}>{l.label}</a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          )}

          {thinking && (
            <div className="aia-msg">
              <span className="aia-ava">🤖</span>
              <div className="aia-col">
                <div className="aia-bub bot">
                  <span className="aia-typing"><span /><span /><span /></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="aia-chips">
          {CHIPS.map((c) => (
            <button type="button" className="aia-chip" key={c} onClick={() => send(c)} disabled={thinking}>{c}</button>
          ))}
        </div>

        <form className="aia-form" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <input
            className="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything… e.g. “resize an image”"
            aria-label="Ask the assistant"
            autoComplete="off"
          />
          <button type="submit" className="btn" disabled={thinking || !input.trim()}>Send</button>
        </form>
      </div>

      <p className="hint">This assistant matches your request to our tools — it doesn't send your messages anywhere.</p>
    </div>
  );
}
