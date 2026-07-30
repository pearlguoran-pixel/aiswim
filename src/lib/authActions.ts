"use server";

import { cookies } from "next/headers";
import { checkPasscode, SESSION_COOKIE_NAME, type Role } from "@/lib/session";

export interface LoginActionResult {
  success: boolean;
  error?: string;
}

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export async function loginWithPasscode(
  role: Role,
  passcode: string
): Promise<LoginActionResult> {
  if (!passcode.trim()) {
    return { success: false, error: "Enter the passcode." };
  }

  if (!checkPasscode(role, passcode)) {
    return { success: false, error: "Incorrect passcode. Try again." };
  }

  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, role, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return { success: true };
}
