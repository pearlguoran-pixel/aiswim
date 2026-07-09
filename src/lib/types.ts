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
  id: string;
  firstName: string;
  lastName: string;
  name?: string;
  gender: Gender;
  age?: number;
  gradYear: number | null;
  section: Section;
  specialtyStroke?: Stroke;
  isAlumni?: boolean;
}

export interface RaceResult {
  swimmerId: string;
  swimmerName: string;
  event: string;
  time: string | null;
  noShow: boolean;
  disqualified: boolean;
  exhibition: boolean;
  place: number | null;
  personalBestDiff: number | null;
  date: string;
  meetName: string;
}

export interface CoachProfile {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  qualifications: string;
  bio: string;
}
