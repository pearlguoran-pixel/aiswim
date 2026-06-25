"use client";

import { useMemo, useState } from "react";
import type { RecordEntry, Gender, Stroke } from "@/lib/types";
import styles from "./RecordsTable.module.css";

interface RecordsTableProps {
  records: RecordEntry[];
}

const GENDER_OPTIONS: Array<Gender | "All"> = ["All", "Male", "Female"];
const STROKE_OPTIONS: Array<Stroke | "All"> = [
  "All",
  "Freestyle",
  "Backstroke",
  "Breaststroke",
  "Butterfly",
  "IM",
  "Distance",
];

export default function RecordsTable({ records }: RecordsTableProps) {
  const [gender, setGender] = useState<Gender | "All">("All");
  const [stroke, setStroke] = useState<Stroke | "All">("All");
  const [ageGroup, setAgeGroup] = useState<string>("All");

  const ageGroupOptions = useMemo(() => {
    const unique = Array.from(new Set(records.map((r) => r.ageGroup)));
    return ["All", ...unique];
  }, [records]);

  const filtered = useMemo(() => {
    return records
      .filter((r) => gender === "All" || r.gender === gender)
      .filter((r) => stroke === "All" || r.stroke === stroke)
      .filter((r) => ageGroup === "All" || r.ageGroup === ageGroup)
      .sort((a, b) => a.eventName.localeCompare(b.eventName));
  }, [records, gender, stroke, ageGroup]);

  return (
    <div className={styles.wrap}>
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Gender</span>
          <div className={styles.chips}>
            {GENDER_OPTIONS.map((g) => (
              <button
                key={g}
                type="button"
                className={`${styles.chip} ${gender === g ? styles.chipActive : ""}`}
                onClick={() => setGender(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <label className={styles.filterGroup}>
          <span className={styles.filterLabel}>Stroke</span>
          <select
            className={styles.select}
            value={stroke}
            onChange={(e) => setStroke(e.target.value as Stroke | "All")}
          >
            {STROKE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.filterGroup}>
          <span className={styles.filterLabel}>Age Group</span>
          <select
            className={styles.select}
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
          >
            {ageGroupOptions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Event</th>
              <th>Age Group</th>
              <th>Time</th>
              <th>Swimmer</th>
              <th>Date Set</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td>{r.eventName}</td>
                <td>{r.ageGroup}</td>
                <td className={styles.time}>{r.formattedTime}</td>
                <td>
                  {r.swimmerName}
                  {r.isAlumniRecord && <span className={styles.alumniTag}>Alumni</span>}
                </td>
                <td>{r.dateSet}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  No records match these filters yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
