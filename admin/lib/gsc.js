/* ============================================================================
   Google Search Console client.

   Deliberately dependency-free. The official `googleapis` package pulls in a
   very large tree for what is, here, one API call — so this signs a service
   account JWT with node:crypto, exchanges it for an access token, and calls the
   Search Analytics endpoint directly.

   Setup (one time, all free):
     1. Google Cloud console -> create a project -> enable "Google Search
        Console API".
     2. Create a Service Account, then create a JSON key for it.
     3. In Search Console -> Settings -> Users and permissions, add the service
        account's client_email as a user with Full or Restricted access. This
        step is the one people miss: the credential is valid but sees nothing
        until the property explicitly grants it access.
     4. Put the JSON key in the admin app's env as GSC_SERVICE_ACCOUNT_JSON
        (the whole JSON object on one line), and set GSC_SITE_URL.

   GSC_SITE_URL must match the property exactly as Search Console lists it:
     - Domain property:  sc-domain:freetoolss.online
     - URL prefix:       https://www.freetoolss.online/   (trailing slash)
   These are different properties with different data. A mismatch returns 403,
   not an empty result, which is why the error is surfaced verbatim.
   ========================================================================== */

import crypto from "crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Parsed service-account credentials, or null when not configured. */
export function credentials() {
  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (!raw || !raw.trim()) return null;
  try {
    const json = JSON.parse(raw);
    if (!json.client_email || !json.private_key) return null;
    // Env vars frequently carry the key with literal \n rather than newlines.
    json.private_key = String(json.private_key).replace(/\\n/g, "\n");
    return json;
  } catch (e) {
    return null;
  }
}

export function siteUrl() {
  return process.env.GSC_SITE_URL || "";
}

/** True when both a credential and a target property are present. */
export function isConfigured() {
  return Boolean(credentials() && siteUrl());
}

/* Exchange a self-signed JWT for an access token. Tokens last an hour; the
   module caches one rather than re-signing on every request. */
let cachedToken = null;
let cachedExpiry = 0;

async function accessToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && now < cachedExpiry - 60) return cachedToken;

  const creds = credentials();
  if (!creds) throw new Error("GSC_SERVICE_ACCOUNT_JSON is not set or is not valid JSON.");

  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({
      iss: creds.client_email,
      scope: SCOPE,
      aud: TOKEN_URL,
      exp: now + 3600,
      iat: now,
    })
  );
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  let signature;
  try {
    signature = base64url(signer.sign(creds.private_key));
  } catch (e) {
    throw new Error("Could not sign with the service account private key — check the JSON key is complete and unmodified.");
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claim}.${signature}`,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Google rejected the credentials: ${data.error_description || data.error || res.status}`);
  }
  cachedToken = data.access_token;
  cachedExpiry = now + (Number(data.expires_in) || 3600);
  return cachedToken;
}

/* Search Console data lags by roughly two days, so a range ending today would
   report zeros for the most recent days and drag every average down. */
function isoDaysAgo(n) {
  const d = new Date(Date.now() - n * 86400000);
  return d.toISOString().slice(0, 10);
}

/**
 * Query the Search Analytics API.
 *
 * @param {object} opts
 * @param {number} opts.days      window length, ending 2 days ago
 * @param {number} opts.offset    shift the whole window back this many days
 *                                (used to build the previous period)
 * @param {string[]} opts.dimensions  e.g. ["query"] or ["query","page"]
 * @param {number} opts.rowLimit
 * @returns {Promise<Array<{keys:string[],clicks:number,impressions:number,ctr:number,position:number}>>}
 */
export async function searchAnalytics({ days = 28, offset = 0, dimensions = ["query"], rowLimit = 1000 } = {}) {
  const site = siteUrl();
  if (!site) throw new Error("GSC_SITE_URL is not set.");
  const token = await accessToken();

  const endDaysAgo = 2 + offset;
  const body = {
    startDate: isoDaysAgo(endDaysAgo + days),
    endDate: isoDaysAgo(endDaysAgo),
    dimensions,
    rowLimit,
    // Web only: image and video results have their own position semantics and
    // would distort an average meant to describe ordinary blue-link ranking.
    type: "web",
  };

  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || `HTTP ${res.status}`;
    if (res.status === 403) {
      throw new Error(
        `${msg} — most often the service account has not been added as a user on this Search Console property, or GSC_SITE_URL does not match the property exactly.`
      );
    }
    throw new Error(msg);
  }
  return data.rows || [];
}

/** Convenience: query rows keyed by the search term, lowercased for matching. */
export async function queryRows(opts) {
  const rows = await searchAnalytics({ ...opts, dimensions: ["query"] });
  const map = new Map();
  for (const r of rows) {
    map.set(String(r.keys[0]).toLowerCase(), {
      phrase: r.keys[0],
      clicks: r.clicks || 0,
      impressions: r.impressions || 0,
      ctr: r.ctr || 0,
      position: r.position || 0,
    });
  }
  return map;
}
