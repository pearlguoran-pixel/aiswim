// src/app/home/page.tsx
// Overwrites previous version.
// Change from v9: fetches posted events from /api/admin/events and renders
// an EventsBoard section below the existing hero/meets/dates content.
// All other logic (session check, force-dynamic, existing components) unchanged.

export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CountdownBar from "@/components/CountdownBar";
import MeetsList from "@/components/MeetsList";
import DatesList from "@/components/DatesList";
import EventsBoard from "@/components/EventsBoard"; // ← new component (see below)
import { getHomePageData } from "@/lib/queries"; // unchanged from v9
import styles from "./page.module.css";

export default async function HomePage() {
  const session = await getServerSession();
  if (!session) redirect("/");

  const { meets, dates } = await getHomePageData();

  // Fetch posted events — fire-and-forget; empty array on failure
  let postedEvents: PostedEvent[] = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/admin/events`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      postedEvents = data.events ?? [];
    }
  } catch {
    // non-fatal — homepage still renders without event board
  }

  return (
    <>
      <Navbar activePath="/home" />
      <main className={styles.main}>
        <Hero />
        <CountdownBar />

        {/* Posted events board — visible to all logged-in roles */}
        {postedEvents.length > 0 && (
          <EventsBoard events={postedEvents} session={session} />
        )}

        <div className={styles.twoCol}>
          <MeetsList meets={meets} />
          <DatesList dates={dates} />
        </div>
      </main>
    </>
  );
}

// ── Type (co-locate here for simplicity; move to src/lib/types.ts as preferred) ──
export interface PostedEvent {
  id: number;
  title: string;
  description: string;
  date: string; // ISO string from JSON
  category: "meet" | "admin" | "payment" | "ceremony" | "party";
}
