"use client";

import { useEffect, useMemo, useState } from "react";
import CopyButton from "../CopyButton";

/* =====================================================================
   PASSWORD STRENGTH  (hand-rolled, nothing stored, all client-side)
   ===================================================================== */

const COMMON_PASSWORDS = [
  "password", "123456", "123456789", "12345678", "12345", "qwerty", "abc123",
  "111111", "1234567", "password1", "1234567890", "000000", "iloveyou",
  "dragon", "monkey", "letmein", "welcome", "admin", "login", "master",
  "sunshine", "princess", "football", "baseball", "shadow", "superman",
  "qwertyuiop", "trustno1", "passw0rd", "starwars", "whatever", "hello",
  "freedom", "ninja", "azerty",
];

const LABELS = [
  { min: 0, label: "Very weak", color: "var(--red)" },
  { min: 20, label: "Weak", color: "var(--red)" },
  { min: 40, label: "Fair", color: "var(--amber)" },
  { min: 60, label: "Strong", color: "var(--green)" },
  { min: 80, label: "Very strong", color: "var(--green)" },
];

function hasSequence(s) {
  const lc = s.toLowerCase();
  for (let i = 0; i < lc.length - 2; i++) {
    const a = lc.charCodeAt(i), b = lc.charCodeAt(i + 1), c = lc.charCodeAt(i + 2);
    if (b - a === 1 && c - b === 1) return true;     // ascending 1234 / abcd
    if (a - b === 1 && b - c === 1) return true;     // descending 4321 / dcba
  }
  return false;
}

function humanTime(sec) {
  if (sec < 1) return "less than a second";
  const units = [
    ["century", 3.156e9], ["year", 3.156e7], ["month", 2.628e6],
    ["day", 86400], ["hour", 3600], ["minute", 60], ["second", 1],
  ];
  for (const [name, s] of units) {
    if (sec >= s) {
      const v = sec / s;
      const n = v >= 100 ? Math.round(v).toLocaleString() : v >= 10 ? Math.round(v) : v.toFixed(1);
      return `${n} ${name}${v >= 2 ? "s" : ""}`;
    }
  }
  return "less than a second";
}

function crackTime(bits) {
  // offline attacker guessing ~10 billion/sec; on average half the space is searched
  const log10sec = (bits - 1) * Math.log10(2) - 10;
  if (log10sec < 0) return "instantly";
  if (log10sec > 17) return "eons (effectively uncrackable)";
  return humanTime(Math.pow(10, log10sec));
}

function analyze(pw) {
  if (!pw) {
    return { score: 0, entropy: 0, crack: "—", tips: ["Start typing to check your password."], label: LABELS[0] };
  }

  const len = pw.length;
  const classes = {
    lower: /[a-z]/.test(pw),
    upper: /[A-Z]/.test(pw),
    digit: /[0-9]/.test(pw),
    symbol: /[^a-zA-Z0-9]/.test(pw),
  };
  let pool = 0;
  if (classes.lower) pool += 26;
  if (classes.upper) pool += 26;
  if (classes.digit) pool += 10;
  if (classes.symbol) pool += 33;
  const variety = Object.values(classes).filter(Boolean).length;
  const rawEntropy = len * Math.log2(pool || 1);

  const lc = pw.toLowerCase();
  const tips = [];
  let penalty = 0;

  if (COMMON_PASSWORDS.includes(lc)) {
    penalty += 45;
    tips.push("This is one of the most common passwords — never use it.");
  } else if (COMMON_PASSWORDS.some((c) => c.length >= 5 && lc.includes(c))) {
    penalty += 18;
    tips.push("Contains a well-known word or password — avoid dictionary terms.");
  }
  if (hasSequence(pw)) {
    penalty += 12;
    tips.push("Avoid sequences like 1234, abcd or qwerty runs.");
  }
  if (/(.)\1{2,}/.test(pw)) {
    penalty += 10;
    tips.push("Avoid repeating the same character (e.g. aaaa).");
  }
  if (/^\d+$/.test(pw)) {
    penalty += 15;
    tips.push("Digits only is weak — mix in letters and symbols.");
  }

  // constructive tips
  if (len < 12) tips.push("Use at least 12 characters — length beats complexity.");
  if (!classes.upper) tips.push("Add UPPERCASE letters.");
  if (!classes.lower) tips.push("Add lowercase letters.");
  if (!classes.digit) tips.push("Add numbers.");
  if (!classes.symbol) tips.push("Add symbols like ! @ # $ %.");
  if (tips.length === 0) tips.push("Great password — store it in a password manager, not your memory.");

  let score = 0;
  score += Math.min(40, len * 4);                        // length, up to 40
  score += Math.max(0, (variety - 1)) * 12;              // variety, up to 36
  score += Math.min(24, Math.max(0, rawEntropy - 28));   // entropy bonus, up to 24
  score -= penalty;
  score = Math.max(0, Math.min(100, Math.round(score)));

  const effEntropy = Math.max(0, rawEntropy - penalty * 0.5);
  const label = [...LABELS].reverse().find((l) => score >= l.min) || LABELS[0];

  return { score, entropy: Math.round(rawEntropy), crack: crackTime(effEntropy), tips: tips.slice(0, 6), label };
}

export function PasswordStrength() {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const a = useMemo(() => analyze(pw), [pw]);

  return (
    <div className="tool">
      <label className="fld">Password (checked only on your device)</label>
      <div className="tool-controls" style={{ marginBottom: 12 }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <input
            className="input"
            style={{ paddingRight: 46 }}
            type={show ? "text" : "password"}
            value={pw}
            autoComplete="new-password"
            spellCheck={false}
            placeholder="Type a password to test it…"
            onChange={(e) => setPw(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            style={{
              position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
              border: "none", background: "transparent", cursor: "pointer", fontSize: 18, padding: 4,
            }}
          >
            {show ? "🙈" : "👁"}
          </button>
        </div>
      </div>

      {/* meter */}
      <div
        style={{
          height: 14, borderRadius: 999, background: "var(--surface-2)",
          border: "1px solid var(--border)", overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%", width: `${a.score}%`,
            borderRadius: 999,
            background: "linear-gradient(90deg, var(--red), var(--amber), var(--green))",
            transition: "width .25s ease",
          }}
        />
      </div>

      <div className="flex-between" style={{ marginTop: 10 }}>
        <strong style={{ fontSize: 18, color: a.label.color }}>{a.label.label}</strong>
        <span className="muted" style={{ fontSize: 13 }}>Score {a.score}/100</span>
      </div>

      <div className="grid grid-2" style={{ gap: 12, marginTop: 12 }}>
        <div className="sheet center" style={{ padding: 14 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent)" }}>{a.entropy}</div>
          <div className="hint" style={{ margin: 0 }}>bits of entropy</div>
        </div>
        <div className="sheet center" style={{ padding: 14 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "var(--accent-2)", overflowWrap: "anywhere" }}>{a.crack}</div>
          <div className="hint" style={{ margin: 0 }}>to brute-force offline</div>
        </div>
      </div>

      {a.tips.length > 0 ? (
        <div className="sheet" style={{ padding: "12px 16px", marginTop: 12 }}>
          <div className="fld" style={{ marginBottom: 6 }}>How to make it stronger</div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.7, color: "var(--text-soft)" }}>
            {a.tips.map((t, i) => (<li key={i}>{t}</li>))}
          </ul>
        </div>
      ) : null}

      <p className="hint">
        100% private — your password is analysed in your browser and never sent, saved or logged.
        Crack-time assumes a fast offline attack (~10 billion guesses/second).
      </p>
    </div>
  );
}

/* =====================================================================
   EMOJI PICKER  (built-in dataset, search, categories, recent, copy)
   ===================================================================== */

const EMOJI = {
  Smileys: [
    ["😀", "grinning face", "happy smile"], ["😃", "grinning big eyes", "happy joy"],
    ["😄", "grinning smiling eyes", "happy laugh"], ["😁", "beaming", "grin happy"],
    ["😆", "grinning squinting", "laugh haha"], ["😅", "sweat smile", "relief nervous"],
    ["🤣", "rolling on floor", "lol laughing"], ["😂", "tears of joy", "lol cry laugh"],
    ["🙂", "slight smile", "content"], ["🙃", "upside down", "silly sarcasm"],
    ["😉", "wink", "flirt joke"], ["😊", "smiling blush", "happy shy"],
    ["😇", "halo angel", "innocent"], ["🥰", "smiling hearts", "love adore"],
    ["😍", "heart eyes", "love crush"], ["🤩", "star struck", "amazed wow"],
    ["😘", "blowing kiss", "love"], ["😗", "kissing", "kiss"],
    ["😋", "yum tongue", "delicious tasty"], ["😛", "tongue out", "playful"],
    ["🤪", "zany", "crazy silly"], ["😜", "winking tongue", "joke"],
    ["🤗", "hugging", "hug care"], ["🤭", "hand over mouth", "giggle oops"],
    ["🤫", "shushing", "quiet secret"], ["🤔", "thinking", "hmm ponder"],
    ["😐", "neutral", "meh"], ["😴", "sleeping", "sleep zzz tired"],
    ["😌", "relieved", "calm content"], ["😔", "pensive", "sad down"],
    ["😢", "crying", "sad tear"], ["😭", "loudly crying", "sob bawl"],
    ["😤", "steam nose", "angry frustrated"], ["😡", "pouting", "angry mad rage"],
    ["🤬", "cursing", "swear angry"], ["😱", "screaming fear", "shock scared"],
    ["😳", "flushed", "embarrassed shy"], ["🥵", "hot face", "sweating heat"],
    ["🥶", "cold face", "freezing"], ["😷", "medical mask", "sick"],
    ["🤒", "thermometer", "sick fever"], ["🤢", "nauseated", "sick gross"],
    ["🥳", "partying", "celebrate party"], ["😎", "sunglasses", "cool"],
    ["🤓", "nerd", "geek smart"], ["🤠", "cowboy", "hat"],
    ["🥺", "pleading", "puppy eyes beg"], ["😬", "grimacing", "awkward"],
  ],
  Gestures: [
    ["👍", "thumbs up", "like yes ok"], ["👎", "thumbs down", "dislike no"],
    ["👌", "ok hand", "perfect"], ["✌️", "victory peace", "two"],
    ["🤞", "fingers crossed", "luck hope"], ["🤟", "love you gesture", "rock"],
    ["🤘", "rock on horns", "metal"], ["🤙", "call me", "shaka hang loose"],
    ["👈", "point left", "left"], ["👉", "point right", "right"],
    ["👆", "point up", "up"], ["👇", "point down", "down"],
    ["☝️", "index up", "one point"], ["✋", "raised hand", "stop high five"],
    ["🤚", "back of hand", "stop"], ["🖐️", "hand splayed", "five"],
    ["🖖", "vulcan salute", "spock"], ["👋", "waving hand", "hi bye hello"],
    ["🤝", "handshake", "deal agree"], ["👏", "clapping", "applause bravo"],
    ["🙌", "raising hands", "celebrate praise"], ["🙏", "folded hands", "pray thanks please"],
    ["🤲", "palms up", "beg receive"], ["💪", "flexed biceps", "strong muscle"],
    ["✊", "raised fist", "power solidarity"], ["👊", "fist bump", "punch bro"],
    ["🤛", "left fist", "bump"], ["🤜", "right fist", "bump"],
    ["✍️", "writing hand", "write"], ["🤌", "pinched fingers", "italian"],
    ["🫶", "heart hands", "love"], ["🫰", "finger heart", "love money"],
  ],
  People: [
    ["👶", "baby", "infant"], ["🧒", "child", "kid"], ["👦", "boy", "child"],
    ["👧", "girl", "child"], ["🧑", "person", "adult"], ["👨", "man", "male"],
    ["👩", "woman", "female"], ["🧓", "older person", "elder"], ["👴", "old man", "grandpa"],
    ["👵", "old woman", "grandma"], ["👮", "police officer", "cop"], ["🕵️", "detective", "spy"],
    ["👷", "construction worker", "builder"], ["👳", "person turban", ""], ["👲", "person cap", ""],
    ["🧕", "woman headscarf", "hijab"], ["🤵", "person tuxedo", "groom wedding"], ["👰", "person veil", "bride wedding"],
    ["🤰", "pregnant woman", "expecting"], ["🎅", "santa claus", "christmas"], ["🤶", "mrs claus", "christmas"],
    ["🦸", "superhero", "hero"], ["🦹", "supervillain", "villain"], ["🧙", "mage wizard", "magic"],
    ["🧚", "fairy", "magic"], ["🧛", "vampire", "dracula"], ["🧜", "merperson", "mermaid"],
    ["🧑‍🚀", "astronaut", "space"], ["🧑‍🍳", "cook chef", "food"], ["🧑‍🏫", "teacher", "school"],
    ["🧑‍💻", "technologist", "developer coder"], ["🧑‍🎤", "singer", "music star"], ["👤", "silhouette", "user person"],
  ],
  Animals: [
    ["🐶", "dog", "puppy pet"], ["🐱", "cat", "kitten pet"], ["🐭", "mouse", "rodent"],
    ["🐹", "hamster", "pet"], ["🐰", "rabbit", "bunny"], ["🦊", "fox", ""],
    ["🐻", "bear", ""], ["🐼", "panda", ""], ["🐨", "koala", ""],
    ["🐯", "tiger", ""], ["🦁", "lion", ""], ["🐮", "cow", ""],
    ["🐷", "pig", ""], ["🐸", "frog", ""], ["🐵", "monkey", ""],
    ["🐔", "chicken", "hen"], ["🐧", "penguin", ""], ["🐦", "bird", ""],
    ["🦄", "unicorn", "magic"], ["🐝", "bee", "honey"], ["🦋", "butterfly", ""],
    ["🐌", "snail", ""], ["🐞", "ladybug", ""], ["🐢", "turtle", "tortoise"],
    ["🐍", "snake", ""], ["🐙", "octopus", ""], ["🦑", "squid", ""],
    ["🦀", "crab", ""], ["🐬", "dolphin", ""], ["🐳", "whale", ""],
    ["🐟", "fish", ""], ["🦈", "shark", ""], ["🐊", "crocodile", "alligator"],
    ["🐘", "elephant", ""], ["🦒", "giraffe", ""], ["🦓", "zebra", ""],
    ["🐎", "horse", ""], ["🐐", "goat", ""], ["🐓", "rooster", ""],
    ["🦅", "eagle", "bird"], ["🦉", "owl", "bird"], ["🌵", "cactus", "plant"],
    ["🌲", "evergreen tree", "pine"], ["🌳", "tree", "deciduous"], ["🌴", "palm tree", ""],
    ["🌸", "cherry blossom", "flower"], ["🌹", "rose", "flower"], ["🌻", "sunflower", "flower"],
    ["🌈", "rainbow", ""], ["⭐", "star", ""], ["🔥", "fire", "flame lit hot"],
  ],
  Food: [
    ["🍎", "red apple", "fruit"], ["🍏", "green apple", "fruit"], ["🍊", "orange", "fruit"],
    ["🍋", "lemon", "fruit"], ["🍌", "banana", "fruit"], ["🍉", "watermelon", "fruit"],
    ["🍇", "grapes", "fruit"], ["🍓", "strawberry", "fruit"], ["🫐", "blueberries", "fruit"],
    ["🍒", "cherries", "fruit"], ["🍑", "peach", "fruit"], ["🥭", "mango", "fruit"],
    ["🍍", "pineapple", "fruit"], ["🥥", "coconut", ""], ["🥝", "kiwi", "fruit"],
    ["🍅", "tomato", ""], ["🥑", "avocado", ""], ["🥦", "broccoli", "veg"],
    ["🌽", "corn", ""], ["🥕", "carrot", "veg"], ["🥔", "potato", ""],
    ["🍞", "bread", ""], ["🥐", "croissant", ""], ["🥨", "pretzel", ""],
    ["🧀", "cheese", ""], ["🥚", "egg", ""], ["🍳", "fried egg", "cooking"],
    ["🥞", "pancakes", "breakfast"], ["🧇", "waffle", ""], ["🥓", "bacon", ""],
    ["🍔", "hamburger", "burger"], ["🍟", "fries", "chips"], ["🍕", "pizza", ""],
    ["🌭", "hot dog", ""], ["🌮", "taco", ""], ["🌯", "burrito", ""],
    ["🍜", "ramen noodles", "soup"], ["🍝", "spaghetti", "pasta"], ["🍣", "sushi", ""],
    ["🍤", "shrimp", "tempura"], ["🍙", "rice ball", ""], ["🍦", "ice cream", "dessert"],
    ["🍩", "donut", "doughnut"], ["🍪", "cookie", ""], ["🎂", "birthday cake", "celebrate"],
    ["🍰", "cake slice", "dessert"], ["🍫", "chocolate", ""], ["🍬", "candy", "sweet"],
    ["🍿", "popcorn", "movie"], ["☕", "coffee", "hot drink"], ["🍵", "tea", ""],
    ["🍺", "beer", ""], ["🍷", "wine", ""], ["🥂", "champagne clink", "cheers"],
  ],
  Travel: [
    ["🚗", "car", "auto"], ["🚕", "taxi", "cab"], ["🚙", "suv", "car"],
    ["🚌", "bus", ""], ["🚎", "trolleybus", ""], ["🏎️", "race car", "fast"],
    ["🚓", "police car", ""], ["🚑", "ambulance", ""], ["🚒", "fire engine", ""],
    ["🚚", "truck", "delivery"], ["🚜", "tractor", "farm"], ["🏍️", "motorcycle", "bike"],
    ["🚲", "bicycle", "bike"], ["🛴", "scooter", ""], ["✈️", "airplane", "flight travel"],
    ["🚀", "rocket", "space launch"], ["🛸", "ufo", "alien"], ["🚁", "helicopter", ""],
    ["⛵", "sailboat", "boat"], ["🚤", "speedboat", "boat"], ["🛳️", "cruise ship", ""],
    ["🚢", "ship", ""], ["🚂", "locomotive", "train"], ["🚆", "train", ""],
    ["🚇", "metro", "subway"], ["🚉", "station", "train"], ["🗺️", "world map", "travel"],
    ["🧭", "compass", "direction"], ["🏔️", "mountain snow", ""], ["🌋", "volcano", ""],
    ["🏕️", "camping", "tent"], ["🏖️", "beach", "vacation"], ["🏝️", "island", "tropical"],
    ["🗽", "statue of liberty", "new york"], ["🗼", "tower tokyo", ""], ["🏰", "castle", ""],
    ["⛩️", "shinto shrine", "japan"], ["🎡", "ferris wheel", "fair"], ["🎢", "roller coaster", "theme park"],
    ["🚦", "traffic light", ""], ["⛽", "fuel pump", "gas"], ["🏁", "checkered flag", "finish race"],
  ],
  Activities: [
    ["⚽", "soccer", "football"], ["🏀", "basketball", ""], ["🏈", "american football", ""],
    ["⚾", "baseball", ""], ["🥎", "softball", ""], ["🎾", "tennis", ""],
    ["🏐", "volleyball", ""], ["🏉", "rugby", ""], ["🎱", "billiards", "pool 8ball"],
    ["🏓", "ping pong", "table tennis"], ["🏸", "badminton", ""], ["🥅", "goal net", ""],
    ["🏒", "ice hockey", ""], ["🏑", "field hockey", ""], ["🏏", "cricket", ""],
    ["⛳", "golf flag", ""], ["🏹", "bow arrow", "archery"], ["🎣", "fishing", ""],
    ["🥊", "boxing glove", ""], ["🥋", "martial arts", "karate judo"], ["⛸️", "ice skate", ""],
    ["🛹", "skateboard", ""], ["🎿", "ski", ""], ["🏂", "snowboard", ""],
    ["🏋️", "weight lifting", "gym"], ["🤸", "cartwheel", "gymnast"], ["🤾", "handball", ""],
    ["🏊", "swimming", ""], ["🚴", "cycling", "bike"], ["🧗", "climbing", ""],
    ["🎯", "bullseye", "dart target"], ["🎳", "bowling", ""], ["🎮", "video game", "controller gaming"],
    ["🎲", "dice", "game"], ["♟️", "chess pawn", "game"], ["🎸", "guitar", "music"],
    ["🎹", "piano keyboard", "music"], ["🎺", "trumpet", "music"], ["🎻", "violin", "music"],
    ["🥁", "drum", "music"], ["🎤", "microphone", "sing karaoke"], ["🎧", "headphones", "music"],
    ["🎬", "clapper", "movie film"], ["🎨", "artist palette", "paint art"], ["🎭", "performing arts", "theater"],
  ],
  Objects: [
    ["💡", "light bulb", "idea"], ["🔦", "flashlight", "torch"], ["🔋", "battery", ""],
    ["🔌", "plug", "power"], ["💻", "laptop", "computer"], ["🖥️", "desktop", "monitor"],
    ["⌨️", "keyboard", ""], ["🖱️", "mouse computer", ""], ["🖨️", "printer", ""],
    ["📱", "mobile phone", "smartphone"], ["☎️", "telephone", "phone"], ["📞", "phone receiver", "call"],
    ["📷", "camera", "photo"], ["📸", "camera flash", "photo"], ["🎥", "movie camera", "film"],
    ["📺", "television", "tv"], ["📻", "radio", ""], ["⏰", "alarm clock", "time"],
    ["⏱️", "stopwatch", "timer"], ["⌚", "watch", "time"], ["📡", "satellite antenna", "signal"],
    ["🔭", "telescope", "astronomy"], ["🔬", "microscope", "science lab"], ["💊", "pill", "medicine"],
    ["💉", "syringe", "vaccine shot"], ["🩺", "stethoscope", "doctor"], ["🔧", "wrench", "tool fix"],
    ["🔨", "hammer", "tool"], ["🛠️", "hammer wrench", "tools"], ["⚙️", "gear", "settings"],
    ["🔩", "nut bolt", "hardware"], ["🧰", "toolbox", ""], ["🧲", "magnet", ""],
    ["🔑", "key", "unlock"], ["🔒", "locked", "secure privacy"], ["🔓", "unlocked", "open"],
    ["📎", "paperclip", ""], ["📌", "pushpin", "pin"], ["📍", "round pin", "location map"],
    ["✂️", "scissors", "cut"], ["🖊️", "pen", "write"], ["✏️", "pencil", "write"],
    ["📚", "books", "study read"], ["📖", "open book", "read"], ["📝", "memo", "note write"],
    ["💰", "money bag", "cash"], ["💵", "dollar", "money cash"], ["💳", "credit card", "payment"],
    ["🎁", "gift", "present"], ["🎈", "balloon", "party"], ["🎉", "party popper", "celebrate confetti"],
  ],
  Symbols: [
    ["❤️", "red heart", "love"], ["🧡", "orange heart", "love"], ["💛", "yellow heart", "love"],
    ["💚", "green heart", "love"], ["💙", "blue heart", "love"], ["💜", "purple heart", "love"],
    ["🖤", "black heart", "love"], ["🤍", "white heart", "love"], ["💔", "broken heart", "sad"],
    ["💕", "two hearts", "love"], ["💖", "sparkling heart", "love"], ["💝", "heart ribbon", "gift love"],
    ["💯", "hundred", "100 perfect score"], ["✅", "check mark", "done yes correct"], ["❌", "cross mark", "no wrong x"],
    ["✔️", "check", "tick yes"], ["➕", "plus", "add"], ["➖", "minus", "subtract"],
    ["✖️", "multiply", "x times"], ["➗", "divide", ""], ["❓", "question mark", "help"],
    ["❗", "exclamation", "warning"], ["⚠️", "warning", "caution alert"], ["🚫", "prohibited", "no ban"],
    ["♻️", "recycle", "environment"], ["✨", "sparkles", "shine new magic"], ["⭐", "star", "favorite"],
    ["🌟", "glowing star", "shine"], ["💫", "dizzy star", ""], ["⚡", "high voltage", "lightning power"],
    ["🔔", "bell", "notification"], ["🔕", "bell off", "mute"], ["🔊", "loud speaker", "volume sound"],
    ["🔇", "muted speaker", "silent"], ["🎵", "musical note", "music"], ["🎶", "musical notes", "music"],
    ["©️", "copyright", ""], ["®️", "registered", "trademark"], ["™️", "trademark", ""],
    ["♾️", "infinity", "forever"], ["🔴", "red circle", "dot"], ["🟢", "green circle", "dot online"],
    ["🔵", "blue circle", "dot"], ["🟡", "yellow circle", "dot"], ["⚫", "black circle", "dot"],
    ["⚪", "white circle", "dot"], ["🔺", "red triangle up", ""], ["🔻", "red triangle down", ""],
  ],
  Flags: [
    ["🏁", "checkered flag", "race finish"], ["🚩", "triangular flag", "red flag"], ["🏴", "black flag", ""],
    ["🏳️", "white flag", "surrender"], ["🏳️‍🌈", "rainbow flag", "pride lgbt"], ["🏴‍☠️", "pirate flag", "skull"],
    ["🇺🇸", "united states", "usa america"], ["🇬🇧", "united kingdom", "uk britain"], ["🇨🇦", "canada", ""],
    ["🇦🇺", "australia", ""], ["🇮🇳", "india", ""], ["🇩🇪", "germany", ""],
    ["🇫🇷", "france", ""], ["🇪🇸", "spain", ""], ["🇮🇹", "italy", ""],
    ["🇯🇵", "japan", ""], ["🇨🇳", "china", ""], ["🇰🇷", "south korea", ""],
    ["🇧🇷", "brazil", ""], ["🇲🇽", "mexico", ""], ["🇷🇺", "russia", ""],
    ["🇿🇦", "south africa", ""], ["🇳🇬", "nigeria", ""], ["🇦🇪", "united arab emirates", "uae dubai"],
    ["🇸🇦", "saudi arabia", ""], ["🇸🇬", "singapore", ""], ["🇳🇱", "netherlands", "holland"],
    ["🇸🇪", "sweden", ""], ["🇨🇭", "switzerland", ""], ["🇮🇪", "ireland", ""],
    ["🇵🇹", "portugal", ""], ["🇬🇷", "greece", ""], ["🇹🇷", "turkey", ""],
  ],
};

const CATEGORIES = Object.keys(EMOJI);
const CAT_ICON = {
  Smileys: "😀", Gestures: "👍", People: "🧑", Animals: "🐶", Food: "🍔",
  Travel: "✈️", Activities: "⚽", Objects: "💡", Symbols: "❤️", Flags: "🏁",
};
const ALL_EMOJI = CATEGORIES.flatMap((cat) =>
  EMOJI[cat].map(([e, n, k]) => ({ e, n, k, cat }))
);
const RECENT_KEY = "emoji-recent";

export function EmojiPicker() {
  const [cat, setCat] = useState(CATEGORIES[0]);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState("");
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw).slice(0, 24));
    } catch (e) {}
  }, []);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (q) {
      return ALL_EMOJI.filter(
        (it) => it.n.includes(q) || it.k.includes(q) || it.e === query.trim()
      ).slice(0, 120);
    }
    return EMOJI[cat].map(([e, n, k]) => ({ e, n, k, cat }));
  }, [q, cat, query]);

  function pushRecent(emoji) {
    setRecent((prev) => {
      const next = [emoji, ...prev.filter((x) => x !== emoji)].slice(0, 24);
      if (typeof window !== "undefined") {
        try { window.localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch (e) {}
      }
      return next;
    });
  }

  async function pick(emoji) {
    pushRecent(emoji);
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(emoji);
      }
    } catch (e) {}
    setCopied(emoji);
    setTimeout(() => setCopied((c) => (c === emoji ? "" : c)), 1100);
  }

  const cell = {
    fontSize: 26, lineHeight: 1, height: 46,
    display: "flex", alignItems: "center", justifyContent: "center",
    border: "1px solid transparent", borderRadius: "var(--radius-sm)",
    background: "var(--surface-2)", cursor: "pointer", userSelect: "none",
    transition: "transform .1s ease, background .1s ease, border-color .1s ease",
  };

  return (
    <div className="tool">
      <div style={{ position: "relative" }}>
        {copied ? (
          <div
            style={{
              position: "absolute", top: -6, right: 0, zIndex: 5,
              background: "var(--green)", color: "#fff", fontWeight: 700, fontSize: 13,
              padding: "6px 12px", borderRadius: 999, boxShadow: "var(--shadow-sm)",
              animation: "fade-in .15s ease",
            }}
          >
            Copied {copied} ✓
          </div>
        ) : null}

        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔎 Search emojis — try 'love', 'fire', 'party'…"
          style={{ marginBottom: 12 }}
        />
      </div>

      {!q ? (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {CATEGORIES.map((c) => {
            const on = c === cat;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                style={{
                  border: "1px solid " + (on ? "transparent" : "var(--border-strong)"),
                  background: on ? "linear-gradient(120deg, var(--accent), var(--accent-2))" : "var(--surface)",
                  color: on ? "#fff" : "var(--text-soft)",
                  fontWeight: 700, fontSize: 13, cursor: "pointer",
                  padding: "7px 12px", borderRadius: 999,
                  display: "inline-flex", alignItems: "center", gap: 6,
                  boxShadow: on ? "var(--shadow-sm)" : "none",
                }}
              >
                <span style={{ fontSize: 15 }}>{CAT_ICON[c]}</span> {c}
              </button>
            );
          })}
        </div>
      ) : null}

      {!q && recent.length > 0 ? (
        <div style={{ marginBottom: 14 }}>
          <div className="fld" style={{ marginBottom: 6 }}>🕘 Recently used</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(46px, 1fr))", gap: 6 }}>
            {recent.map((em, i) => (
              <button
                key={em + i}
                onClick={() => pick(em)}
                title="Copy"
                style={{ ...cell, background: "var(--accent-soft)" }}
                onMouseDown={(e) => e.currentTarget.style.transform = "scale(.9)"}
                onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                {em}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="fld" style={{ marginBottom: 6 }}>
        {q ? `${results.length} result${results.length === 1 ? "" : "s"}` : cat}
      </div>

      {results.length === 0 ? (
        <div className="sheet center" style={{ padding: 28, color: "var(--muted)" }}>
          No emojis match “{query}”. Try another word.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(46px, 1fr))", gap: 6 }}>
          {results.map((it, i) => (
            <button
              key={it.e + i}
              onClick={() => pick(it.e)}
              title={`${it.n} — click to copy`}
              aria-label={`Copy ${it.n}`}
              style={{
                ...cell,
                borderColor: copied === it.e ? "var(--green)" : "transparent",
                background: copied === it.e ? "var(--green-soft)" : "var(--surface-2)",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(.9)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {it.e}
            </button>
          ))}
        </div>
      )}

      <p className="hint">
        Tap any emoji to copy it to your clipboard. Recently used emojis are remembered on this
        device only. {ALL_EMOJI.length}+ emojis included — search by name or keyword.
      </p>
    </div>
  );
}
