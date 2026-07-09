import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const posts = [
  {
    title: "Welcome to your all-in-one platform",
    slug: "welcome-to-your-platform",
    category: "General",
    author: "Admin",
    featured: true,
    excerpt: "A quick tour of the platform, the free tools, and how to earn with ads.",
    coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80",
    content: `## Welcome 👋\n\nThis is your **all-in-one platform** — 150+ free online tools — formatters, converters, calculators, PDF & image tools, SEO helpers and productivity apps, all in one place.\n\n## Free tools that work right now\n\nTry the [JSON Formatter](/tools/json-formatter), [Base64 encoder](/tools/base64-encoder), [JWT decoder](/tools/jwt-decoder), [password generator](/tools/password-generator) and more — no signup, all in your browser.\n\n## Managed from a separate admin panel\n\nThis website is a standalone build. Blog posts are written in a **separate admin panel** that connects to the same database, so the site stays fast and clean.\n\n## New tools every week\n\nExplore the [full tool directory](/services) and bookmark your favourites — new tools are added regularly. 🚀`,
  },
  {
    title: "10 free developer tools you'll actually use",
    slug: "10-free-developer-tools",
    category: "Programming",
    author: "Admin",
    excerpt: "JSON formatters, JWT decoders, hash and regex testers — the small tools that save big time.",
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80",
    content: `## The little tools that save hours\n\nEvery developer keeps a handful of tiny utilities within reach. Good news: they're all built into this platform, free.\n\n1. [JSON Formatter & Validator](/tools/json-formatter)\n2. [Base64 Encoder / Decoder](/tools/base64-encoder)\n3. [JWT Decoder](/tools/jwt-decoder)\n4. [Hash Generator](/tools/hash-generator)\n5. [UUID Generator](/tools/uuid-generator)\n6. [Regex Tester](/tools/regex-tester)\n7. [Password Generator](/tools/password-generator)\n8. [Case Converter](/tools/case-converter)\n9. [Color Converter](/tools/color-converter)\n10. [QR Code Generator](/tools/qr-code-generator)\n\n> All of them run in your browser — your data never leaves your device.`,
  },
  {
    title: "How to write a resume that beats the ATS",
    slug: "resume-that-beats-the-ats",
    category: "Career",
    author: "Admin",
    excerpt: "Applicant Tracking Systems filter most resumes before a human sees them. Here's how to get through.",
    coverImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=80",
    content: `## What is an ATS?\n\nAn **Applicant Tracking System** scans your resume before a recruiter opens it. If it can't read your resume, you're rejected automatically.\n\n## Five rules that work\n\n1. **Use a clean, single-column layout.**\n2. **Match keywords from the job post.**\n3. **Use standard section titles** (Experience, Education, Skills).\n4. **Save as PDF** unless asked otherwise.\n5. **Quantify results** — "Increased signups by 40%".\n\n> A free ATS resume scanner is coming to the [Career Hub](/career).`,
  },
];

async function main() {
  console.log("Seeding posts…");
  for (const p of posts) {
    await prisma.post.upsert({ where: { slug: p.slug }, update: {}, create: p });
    console.log("  ✓", p.title);
  }
  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
