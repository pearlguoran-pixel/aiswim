import type { CoachProfile } from "@/lib/types";
import styles from "./CoachesGrid.module.css";

interface CoachesGridProps {
  coaches: CoachProfile[];
}

export default function CoachesGrid({ coaches }: CoachesGridProps) {
  return (
    <div className={styles.grid}>
      {coaches.map((coach) => (
        <div className={styles.card} key={coach.id}>
          <div className={styles.avatar}>
            {coach.firstName[0]}
            {coach.lastName[0]}
          </div>
          <h3 className={styles.name}>
            {coach.firstName} {coach.lastName}
          </h3>
          <p className={styles.title}>{coach.title}</p>
          <p className={styles.qualifications}>{coach.qualifications}</p>
          <p className={styles.bio}>{coach.bio}</p>
        </div>
      ))}
    </div>
  );
}
