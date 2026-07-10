// src/components/SwimmerInfoPanel.tsx
import type { SwimmerProfile } from '@/lib/types';
import styles from './SwimmerInfoPanel.module.css';

function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

export default function SwimmerInfoPanel({ swimmer }: { swimmer: SwimmerProfile }) {
  const fullName = `${swimmer.firstName} ${swimmer.lastName}`.trim();

  return (
    <aside className={styles.panel}>
      <div className={styles.avatar}>{initials(swimmer.firstName, swimmer.lastName)}</div>
      <h1 className={styles.name}>{fullName}</h1>
      <span className={styles.sectionBadge}>{swimmer.section}</span>

      <dl className={styles.infoList}>
        <div className={styles.infoRow}>
          <dt>Gender</dt>
          <dd>{swimmer.gender}</dd>
        </div>
        <div className={styles.infoRow}>
          <dt>Age</dt>
          <dd>{swimmer.age}</dd>
        </div>
        <div className={styles.infoRow}>
          <dt>Grad Year</dt>
          <dd>{swimmer.gradYear ?? '—'}</dd>
        </div>
        <div className={styles.infoRow}>
          <dt>Section</dt>
          <dd>{swimmer.section}</dd>
        </div>
      </dl>
    </aside>
  );
}
