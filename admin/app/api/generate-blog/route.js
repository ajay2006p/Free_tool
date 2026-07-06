import { NextResponse } from "next/server";
import { isAuthed } from "../../../lib/auth";

export const dynamic = "force-dynamic";

const SYSTEM = `You are a professional tech blogger for a free online-tools website (developer tools, calculators, converters, SEO, social media & productivity tools).
Write an original, SEO-optimized, genuinely useful blog post.
Return ONLY valid JSON (no markdown fences, no text outside it) with this exact shape:
{
  "title": "compelling, specific title (<= 70 chars)",
  "excerpt": "one-sentence summary for search results (<= 160 chars)",
  "category": one of "General","Programming","AI","Career","Tutorials","Tech News","Web Dev","DevOps","Reviews",
  "content": "the full post in Markdown, 600-900 words, with an intro, 3-5 ## headings, short paragraphs, a bulleted list where useful, and a conclusion. Where natural, link to relevant free tools with markdown links such as [JSON Formatter](/tools/json-formatter), [Password Generator](/tools/password-generator), [Resume Builder](/career/resume-builder). Do not invent tool links that don't fit."
}`;

export async function POST(request) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ error: "no_key" });

  let topic = "";
  try { topic = (await request.json())?.topic || ""; } catch (e) {}
  if (!topic.trim()) return NextResponse.json({ error: "Please enter a topic." }, { status: 400 });

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
        max_tokens: 3000,
        system: SYSTEM,
        messages: [{ role: "user", content: `Write a professional blog post about: ${topic}` }],
      }),
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data?.error?.message || "AI request failed" });
    let text = (data?.content || []).map((b) => b.text || "").join("").trim();
    text = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    let post;
    try { post = JSON.parse(text); }
    catch (e) { return NextResponse.json({ error: "AI returned an unexpected format. Try again." }); }
    return NextResponse.json({ ok: true, post });
  } catch (e) {
    return NextResponse.json({ error: "Could not reach the AI service." });
  }
}
