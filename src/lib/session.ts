import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

// ---------------------------------------------------------------------------
// ADMIN SESSION
// Signed, stateless session token (HMAC over an expiry timestamp) stored in
// a cookie. Verified without a DB lookup, which is why isValidSessionToken
// can run inside middleware. Passcode is env-configured (ADMIN_PASSCODE) —
// see /api/admin/login.
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

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

/**
 * Creates a signed session token: `${expiryTimestamp}.${signature}`.
 * Stateless — no server-side session store needed.
 */
export async function createSessionToken(): Promise<string> {
  const expires = Date.now() + ADMIN_SESSION_MAX_AGE * 1000;
  const payload = String(expires);
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

/**
 * Verifies a session token's signature and expiry.
 */
export async function isValidSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);

  // Constant-time comparison to avoid timing attacks.
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
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
// viewing the public site (see spec: /home and other public pages redirect
// to / without it). No signed token needed since middleware doesn't guard
// parent routes today — plain cookie is enough. If parent-gated pages need
// middleware protection later, promote this to a signed token the same way
// admin's works above.
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
// Used by pages/components (Navbar, /home) that just need "is anyone signed
// in" and "what role" without caring which system backs it.
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
