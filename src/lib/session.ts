import { cookies } from "next/headers";

// Simple role-based session for the public site. Parents and admins both
// authenticate with a shared passcode (not per-user accounts), so the
// "session" is just a role marker in a cookie — no user table.
//
// PASSCODES (change here if the team passcode changes):
//   parents: icsswim
//   admin:   12345
//
// NOTE: Intentionally lightweight to match the site's current mock-data
// stage (see spec v8 §9.5 — NextAuth swap still pending). When NextAuth is
// wired in, replace the cookie check below with a real session lookup but
// keep the same `Role` shape so Navbar and page guards don't need to change.

export type Role = "parent" | "admin";

const COOKIE_NAME = "eaglerays_session";

const PASSCODES: Record<Role, string> = {
  parent: "icsswim",
  admin: "12345",
};

export function checkPasscode(role: Role, passcode: string): boolean {
  return PASSCODES[role] === passcode;
}

/**
 * Reads the current session role from the request cookie.
 * Returns null if no valid session is present.
 */
export async function getServerSession(): Promise<Role | null> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (value === "parent" || value === "admin") {
    return value;
  }
  return null;
}

/**
 * Convenience boolean for call sites (like Navbar) that only care whether
 * *someone* is signed in, regardless of role.
 */
export async function isAuthenticated(): Promise<boolean> {
  return (await getServerSession()) !== null;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
