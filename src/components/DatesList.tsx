import type { DateEvent } from "@/lib/types";
import styles from "./DatesList.module.css";

interface DatesListProps {
  dates: DateEvent[];
}

const typeLabel: Record<DateEvent["type"], string> = {
  party: "Party",
  payment: "Payment",
  ceremony: "Ceremony",
  admin: "Admin",
};

export default function DatesList({ dates }: DatesListProps) {
  return (
    <div>
      <h2 className={styles.heading}>Dates</h2>
      <ul className={styles.list}>
        {dates.map((item) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.dateBlock}>
              <span className={styles.month}>{item.month}</span>
              <span className={styles.day}>{item.day}</span>
            </div>

            <div className={styles.info}>
              <div className={styles.name}>{item.name}</div>
              <div className={styles.detail}>{item.detail}</div>
            </div>

            <span className={`${styles.typeBadge} ${styles[`type_${item.type}`]}`}>
              {typeLabel[item.type]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
