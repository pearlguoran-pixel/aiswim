"use client";

import { useRouter } from "next/navigation";
import styles from "./SignOutButton.module.css";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={handleSignOut} className={styles.button}>
      Sign out
    </button>
  );
}
