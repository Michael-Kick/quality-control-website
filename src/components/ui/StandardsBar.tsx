import { siteConfig } from "@/config/site";
import styles from "./StandardsBar.module.css";

/** Grey strip listing the standards (ISO 9001 · ISO 13485 · ISO 19011 · GMP) under the hero. */
export function StandardsBar({ label }: { label: string }) {
  return (
    <div className={styles.bar}>
      <ul className={`container ${styles.list}`} aria-label={label}>
        {siteConfig.standards.map((standard) => (
          <li key={standard}>{standard}</li>
        ))}
      </ul>
    </div>
  );
}
