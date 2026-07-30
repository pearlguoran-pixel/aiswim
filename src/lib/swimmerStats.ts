// src/lib/swimmerStats.ts
//
// Derives view data for the Swimmer Profile page (§3.B) from the flat
// RaceResult[] list. Two entry points:
//   - getPersonalBests(swimmerId, results)  -> best legal time per event
//   - getMostRecentMeet(swimmerId, results) -> all results from the swimmer's
//                                               single latest meet date
//
// "Legal" here means: not a no-show, not disqualified, and has a recorded
// time (a DQ can still carry a recorded time on the source report, but it's
// not eligible to be a personal best).

import type { RaceResult, SwimEvent, Stroke } from "./types";

export interface PersonalBest {
  event: SwimEvent;
  time: string;
  seconds: number;
  date: string;
  meetName: string;
}

/**
 * Converts a HyTek-style time string ("20.59S", "1:29.62S") to seconds.
 * Strips the trailing course-code letter(s) before parsing.
 */
function timeToSeconds(time: string): number {
  const clean = time.replace(/[A-Za-z]+$/, "");
  const parts = clean.split(":");
  if (parts.length === 2) {
    const [min, sec] = parts;
    return parseInt(min, 10) * 60 + parseFloat(sec);
  }
  return parseFloat(clean);
}

/**
 * Maps a canonical SwimEvent to its board grouping (Stroke). 400m+ freestyle
 * events group under "Distance" rather than "Freestyle" to mirror how the
 * Roster's old Specialty Stroke field categorized swimmers.
 */
export function eventToStroke(event: SwimEvent): Stroke {
  if (event.includes("Individual Medley")) return "IM";
  if (event.includes("Freestyle")) {
    const distance = parseInt(event, 10);
    return distance >= 400 ? "Distance" : "Freestyle";
  }
  if (event.includes("Backstroke")) return "Backstroke";
  if (event.includes("Breaststroke")) return "Breaststroke";
  if (event.includes("Butterfly")) return "Butterfly";
  return "Freestyle";
}

export function getPersonalBests(swimmerId: string, results: RaceResult[]): PersonalBest[] {
  const legal = results.filter(
    (r): r is RaceResult & { time: string } =>
      r.swimmerId === swimmerId && !r.noShow && !r.disqualified && r.time !== null
  );

  const bestByEvent = new Map<SwimEvent, PersonalBest>();

  for (const r of legal) {
    const seconds = timeToSeconds(r.time);
    const existing = bestByEvent.get(r.event);
    if (!existing || seconds < existing.seconds) {
      bestByEvent.set(r.event, {
        event: r.event,
        time: r.time,
        seconds,
        date: r.date,
        meetName: r.meetName,
      });
    }
  }

  return Array.from(bestByEvent.values());
}

function parseReportDate(d: string): number {
  const [m, day, y] = d.split("/").map(Number);
  return new Date(y, m - 1, day).getTime();
}

export function getMostRecentMeet(swimmerId: string, results: RaceResult[]): RaceResult[] {
  const swimmerResults = results.filter((r) => r.swimmerId === swimmerId);
  if (swimmerResults.length === 0) return [];

  const latestTs = Math.max(...swimmerResults.map((r) => parseReportDate(r.date)));

  return swimmerResults
    .filter((r) => parseReportDate(r.date) === latestTs)
    .sort((a, b) => (a.place ?? 99) - (b.place ?? 99));
}
