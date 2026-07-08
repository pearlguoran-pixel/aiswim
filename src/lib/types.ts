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

export type SwimEvent =
  | "50 Freestyle"
  | "100 Freestyle"
  | "200 Freestyle"
  | "400 Freestyle"
  | "800 Freestyle"
  | "1500 Freestyle"
  | "50 Butterfly"
  | "100 Butterfly"
  | "200 Butterfly"
  | "50 Backstroke"
  | "100 Backstroke"
  | "200 Backstroke"
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
  eventName: SwimEvent;
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
  age: number;
  gradYear: number;
  section: Section;
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
