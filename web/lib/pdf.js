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
