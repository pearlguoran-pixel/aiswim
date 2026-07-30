import type { RaceResult } from "@/lib/types";
import styles from "./RecentMeetResults.module.css";

interface RecentMeetResultsProps {
  results: RaceResult[];
}

function placeBadgeClass(place: number | null): string {
  if (place === 1) return styles.gold;
  if (place === 2) return styles.silver;
  if (place === 3) return styles.bronze;
  return styles.noPlace;
}

export default function RecentMeetResults({ results }: RecentMeetResultsProps) {
  if (results.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Most Recent Meet</h2>
        <p className={styles.empty}>No meet results recorded yet.</p>
      </section>
    );
  }

  const { meetName, date } = results[0];

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Most Recent Meet</h2>
      <p className={styles.meetMeta}>
        {meetName} <span className={styles.dot}>·</span> {date}
      </p>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.placeCol}>Place</th>
            <th>Event</th>
            <th>Time</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={`${r.event}-${r.date}-${r.time ?? "none"}`}>
              <td>
                {r.place ? (
                  <span className={`${styles.badge} ${placeBadgeClass(r.place)}`}>{r.place}</span>
                ) : (
                  <span className={styles.dash}>—</span>
                )}
              </td>
              <td>{r.event}</td>
              <td className={styles.time}>{r.time ?? "—"}</td>
              <td className={styles.tags}>
                {r.disqualified && <span className={`${styles.tag} ${styles.tagDq}`}>DQ</span>}
                {r.noShow && <span className={`${styles.tag} ${styles.tagNs}`}>NS</span>}
                {r.exhibition && (
                  <span className={`${styles.tag} ${styles.tagExh}`}>Exhibition</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
