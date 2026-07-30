"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginWithPasscode } from "@/lib/authActions";
import type { Role } from "@/lib/session";
import styles from "./LoginBox.module.css";

interface LoginBoxProps {
  role: Role;
  heading: string;
  description: string;
}

export default function LoginBox({ role, heading, description }: LoginBoxProps) {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await loginWithPasscode(role, passcode);
      if (!result.success) {
        setError(result.error ?? "Something went wrong. Try again.");
        return;
      }
      router.push("/home");
      router.refresh();
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
