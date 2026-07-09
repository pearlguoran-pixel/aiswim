// src/lib/swimmerStats.ts
//
// Derives per-swimmer view data from the flat mock results list. Once
// race_results is wired to Neon (v6 §7.3), these same functions can be
// re-pointed at a DB query without changing the components that call them.

import type { RaceResult } from './types';

// Canonical individual events for the Personal Bests board, grouped by
// stroke in the order swimmers see them on the blocks. Relay events are
// intentionally excluded — this page is about individual performance.
export const EVENT_GROUPS: { stroke: string; events: string[] }[] = [
  { stroke: 'Freestyle', events: ['25 Freestyle', '50 Freestyle', '100 Freestyle', '200 Freestyle', '400 Freestyle', '800 Freestyle', '1500 Freestyle'] },
  { stroke: 'Butterfly', events: ['25 Butterfly', '50 Butterfly', '100 Butterfly', '200 Butterfly'] },
  { stroke: 'Backstroke', events: ['25 Backstroke', '50 Backstroke', '100 Backstroke', '200 Backstroke'] },
  { stroke: 'Breaststroke', events: ['25 Breaststroke', '50 Breaststroke', '100 Breaststroke', '200 Breaststroke'] },
  { stroke: 'Individual Medley', events: ['100 Individual Medley', '200 Individual Medley', '400 Individual Medley'] },
];

/** "1:29.62S" -> 89.62, "26.65S" -> 26.65. Strips a trailing course letter. */
function timeToSeconds(time: string): number {
  const clean = time.replace(/[A-Za-z]$/, '');
  if (clean.includes(':')) {
    const [min, sec] = clean.split(':');
    return parseInt(min, 10) * 60 + parseFloat(sec);
  }
  return parseFloat(clean);
}

/** Strips the trailing course-code letter for display, e.g. "26.65S" -> "26.65". */
export function formatTime(time: string): string {
  return time.replace(/[A-Za-z]$/, '');
}

/** Best legal time per event for a swimmer. NS/DQ/timeless rows are excluded. */
export function getPersonalBests(
  swimmerId: string,
  allResults: RaceResult[]
): Map<string, RaceResult> {
  const bests = new Map<string, RaceResult>();
  for (const r of allResults) {
    if (r.swimmerId !== swimmerId) continue;
    if (r.noShow || r.disqualified || !r.time) continue;
    const existing = bests.get(r.event);
    if (!existing || timeToSeconds(r.time) < timeToSeconds(existing.time as string)) {
      bests.set(r.event, r);
    }
  }
  return bests;
}

export interface RecentMeet {
  meetName: string;
  date: string;
  results: RaceResult[];
}

/** All of a swimmer's results from their single most recent meet date. */
export function getMostRecentMeet(
  swimmerId: string,
  allResults: RaceResult[]
): RecentMeet | null {
  const mine = allResults.filter((r) => r.swimmerId === swimmerId);
  if (mine.length === 0) return null;

  const mostRecentDate = mine.reduce((latest, r) => {
    const d = new Date(r.date);
    return d > latest ? d : latest;
  }, new Date(0));

  const results = mine.filter(
    (r) => new Date(r.date).getTime() === mostRecentDate.getTime()
  );

  return {
    meetName: results[0].meetName,
    date: results[0].date,
    results,
  };
}
