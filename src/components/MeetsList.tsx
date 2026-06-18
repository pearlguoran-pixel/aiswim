import type { MeetEvent } from "@/lib/types";
import styles from "./MeetsList.module.css";

interface MeetsListProps {
  meets: MeetEvent[];
}

const statusLabel: Record<MeetEvent["status"], string> = {
  past: "Past",
  next: "Up next",
  upcoming: "Upcoming",
};

export default function MeetsList({ meets }: MeetsListProps) {
  return (
    <div>
      <h2 className={styles.heading}>Meets, Trials &amp; Tryouts</h2>
      <ul className={styles.list}>
        {meets.map((meet) => (
          <li key={meet.id} className={styles.item}>
            <div
              className={`${styles.dateBlock} ${meet.status === "next" ? styles.dateBlockGold : ""}`}
            >
              <span className={styles.month}>{meet.month}</span>
              <span className={styles.day}>{meet.day}</span>
            </div>

            <div className={styles.info}>
              <div className={styles.name}>
                {meet.name}
                {meet.isChampionship && (
                  <span className={`${styles.badge} ${styles.badgeChamp}`}>
                    Championships
                  </span>
                )}
                {!meet.isChampionship && (
                  <span
                    className={`${styles.badge} ${
                      meet.status === "past"
                        ? styles.badgePast
                        : meet.status === "next"
                        ? styles.badgeNext
                        : styles.badgeUpcoming
                    }`}
                  >
                    {statusLabel[meet.status]}
                  </span>
                )}
              </div>
              <div className={styles.location}>{meet.location}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
