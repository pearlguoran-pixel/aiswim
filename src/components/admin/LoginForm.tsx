"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "Something went wrong. Try again.");
        return;
      }

      const redirectTo = searchParams.get("redirectTo") ?? "/admin/import";
      router.push(redirectTo);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="passcode" className={styles.label}>
        Passcode
      </label>
      <input
        id="passcode"
        type="password"
        inputMode="numeric"
        autoComplete="off"
        value={passcode}
        onChange={(event) => setPasscode(event.target.value)}
        className={styles.input}
        placeholder="••••••"
        required
      />
      {error ? <p className={styles.error}>{error}</p> : null}
      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
