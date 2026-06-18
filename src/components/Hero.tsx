import ShieldLogo from "./ShieldLogo";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <div className={styles.hero}>
      {/* subtle watermark */}
      <div className={styles.watermark} aria-hidden="true">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 10L20 50V110C20 155 55 190 100 198C145 190 180 155 180 110V50L100 10Z"
            fill="#0a2240"
          />
        </svg>
      </div>

      <div className={styles.inner}>
        <div className={styles.logoRow}>
          <ShieldLogo size={64} />
          <h1 className={styles.title}>ICS Eagle Rays</h1>
        </div>
        <p className={styles.subtitle}>
          Swim Team · Season 2025–26 · Short Course Meters
        </p>
      </div>

      {/* wave transition to white */}
      <div className={styles.wave} aria-hidden="true">
        <svg
          viewBox="0 0 900 42"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,22 C150,42 300,2 450,22 C600,42 750,2 900,22 L900,42 L0,42 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </div>
  );
}
