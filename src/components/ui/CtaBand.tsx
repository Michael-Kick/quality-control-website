import type { ReactNode } from "react";
import type { AppPathname } from "@/i18n/routing";
import { ButtonLink } from "./Button";
import styles from "./CtaBand.module.css";

type CtaBandProps = {
  title: ReactNode;
  text: ReactNode;
  ctaLabel: ReactNode;
  href?: AppPathname;
};

/** Navy closing band with one call to action, placed at the end of a page. */
export function CtaBand({ title, text, ctaLabel, href = "/kontakt" }: CtaBandProps) {
  return (
    <section className={styles.band}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.text}>{text}</p>
        </div>
        <ButtonLink href={href} variant="primary">
          {ctaLabel}
        </ButtonLink>
      </div>
    </section>
  );
}
