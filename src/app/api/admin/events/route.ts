// src/app/api/admin/events/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // adjust if your db client lives elsewhere (e.g. @/lib/db)
import { sql } from "drizzle-orm";
import { getServerSession } from "@/lib/session";

const VALID_CATEGORIES = ["meet", "admin", "payment", "ceremony", "party"] as const;
type EventCategory = (typeof VALID_CATEGORIES)[number];

// Ensure the events table exists — runs on every cold start, no-op if already there.
// This avoids needing `drizzle-kit push` as a manual deploy step.
async function ensureTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS events (
      id          SERIAL PRIMARY KEY,
      title       VARCHAR(200)  NOT NULL,
      description TEXT          NOT NULL,
      date        TIMESTAMPTZ   NOT NULL,
      category    VARCHAR(50)   NOT NULL,
      created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    )
  `);
}

// GET /api/admin/events — returns all events sorted by date ascending
export async function GET() {
  try {
    await ensureTable();
    const rows = await db.execute(sql`
      SELECT id, title, description, date, category, created_at
      FROM events
      ORDER BY date ASC
    `);
    return NextResponse.json({ events: rows.rows ?? rows });
  } catch (err) {
    console.error("GET /api/admin/events error:", err);
    return NextResponse.json({ error: "Failed to fetch events." }, { status: 500 });
  }
}

// POST /api/admin/events — creates a new event (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (session !== "admin") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { title, description, date, category } = body;

  if (!title?.trim())       return NextResponse.json({ error: "Title is required." },       { status: 400 });
  if (!description?.trim()) return NextResponse.json({ error: "Description is required." }, { status: 400 });
  if (!date)                return NextResponse.json({ error: "Date is required." },         { status: 400 });

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return NextResponse.json({ error: "Invalid date." }, { status: 400 });
  }
  if (!VALID_CATEGORIES.includes(category as EventCategory)) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }

  try {
    await ensureTable();
    const result = await db.execute(sql`
      INSERT INTO events (title, description, date, category)
      VALUES (${title.trim()}, ${description.trim()}, ${parsedDate.toISOString()}, ${category})
      RETURNING id, title, description, date, category, created_at
    `);
    const inserted = (result.rows ?? result)[0];
    return NextResponse.json({ event: inserted }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/events error:", err);
    return NextResponse.json({ error: "Failed to save event." }, { status: 500 });
  }
}

// DELETE /api/admin/events?id=123 — removes an event (admin only)
export async function DELETE(req: NextRequest) {
  const session = await getServerSession();
  if (session !== "admin") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id") ?? "", 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  try {
    await ensureTable();
    await db.execute(sql`DELETE FROM events WHERE id = ${id}`);
    return NextResponse.json({ deleted: id });
  } catch (err) {
    console.error("DELETE /api/admin/events error:", err);
    return NextResponse.json({ error: "Failed to delete event." }, { status: 500 });
  }
}
