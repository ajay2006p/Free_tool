/* ============================================================================
   Shared server helpers for the "hosted" tools — Survey Builder, Meeting
   Scheduler and Link-in-Bio site builder. All three do the same thing:
   the creator builds something, we store it under a short code, and anyone
   with the link can open it (and, for surveys/polls, submit an answer).

   Everything funnels through one HostedItem model, so the rules about size
   limits, codes and owner tokens live here rather than in each route.
   ========================================================================== */

import crypto from "crypto";

// Ambiguous characters (l, o, 0, 1) are left out so codes survive being read
// aloud or copied off a slide.
const ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";

export function makeCode(len = 7) {
  const b = crypto.randomBytes(len);
  return [...b].map((n) => ALPHABET[n % ALPHABET.length]).join("");
}

export function makeToken() {
  return crypto.randomBytes(16).toString("hex");
}

export const KINDS = {
  survey: { maxData: 100_000, accepts: true, maxResponses: 5000 },
  poll: { maxData: 40_000, accepts: true, maxResponses: 2000 },
  site: { maxData: 60_000, accepts: false, maxResponses: 0 },
};

export function isKind(k) {
  return Object.prototype.hasOwnProperty.call(KINDS, k);
}

/** Codes are user-supplied in the URL — never hand one straight to Prisma. */
export function isCode(c) {
  return typeof c === "string" && /^[a-z2-9]{4,16}$/.test(c);
}

export const MAX_RESPONSE_BYTES = 20_000;

/**
 * Owner tokens are compared in constant time so the endpoint can't be used as
 * an oracle to guess a token byte by byte.
 */
export function tokenMatches(stored, given) {
  const a = Buffer.from(String(stored || ""), "utf8");
  const b = Buffer.from(String(given || ""), "utf8");
  if (!a.length || a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Parse a stored JSON payload without ever throwing into a route handler. */
export function safeParse(json, fallback = null) {
  try {
    const v = JSON.parse(json);
    return v == null ? fallback : v;
  } catch (e) {
    return fallback;
  }
}

export function titleOf(raw, fallback) {
  const t = String(raw == null ? "" : raw).trim().replace(/\s+/g, " ");
  return (t || fallback).slice(0, 160);
}
