import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CountdownBar from "@/components/CountdownBar";
import MeetsList from "@/components/MeetsList";
import DatesList from "@/components/DatesList";
import { getHomePageData } from "@/lib/queries";
import styles from "./page.module.css";

// Always fetch fresh data — this page depends on "today's date" for
// past/next/upcoming status, so it shouldn't be statically cached.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { meets, dates } = await getHomePageData();

  return (
    <>
      <Navbar activePath="/" />
      <Hero />
      <CountdownBar />

      <main className={styles.main}>
        <div className={styles.twoCol}>
          <MeetsList meets={meets} />
          <DatesList dates={dates} />
        </div>
      </main>
    </>
  );
}
