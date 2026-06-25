import type { ReactNode } from "react";
import Link from "next/link";
import SignOutButton from "@/components/admin/SignOutButton";
import styles from "./admin-layout.module.css";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <span className={styles.brand}>Eagle Rays Admin</span>
        <nav className={styles.nav}>
          <Link href="/admin/import" className={styles.navLink}>
            Import data
          </Link>
          <Link href="/admin/relay-analyzer" className={styles.navLink}>
            Relay analyzer
          </Link>
        </nav>
        <SignOutButton />
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
