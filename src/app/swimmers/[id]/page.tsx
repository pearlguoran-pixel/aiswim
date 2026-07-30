import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import SwimmerInfoPanel from "@/components/SwimmerInfoPanel";
import PersonalBestsBoard from "@/components/PersonalBestsBoard";
import RecentMeetResults from "@/components/RecentMeetResults";
import { mockSwimmerProfiles } from "@/lib/mockSwimmerProfiles";
import { mockSwimmerResults } from "@/lib/mockSwimmerResults";
import { getPersonalBests, getMostRecentMeet } from "@/lib/swimmerStats";
import styles from "./page.module.css";

interface SwimmerProfilePageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return mockSwimmerProfiles.map((s) => ({ id: s.id }));
}

export default function SwimmerProfilePage({ params }: SwimmerProfilePageProps) {
  const swimmer = mockSwimmerProfiles.find((s) => s.id === params.id);

  if (!swimmer) {
    notFound();
  }

  const personalBests = getPersonalBests(swimmer.id, mockSwimmerResults);
  const recentMeet = getMostRecentMeet(swimmer.id, mockSwimmerResults);

  return (
    <>
      <Navbar activePath="/roster" />
      <div className={styles.page}>
        <SwimmerInfoPanel swimmer={swimmer} />
        <div className={styles.content}>
          <PersonalBestsBoard personalBests={personalBests} />
          <RecentMeetResults results={recentMeet} />
        </div>
      </div>
    </>
  );
}
