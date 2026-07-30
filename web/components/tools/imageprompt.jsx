"use client";

/* ============================================================================
   AI Image Prompt Generator — turns a plain idea into a detailed prompt for
   Midjourney, Stable Diffusion, DALL·E, Firefly or any other generator.

   It does NOT generate images: image models cost money to run, and shipping a
   fake or crippled generator would waste the visitor's time. What actually
   limits most people's results is prompt quality, and that we can fix for free.

   Each target platform gets the syntax it really wants — Midjourney flags,
   Stable Diffusion comma tags plus a negative prompt, or a natural-language
   paragraph for DALL·E.
   ========================================================================== */

import { useMemo, useState } from "react";
import CopyButton from "../CopyButton";

const PLATFORMS = [
  { key: "midjourney", name: "Midjourney", note: "Comma-separated cues plus --ar / --style flags." },
  { key: "sd", name: "Stable Diffusion", note: "Weighted tag list plus a negative prompt." },
  { key: "dalle", name: "DALL·E / ChatGPT", note: "One descriptive sentence — no tag soup." },
  { key: "firefly", name: "Firefly / generic", note: "Plain descriptive prompt, no vendor syntax." },
];

const STYLES = {
  photo: {
    name: "Photorealistic",
    cues: ["photorealistic", "shot on a full-frame DSLR", "85mm lens", "shallow depth of field", "natural skin texture", "sharp focus"],
    sentence: "a photorealistic photograph",
  },
  cinematic: {
    name: "Cinematic",
    cues: ["cinematic still", "anamorphic lens", "shallow depth of field", "film grain", "dramatic composition", "colour graded"],
    sentence: "a cinematic film still",
  },
  illustration: {
    name: "Illustration",
    cues: ["digital illustration", "clean linework", "flat shading", "vibrant palette", "editorial style"],
    sentence: "a digital illustration",
  },
  anime: {
    name: "Anime",
    cues: ["anime key visual", "cel shading", "expressive eyes", "detailed background art", "studio quality"],
    sentence: "an anime key visual",
  },
  threed: {
    name: "3D render",
    cues: ["3D render", "octane render", "subsurface scattering", "soft shadows", "physically based materials"],
    sentence: "a polished 3D render",
  },
  watercolour: {
    name: "Watercolour",
    cues: ["watercolour painting", "wet-on-wet washes", "visible paper texture", "soft bleeding edges"],
    sentence: "a watercolour painting",
  },
  logo: {
    name: "Logo / icon",
    cues: ["minimal vector logo", "flat design", "geometric", "solid background", "high contrast", "scalable"],
    sentence: "a minimal flat vector logo",
  },
  product: {
    name: "Product shot",
    cues: ["studio product photograph", "seamless backdrop", "softbox lighting", "crisp reflections", "commercial quality"],
    sentence: "a studio product photograph",
  },
  pixel: {
    name: "Pixel art",
    cues: ["pixel art", "16-bit palette", "crisp pixels", "isometric", "no anti-aliasing"],
    sentence: "detailed pixel art",
  },
  concept: {
    name: "Concept art",
    cues: ["concept art", "matte painting", "epic scale", "atmospheric perspective", "trending on artstation"],
    sentence: "sweeping concept art",
  },
};

const LIGHTING = [
  { key: "golden", label: "Golden hour", cue: "warm golden-hour light, long shadows" },
  { key: "studio", label: "Studio", cue: "three-point studio lighting, soft key light" },
  { key: "neon", label: "Neon", cue: "neon rim lighting, magenta and cyan glow" },
  { key: "overcast", label: "Soft daylight", cue: "soft diffused overcast daylight" },
  { key: "dramatic", label: "Dramatic", cue: "high-contrast chiaroscuro lighting, deep shadows" },
  { key: "backlit", label: "Backlit", cue: "strong backlight, visible light rays, silhouette edges" },
  { key: "night", label: "Night", cue: "low-key night lighting, practical light sources" },
];

const MOODS = [
  { key: "none", label: "No preference", cue: "" },
  { key: "serene", label: "Serene", cue: "calm, serene atmosphere" },
  { key: "epic", label: "Epic", cue: "awe-inspiring, epic scale" },
  { key: "cosy", label: "Cosy", cue: "warm, cosy, inviting mood" },
  { key: "moody", label: "Moody", cue: "moody, brooding atmosphere" },
  { key: "playful", label: "Playful", cue: "bright, playful, energetic" },
  { key: "futuristic", label: "Futuristic", cue: "sleek, futuristic, high-tech" },
  { key: "vintage", label: "Vintage", cue: "nostalgic, retro, aged tones" },
];

const SHOTS = [
  { key: "none", label: "No preference", cue: "" },
  { key: "closeup", label: "Close-up", cue: "tight close-up" },
  { key: "portrait", label: "Portrait", cue: "head-and-shoulders portrait" },
  { key: "full", label: "Full body", cue: "full-body shot" },
  { key: "wide", label: "Wide shot", cue: "wide establishing shot" },
  { key: "aerial", label: "Aerial", cue: "aerial drone view from above" },
  { key: "macro", label: "Macro", cue: "extreme macro detail" },
  { key: "isometric", label: "Isometric", cue: "isometric view" },
];

const RATIOS = [
  { key: "1:1", label: "Square 1:1" },
  { key: "16:9", label: "Wide 16:9" },
  { key: "9:16", label: "Vertical 9:16" },
  { key: "4:3", label: "Classic 4:3" },
  { key: "3:2", label: "Photo 3:2" },
  { key: "2:3", label: "Portrait 2:3" },
];

const QUALITY = ["highly detailed", "8k", "professional quality", "masterpiece"];

const NEGATIVE = [
  "blurry", "low quality", "jpeg artifacts", "watermark", "signature", "text",
  "extra fingers", "deformed hands", "bad anatomy", "duplicate", "cropped", "out of frame",
];

const IDEAS = [
  "a lighthouse on a cliff during a storm",
  "a cosy bookshop cafe on a rainy evening",
  "a red fox asleep in fresh snow",
  "an astronaut tending a greenhouse on Mars",
  "a street food stall at night in Tokyo",
  "a hot air balloon over terraced rice fields",
  "a vintage motorcycle in a sunlit garage",
  "a jellyfish drifting through deep water",
  "a treehouse village connected by rope bridges",
  "a violinist practising in an empty theatre",
  "a golden retriever puppy in a field of lavender",
  "an abandoned train station reclaimed by plants",
];

export function AiImagePrompt() {
  const [subject, setSubject] = useState("");
  const [platform, setPlatform] = useState("midjourney");
  const [style, setStyle] = useState("photo");
  const [light, setLight] = useState("golden");
  const [mood, setMood] = useState("none");
  const [shot, setShot] = useState("none");
  const [ratio, setRatio] = useState("16:9");
  const [extra, setExtra] = useState("");
  const [useNegative, setUseNegative] = useState(true);

  const prompt = useMemo(() => {
    const subj = subject.trim();
    if (!subj) return "";

    const s = STYLES[style];
    const lightCue = LIGHTING.find((l) => l.key === light)?.cue || "";
    const moodCue = MOODS.find((m) => m.key === mood)?.cue || "";
    const shotCue = SHOTS.find((x) => x.key === shot)?.cue || "";
    const extras = extra.trim();

    if (platform === "dalle" || platform === "firefly") {
      // Natural language: these models follow a sentence better than tags.
      const parts = [
        `${s.sentence} of ${subj}`,
        shotCue ? `framed as a ${shotCue}` : "",
        lightCue ? `lit by ${lightCue}` : "",
        moodCue ? `with a ${moodCue}` : "",
        extras,
      ].filter(Boolean);
      let out = `${parts.join(", ")}.`;
      out += ` Rendered with ${s.cues.slice(1, 4).join(", ")}, highly detailed and professionally composed.`;
      if (platform === "firefly") out += ` Aspect ratio ${ratio}.`;
      return out;
    }

    const tags = [shotCue, subj, ...s.cues, lightCue, moodCue, extras, ...QUALITY].filter(Boolean);

    if (platform === "midjourney") {
      return `${tags.join(", ")} --ar ${ratio} --style raw --v 6`;
    }

    // Stable Diffusion: weight the subject up, and supply a negative prompt.
    const sd = [`(${subj}:1.3)`, shotCue, ...s.cues, lightCue, moodCue, extras, ...QUALITY].filter(Boolean).join(", ");
    return useNegative ? `${sd}\n\nNegative prompt: ${NEGATIVE.join(", ")}` : sd;
  }, [subject, platform, style, light, mood, shot, ratio, extra, useNegative]);

  const activePlatform = PLATFORMS.find((p) => p.key === platform);

  return (
    <div className="tool">
      <div className="notice" style={{ marginBottom: 16 }}>
        This tool writes <strong>prompts</strong>, not images. Paste the result into Midjourney, Stable Diffusion,
        DALL·E, Firefly or any generator you already use — a well-structured prompt is what separates a flat result
        from a great one.
      </div>

      <label className="fld">What do you want a picture of?</label>
      <div className="tool-controls">
        <input
          className="input"
          style={{ flex: 1 }}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. a red fox asleep in fresh snow"
          maxLength={300}
        />
        <button
          className="btn btn-outline"
          onClick={() => setSubject(IDEAS[Math.floor(Math.random() * IDEAS.length)])}
          title="Fill in a random idea"
        >
          Surprise me
        </button>
      </div>

      <div className="fld" style={{ marginTop: 16 }}>Which generator are you using?</div>
      <div className="chips">
        {PLATFORMS.map((p) => (
          <button
            key={p.key}
            className="chip"
            onClick={() => setPlatform(p.key)}
            style={platform === p.key ? { borderColor: "var(--accent)", fontWeight: 800 } : undefined}
          >
            {p.name}
          </button>
        ))}
      </div>
      <p className="hint" style={{ marginTop: 6 }}>{activePlatform.note}</p>

      <div className="fld" style={{ marginTop: 14 }}>Style</div>
      <div className="chips">
        {Object.entries(STYLES).map(([key, s]) => (
          <button
            key={key}
            className="chip"
            onClick={() => setStyle(key)}
            style={style === key ? { borderColor: "var(--accent)", fontWeight: 800 } : undefined}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid-2" style={{ gap: 12, marginTop: 16 }}>
        <div>
          <label className="fld">Lighting</label>
          <select className="input" value={light} onChange={(e) => setLight(e.target.value)}>
            {LIGHTING.map((l) => (
              <option key={l.key} value={l.key}>{l.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="fld">Mood</label>
          <select className="input" value={mood} onChange={(e) => setMood(e.target.value)}>
            {MOODS.map((m) => (
              <option key={m.key} value={m.key}>{m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="fld">Shot type</label>
          <select className="input" value={shot} onChange={(e) => setShot(e.target.value)}>
            {SHOTS.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="fld">Aspect ratio</label>
          <select className="input" value={ratio} onChange={(e) => setRatio(e.target.value)}>
            {RATIOS.map((r) => (
              <option key={r.key} value={r.key}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      <label className="fld" style={{ marginTop: 12 }}>Anything else to include? (optional)</label>
      <input
        className="input"
        value={extra}
        onChange={(e) => setExtra(e.target.value)}
        placeholder="e.g. wearing a knitted scarf, autumn colours"
        maxLength={200}
      />

      {platform === "sd" ? (
        <label className="chk" style={{ marginTop: 12 }}>
          <input type="checkbox" checked={useNegative} onChange={(e) => setUseNegative(e.target.checked)} />
          <span>Add a negative prompt (recommended — filters out common artefacts)</span>
        </label>
      ) : null}

      <div className="flex-between" style={{ margin: "20px 0 6px" }}>
        <label className="fld" style={{ margin: 0 }}>Your prompt</label>
        {prompt ? <CopyButton value={prompt} /> : null}
      </div>
      <textarea
        className="textarea"
        rows={7}
        readOnly
        value={prompt}
        placeholder="Describe your idea above and the full prompt appears here."
      />

      {prompt ? (
        <p className="hint">
          Tip: generate four images from this prompt, then re-run the best one with one detail changed at a time.
          Changing everything at once makes it impossible to tell what helped.
        </p>
      ) : null}
    </div>
  );
}
