// Real PDF generation with pdf-lib (dynamic import so it isn't in every bundle).
// Produces a downloadable file that works on mobile — no print-popup (which
// mobile browsers block).

// Helvetica (WinAnsi) can't encode every char; keep text to Latin-1 and swap
// smart punctuation so pdf-lib never throws.
function safe(s) {
  return String(s ?? "")
    .replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-").replace(/•/g, "-").replace(/…/g, "...")
    .replace(/[^\t\n\r\x20-\xFF]/g, "");
}

function wrap(text, font, size, maxW) {
  const out = [];
  for (const raw of safe(text).split("\n")) {
    if (!raw.trim()) { out.push(""); continue; }
    const words = raw.split(/\s+/);
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (font.widthOfTextAtSize(test, size) > maxW && line) { out.push(line); line = w; }
      else line = test;
    }
    if (line) out.push(line);
  }
  return out;
}

export function downloadBytes(bytes, name, type = "application/pdf") {
  const blob = new Blob([bytes], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.rel = "noopener";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/* ---------------- Resume PDF ---------------- */
export async function buildResumePdf(f) {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const W = 595.28, H = 841.89, margin = 50, maxW = W - margin * 2;
  const ink = rgb(0.1, 0.11, 0.15), gray = rgb(0.42, 0.45, 0.5), line = rgb(0.8, 0.82, 0.86);
  let page = doc.addPage([W, H]);
  let y = H - margin;
  const need = (h) => { if (y - h < margin) { page = doc.addPage([W, H]); y = H - margin; } };
  const write = (str, { fnt = font, size = 11, color = ink, gap = 4 } = {}) => {
    for (const ln of wrap(str, fnt, size, maxW)) { need(size + gap); if (ln) page.drawText(ln, { x: margin, y: y - size, size, font: fnt, color }); y -= size + gap; }
  };
  write(f.name || "Your Name", { fnt: bold, size: 24, gap: 6 });
  write([f.title, f.email, f.phone, f.location].filter(Boolean).join("   |   "), { size: 10, color: gray, gap: 12 });
  const section = (title, body) => {
    if (!body || !String(body).trim()) return;
    need(34); y -= 6;
    write(title.toUpperCase(), { fnt: bold, size: 12, color: ink, gap: 5 });
    need(8); page.drawLine({ start: { x: margin, y: y + 3 }, end: { x: margin + maxW, y: y + 3 }, thickness: 0.8, color: line }); y -= 9;
    write(body, { size: 11, gap: 4 });
    y -= 8;
  };
  section("Summary", f.summary);
  section("Skills", f.skills);
  section("Experience", f.experience);
  section("Education", f.education);
  return doc.save();
}

/* ---------------- Invoice PDF ---------------- */
export async function buildInvoicePdf(f, items, totals) {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const W = 595.28, H = 841.89, margin = 50;
  const ink = rgb(0.1, 0.11, 0.15), gray = rgb(0.42, 0.45, 0.5), line = rgb(0.8, 0.82, 0.86), accent = rgb(0.31, 0.27, 0.9);
  let page = doc.addPage([W, H]);
  let y = H - margin;
  const money = (n) => (Number(n) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const t = (str, x, opts = {}) => { const { fnt = font, size = 10, color = ink } = opts; page.drawText(safe(String(str)), { x, y: opts.y ?? y, size, font: fnt, color }); };
  const right = (str, xRight, opts = {}) => { const { fnt = font, size = 10 } = opts; const w = fnt.widthOfTextAtSize(safe(String(str)), size); t(str, xRight - w, opts); };

  t("INVOICE", margin, { fnt: bold, size: 26, color: accent }); y -= 20;
  t("#" + safe(f.number || ""), margin, { size: 11, color: gray }); y -= 26;
  // From / To
  const colR = W / 2 + 10;
  const startY = y;
  t("FROM", margin, { fnt: bold, size: 9, color: gray });
  t("BILL TO", colR, { fnt: bold, size: 9, color: gray });
  y -= 14;
  const fromLines = safe(f.from).split("\n"), toLines = safe(f.to).split("\n");
  const rows = Math.max(fromLines.length, toLines.length);
  for (let i = 0; i < rows; i++) { if (fromLines[i]) t(fromLines[i], margin, { size: 10 }); if (toLines[i]) t(toLines[i], colR, { size: 10 }); y -= 13; }
  y -= 16;
  // Table header
  const cQty = W - margin - 200, cRate = W - margin - 110, cAmt = W - margin;
  page.drawRectangle({ x: margin, y: y - 4, width: W - margin * 2, height: 20, color: rgb(0.95, 0.96, 0.99) });
  t("DESCRIPTION", margin + 6, { fnt: bold, size: 9, color: gray, y: y + 2 });
  right("QTY", cQty + 30, { fnt: bold, size: 9, color: gray, y: y + 2 });
  right("RATE", cRate + 40, { fnt: bold, size: 9, color: gray, y: y + 2 });
  right("AMOUNT", cAmt, { fnt: bold, size: 9, color: gray, y: y + 2 });
  y -= 22;
  for (const it of items) {
    if (y < margin + 90) { page = doc.addPage([W, H]); y = H - margin; }
    t(it.desc || "", margin + 6, { size: 10, y });
    right(String(it.qty), cQty + 30, { size: 10, y });
    right(money(it.rate), cRate + 40, { size: 10, y });
    right(money(it.qty * it.rate), cAmt, { size: 10, y });
    y -= 8; page.drawLine({ start: { x: margin, y }, end: { x: W - margin, y }, thickness: 0.5, color: line }); y -= 14;
  }
  y -= 6;
  const totRow = (label, val, opts = {}) => { right(label, cRate + 40, { fnt: opts.bold ? bold : font, size: opts.size || 10, color: opts.color || ink, y }); right(money(val), cAmt, { fnt: opts.bold ? bold : font, size: opts.size || 10, color: opts.color || ink, y }); y -= (opts.size || 10) + 6; };
  totRow("Subtotal", totals.sub);
  totRow(`Tax (${totals.taxRate}%)`, totals.taxAmt);
  y -= 2; page.drawLine({ start: { x: cRate, y: y + 6 }, end: { x: W - margin, y: y + 6 }, thickness: 0.8, color: line }); y -= 4;
  totRow("TOTAL", totals.total, { bold: true, size: 14, color: accent });
  return doc.save();
}

/* ---------------- Slide deck PDF ----------------
   16:9 landscape pages (720 × 405 pt) so the export matches how the deck is
   presented on screen and projects without letterboxing. */
export async function buildSlidesPdf(slides, theme) {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const hex = (h) => {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(h || "").trim());
    if (!m) return rgb(0, 0, 0);
    const n = parseInt(m[1], 16);
    return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
  };

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const W = 720, H = 405, margin = 54;
  const maxW = W - margin * 2;
  const bg = hex(theme.pdfBg);
  const ink = hex(theme.pdfText);
  const accent = hex(theme.pdfAccent);

  slides.forEach((slide, index) => {
    const page = doc.addPage([W, H]);
    page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: bg });
    // Accent bar down the left edge — cheap way to make every slide feel designed.
    page.drawRectangle({ x: 0, y: 0, width: 6, height: H, color: accent });

    const isTitle = slide.layout === "title";
    let y = isTitle ? H / 2 + 30 : H - margin;

    const titleSize = isTitle ? 34 : 26;
    const titleLines = wrap(slide.title || "", bold, titleSize, maxW);
    for (const line of titleLines) {
      page.drawText(line, { x: margin, y: y - titleSize, size: titleSize, font: bold, color: ink });
      y -= titleSize + 8;
    }

    if (!isTitle) {
      y -= 6;
      page.drawLine({ start: { x: margin, y }, end: { x: margin + 70, y }, thickness: 3, color: accent });
      y -= 22;
    }

    const bulletSize = isTitle ? 15 : 16;
    for (const bulletRaw of slide.bullets || []) {
      const lines = wrap(bulletRaw, font, bulletSize, maxW - (isTitle ? 0 : 20));
      lines.forEach((line, li) => {
        if (y - bulletSize < margin - 20) return;
        const x = margin + (isTitle ? 0 : 20);
        if (li === 0 && !isTitle) {
          page.drawText("-", { x: margin + 4, y: y - bulletSize, size: bulletSize, font, color: accent });
        }
        page.drawText(line, { x, y: y - bulletSize, size: bulletSize, font, color: ink });
        y -= bulletSize + 6;
      });
      y -= 5;
    }

    // Slide number, skipped on the title slide.
    if (!isTitle) {
      const label = String(index + 1);
      const w = font.widthOfTextAtSize(label, 10);
      page.drawText(label, { x: W - margin - w, y: 24, size: 10, font, color: accent });
    }
  });

  return doc.save();
}

/* ---------------- Certificate PDF ----------------
   A4 landscape with a double border — the layout people expect from a printed
   certificate, and it survives being framed or scanned. */
export async function buildCertificatePdf(f, style) {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const hex = (h) => {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(h || "").trim());
    if (!m) return rgb(0, 0, 0);
    const n = parseInt(m[1], 16);
    return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
  };

  const doc = await PDFDocument.create();
  const serif = await doc.embedFont(StandardFonts.TimesRoman);
  const serifBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const italic = await doc.embedFont(StandardFonts.TimesRomanItalic);

  const W = 841.89, H = 595.28;
  const bg = hex(style.pdfBg);
  const ink = hex(style.pdfText);
  const accent = hex(style.pdfAccent);

  // One page per recipient, so a whole class or cohort is a single download
  // instead of thirty separate files.
  const recipients = (Array.isArray(f.recipients) && f.recipients.length ? f.recipients : [f.recipient])
    .map((r) => safe(r).trim())
    .filter(Boolean);
  if (!recipients.length) recipients.push("Recipient Name");

  recipients.forEach((recipient, idx) => {
    const page = doc.addPage([W, H]);

    page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: bg });
    page.drawRectangle({ x: 26, y: 26, width: W - 52, height: H - 52, borderColor: accent, borderWidth: 3 });
    page.drawRectangle({ x: 36, y: 36, width: W - 72, height: H - 72, borderColor: accent, borderWidth: 1 });

    const centre = (text, y, { fnt = serif, size = 14, color = ink } = {}) => {
      const s = safe(text);
      if (!s) return;
      const w = fnt.widthOfTextAtSize(s, size);
      page.drawText(s, { x: (W - w) / 2, y, size, font: fnt, color });
    };

    centre((f.heading || "Certificate of Achievement").toUpperCase(), H - 118, { fnt: serifBold, size: 30, color: accent });
    centre(f.subheading || "This certificate is proudly presented to", H - 162, { fnt: italic, size: 14 });

    // The recipient's name is the point of the page — size it down only as needed.
    let nameSize = 44;
    while (nameSize > 18 && serifBold.widthOfTextAtSize(recipient, nameSize) > W - 200) nameSize -= 2;
    centre(recipient, H - 232, { fnt: serifBold, size: nameSize });
    page.drawLine({ start: { x: 150, y: H - 250 }, end: { x: W - 150, y: H - 250 }, thickness: 1, color: accent });

    const reasonLines = wrap(f.reason || "", serif, 14, W - 240).slice(0, 3);
    let ry = H - 286;
    for (const line of reasonLines) {
      centre(line, ry, { size: 14 });
      ry -= 20;
    }

    // Signature / date blocks along the bottom.
    const baseY = 96;
    const blocks = [
      { label: f.leftLabel || "Date", value: f.date || "" },
      { label: f.rightLabel || "Signature", value: f.signer || "" },
    ];
    const colW = (W - 200) / 2;
    blocks.forEach((b, i) => {
      const cx = 100 + colW * i + colW / 2;
      const val = safe(b.value);
      if (val) {
        const fnt = i === 1 ? italic : serif;
        const size = i === 1 ? 18 : 13;
        const w = fnt.widthOfTextAtSize(val, size);
        page.drawText(val, { x: cx - w / 2, y: baseY + 10, size, font: fnt, color: ink });
      }
      page.drawLine({ start: { x: cx - colW / 2 + 20, y: baseY }, end: { x: cx + colW / 2 - 20, y: baseY }, thickness: 1, color: accent });
      const label = safe(b.label).toUpperCase();
      const lw = serif.widthOfTextAtSize(label, 9);
      page.drawText(label, { x: cx - lw / 2, y: baseY - 16, size: 9, font: serif, color: accent });
    });

    if (f.org) centre(safe(f.org), H - 84, { fnt: serifBold, size: 12, color: accent });
    if (f.serial) {
      // Batch runs get a per-page suffix so no two certificates share an ID.
      const id = recipients.length > 1 ? `${f.serial}-${String(idx + 1).padStart(3, "0")}` : f.serial;
      page.drawText(safe(`Certificate ID: ${id}`), { x: 46, y: 46, size: 8, font: serif, color: accent });
    }
  });

  return doc.save();
}
