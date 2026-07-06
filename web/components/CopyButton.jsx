"use client";

import { useState } from "react";

export default function CopyButton({ value, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(String(value ?? ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {}
  }
  return (
    <button type="button" className="copy-btn" onClick={copy}>
      {copied ? "✓ Copied" : label}
    </button>
  );
}
