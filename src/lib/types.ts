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
