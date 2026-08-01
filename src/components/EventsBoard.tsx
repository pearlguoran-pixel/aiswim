// src/components/EventsBoard.tsx
// New component — displays coach-posted events on the homepage.
// Shows for both parent and admin sessions.

import type { PostedEvent } from "@/app/home/page";
import styles from "./EventsBoard.module.css";

interface EventsBoardProps {
  events: PostedEvent[];
  session: "admin" | "parent";
}

const CATEGORY_LABELS: Record<PostedEvent["category"], string> = {
  meet: "Meet",
  admin: "Admin",
  payment: "Payment",
  ceremony: "Ceremony",
  party: "Party",
};

export default function EventsBoard({ events }: EventsBoardProps) {
  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  // Sort upcoming first, then past
  const sorted = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>From the Coaches</span>
          <h2 className={styles.heading}>Upcoming Events</h2>
        </header>

        <ul className={styles.list}>
          {sorted.map((ev) => {
            const isPast = new Date(ev.date) < new Date();
            return (
              <li
                key={ev.id}
                className={`${styles.card} ${isPast ? styles.past : ""}`}
              >
                <div className={styles.dateColumn}>
                  <span className={styles.dateDay}>
                    {new Date(ev.date).toLocaleDateString("en-US", {
                      day: "numeric",
                    })}
                  </span>
                  <span className={styles.dateMonth}>
                    {new Date(ev.date).toLocaleDateString("en-US", {
                      month: "short",
                    })}
                  </span>
                </div>
                <div className={styles.content}>
                  <div className={styles.meta}>
                    <span
                      className={styles.badge}
                      data-category={ev.category}
                    >
                      {CATEGORY_LABELS[ev.category]}
                    </span>
                    {isPast && (
                      <span className={styles.pastLabel}>Past</span>
                    )}
                  </div>
                  <div className={styles.title}>{ev.title}</div>
                  <div className={styles.description}>{ev.description}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
