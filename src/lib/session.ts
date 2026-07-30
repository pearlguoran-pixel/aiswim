import { cookies } from "next/headers";

// ---------------------------------------------------------------------------
// ADMIN SESSION
// Signed, stateless session token (HMAC over an expiry timestamp) stored in
// a cookie. Verified without a DB lookup, which is why isValidSessionToken
// can run inside middleware (Edge Runtime). Passcode is env-configured
// (ADMIN_PASSCODE) — see /api/admin/login.
//
// Uses Web Crypto (SubtleCrypto) rather than Node's `crypto` module because
// middleware.ts runs on the Edge Runtime, which doesn't support Node's
// crypto — Web Crypto works in both Node and Edge.
// ---------------------------------------------------------------------------

export const ADMIN_SESSION_COOKIE = "eaglerays_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

function getSecret(): string {
  const secret = process.env.SESSION_SECRET ?? process.env.ADMIN_PASSCODE;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET (or ADMIN_PASSCODE as a fallback) must be set to sign session tokens."
    );
  }
  return secret;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toHex(signature);
}

/**
 * Creates a signed session token: `${expiryTimestamp}.${signature}`.
 * Stateless — no server-side session store needed.
 */
export async function createSessionToken(): Promise<string> {
  const expires = Date.now() + ADMIN_SESSION_MAX_AGE * 1000;
  const payload = String(expires);
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

/**
 * Verifies a session token's signature and expiry.
 */
export async function isValidSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = await sign(payload);

  if (signature.length !== expected.length || signature !== expected) {
    return false;
  }

  const expires = Number(payload);
  if (!Number.isFinite(expires) || Date.now() > expires) {
    return false;
  }

  return true;
}

/**
 * Server-side check for admin auth, for use in Server Components (e.g.
 * Navbar) where reading the cookie directly is simplest.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  return isValidSessionToken(token);
}

// ---------------------------------------------------------------------------
// PARENT SESSION
// Parents only need a simple "did they enter the shared passcode" gate for
// viewing the public site. No signed token needed since it's just a shared
// family passcode, not sensitive — plain cookie is enough.
// ---------------------------------------------------------------------------

export const PARENT_SESSION_COOKIE = "eaglerays_parent_session";
const PARENT_SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days, in seconds
const PARENT_SESSION_VALUE = "ok";

export async function createParentSession(): Promise<void> {
  const store = await cookies();
  store.set(PARENT_SESSION_COOKIE, PARENT_SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: PARENT_SESSION_MAX_AGE,
  });
}

export async function isParentAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(PARENT_SESSION_COOKIE)?.value === PARENT_SESSION_VALUE;
}

// ---------------------------------------------------------------------------
// COMBINED HELPERS
// ---------------------------------------------------------------------------

export type Role = "parent" | "admin";

/**
 * Returns the signed-in role, checking admin first (admin implies full
 * access). Returns null if neither session is present/valid.
 */
export async function getServerSession(): Promise<Role | null> {
  if (await isAdminAuthenticated()) return "admin";
  if (await isParentAuthenticated()) return "parent";
  return null;
}
