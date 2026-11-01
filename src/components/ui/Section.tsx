import type { ReactNode } from "react";
import styles from "./Section.module.css";

type SectionProps = {
  children: ReactNode;
  /** `muted` gives the light grey band used to alternate sections. */
  tone?: "default" | "muted";
  id?: string;
  labelledBy?: string;
  className?: string;
};

/** Full-width band with vertical rhythm and the content container inside. */
export function Section({ children, tone = "default", id, labelledBy, className }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={[styles.section, tone === "muted" && styles.muted, className].filter(Boolean).join(" ")}
    >
      <div className={`container ${styles.inner}`}>{children}</div>
    </section>
  );
}

type SectionHeadProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  /** Pass the same id as the Section's `labelledBy`. */
  titleId?: string;
};

export function SectionHead({ eyebrow, title, intro, titleId }: SectionHeadProps) {
  return (
    <div className={styles.head}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      {intro ? <p className={styles.intro}>{intro}</p> : null}
    </div>
  );
}

/** Small uppercase label above headings. Use `onDark` on navy backgrounds. */
export function Eyebrow({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return <div className={[styles.eyebrow, onDark && styles.eyebrowOnDark].filter(Boolean).join(" ")}>{children}</div>;
}
