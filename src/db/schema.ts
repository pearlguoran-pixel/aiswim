import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  integer,
  numeric,
  boolean,
  date,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

// ──────────────────────────────────────────────
// Enums
// ──────────────────────────────────────────────

export const schoolSectionEnum = pgEnum("school_section", [
  "Elementary",
  "Middle School",
  "High School",
]);

export const strokeTypeEnum = pgEnum("stroke_type", [
  "Freestyle",
  "Backstroke",
  "Breaststroke",
  "Butterfly",
  "IM",
  "Distance",
]);

export const genderTypeEnum = pgEnum("gender_type", ["Male", "Female"]);

// SCM is the default/only course used today; LCM and SCY are reserved for later.
export const courseTypeEnum = pgEnum("course_type", ["SCM", "LCM", "SCY"]);

// ──────────────────────────────────────────────
// Swimmers
// ──────────────────────────────────────────────

export const swimmers = pgTable("swimmers", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  gender: genderTypeEnum("gender").notNull(),
  nationalityCode: varchar("nationality_code", { length: 3 }).default("THA"),
  gradYear: integer("grad_year").notNull(),
  section: schoolSectionEnum("section").notNull(),
  specialtyStroke: strokeTypeEnum("specialty_stroke"),
  heightCm: integer("height_cm"),
  weightKg: integer("weight_kg"),
  birthDate: date("birth_date"),
  isAlumni: boolean("is_alumni").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ──────────────────────────────────────────────
// Meets
// ──────────────────────────────────────────────

export const meets = pgTable("meets", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  location: varchar("location", { length: 100 }),
  meetDate: date("meet_date").notNull(),
  isChampionship: boolean("is_championship").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ──────────────────────────────────────────────
// Race Results (individual swims + relay splits)
// ──────────────────────────────────────────────

export const raceResults = pgTable("race_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  swimmerId: uuid("swimmer_id").references(() => swimmers.id, {
    onDelete: "cascade",
  }),
  meetId: uuid("meet_id").references(() => meets.id, { onDelete: "cascade" }),
  eventName: varchar("event_name", { length: 60 }).notNull(), // e.g. '100 SCM Free'
  distanceM: integer("distance_m"), // numeric distance in metres, e.g. 100
  stroke: strokeTypeEnum("stroke"),
  ageGroup: varchar("age_group", { length: 20 }), // free-text from import, e.g. '13-14', 'Open'
  gender: genderTypeEnum("gender"),
  course: courseTypeEnum("course").default("SCM"),
  raceTimeSeconds: numeric("race_time_seconds", { precision: 7, scale: 2 }).notNull(), // pure seconds for AI & math
  formattedTime: varchar("formatted_time", { length: 12 }).notNull(), // e.g. '1:02.15'
  isRelaySplit: boolean("is_relay_split").default(false),
  relayPosition: integer("relay_position"), // 1–4 if relay split
  createdAt: timestamp("created_at").defaultNow(),
});

// ──────────────────────────────────────────────
// School Records (materialised / manually curated)
// ──────────────────────────────────────────────

export const schoolRecords = pgTable("school_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventName: varchar("event_name", { length: 60 }).notNull(),
  gender: genderTypeEnum("gender").notNull(),
  ageGroup: varchar("age_group", { length: 20 }),
  course: courseTypeEnum("course").default("SCM"),
  recordTimeSec: numeric("record_time_sec", { precision: 7, scale: 2 }).notNull(),
  formattedTime: varchar("formatted_time", { length: 12 }).notNull(),
  swimmerId: uuid("swimmer_id").references(() => swimmers.id, {
    onDelete: "set null",
  }),
  swimmerNameOverride: varchar("swimmer_name_override", { length: 100 }), // for alumni whose account may not exist
  meetId: uuid("meet_id").references(() => meets.id, { onDelete: "set null" }),
  dateSet: date("date_set"),
  isAlumniRecord: boolean("is_alumni_record").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ──────────────────────────────────────────────
// Coaches
// ──────────────────────────────────────────────

export const coaches = pgTable("coaches", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  title: varchar("title", { length: 100 }),
  qualifications: text("qualifications"),
  bio: text("bio"),
  headshotUrl: varchar("headshot_url", { length: 255 }),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ──────────────────────────────────────────────
// Calendar Events (team milestones — tryouts, time trials, ceremonies, payments, etc.)
// ──────────────────────────────────────────────

export const calendarEvents = pgTable("calendar_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 150 }).notNull(),
  eventType: varchar("event_type", { length: 50 }), // 'Tryout' | 'Time Trial' | 'Ceremony' | 'Payment' | 'Meet' | 'Other'
  eventDate: timestamp("event_date").notNull(),
  location: varchar("location", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ──────────────────────────────────────────────
// Inferred TypeScript types (handy for components / API routes)
// ──────────────────────────────────────────────

export type Swimmer = typeof swimmers.$inferSelect;
export type NewSwimmer = typeof swimmers.$inferInsert;

export type Meet = typeof meets.$inferSelect;
export type NewMeet = typeof meets.$inferInsert;

export type RaceResult = typeof raceResults.$inferSelect;
export type NewRaceResult = typeof raceResults.$inferInsert;

export type SchoolRecord = typeof schoolRecords.$inferSelect;
export type NewSchoolRecord = typeof schoolRecords.$inferInsert;

export type Coach = typeof coaches.$inferSelect;
export type NewCoach = typeof coaches.$inferInsert;

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type NewCalendarEvent = typeof calendarEvents.$inferInsert;
