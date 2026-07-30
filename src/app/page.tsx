import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import ShieldLogo from "@/components/ShieldLogo";
import LoginBox from "@/components/LoginBox";
import styles from "./page.module.css";

export default async function LoginPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/home");
  }

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <ShieldLogo size={56} />
        <p className={styles.eyebrow}>International Community School — Bangkok</p>
        <h1 className={styles.title}>Eagle Rays</h1>
        <p className={styles.subtitle}>Sign in to see meets, results, and team news.</p>
      </div>

      <div className={styles.boxes}>
        <LoginBox
          role="parent"
          heading="Parents &amp; Swimmers"
          description="Enter the team passcode to view meet schedules, results, and announcements."
        />
        <LoginBox
          role="admin"
          heading="Coaches &amp; Admin"
          description="Enter the admin passcode to sign in and manage the Community Portal."
        />
      </div>
    </div>
  );
}
