"use client";

/* ============================================================================
   Paraphrasing Tool — rewrites text in the browser with no API and no signup.

   It is a rules engine, not a language model, and the UI says so: phrase-level
   rewrites first (those carry the most meaning), then synonym substitution with
   part-of-speech-safe pairs, then per-mode sentence surgery. Rules-based means
   it is instant, private and offline — and that you should read the output
   before you use it, which the tool tells the user up front.
   ========================================================================== */

import { useMemo, useState } from "react";
import CopyButton from "../CopyButton";

/* ---- multi-word rewrites. Applied first: replacing "in order to" with "to"
   is a better paraphrase than swapping any single word in it. ---- */
const PHRASES = [
  [/\bin order to\b/gi, "to"],
  [/\bdue to the fact that\b/gi, "because"],
  [/\bin spite of the fact that\b/gi, "although"],
  [/\bdespite the fact that\b/gi, "although"],
  [/\bin the event that\b/gi, "if"],
  [/\bfor the purpose of\b/gi, "for"],
  [/\bwith regard to\b/gi, "about"],
  [/\bwith respect to\b/gi, "about"],
  [/\bin relation to\b/gi, "about"],
  [/\bat this point in time\b/gi, "now"],
  [/\bat the present time\b/gi, "currently"],
  [/\bin the near future\b/gi, "soon"],
  [/\ba large number of\b/gi, "many"],
  [/\ba small number of\b/gi, "a few"],
  [/\ba majority of\b/gi, "most"],
  [/\bthe vast majority of\b/gi, "almost all"],
  [/\bis able to\b/gi, "can"],
  [/\bare able to\b/gi, "can"],
  [/\bwas able to\b/gi, "could"],
  [/\bhas the ability to\b/gi, "can"],
  [/\bit is important to note that\b/gi, "note that"],
  [/\bit should be noted that\b/gi, "note that"],
  [/\bit is worth noting that\b/gi, "notably,"],
  [/\bin conclusion\b/gi, "to sum up"],
  [/\bas a result of\b/gi, "because of"],
  [/\bas a matter of fact\b/gi, "in fact"],
  [/\bin the process of\b/gi, "currently"],
  [/\btake into consideration\b/gi, "consider"],
  [/\btake into account\b/gi, "consider"],
  [/\bmake a decision\b/gi, "decide"],
  [/\bmake use of\b/gi, "use"],
  [/\bcarry out\b/gi, "perform"],
  [/\bput an end to\b/gi, "end"],
  [/\bgive rise to\b/gi, "cause"],
  [/\bcome to the conclusion\b/gi, "conclude"],
  [/\bon a regular basis\b/gi, "regularly"],
  [/\bin a timely manner\b/gi, "promptly"],
  [/\bin the majority of cases\b/gi, "usually"],
  [/\bprior to\b/gi, "before"],
  [/\bsubsequent to\b/gi, "after"],
  [/\bin addition to\b/gi, "besides"],
  [/\bas well as\b/gi, "and"],
  [/\bnot only .{0,40}? but also\b/gi, (m) => m.replace(/not only/i, "both").replace(/but also/i, "and")],
  [/\bthere is no doubt that\b/gi, "clearly"],
  [/\ba number of\b/gi, "several"],
  [/\bin terms of\b/gi, "regarding"],
  [/\bon the other hand\b/gi, "conversely"],
  [/\bfirst and foremost\b/gi, "above all"],
  [/\beach and every\b/gi, "every"],
  [/\bbasic fundamentals\b/gi, "fundamentals"],
  [/\bcompletely eliminate\b/gi, "eliminate"],
  [/\bfuture plans\b/gi, "plans"],
  [/\bpast history\b/gi, "history"],
  [/\bend result\b/gi, "result"],
  [/\bfree gift\b/gi, "gift"],
  [/\bvery unique\b/gi, "unique"],
];

/* ---- single-word synonyms. Only pairs that are safe in the same grammatical
   slot, so substitution can't break a sentence. ---- */
const SYNONYMS = {
  important: ["significant", "crucial", "vital", "key"],
  significant: ["notable", "considerable", "important"],
  big: ["large", "substantial", "sizeable"],
  large: ["big", "substantial", "considerable"],
  small: ["minor", "modest", "slight"],
  little: ["small", "slight", "modest"],
  good: ["strong", "solid", "effective", "positive"],
  great: ["excellent", "outstanding", "remarkable"],
  bad: ["poor", "weak", "negative"],
  difficult: ["challenging", "demanding", "tough"],
  hard: ["difficult", "demanding", "tough"],
  easy: ["simple", "straightforward", "effortless"],
  simple: ["straightforward", "basic", "uncomplicated"],
  fast: ["quick", "rapid", "swift"],
  quick: ["fast", "rapid", "prompt"],
  slow: ["gradual", "sluggish", "unhurried"],
  new: ["fresh", "recent", "novel"],
  old: ["former", "previous", "earlier"],
  many: ["numerous", "several", "plenty of"],
  few: ["a handful of", "limited", "scarce"],
  help: ["assist", "support", "aid"],
  helps: ["assists", "supports", "aids"],
  show: ["demonstrate", "reveal", "indicate"],
  shows: ["demonstrates", "reveals", "indicates"],
  showed: ["demonstrated", "revealed", "indicated"],
  make: ["create", "produce", "build"],
  makes: ["creates", "produces", "builds"],
  made: ["created", "produced", "built"],
  get: ["obtain", "acquire", "receive"],
  gets: ["obtains", "acquires", "receives"],
  got: ["obtained", "acquired", "received"],
  give: ["provide", "offer", "supply"],
  gives: ["provides", "offers", "supplies"],
  gave: ["provided", "offered", "supplied"],
  use: ["utilise", "employ", "apply"],
  uses: ["utilises", "employs", "applies"],
  used: ["utilised", "employed", "applied"],
  need: ["require", "demand"],
  needs: ["requires", "demands"],
  want: ["wish for", "desire", "seek"],
  wants: ["seeks", "desires"],
  think: ["believe", "consider", "reckon"],
  thinks: ["believes", "considers"],
  say: ["state", "mention", "note"],
  says: ["states", "mentions", "notes"],
  said: ["stated", "mentioned", "noted"],
  tell: ["inform", "notify"],
  find: ["discover", "locate", "identify"],
  finds: ["discovers", "locates", "identifies"],
  found: ["discovered", "located", "identified"],
  start: ["begin", "commence", "launch"],
  starts: ["begins", "commences", "launches"],
  started: ["began", "commenced", "launched"],
  end: ["finish", "conclude", "complete"],
  ends: ["finishes", "concludes", "completes"],
  keep: ["retain", "maintain", "preserve"],
  keeps: ["retains", "maintains", "preserves"],
  change: ["alter", "modify", "adjust"],
  changes: ["alters", "modifies", "adjusts"],
  changed: ["altered", "modified", "adjusted"],
  improve: ["enhance", "strengthen", "refine"],
  improves: ["enhances", "strengthens", "refines"],
  increase: ["raise", "boost", "grow"],
  increases: ["raises", "boosts", "grows"],
  reduce: ["lower", "cut", "decrease"],
  reduces: ["lowers", "cuts", "decreases"],
  build: ["construct", "develop", "create"],
  builds: ["constructs", "develops", "creates"],
  create: ["build", "produce", "generate"],
  creates: ["builds", "produces", "generates"],
  allow: ["let", "enable", "permit"],
  allows: ["lets", "enables", "permits"],
  ensure: ["guarantee", "make certain"],
  ensures: ["guarantees"],
  choose: ["select", "pick"],
  chooses: ["selects", "picks"],
  learn: ["study", "grasp", "pick up"],
  learns: ["studies", "grasps"],
  explain: ["clarify", "describe", "outline"],
  explains: ["clarifies", "describes", "outlines"],
  understand: ["grasp", "comprehend", "follow"],
  understands: ["grasps", "comprehends"],
  problem: ["issue", "difficulty", "challenge"],
  problems: ["issues", "difficulties", "challenges"],
  solution: ["fix", "answer", "remedy"],
  solutions: ["fixes", "answers", "remedies"],
  result: ["outcome", "effect", "consequence"],
  results: ["outcomes", "effects", "findings"],
  reason: ["cause", "motive", "rationale"],
  reasons: ["causes", "motives"],
  way: ["method", "approach", "means"],
  ways: ["methods", "approaches", "means"],
  method: ["approach", "technique", "process"],
  methods: ["approaches", "techniques", "processes"],
  goal: ["objective", "aim", "target"],
  goals: ["objectives", "aims", "targets"],
  idea: ["concept", "notion", "thought"],
  ideas: ["concepts", "notions", "thoughts"],
  people: ["individuals", "users", "readers"],
  person: ["individual"],
  company: ["business", "firm", "organisation"],
  companies: ["businesses", "firms", "organisations"],
  customer: ["client", "buyer"],
  customers: ["clients", "buyers"],
  student: ["learner", "pupil"],
  students: ["learners", "pupils"],
  job: ["role", "position", "post"],
  jobs: ["roles", "positions"],
  work: ["effort", "labour"],
  money: ["funds", "cash", "capital"],
  price: ["cost", "rate", "fee"],
  prices: ["costs", "rates", "fees"],
  cheap: ["affordable", "inexpensive", "low-cost"],
  expensive: ["costly", "pricey"],
  free: ["no-cost", "complimentary"],
  time: ["period", "duration"],
  tool: ["utility", "application", "app"],
  tools: ["utilities", "applications", "apps"],
  data: ["information", "figures"],
  information: ["details", "data"],
  benefit: ["advantage", "upside"],
  benefits: ["advantages", "upsides"],
  feature: ["capability", "function"],
  features: ["capabilities", "functions"],
  example: ["instance", "case"],
  examples: ["instances", "cases"],
  step: ["stage", "phase"],
  steps: ["stages", "phases"],
  very: ["highly", "extremely", "particularly"],
  really: ["genuinely", "truly"],
  often: ["frequently", "regularly", "commonly"],
  always: ["consistently", "invariably"],
  usually: ["typically", "generally", "normally"],
  sometimes: ["occasionally", "at times"],
  quickly: ["rapidly", "swiftly", "promptly"],
  easily: ["readily", "effortlessly"],
  clearly: ["plainly", "evidently"],
  also: ["additionally", "moreover", "too"],
  however: ["nevertheless", "though", "even so"],
  therefore: ["consequently", "so", "as a result"],
  because: ["since", "as"],
  but: ["yet", "although"],
  so: ["therefore", "thus"],
  additionally: ["also", "moreover"],
  finally: ["lastly", "ultimately"],
};

/* Words never touched: swapping them changes meaning or breaks grammar. */
const FROZEN = new Set([
  "the", "a", "an", "and", "or", "if", "is", "are", "was", "were", "be", "been",
  "to", "of", "in", "on", "at", "for", "with", "as", "by", "it", "this", "that",
  "i", "you", "he", "she", "we", "they", "not", "no", "do", "does", "did", "will",
  "can", "may", "must", "should", "would", "could", "have", "has", "had",
]);

const CONTRACTIONS = [
  [/\bcan't\b/gi, "cannot"], [/\bwon't\b/gi, "will not"], [/\bdon't\b/gi, "do not"],
  [/\bdoesn't\b/gi, "does not"], [/\bdidn't\b/gi, "did not"], [/\bisn't\b/gi, "is not"],
  [/\baren't\b/gi, "are not"], [/\bwasn't\b/gi, "was not"], [/\bweren't\b/gi, "were not"],
  [/\bhasn't\b/gi, "has not"], [/\bhaven't\b/gi, "have not"], [/\bhadn't\b/gi, "had not"],
  [/\bit's\b/gi, "it is"], [/\bthat's\b/gi, "that is"], [/\bwe're\b/gi, "we are"],
  [/\bthey're\b/gi, "they are"], [/\byou're\b/gi, "you are"], [/\bi'm\b/gi, "I am"],
  [/\bI'll\b/g, "I will"], [/\bwe'll\b/gi, "we will"], [/\blet's\b/gi, "let us"],
  [/\bwould've\b/gi, "would have"], [/\bshould've\b/gi, "should have"],
];

/* Casual → formal, used by the Formal mode. */
const FORMALIZE = [
  [/\bkids\b/gi, "children"], [/\bstuff\b/gi, "material"], [/\bthings\b/gi, "elements"],
  // "a lot of" must run before "a lot", or the shorter rule eats the longer one.
  [/\ba lot of\b/gi, "considerable"], [/\blots of\b/gi, "numerous"], [/\ba lot\b/gi, "considerably"],
  [/\bkind of\b/gi, "somewhat"], [/\bsort of\b/gi, "somewhat"], [/\bpretty\b/gi, "fairly"],
  [/\bhuge\b/gi, "substantial"], [/\bawesome\b/gi, "excellent"], [/\bokay\b/gi, "acceptable"],
  [/\bguys\b/gi, "colleagues"], [/\bcheck out\b/gi, "review"],
  [/\bfigure out\b/gi, "determine"], [/\bfind out\b/gi, "ascertain"], [/\bgo up\b/gi, "increase"],
  [/\bgo down\b/gi, "decrease"], [/\bset up\b/gi, "establish"], [/\bdeal with\b/gi, "address"],
  [/\bget rid of\b/gi, "remove"], [/\bshow up\b/gi, "appear"], [/\bcome up with\b/gi, "devise"],
];

/* Long/latinate → plain, used by the Simple mode. */
const SIMPLIFY = [
  // Spelling variants go inside the word boundaries — `\butilise|utilize\b`
  // would anchor only one side of each alternative.
  // Plurals need their own rule where the singular swap wouldn't fit the
  // grammar ("ten endeavors" → "ten attempts", not "ten try").
  [/\bendeavou?rs\b/gi, "attempts"], [/\butili[sz]es\b/gi, "uses"],
  [/\butili[sz]e\b/gi, "use"], [/\bfacilitate\b/gi, "help"], [/\bdemonstrate\b/gi, "show"],
  [/\bcommence\b/gi, "start"], [/\bterminate\b/gi, "end"], [/\bendeavou?r\b/gi, "try"],
  [/\bsufficient\b/gi, "enough"], [/\bnumerous\b/gi, "many"], [/\bapproximately\b/gi, "about"],
  [/\bsubsequently\b/gi, "later"], [/\bnevertheless\b/gi, "still"], [/\bconsequently\b/gi, "so"],
  [/\bfurthermore\b/gi, "also"], [/\bpurchase\b/gi, "buy"], [/\brequire\b/gi, "need"],
  [/\bassistance\b/gi, "help"], [/\badditional\b/gi, "extra"], [/\bobtain\b/gi, "get"],
  [/\bindicate\b/gi, "show"], [/\bcomprehend\b/gi, "understand"], [/\bimplement\b/gi, "do"],
  [/\bmajority\b/gi, "most"], [/\binitiate\b/gi, "start"], [/\bascertain\b/gi, "find out"],
];

/* Filler that can go without changing meaning — used by Shorten. */
const FILLER = [
  /\bvery\s+/gi, /\breally\s+/gi, /\bactually\s+/gi, /\bbasically\s+/gi, /\bsimply\s+/gi,
  /\bjust\s+/gi, /\bquite\s+/gi, /\brather\s+/gi, /\bliterally\s+/gi, /\btotally\s+/gi,
  /\bin fact,?\s+/gi, /\bof course,?\s+/gi, /\bneedless to say,?\s+/gi, /\bas you can see,?\s+/gi,
  /\bit is worth mentioning that\s+/gi, /\bplease note that\s+/gi,
];

const MODES = [
  { key: "standard", name: "Standard", hint: "Balanced rewrite — swaps wording, keeps your structure." },
  { key: "fluency", name: "Fluency", hint: "Smooths clunky phrasing and tightens long clauses." },
  { key: "formal", name: "Formal", hint: "Academic / professional tone. Expands contractions." },
  { key: "simple", name: "Simple", hint: "Plain English. Short words, short sentences." },
  { key: "shorten", name: "Shorten", hint: "Cuts filler and padding to reduce word count." },
];

/* Deterministic pick so the same input+strength always gives the same output —
   two identical runs producing different text feels broken. `seed` shifts the
   choice when the user asks to re-roll. */
function pickSyn(list, key, seed) {
  let h = seed;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % 100003;
  return list[h % list.length];
}

function matchCase(source, replacement) {
  if (source === source.toUpperCase() && source.length > 1) return replacement.toUpperCase();
  if (source[0] === source[0].toUpperCase()) return replacement[0].toUpperCase() + replacement.slice(1);
  return replacement;
}

function applyRules(text, rules) {
  return rules.reduce((acc, [re, to]) => acc.replace(re, to), text);
}

/**
 * Swap words for synonyms at the requested rate.
 *
 * `plainOnly` is what Simple and Shorten mode need: without it the synonym
 * bank happily turns "use" back into "utilise" straight after SIMPLIFY had
 * turned "utilise" into "use", so those modes would undo their own work.
 * Restricting them to synonyms no longer than the original keeps the text
 * moving in one direction.
 */
function substitute(text, strength, seed, plainOnly = false) {
  let swapped = 0;
  const out = text.replace(/\b[A-Za-z][A-Za-z'-]*\b/g, (word, offset) => {
    const lower = word.toLowerCase();
    if (FROZEN.has(lower)) return word;
    let list = SYNONYMS[lower];
    if (!list) return word;
    if (plainOnly) {
      list = list.filter((s) => s.length <= lower.length && !s.includes(" "));
      if (!list.length) return word;
    }
    // `strength` is a percentage of eligible words to change; spread the
    // choices out using the word's position so swaps aren't clustered.
    if ((offset * 7 + lower.length) % 100 >= strength) return word;
    swapped++;
    return matchCase(word, pickSyn(list, lower + offset, seed));
  });
  return { out, swapped };
}

/** Break a sentence longer than `max` words at a conjunction. */
function splitLongSentences(text, max = 22) {
  return text.replace(/[^.!?]+[.!?]+/g, (sentence) => {
    const words = sentence.trim().split(/\s+/);
    if (words.length <= max) return sentence;
    const at = sentence.search(/,\s+(and|but|which|while|because|so)\s+/i);
    if (at < 0) return sentence;
    const head = sentence.slice(0, at).trim();
    const tailRaw = sentence.slice(at).replace(/^,\s+/, "");
    const tail = tailRaw.replace(/^(and|but|which|while|because|so)\s+/i, (m, w) =>
      /^which$/i.test(w) ? "This " : /^and$/i.test(w) ? "" : `${w[0].toUpperCase()}${w.slice(1)} `
    );
    const tidy = tail.charAt(0).toUpperCase() + tail.slice(1);
    return `${head}. ${tidy}`;
  });
}

function tidy(text) {
  return text
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/([.!?])\s*([a-z])/g, (m, p, c) => `${p} ${c.toUpperCase()}`)
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

export function paraphrase(text, mode = "standard", strength = 55, seed = 1) {
  if (!text.trim()) return { out: "", swapped: 0 };

  // Paragraph breaks must survive every stage, so work per paragraph.
  const paragraphs = text.split(/\n{2,}/);
  let swapped = 0;

  const done = paragraphs.map((para) => {
    let t = para;

    if (mode === "formal") t = applyRules(t, CONTRACTIONS);
    t = applyRules(t, PHRASES);
    if (mode === "formal") t = applyRules(t, FORMALIZE);
    if (mode === "simple") t = applyRules(t, SIMPLIFY);
    if (mode === "shorten") t = FILLER.reduce((acc, re) => acc.replace(re, ""), t);

    // Shorten shouldn't also lengthen words, so it substitutes lightly. Both
    // Simple and Shorten are restricted to synonyms no longer than the word
    // they replace, so neither mode can undo its own simplification.
    const plainOnly = mode === "simple" || mode === "shorten";
    const rate = mode === "shorten" ? Math.round(strength / 2) : strength;
    const sub = substitute(t, rate, seed, plainOnly);
    t = sub.out;
    swapped += sub.swapped;

    // A final simplify pass catches anything the substitution stage introduced.
    if (mode === "simple") t = applyRules(t, SIMPLIFY);

    if (mode === "fluency" || mode === "simple") t = splitLongSentences(t, mode === "simple" ? 16 : 22);

    return tidy(t);
  });

  return { out: done.join("\n\n"), swapped };
}

const words = (s) => (s.trim() ? s.trim().split(/\s+/).length : 0);

export function ParaphrasingTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("standard");
  const [strength, setStrength] = useState(55);
  const [seed, setSeed] = useState(1);

  const { out, swapped } = useMemo(() => paraphrase(input, mode, strength, seed), [input, mode, strength, seed]);
  const activeMode = MODES.find((m) => m.key === mode);

  return (
    <div className="tool">
      <div className="fld">Rewrite style</div>
      <div className="chips" style={{ marginBottom: 6 }}>
        {MODES.map((m) => (
          <button
            key={m.key}
            className="chip"
            onClick={() => setMode(m.key)}
            style={mode === m.key ? { borderColor: "var(--accent)", fontWeight: 800 } : undefined}
          >
            {m.name}
          </button>
        ))}
      </div>
      <p className="hint" style={{ marginTop: 0 }}>{activeMode.hint}</p>

      <div className="tool-controls" style={{ margin: "10px 0 14px", flexWrap: "wrap" }}>
        <label className="fld" style={{ margin: 0 }}>
          How much to change: <strong>{strength}%</strong>
        </label>
        <input
          type="range"
          min={20}
          max={95}
          step={5}
          value={strength}
          onChange={(e) => setStrength(Number(e.target.value))}
          style={{ flex: 1, minWidth: 160 }}
          aria-label="Rewrite strength"
        />
        <button className="btn btn-sm btn-outline" onClick={() => setSeed((s) => s + 1)} disabled={!input.trim()}>
          Try different wording
        </button>
      </div>

      <div className="tool-io">
        <div>
          <div className="flex-between">
            <label className="fld">Your text</label>
            <span className="muted" style={{ fontSize: 12 }}>{words(input)} words</span>
          </div>
          <textarea
            className="textarea"
            rows={12}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste the text you want to rewrite…"
          />
        </div>
        <div>
          <div className="flex-between">
            <label className="fld">Paraphrased</label>
            <span className="muted" style={{ fontSize: 12 }}>
              {words(out)} words{swapped ? ` · ${swapped} swapped` : ""}
            </span>
          </div>
          <textarea className="textarea" rows={12} readOnly value={out} placeholder="Your rewrite appears here." />
          <div className="tool-controls" style={{ marginTop: 8 }}>
            <CopyButton value={out} />
            <button className="btn btn-sm btn-outline" onClick={() => setInput(out)} disabled={!out}>
              Rewrite again
            </button>
            <button className="btn btn-sm btn-outline" onClick={() => setInput("")} disabled={!input}>
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="notice" style={{ marginTop: 16 }}>
        <strong>How this works:</strong> the rewrite runs entirely in your browser using a phrase and synonym
        engine — instant, private, and free with no word limit. It is not an AI model, so always read the result
        before submitting it anywhere, especially for academic work.
      </div>
    </div>
  );
}
