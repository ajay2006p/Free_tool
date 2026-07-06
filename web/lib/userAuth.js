import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./db";

// Public user accounts using only Node's built-in crypto (no bcrypt dependency).
// Passwords are scrypt-hashed; sessions are stateless signed cookies (HMAC).

const SECRET = process.env.USER_SESSION_SECRET || "dev-user-secret-change-me-please";
export const USER_COOKIE = "dh_user";

export function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(pw), salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(pw, stored) {
  try {
    const [salt, hash] = String(stored).split(":");
    if (!salt || !hash) return false;
    const h = crypto.scryptSync(String(pw), salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(h, "hex"), Buffer.from(hash, "hex"));
  } catch (e) { return false; }
}

export function makeToken(userId) {
  const exp = Date.now() + 30 * 86400000; // 30 days
  const payload = `${userId}.${exp}`;
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyToken(token) {
  if (!token) return null;
  const parts = String(token).split(".");
  if (parts.length !== 3) return null;
  const [userId, exp, sig] = parts;
  const expected = crypto.createHmac("sha256", SECRET).update(`${userId}.${exp}`).digest("hex");
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  if (Date.now() > Number(exp)) return null;
  return userId; // MongoDB ObjectId (string)
}

export async function getUser() {
  const token = cookies().get(USER_COOKIE)?.value;
  const uid = verifyToken(token);
  if (!uid) return null;
  try {
    return await prisma.user.findUnique({ where: { id: uid }, select: { id: true, email: true, name: true, createdAt: true } });
  } catch (e) { return null; }
}

export function validEmail(e) {
  return typeof e === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}
