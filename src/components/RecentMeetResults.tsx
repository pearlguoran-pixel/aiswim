// src/components/RecentMeetResults.tsx
import type { RecentMeet } from '@/lib/swimmerStats';
import { formatTime } from '@/lib/swimmerStats';
import styles from './RecentMeetResults.module.css';

function PlaceBadge({ place }: { place: number | null }) {
  if (place === null) return <span className={styles.noPlace}>—</span>;
  const medal = place === 1 ? styles.gold : place === 2 ? styles.silver : place === 3 ? styles.bronze : styles.place;
  return <span className={`${styles.placeBadge} ${medal}`}>{place}</span>;
}

export default function RecentMeetResults({ meet }: { meet: RecentMeet | null }) {
  if (!meet) {
    return (
      <section className={styles.section}>
        <h2 className={styles.heading}>Most Recent Meet</h2>
        <p className={styles.empty}>No meet results on file yet.</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.meetHeader}>
        <h2 className={styles.heading}>Most Recent Meet</h2>
        <div className={styles.meetMeta}>
          <span className={styles.meetName}>{meet.meetName}</span>
          <span className={styles.meetDate}>{meet.date}</span>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Event</th>
            <th>Time</th>
            <th>Place</th>
            <th>vs. PB</th>
          </tr>
        </thead>
        <tbody>
          {meet.results.map((r, i) => (
            <tr key={`${r.event}-${i}`}>
              <td>{r.event}</td>
              <td className={styles.timeCell}>
                {r.noShow ? (
                  <span className={styles.tag}>NS</span>
                ) : r.disqualified ? (
                  <span className={styles.tagDq}>DQ</span>
                ) : (
                  <>
                    {formatTime(r.time as string)}
                    {r.exhibition && <span className={styles.tag}>X</span>}
                  </>
                )}
              </td>
              <td>
                <PlaceBadge place={r.place} />
              </td>
              <td className={styles.diffCell}>
                {r.personalBestDiff === null
                  ? '—'
                  : r.personalBestDiff <= 0
                  ? <span className={styles.improved}>{r.personalBestDiff.toFixed(2)}</span>
                  : <span className={styles.regressed}>+{r.personalBestDiff.toFixed(2)}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
