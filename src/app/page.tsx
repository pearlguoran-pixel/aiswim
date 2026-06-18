import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CountdownBar from "@/components/CountdownBar";
import MeetsList from "@/components/MeetsList";
import DatesList from "@/components/DatesList";
import { meets, dates } from "@/lib/data";
import styles from "./page.module.css";

export default function HomePage() {
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
