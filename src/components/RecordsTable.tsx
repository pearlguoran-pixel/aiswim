"use client";

import { useMemo, useState } from "react";
import type { RecordEntry, Gender, Event } from "@/lib/types";
import styles from "./RecordsTable.module.css";

interface RecordsTableProps {
  records: RecordEntry[];
}

const GENDER_OPTIONS: Array<Gender | "All"> = ["All", "Male", "Female"];

const EVENT_OPTIONS: Array<Event | "All"> = [
  "All",
  "50 Freestyle",
  "100 Freestyle",
  "200 Freestyle",
  "400 Freestyle",
  "800 Freestyle",
  "1500 Freestyle",
  "50 Butterfly",
  "100 Butterfly",
  "200 Butterfly",
  "50 Backstroke",
  "100 Backstroke",
  "200 Backstroke",
  "50 Breaststroke",
  "100 Breaststroke",
  "200 Breaststroke",
  "100 Individual Medley",
  "200 Individual Medley",
  "400 Individual Medley",
  "4x50 Freestyle Relay",
  "4x100 Freestyle Relay",
  "4x200 Freestyle Relay",
  "4x50 Medley Relay",
  "4x100 Medley Relay",
];

export default function RecordsTable({ records }: RecordsTableProps) {
  const [gender, setGender] = useState<Gender | "All">("All");
  const [event, setEvent] = useState<Event | "All">("All");
  const [ageGroup, setAgeGroup] = useState<string>("All");

  const ageGroupOptions = useMemo(() => {
    const unique = Array.from(new Set(records.map((r) => r.ageGroup)));
    return ["All", ...unique];
  }, [records]);

  const filtered = useMemo(() => {
    return records
      .filter((r) => gender === "All" || r.gender === gender)
      .filter((r) => event === "All" || r.eventName === event)
      .filter((r) => ageGroup === "All" || r.ageGroup === ageGroup)
      .sort((a, b) => a.eventName.localeCompare(b.eventName));
  }, [records, gender, event, ageGroup]);

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
          <span className={styles.filterLabel}>Event</span>
          <select
            className={styles.select}
            value={event}
            onChange={(e) => setEvent(e.target.value as Event | "All")}
          >
            {EVENT_OPTIONS.map((ev) => (
              <option key={ev} value={ev}>
                {ev}
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
