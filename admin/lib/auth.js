import { cookies } from "next/headers";

export const SESSION_COOKIE = "admin_session";

export function sessionToken() {
  return process.env.ADMIN_TOKEN || "dev-token";
}

export function isAuthed() {
  const value = cookies().get(SESSION_COOKIE)?.value;
  return Boolean(value) && value === sessionToken();
}
