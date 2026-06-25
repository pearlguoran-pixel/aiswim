// Shared types for the admin backend: data import and the relay analyzer.
// Add alongside the existing src/lib/types.ts (kept separate so it's obvious
// which types belong to the new admin features vs. the public site).

export type ImportDataType = "swimmers" | "race_results" | "school_records" | "coaches";

export interface ImportResult {
  dataType: ImportDataType;
  fileName: string;
  rowsReceived: number;
  rowsImported: number;
  rowsSkipped: number;
  warnings: string[];
  importedAt: string; // ISO timestamp
}

export type RelayEventKey = "200_medley_relay" | "200_free_relay" | "400_free_relay";

export type Stroke = "free" | "back" | "breast" | "fly";

export interface RelayCandidate {
  id: string;
  name: string;
  gender: "M" | "F";
  strokes: Stroke[];
  bestTimesSeconds: Partial<Record<Stroke, number>>;
}

export interface RelayLeg {
  order: number;
  stroke: Stroke;
  swimmerId: string;
  swimmerName: string;
  splitSeconds: number;
}

export interface RelayLineupResult {
  event: RelayEventKey;
  legs: RelayLeg[];
  projectedTotalSeconds: number;
  reasoning: string;
  generatedAt: string; // ISO timestamp
}
