import type { ReactNode } from "react";
import styles from "./Card.module.css";

type CardProps = {
  children: ReactNode;
  /** Highlighted with the accent border, e.g. the external management representative offer. */
  featured?: boolean;
  className?: string;
};

export function Card({ children, featured = false, className }: CardProps) {
  return (
    <div className={[styles.card, featured && styles.featured, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

export function CardTitle({ children, as: Tag = "h3" }: { children: ReactNode; as?: "h2" | "h3" }) {
  return <Tag className={styles.title}>{children}</Tag>;
}

export function CardText({ children }: { children: ReactNode }) {
  return <p className={styles.text}>{children}</p>;
}

/** Square icon tile shown at the top of service cards. Decorative only. */
export function CardIcon({ children }: { children: ReactNode }) {
  return (
    <div className={styles.icon} aria-hidden="true">
      {children}
    </div>
  );
}

/** Small accent chip, e.g. the standard a training covers. */
export function Tag({ children }: { children: ReactNode }) {
  return <span className={styles.tag}>{children}</span>;
}

export type SpecItem = { label: ReactNode; value: ReactNode };

/** Label/value rows (Grundlage, Dauer, Format, Ergebnis) at the bottom of a service card. */
export function SpecList({ items }: { items: SpecItem[] }) {
  return (
    <dl className={styles.spec}>
      {items.map((item, i) => (
        <div key={i} className={styles.specRow}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Responsive card grid: 2 or 3 columns on desktop, one column on phones. */
export function CardGrid({ children, columns = 2 }: { children: ReactNode; columns?: 2 | 3 }) {
  return <div className={columns === 3 ? styles.grid3 : styles.grid2}>{children}</div>;
}
