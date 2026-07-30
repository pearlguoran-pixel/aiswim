import type { SwimmerProfile } from "@/lib/types";
import styles from "./SwimmerInfoPanel.module.css";

interface SwimmerInfoPanelProps {
  swimmer: SwimmerProfile;
}

function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export default function SwimmerInfoPanel({ swimmer }: SwimmerInfoPanelProps) {
  return (
    <aside className={styles.panel}>
      <div className={styles.avatar}>{initials(swimmer.firstName, swimmer.lastName)}</div>
      <h1 className={styles.name}>
        {swimmer.firstName} {swimmer.lastName}
      </h1>
      <dl className={styles.info}>
        <div className={styles.infoRow}>
          <dt>Gender</dt>
          <dd>{swimmer.gender}</dd>
        </div>
        <div className={styles.infoRow}>
          <dt>Age</dt>
          <dd>{swimmer.age}</dd>
        </div>
        <div className={styles.infoRow}>
          <dt>Class of</dt>
          <dd>{swimmer.gradYear ?? "—"}</dd>
        </div>
        <div className={styles.infoRow}>
          <dt>Section</dt>
          <dd>{swimmer.section}</dd>
        </div>
      </dl>
    </aside>
  );
}
