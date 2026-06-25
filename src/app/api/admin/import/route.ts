import { NextRequest, NextResponse } from "next/server";
import type { ImportDataType, ImportResult } from "@/lib/admin-types";

const VALID_TYPES: ImportDataType[] = ["swimmers", "race_results", "school_records", "coaches"];

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");
  const dataType = formData.get("dataType");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
  }
  if (typeof dataType !== "string" || !VALID_TYPES.includes(dataType as ImportDataType)) {
    return NextResponse.json({ error: "Unknown data type." }, { status: 400 });
  }

  // ------------------------------------------------------------------
  // TODO (finalize function) — this currently does NOT parse the file or
  // write anything to Neon. The page and the request/response shape are
  // final; only the body of this handler needs to change. Real version:
  //
  //   1. Branch on the file extension/MIME type:
  //        .csv        → parse with a CSV library (e.g. papaparse)
  //        .xlsx / .xls→ parse with SheetJS (xlsx package)
  //        .pdf        → extract tabular data (e.g. pdf-parse + a layout
  //                      heuristic, since PDFs rarely have clean columns)
  //   2. Map each parsed row's columns onto the matching Drizzle table in
  //      src/db/schema.ts (swimmers / race_results / school_records /
  //      coaches), validating types/required fields per row.
  //   3. Insert valid rows with `db.insert(table).values(rows)`, collecting
  //      per-row errors into `warnings` instead of failing the whole batch.
  //   4. Return real rowsReceived/rowsImported/rowsSkipped counts.
  // ------------------------------------------------------------------

  const fakeRowCount = Math.max(1, Math.round(file.size / 120));
  const result: ImportResult = {
    dataType: dataType as ImportDataType,
    fileName: file.name,
    rowsReceived: fakeRowCount,
    rowsImported: fakeRowCount,
    rowsSkipped: 0,
    warnings: ["Placeholder response — no data was actually written to the database yet."],
    importedAt: new Date().toISOString(),
  };

  return NextResponse.json(result);
}
