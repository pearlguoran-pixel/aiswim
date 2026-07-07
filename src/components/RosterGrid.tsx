"use client";

import { useMemo, useState } from "react";
import type { SwimmerProfile, Section, Gender } from "@/lib/types";
import styles from "./RosterGrid.module.css";

interface RosterGridProps {
  swimmers: SwimmerProfile[];
}

const SECTION_OPTIONS: Array<Section | "All"> = [
  "All",
  "Elementary",
  "Middle School",
  "High School",
];

const GENDER_OPTIONS: Array<Gender | "All"> = ["All", "Male", "Female"];

export default function RosterGrid({ swimmers }: RosterGridProps) {
  const [search, setSearch] = useState("");
  const [section, setSection] = useState<Section | "All">("All");
  const [gender, setGender] = useState<Gender | "All">("All");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return swimmers
      .filter((s) => section === "All" || s.section === section)
      .filter((s) => gender === "All" || s.gender === gender)
      .filter((s) =>
        term === "" ? true : `${s.firstName} ${s.lastName}`.toLowerCase().includes(term)
      )
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [swimmers, section, gender, search]);

  return (
    <div className={styles.wrap}>
      <div className={styles.filters}>
        <input
          className={styles.search}
          type="text"
          placeholder="Search by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Section</span>
          <div className={styles.chips}>
            {SECTION_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`${styles.chip} ${section === opt ? styles.chipActive : ""}`}
                onClick={() => setSection(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Gender</span>
          <div className={styles.chips}>
            {GENDER_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`${styles.chip} ${gender === opt ? styles.chipActive : ""}`}
                onClick={() => setGender(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className={styles.count}>
        {filtered.length} swimmer{filtered.length === 1 ? "" : "s"}
      </p>

      <div className={styles.grid}>
        {filtered.map((swimmer, index) => (
          <div className={styles.card} key={swimmer.id}>
            <span className={styles.lane}>{String(index + 1).padStart(2, "0")}</span>
            <h3 className={styles.name}>
              {swimmer.firstName} {swimmer.lastName}
            </h3>
            <span className={styles.section}>{swimmer.section}</span>
            <dl className={styles.meta}>
              <div>
                <dt>Age</dt>
                <dd>{swimmer.age}</dd>
              </div>
              <div>
                <dt>Class of</dt>
                <dd>{swimmer.gradYear}</dd>
              </div>
              <div>
                <dt>Gender</dt>
                <dd>{swimmer.gender}</dd>
              </div>
            </dl>
          </div>
        ))}

        {filtered.length === 0 && <p className={styles.empty}>No swimmers match these filters.</p>}
      </div>
    </div>
  );
}
