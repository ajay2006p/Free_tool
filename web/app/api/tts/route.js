import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/* Neural ("HD") text-to-speech — the paid upsell tier of the TTS tool.
 *
 * The free tier runs entirely in the browser via the Web Speech API and never
 * touches this route. This endpoint is only hit when a user asks for an HD
 * voice, and it stays DISABLED until a key is configured, so the tool works
 * (free tier only) with no cost and no setup.
 *
 * To enable, set in the deployment environment:
 *   TTS_API_KEY   - ElevenLabs API key (https://elevenlabs.io)
 *   TTS_VOICE_ID  - optional, defaults to a public ElevenLabs voice
 *   TTS_MODEL     - optional, defaults to eleven_multilingual_v2
 *
 * Cost control: HD requests are capped at MAX_HD_CHARS characters. Because the
 * tool is public and unauthenticated, this cap is the main guard against a
 * single visitor running up the bill — tighten it, or add rate limiting /
 * a usage cap, before enabling in production with a funded key. */

const MAX_HD_CHARS = 600;
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // ElevenLabs "Rachel", a public preset
const DEFAULT_MODEL = "eleven_multilingual_v2";

export async function POST(request) {
  const key = process.env.TTS_API_KEY;
  // Disabled by design when no key is set — the client falls back to free voices.
  if (!key) return NextResponse.json({ error: "hd_disabled" }, { status: 503 });

  let text = "";
  try { text = String((await request.json())?.text || "").trim(); } catch (e) {}
  if (!text) return NextResponse.json({ error: "Enter some text to read." }, { status: 400 });
  if (text.length > MAX_HD_CHARS) {
    return NextResponse.json(
      { error: `HD voice is limited to ${MAX_HD_CHARS} characters per request. Shorten the text or use the free voice for long passages.` },
      { status: 413 }
    );
  }

  const voiceId = process.env.TTS_VOICE_ID || DEFAULT_VOICE_ID;
  const model = process.env.TTS_MODEL || DEFAULT_MODEL;

  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": key,
        "content-type": "application/json",
        accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: model,
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });

    if (!res.ok) {
      // Surface a clean message; keep provider detail out of the client.
      let detail = "";
      try { detail = (await res.json())?.detail?.message || ""; } catch (e) {}
      const msg = res.status === 401
        ? "HD voice is misconfigured (invalid API key)."
        : res.status === 429
        ? "HD voice is busy right now — try again in a moment."
        : detail || "HD voice could not generate audio. Try the free voice instead.";
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    // Stream the MP3 straight back to the browser.
    const audio = await res.arrayBuffer();
    return new Response(audio, {
      headers: {
        "content-type": "audio/mpeg",
        "cache-control": "no-store",
      },
    });
  } catch (e) {
    return NextResponse.json({ error: "Could not reach the HD voice service." }, { status: 502 });
  }
}
