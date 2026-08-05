import { cookies } from "next/headers";

// Admin panel auth — a single shared password (from ADMIN_PASSWORD) sets a signed
// session cookie whose value equals ADMIN_TOKEN. The public site has no accounts
// of its own; this cookie is the only login anywhere on the domain.

export const SESSION_COOKIE = "admin_session";

export function sessionToken() {
  return process.env.ADMIN_TOKEN || "dev-token";
}

export function isAuthed() {
  const value = cookies().get(SESSION_COOKIE)?.value;
  return Boolean(value) && value === sessionToken();
}
