"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/session";
import styles from "./LoginBox.module.css";

interface LoginBoxProps {
  role: Role;
  heading: string;
  description: string;
}

const LOGIN_ENDPOINT: Record<Role, string> = {
  parent: "/api/parent/login",
  admin: "/api/admin/login",
};

export default function LoginBox({ role, heading, description }: LoginBoxProps) {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch(LOGIN_ENDPOINT[role], {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ passcode }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setError(data?.error ?? "Something went wrong. Try again.");
          return;
        }

        router.push("/home");
        router.refresh();
      } catch {
        setError("Couldn't reach the server. Try again.");
      }
    });
  }

  const inputId = `passcode-${role}`;

  return (
    <div className={styles.box} data-role={role}>
      <p className={styles.badge}>{role === "admin" ? "Staff Only" : "Team Families"}</p>
      <h2 className={styles.heading}>{heading}</h2>
      <p className={styles.description}>{description}</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor={inputId} className={styles.label}>
          Passcode
        </label>
        <input
          id={inputId}
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className={styles.input}
          autoComplete="off"
          placeholder="••••••••"
        />

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button type="submit" className={styles.submit} disabled={isPending}>
          {isPending ? "Checking…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
