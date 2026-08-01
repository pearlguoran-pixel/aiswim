// src/components/Navbar.tsx
// Overwrites previous version.
// Change from v9: "Community Portal" renamed to "Edit" and now routes to /admin/events
// All other logic (session-gating, active path, Home → /home) unchanged.

import Link from "next/link";
import { getServerSession } from "@/lib/session";
import styles from "./Navbar.module.css"; // unchanged CSS file

interface NavbarProps {
  activePath?: string;
}

export default async function Navbar({ activePath }: NavbarProps) {
  const session = await getServerSession();

  return (
    <nav className={styles.nav}>
      <Link href="/home" className={styles.logo}>
        ICS Eagle Rays
      </Link>

      <ul className={styles.links}>
        <li>
          <Link
            href="/home"
            className={`${styles.link} ${activePath === "/home" ? styles.active : ""}`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/records"
            className={`${styles.link} ${activePath === "/records" ? styles.active : ""}`}
          >
            Records
          </Link>
        </li>
        <li>
          <Link
            href="/roster"
            className={`${styles.link} ${activePath === "/roster" ? styles.active : ""}`}
          >
            Roster
          </Link>
        </li>
        <li>
          <Link
            href="/coaches"
            className={`${styles.link} ${activePath === "/coaches" ? styles.active : ""}`}
          >
            Coaches
          </Link>
        </li>

        {/* "Edit" replaces "Community Portal" — admin only, routes to /admin/events */}
        {session === "admin" && (
          <li>
            <Link
              href="/admin/events"
              className={`${styles.portalBtn} ${
                activePath?.startsWith("/admin") ? styles.active : ""
              }`}
            >
              Edit
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
