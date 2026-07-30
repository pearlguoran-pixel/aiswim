import type { PersonalBest } from "@/lib/swimmerStats";
import { eventToStroke } from "@/lib/swimmerStats";
import type { Stroke } from "@/lib/types";
import styles from "./PersonalBestsBoard.module.css";

interface PersonalBestsBoardProps {
  personalBests: PersonalBest[];
}

const STROKE_ORDER: Stroke[] = [
  "Freestyle",
  "Backstroke",
  "Breaststroke",
  "Butterfly",
  "IM",
  "Distance",
];

export default function PersonalBestsBoard({ personalBests }: PersonalBestsBoardProps) {
  const grouped = STROKE_ORDER.map((stroke) => ({
    stroke,
    bests: personalBests
      .filter((pb) => eventToStroke(pb.event) === stroke)
      .sort((a, b) => a.seconds - b.seconds),
  })).filter((group) => group.bests.length > 0);

  return (
    <section className={styles.board}>
      <h2 className={styles.title}>Personal Bests</h2>

      {grouped.length === 0 ? (
        <p className={styles.empty}>No recorded times yet.</p>
      ) : (
        <div className={styles.lanes}>
          {grouped.map((group) => (
            <div className={styles.lane} key={group.stroke}>
              <h3 className={styles.laneLabel}>{group.stroke}</h3>
              <ul className={styles.times}>
                {group.bests.map((pb) => (
                  <li className={styles.timeRow} key={pb.event}>
                    <span className={styles.event}>{pb.event}</span>
                    <span className={styles.time}>{pb.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
