import { db } from "@/db";
import {
  meets as meetsTable,
  calendarEvents as calendarEventsTable,
} from "@/db/schema";
import type { MeetEvent, DateEvent, MeetStatus } from "@/lib/types";

// All event dates are displayed in Bangkok local time regardless of
// where the server actually runs (Vercel functions run on UTC).
const TIME_ZONE = "Asia/Bangkok";

function formatMonthDay(input: Date | string): { month: string; day: number } {
  const date = input instanceof Date ? input : new Date(input);
  const month = date.toLocaleDateString("en-US", {
    month: "short",
    timeZone: TIME_ZONE,
  });
  const day = Number(
    date.toLocaleDateString("en-US", { day: "numeric", timeZone: TIME_ZONE })
  );
  return { month, day };
}

// Normalizes any date/timestamp value to a Bangkok-midnight Date,
// so "past vs. upcoming" comparisons aren't thrown off by time-of-day.
function toComparableDate(input: Date | string): Date {
  const date = input instanceof Date ? input : new Date(input);
  return new Date(date.toLocaleDateString("en-US", { timeZone: TIME_ZONE }));
}

interface CombinedMeetRow {
  id: string;
  date: Date;
  name: string;
  location: string | null;
  type: MeetEvent["type"];
  isChampionship: boolean;
}

export async function getHomePageData(): Promise<{
  meets: MeetEvent[];
  dates: DateEvent[];
}> {
  const [meetRows, eventRows] = await Promise.all([
    db.select().from(meetsTable),
    db.select().from(calendarEventsTable),
  ]);

  const today = toComparableDate(new Date());

  // ── Left column: actual meets + Tryout/Time Trial calendar events ──
  const combined: CombinedMeetRow[] = [];

  for (const m of meetRows) {
    combined.push({
      id: m.id,
      date: toComparableDate(m.meetDate),
      name: m.name,
      location: m.location,
      type: m.isChampionship ? "championship" : "meet",
      isChampionship: !!m.isChampionship,
    });
  }

  for (const e of eventRows) {
    const type = (e.eventType ?? "").toLowerCase();
    if (type === "tryout") {
      combined.push({
        id: e.id,
        date: toComparableDate(e.eventDate),
        name: e.title,
        location: e.location,
        type: "tryout",
        isChampionship: false,
      });
    } else if (type === "time trial") {
      combined.push({
        id: e.id,
        date: toComparableDate(e.eventDate),
        name: e.title,
        location: e.location,
        type: "trial",
        isChampionship: false,
      });
    }
  }

  combined.sort((a, b) => a.date.getTime() - b.date.getTime());

  let nextAssigned = false;
  const meets: MeetEvent[] = combined.map((item) => {
    let status: MeetStatus;
    if (item.date.getTime() < today.getTime()) {
      status = "past";
    } else if (!nextAssigned) {
      status = "next";
      nextAssigned = true;
    } else {
      status = "upcoming";
    }

    const { month, day } = formatMonthDay(item.date);
    return {
      id: item.id,
      month,
      day,
      name: item.name,
      location: item.location ?? "TBD",
      status,
      type: item.type,
      isChampionship: item.isChampionship,
    };
  });

  // ── Right column: everything else (Party / Payment / Ceremony / Admin) ──
  const dateTypeMap: Record<string, DateEvent["type"]> = {
    party: "party",
    payment: "payment",
    ceremony: "ceremony",
    admin: "admin",
    other: "admin",
  };

  const dates: DateEvent[] = eventRows
    .filter((e) => {
      const type = (e.eventType ?? "").toLowerCase();
      return type !== "tryout" && type !== "time trial" && type !== "meet";
    })
    .sort(
      (a, b) =>
        toComparableDate(a.eventDate).getTime() -
        toComparableDate(b.eventDate).getTime()
    )
    .map((e) => {
      const { month, day } = formatMonthDay(e.eventDate);
      const type = (e.eventType ?? "other").toLowerCase();
      return {
        id: e.id,
        month,
        day,
        name: e.title,
        detail: [e.location, e.notes].filter(Boolean).join(" · ") || "Details TBA",
        type: dateTypeMap[type] ?? "admin",
      };
    });

  return { meets, dates };
}
