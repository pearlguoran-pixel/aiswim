// src/components/SwimmerInfoPanel.tsx
import type { SwimmerProfile } from '@/lib/types';
import styles from './SwimmerInfoPanel.module.css';

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function SwimmerInfoPanel({ swimmer }: { swimmer: SwimmerProfile }) {
  return (
    <aside className={styles.panel}>
      <div className={styles.avatar}>{initials(swimmer.name)}</div>
      <h1 className={styles.name}>{swimmer.name}</h1>
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
