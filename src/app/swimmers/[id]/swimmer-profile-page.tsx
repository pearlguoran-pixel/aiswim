// src/app/swimmers/[id]/page.tsx
import { notFound } from 'next/navigation';
import { mockSwimmerProfiles } from '@/lib/mockSwimmerProfiles';
import { mockSwimmerResults } from '@/lib/mockSwimmerResults';
import { getPersonalBests, getMostRecentMeet } from '@/lib/swimmerStats';
import SwimmerInfoPanel from '@/components/SwimmerInfoPanel';
import PersonalBestsBoard from '@/components/PersonalBestsBoard';
import RecentMeetResults from '@/components/RecentMeetResults';
import styles from './page.module.css';

export function generateStaticParams() {
  return mockSwimmerProfiles.map((s) => ({ id: s.id }));
}

export default function SwimmerProfilePage({ params }: { params: { id: string } }) {
  const swimmer = mockSwimmerProfiles.find((s) => s.id === params.id);
  if (!swimmer) notFound();

  const bests = getPersonalBests(swimmer.id, mockSwimmerResults);
  const recentMeet = getMostRecentMeet(swimmer.id, mockSwimmerResults);

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <SwimmerInfoPanel swimmer={swimmer} />
        <div className={styles.main}>
          <PersonalBestsBoard bests={bests} />
          <RecentMeetResults meet={recentMeet} />
        </div>
      </div>
    </div>
  );
}
