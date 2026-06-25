import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import LoginForm from "@/components/admin/LoginForm";
import styles from "./login.module.css";

export default async function AdminLoginPage() {
  const isAuthenticated = await getServerSession();
  if (isAuthenticated) {
    redirect("/admin/import");
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Eagle Rays — Staff Only</p>
        <h1 className={styles.title}>Admin sign in</h1>
        <p className={styles.subtitle}>
          Enter the team passcode to manage data imports and the relay analyzer.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
