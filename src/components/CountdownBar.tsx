"use client";

import { useEffect, useState } from "react";
import { NEXT_MEET_DATE, NEXT_MEET_NAME, NEXT_MEET_DETAIL } from "@/lib/data";
import styles from "./CountdownBar.module.css";

interface TimeLeft {
  days: number;
  hours: string;
  minutes: string;
  seconds: string;
}

function calcTimeLeft(): TimeLeft {
  const diff = NEXT_MEET_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: "00", minutes: "00", seconds: "00" };
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  return {
    days: d,
    hours: String(h).padStart(2, "0"),
    minutes: String(m).padStart(2, "0"),
    seconds: String(s).padStart(2, "0"),
  };
}

export default function CountdownBar() {
  const [time, setTime] = useState<TimeLeft>(calcTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <span className={styles.label}>Next meet</span>

        <div className={styles.event}>
          {NEXT_MEET_NAME}
          <small>{NEXT_MEET_DETAIL}</small>
        </div>

        <div className={styles.units}>
          <Unit value={String(time.days)} label="Days" />
          <Unit value={time.hours} label="Hrs" />
          <Unit value={time.minutes} label="Min" />
          <Unit value={time.seconds} label="Sec" />
        </div>
      </div>
    </div>
  );
}

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className={styles.unit}>
      <span className={styles.unitNum}>{value}</span>
      <span className={styles.unitLabel}>{label}</span>
    </div>
  );
}
