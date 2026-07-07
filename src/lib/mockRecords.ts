import type { RecordEntry } from "@/lib/types";

export const mockRecords: RecordEntry[] = [
  // Male — Open
  { id: "r1", eventName: "50 Freestyle", stroke: "Freestyle", gender: "Male", ageGroup: "Open", course: "SCM", formattedTime: "23.84", swimmerName: "Marcus Tan", dateSet: "Nov 2023", isAlumniRecord: true },
  { id: "r2", eventName: "100 Freestyle", stroke: "Freestyle", gender: "Male", ageGroup: "Open", course: "SCM", formattedTime: "51.02", swimmerName: "Marcus Tan", dateSet: "Nov 2023", isAlumniRecord: true },
  { id: "r3", eventName: "200 Freestyle", stroke: "Freestyle", gender: "Male", ageGroup: "Open", course: "SCM", formattedTime: "1:52.40", swimmerName: "Theo Bennett", dateSet: "Oct 2025" },
  { id: "r4", eventName: "400 Freestyle", stroke: "Distance", gender: "Male", ageGroup: "Open", course: "SCM", formattedTime: "4:05.10", swimmerName: "Theo Bennett", dateSet: "Sep 2025" },
  { id: "r5", eventName: "100 Backstroke", stroke: "Backstroke", gender: "Male", ageGroup: "Open", course: "SCM", formattedTime: "57.30", swimmerName: "Aiden Cross", dateSet: "Aug 2025" },
  { id: "r6", eventName: "100 Breaststroke", stroke: "Breaststroke", gender: "Male", ageGroup: "Open", course: "SCM", formattedTime: "1:02.88", swimmerName: "Ravi Kapoor", dateSet: "Oct 2024" },
  { id: "r7", eventName: "100 Butterfly", stroke: "Butterfly", gender: "Male", ageGroup: "Open", course: "SCM", formattedTime: "55.40", swimmerName: "Marcus Tan", dateSet: "Nov 2023", isAlumniRecord: true },
  { id: "r8", eventName: "200 Individual Medley", stroke: "IM", gender: "Male", ageGroup: "Open", course: "SCM", formattedTime: "2:05.60", swimmerName: "Theo Bennett", dateSet: "Oct 2025" },
  { id: "r21", eventName: "4x100 Freestyle Relay", stroke: "Freestyle", gender: "Male", ageGroup: "Open", course: "SCM", formattedTime: "3:32.10", swimmerName: "Carter / Bennett / Cross / Kapoor", dateSet: "Jan 2026" },
  { id: "r22", eventName: "4x100 Medley Relay", stroke: "IM", gender: "Male", ageGroup: "Open", course: "SCM", formattedTime: "3:48.75", swimmerName: "Cross / Kapoor / Tan / Bennett", dateSet: "Nov 2023", isAlumniRecord: true },

  // Male — 13-14 age group
  { id: "r9", eventName: "50 Freestyle", stroke: "Freestyle", gender: "Male", ageGroup: "13-14", course: "SCM", formattedTime: "25.10", swimmerName: "Eli Park", dateSet: "May 2026" },
  { id: "r10", eventName: "100 Freestyle", stroke: "Freestyle", gender: "Male", ageGroup: "13-14", course: "SCM", formattedTime: "55.80", swimmerName: "Eli Park", dateSet: "May 2026" },

  // Female — Open
  { id: "r11", eventName: "50 Freestyle", stroke: "Freestyle", gender: "Female", ageGroup: "Open", course: "SCM", formattedTime: "26.12", swimmerName: "Sophia Lindqvist", dateSet: "Oct 2025" },
  { id: "r12", eventName: "100 Freestyle", stroke: "Freestyle", gender: "Female", ageGroup: "Open", course: "SCM", formattedTime: "56.70", swimmerName: "Sophia Lindqvist", dateSet: "Oct 2025" },
  { id: "r13", eventName: "200 Freestyle", stroke: "Freestyle", gender: "Female", ageGroup: "Open", course: "SCM", formattedTime: "2:02.15", swimmerName: "Naomi Suzuki", dateSet: "Sep 2025" },
  { id: "r14", eventName: "400 Freestyle", stroke: "Distance", gender: "Female", ageGroup: "Open", course: "SCM", formattedTime: "4:22.60", swimmerName: "Naomi Suzuki", dateSet: "Sep 2025" },
  { id: "r15", eventName: "100 Backstroke", stroke: "Backstroke", gender: "Female", ageGroup: "Open", course: "SCM", formattedTime: "1:02.40", swimmerName: "Chanya Srisuk", dateSet: "Aug 2024" },
  { id: "r16", eventName: "100 Breaststroke", stroke: "Breaststroke", gender: "Female", ageGroup: "Open", course: "SCM", formattedTime: "1:09.95", swimmerName: "Lina Hoffmann", dateSet: "Nov 2022", isAlumniRecord: true },
  { id: "r17", eventName: "100 Butterfly", stroke: "Butterfly", gender: "Female", ageGroup: "Open", course: "SCM", formattedTime: "1:00.20", swimmerName: "Sophia Lindqvist", dateSet: "Oct 2025" },
  { id: "r18", eventName: "200 Individual Medley", stroke: "IM", gender: "Female", ageGroup: "Open", course: "SCM", formattedTime: "2:18.40", swimmerName: "Naomi Suzuki", dateSet: "Sep 2025" },
  { id: "r23", eventName: "4x100 Freestyle Relay", stroke: "Freestyle", gender: "Female", ageGroup: "Open", course: "SCM", formattedTime: "3:58.20", swimmerName: "Lindqvist / Suzuki / Srisuk / Tanaka", dateSet: "Jan 2026" },

  // Female — 11-12 age group
  { id: "r19", eventName: "50 Freestyle", stroke: "Freestyle", gender: "Female", ageGroup: "11-12", course: "SCM", formattedTime: "28.90", swimmerName: "Mia Tanaka", dateSet: "Apr 2026" },
  { id: "r20", eventName: "100 Freestyle", stroke: "Freestyle", gender: "Female", ageGroup: "11-12", course: "SCM", formattedTime: "1:03.20", swimmerName: "Mia Tanaka", dateSet: "Apr 2026" },
];
