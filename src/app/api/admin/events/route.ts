// src/app/api/admin/events/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db"; // adjust to your actual db import path
import { events, EVENT_CATEGORIES } from "@/db/schema/events";
import { desc } from "drizzle-orm";
import { getServerSession } from "@/lib/session";

// GET /api/admin/events — returns all events sorted by date ascending
// Accessible by both parent and admin sessions (used by /home)
export async function GET() {
  try {
    const rows = await db
      .select()
      .from(events)
      .orderBy(desc(events.date));

    return NextResponse.json({ events: rows });
  } catch (err) {
    console.error("GET /api/admin/events error:", err);
    return NextResponse.json(
      { error: "Failed to fetch events." },
      { status: 500 }
    );
  }
}

// POST /api/admin/events — creates a new event
// Admin-only
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (session !== "admin") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { title, description, date, category } = body as Record<
    string,
    string
  >;

  // Validation
  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  if (!description?.trim()) {
    return NextResponse.json(
      { error: "Description is required." },
      { status: 400 }
    );
  }
  if (!date) {
    return NextResponse.json({ error: "Date is required." }, { status: 400 });
  }
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return NextResponse.json({ error: "Invalid date." }, { status: 400 });
  }
  if (!EVENT_CATEGORIES.includes(category as (typeof EVENT_CATEGORIES)[number])) {
    return NextResponse.json(
      { error: "Invalid category." },
      { status: 400 }
    );
  }

  try {
    const [inserted] = await db
      .insert(events)
      .values({
        title: title.trim(),
        description: description.trim(),
        date: parsedDate,
        category,
      })
      .returning();

    return NextResponse.json({ event: inserted }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/events error:", err);
    return NextResponse.json(
      { error: "Failed to save event." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/events?id=123 — removes an event
// Admin-only
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
    const { eq } = await import("drizzle-orm");
    await db.delete(events).where(eq(events.id, id));
    return NextResponse.json({ deleted: id });
  } catch (err) {
    console.error("DELETE /api/admin/events error:", err);
    return NextResponse.json(
      { error: "Failed to delete event." },
      { status: 500 }
    );
  }
}
