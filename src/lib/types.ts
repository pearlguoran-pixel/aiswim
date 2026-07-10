export type MeetStatus = "past" | "next" | "upcoming";
export type MeetType = "meet" | "trial" | "tryout" | "championship";
export type DateType = "party" | "payment" | "ceremony" | "admin";

export interface MeetEvent {
  id: string;
  month: string;
  day: number;
  name: string;
  location: string;
  status: MeetStatus;
  type: MeetType;
  isChampionship?: boolean;
}

export interface DateEvent {
  id: string;
  month: string;
  day: number;
  name: string;
  detail: string;
  type: DateType;
}

// ──────────────────────────────────────────────
// Records / Roster / Coaches
// ──────────────────────────────────────────────

export type Section = "Elementary" | "Middle School" | "High School";
export type Stroke =
  | "Freestyle"
  | "Backstroke"
  | "Breaststroke"
  | "Butterfly"
  | "IM"
  | "Distance";
export type Gender = "Male" | "Female";
export type Course = "SCM" | "LCM" | "SCY";

// Full list of individually contested events. Introduced when the Records
// page moved from broad Stroke filtering to a per-event dropdown; the 25m
// sprint events were added for the youngest age-group swimmers (short
// splash-meet distances that don't appear in the older 23-event list).
// NOTE: originally named `Event`, renamed to `SwimEvent` after it was found
// to collide with the browser's built-in DOM `Event` type and break the build.
export type SwimEvent =
  | "25 Freestyle"
  | "50 Freestyle"
  | "100 Freestyle"
  | "200 Freestyle"
  | "400 Freestyle"
  | "800 Freestyle"
  | "1500 Freestyle"
  | "25 Butterfly"
  | "50 Butterfly"
  | "100 Butterfly"
  | "200 Butterfly"
  | "25 Backstroke"
  | "50 Backstroke"
  | "100 Backstroke"
  | "200 Backstroke"
  | "25 Breaststroke"
  | "50 Breaststroke"
  | "100 Breaststroke"
  | "200 Breaststroke"
  | "100 Individual Medley"
  | "200 Individual Medley"
  | "400 Individual Medley"
  | "4x50 Freestyle Relay"
  | "4x100 Freestyle Relay"
  | "4x200 Freestyle Relay"
  | "4x50 Medley Relay"
  | "4x100 Medley Relay";

export interface RecordEntry {
  id: string;
  eventName: SwimEvent; // was: string — narrowed when the Event filter shipped
  stroke: Stroke;
  gender: Gender;
  ageGroup: string;
  course: Course;
  formattedTime: string;
  swimmerName: string;
  dateSet: string;
  isAlumniRecord?: boolean;
}

export interface SwimmerProfile {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  age: number; // NEW — added when the Roster card's Specialty Stroke row was replaced with Age
  gradYear: number | null; // widened from `number` — younger sections (Elementary/Middle School) don't have a tracked HS grad year yet
  section: Section;
  isAlumni?: boolean;
  // `specialtyStroke` removed — Roster's Specialty Stroke filter was dropped
  // and replaced by the Gender filter; nothing reads this field anymore.
}

export interface CoachProfile {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  qualifications: string;
  bio: string;
}

// ──────────────────────────────────────────────
// Swimmer Profile page (individual results)
// ──────────────────────────────────────────────

export interface RaceResult {
  swimmerId: string; // matches SwimmerProfile.id
  swimmerName: string; // display convenience, e.g. `${firstName} ${lastName}`
  event: SwimEvent;
  time: string | null; // null when noShow or disqualified with no time recorded
  noShow: boolean;
  disqualified: boolean;
  exhibition: boolean;
  place: number | null;
  personalBestDiff: number | null;
  date: string; // "M/D/YYYY" as printed on the source report
  meetName: string;
}
