import type { ReactNode } from "react";
import { Eyebrow } from "./Section";
import styles from "./PageHead.module.css";

type PageHeadProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  /** Extra content under the lead, e.g. chips or buttons. */
  children?: ReactNode;
};

/** Navy header band that opens every inner page (Leistungen, Kontakt, ...). */
export function PageHead({ eyebrow, title, lead, children }: PageHeadProps) {
  return (
    <div className={styles.band}>
      <div className={`container ${styles.inner}`}>
        {eyebrow ? <Eyebrow onDark>{eyebrow}</Eyebrow> : null}
        <h1 className={styles.title}>{title}</h1>
        {lead ? <p className={styles.lead}>{lead}</p> : null}
        {children}
      </div>
    </div>
  );
}
