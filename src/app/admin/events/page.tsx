// src/app/admin/events/page.tsx
"use client";

import { useState, useEffect } from "react";
import styles from "./events.module.css";

type EventCategory = "meet" | "admin" | "payment" | "ceremony" | "party";

const CATEGORY_LABELS: Record<EventCategory, string> = {
  meet: "🏊 Meet",
  admin: "📋 Admin",
  payment: "💳 Payment",
  ceremony: "🏆 Ceremony",
  party: "🎉 Party",
};

interface SavedEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  category: EventCategory;
}

export default function AdminEventsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<EventCategory>("meet");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoadingEvents(true);
    try {
      const res = await fetch("/api/admin/events");
      const data = await res.json();
      setSavedEvents(data.events ?? []);
    } catch {
      // non-fatal — list just stays empty
    } finally {
      setLoadingEvents(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, date, category }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }

      // Success — reset form and refresh list
      setTitle("");
      setDescription("");
      setDate("");
      setCategory("meet");
      setStatus("success");
      setSavedEvents((prev) => [data.event, ...prev]);

      // Reset success banner after 3s
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setErrorMsg("Network error — please try again.");
      setStatus("error");
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      await fetch(`/api/admin/events?id=${id}`, { method: "DELETE" });
      setSavedEvents((prev) => prev.filter((e) => e.id !== id));
    } catch {
      // non-fatal
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerEyebrow}>Admin</div>
        <h1 className={styles.heading}>Add Event</h1>
        <p className={styles.subheading}>
          Events you post here appear on the homepage for all parents and coaches.
        </p>
      </div>

      <div className={styles.layout}>
        {/* ── Form ── */}
        <section className={styles.formCard}>
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="title" className={styles.label}>
                Title
              </label>
              <input
                id="title"
                type="text"
                className={styles.input}
                placeholder="e.g. End-of-Season Banquet"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="description" className={styles.label}>
                Description
              </label>
              <textarea
                id="description"
                className={styles.textarea}
                placeholder="What do families need to know?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className={styles.twoCol}>
              <div className={styles.field}>
                <label htmlFor="date" className={styles.label}>
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  className={styles.input}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="category" className={styles.label}>
                  Type
                </label>
                <select
                  id="category"
                  className={styles.select}
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                >
                  {(Object.keys(CATEGORY_LABELS) as EventCategory[]).map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {status === "error" && (
              <p className={styles.errorBanner}>{errorMsg}</p>
            )}
            {status === "success" && (
              <p className={styles.successBanner}>Event posted to homepage ✓</p>
            )}

            <button
              type="submit"
              className={styles.saveBtn}
              disabled={status === "saving"}
            >
              {status === "saving" ? "Saving…" : "Post Event"}
            </button>
          </form>
        </section>

        {/* ── Existing events ── */}
        <section className={styles.listSection}>
          <h2 className={styles.listHeading}>Posted Events</h2>

          {loadingEvents ? (
            <p className={styles.emptyState}>Loading…</p>
          ) : savedEvents.length === 0 ? (
            <p className={styles.emptyState}>No events posted yet.</p>
          ) : (
            <ul className={styles.eventList}>
              {savedEvents.map((ev) => (
                <li key={ev.id} className={styles.eventItem}>
                  <div className={styles.eventMeta}>
                    <span
                      className={styles.categoryBadge}
                      data-category={ev.category}
                    >
                      {CATEGORY_LABELS[ev.category]}
                    </span>
                    <span className={styles.eventDate}>{formatDate(ev.date)}</span>
                  </div>
                  <div className={styles.eventTitle}>{ev.title}</div>
                  <div className={styles.eventDescription}>{ev.description}</div>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(ev.id)}
                    disabled={deletingId === ev.id}
                    aria-label={`Delete "${ev.title}"`}
                  >
                    {deletingId === ev.id ? "Removing…" : "Remove"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
