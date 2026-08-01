// src/app/home/page.tsx

export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CountdownBar from "@/components/CountdownBar";
import MeetsList from "@/components/MeetsList";
import DatesList from "@/components/DatesList";
import { getHomePageData } from "@/lib/queries";
import styles from "./page.module.css";

export default async function HomePage() {
  const session = await getServerSession();
  if (!session) redirect("/");

  const { meets, dates } = await getHomePageData();

  return (
    <>
      <Navbar activePath="/home" />
      <main className={styles.main}>
        <Hero />
        <CountdownBar />
        <div className={styles.twoCol}>
          <MeetsList meets={meets} />
          <DatesList dates={dates} />
        </div>
      </main>
    </>
  );
}
