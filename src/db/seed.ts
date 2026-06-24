/**
 * Seed script — populates `meets` and `calendar_events` with starter data
 * matching what's currently hardcoded on the home page.
 *
 * Run with: npm run db:seed
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import { meets, calendarEvents } from "./schema";

async function seed() {
  console.log("Seeding meets...");

  await db.insert(meets).values([
    {
      name: "Opening Triangular Meet",
      location: "ISB Pool, Bangkok",
      meetDate: "2026-03-15",
      isChampionship: false,
    },
    {
      name: "NIST Dual Meet",
      location: "NIST Pool, Bangkok",
      meetDate: "2026-04-02",
      isChampionship: false,
    },
    {
      name: "Team Time Trials",
      location: "ISB Pool, All lanes",
      meetDate: "2026-04-27",
      isChampionship: false,
    },
    {
      name: "RIS Dual Meet",
      location: "RIS Aquatic Center, Bangkok",
      meetDate: "2026-05-18",
      isChampionship: false,
    },
    {
      name: "SEASAC Divisionals",
      location: "Bangkok Prep, Bangkok",
      meetDate: "2026-06-01",
      isChampionship: true,
    },
    {
      name: "NIST Dual Meet",
      location: "ISB Pool, Bangkok",
      meetDate: "2026-06-14",
      isChampionship: false,
    },
    {
      name: "BISAC Invitational",
      location: "Patana Sports Complex, Bangkok",
      meetDate: "2026-07-05",
      isChampionship: false,
    },
    {
      name: "Team Time Trials",
      location: "ISB Pool, All lanes",
      meetDate: "2026-07-12",
      isChampionship: false,
    },
    {
      name: "End-of-Season Championship",
      location: "TBD",
      meetDate: "2026-08-10",
      isChampionship: true,
    },
    {
      name: "Tryouts — Season 2026–27",
      location: "ISB Pool, Bangkok",
      meetDate: "2026-09-08",
      isChampionship: false,
    },
  ]);

  console.log("Seeding calendar events...");

  await db.insert(calendarEvents).values([
    {
      title: "Team Pasta Party",
      eventType: "Other",
      eventDate: new Date("2026-07-04T18:00:00+07:00"),
      location: "ISB Cafeteria",
      notes: "Pre-meet team bonding dinner.",
    },
    {
      title: "Dues Deadline — Term 1",
      eventType: "Payment",
      eventDate: new Date("2026-08-03T00:00:00+07:00"),
      location: "Via school admin portal",
      notes: null,
    },
    {
      title: "Team Photo Day",
      eventType: "Other",
      eventDate: new Date("2026-08-15T08:00:00+07:00"),
      location: "ISB Pool Deck",
      notes: null,
    },
    {
      title: "Season Awards Banquet",
      eventType: "Ceremony",
      eventDate: new Date("2026-08-22T18:30:00+07:00"),
      location: "ISB Main Hall",
      notes: null,
    },
    {
      title: "Dues Deadline — Term 2",
      eventType: "Payment",
      eventDate: new Date("2026-09-01T00:00:00+07:00"),
      location: "Via school admin portal",
      notes: null,
    },
    {
      title: "Welcome Back Pool Party",
      eventType: "Other",
      eventDate: new Date("2026-09-20T17:00:00+07:00"),
      location: "ISB Pool",
      notes: null,
    },
    {
      title: "Uniform Collection Deadline",
      eventType: "Other",
      eventDate: new Date("2026-10-10T00:00:00+07:00"),
      location: "Athletics Office",
      notes: null,
    },
    {
      title: "End-of-Year Celebration",
      eventType: "Ceremony",
      eventDate: new Date("2026-12-05T19:00:00+07:00"),
      location: "ISB Main Hall",
      notes: null,
    },
  ]);

  console.log("✅ Seed complete.");
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .then(() => process.exit(0));
