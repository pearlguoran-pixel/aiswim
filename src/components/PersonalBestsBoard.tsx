// src/components/PersonalBestsBoard.tsx
import type { RaceResult } from '@/lib/types';
import { EVENT_GROUPS, formatTime } from '@/lib/swimmerStats';
import styles from './PersonalBestsBoard.module.css';

export default function PersonalBestsBoard({
  bests,
}: {
  bests: Map<string, RaceResult>;
}) {
  const hasAnyTimes = bests.size > 0;

  return (
    <section className={styles.board}>
      <h2 className={styles.heading}>Personal Bests</h2>

      {!hasAnyTimes && (
        <p className={styles.empty}>No recorded times yet.</p>
      )}

      {hasAnyTimes && (
        <div className={styles.groups}>
          {EVENT_GROUPS.map((group) => {
            const rows = group.events
              .map((event) => ({ event, best: bests.get(event) }))
              .filter((row) => row.best); // only render events this swimmer has actually raced

            if (rows.length === 0) return null;

            return (
              <div key={group.stroke} className={styles.lane}>
                <h3 className={styles.laneLabel}>{group.stroke}</h3>
                <div className={styles.tiles}>
                  {rows.map(({ event, best }) => (
                    <div key={event} className={styles.tile}>
                      <span className={styles.tileEvent}>{event}</span>
                      <span className={styles.tileTime}>
                        {formatTime(best!.time as string)}
                        {best!.exhibition && (
                          <span className={styles.exBadge} title="Set in an exhibition swim">
                            X
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
