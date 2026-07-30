import { NextRequest, NextResponse } from "next/server";
import { createParentSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const passcode = typeof body?.passcode === "string" ? body.passcode : "";

  const expected = process.env.PARENT_PASSCODE ?? "icsswim";

  if (passcode !== expected) {
    return NextResponse.json({ error: "Incorrect passcode." }, { status: 401 });
  }

  await createParentSession();
  return NextResponse.json({ ok: true });
}
