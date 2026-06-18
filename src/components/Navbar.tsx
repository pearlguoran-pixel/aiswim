import Link from "next/link";
import ShieldLogo from "./ShieldLogo";
import styles from "./Navbar.module.css";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/records", label: "Records" },
  { href: "/roster", label: "Roster" },
  { href: "/coaches", label: "Coaches" },
];

interface NavbarProps {
  activePath?: string;
}

export default function Navbar({ activePath = "/" }: NavbarProps) {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <ShieldLogo size={36} />
        <div className={styles.brand}>
          <span className={styles.brandTop}>International Community School</span>
          <span className={styles.brandBottom}>Bangkok</span>
        </div>
      </div>

      <ul className={styles.links}>
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`${styles.link} ${activePath === link.href ? styles.active : ""}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/admin" className={styles.portalBtn}>
            Community Portal
          </Link>
        </li>
      </ul>
    </nav>
  );
}
