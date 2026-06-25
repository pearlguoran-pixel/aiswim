// Minimal signed-cookie session for the admin passcode login.
//
// This is intentionally simple — it exists so the login page works end to
// end *today*. The spec's outstanding-work list calls for NextAuth
// eventually; when that's wired up, this file can be deleted and replaced
// with NextAuth's session helpers without touching the page components
// (they only call getServerSession() / hit /api/admin/login).
//
// Uses the Web Crypto API (global `crypto`, not Node's `crypto` module) so
// this works in both the Node and Edge runtimes — middleware.ts runs on the
// Edge runtime by default, which doesn't have Node's `crypto`.

import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "eagleRaysAdminSession";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours, in seconds

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    // TODO: once this ships for real, throw here instead of falling back —
    // for now we don't want a missing env var to lock everyone out of a
    // freshly cloned project before they've set anything up.
    return "dev-only-insecure-secret-change-me";
  }
  return secret;
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return bufferToHex(signature);
}

export async function createSessionToken(): Promise<string> {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${await sign(issuedAt)}`;
}

export async function isValidSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;

  const expected = await sign(issuedAt);
  if (signature !== expected) return false;

  const ageMs = Date.now() - Number(issuedAt);
  return ageMs >= 0 && ageMs < ADMIN_SESSION_MAX_AGE * 1000;
}

/** For use in server components / route handlers (reads the cookie jar). */
export async function getServerSession(): Promise<boolean> {
  const store = cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  return isValidSessionToken(token);
}
