// src/db/schema/events.ts
// Add this file alongside your existing Drizzle schema files.
// Run `npx drizzle-kit push` (or generate a migration) after adding.

import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const EVENT_CATEGORIES = [
  "meet",
  "admin",
  "payment",
  "ceremony",
  "party",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
