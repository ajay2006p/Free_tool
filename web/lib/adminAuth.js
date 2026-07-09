import { cookies } from "next/headers";

// Admin panel auth — a single shared password (from ADMIN_PASSWORD) sets a signed
// session cookie whose value equals ADMIN_TOKEN. This is SEPARATE from the public
// user accounts in lib/userAuth.js (cookie "dh_user"), so logging into the site
// as a visitor never grants admin access, and vice-versa.

export const SESSION_COOKIE = "admin_session";

export function sessionToken() {
  return process.env.ADMIN_TOKEN || "dev-token";
}

export function isAuthed() {
  const value = cookies().get(SESSION_COOKIE)?.value;
  return Boolean(value) && value === sessionToken();
}
