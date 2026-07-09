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

export interface RecordEntry {
  id: string;
  eventName: string;
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
  id: string; // slug, e.g. "techid-tongviseskul" — used in /swimmers/[id]
  firstName?: string;
  lastName?: string;
  name?: string;
  gender: Gender;
  age?: number;
  gradYear: number | null; // null for swimmers not yet in a grad-year-tracked grade
  section: Section;
  specialtyStroke?: Stroke;
  isAlumni?: boolean;
}

export interface CoachProfile {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  qualifications: string;
  bio: string;
}

export interface RaceResult {
  swimmerId: string;          // matches SwimmerProfile.id
  swimmerName: string;
  event: string;              // e.g. "50 Freestyle", "200 Individual Medley" — matches SwimEvent
  time: string | null;        // null when noShow or disqualified with no time recorded
  noShow: boolean;
  disqualified: boolean;
  exhibition: boolean;
  place: number | null;
  personalBestDiff: number | null;
  date: string;               // "M/D/YYYY" as printed on the source report
  meetName: string;
}
