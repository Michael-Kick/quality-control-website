import type { RichTranslationValues } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { brandName, siteConfig } from "@/config/site";
import styles from "./LegalText.module.css";

/**
 * Placeholders and markup tags available in legal.json, e.g.
 * "<p>{name}<br></br>[PLZ] {city}</p><p>E-Mail: <mail>{email}</mail></p>".
 */
const richValues: RichTranslationValues = {
  name: siteConfig.personName,
  brand: brandName,
  city: siteConfig.city,
  email: siteConfig.email,
  phone: siteConfig.phone,
  p: (chunks: ReactNode) => <p>{chunks}</p>,
  ul: (chunks: ReactNode) => <ul>{chunks}</ul>,
  li: (chunks: ReactNode) => <li>{chunks}</li>,
  b: (chunks: ReactNode) => <strong>{chunks}</strong>,
  br: () => <br />,
  mail: (chunks: ReactNode) => <a href={`mailto:${siteConfig.email}`}>{chunks}</a>,
  tel: (chunks: ReactNode) => <a href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}>{chunks}</a>,
};

type LegalTextProps = {
  /** Message group in legal.json. */
  page: "imprint" | "privacy";
  /** Section keys under `<page>.sections`, in display order. Each has `title` and `body`. */
  sections: readonly string[];
};

/**
 * Readable prose column for the legal pages: placeholder notice, one <h2> per section
 * and, if `<page>.updated` exists, the "Stand" line at the end.
 */
export async function LegalText({ page, sections }: LegalTextProps) {
  const t = await getTranslations("legal");

  return (
    <Section>
      <div className={styles.prose}>
        <p role="note" className={styles.notice}>
          {t.rich("notice", richValues)}
        </p>
        {sections.map((key) => (
          <section key={key} className={styles.block}>
            <h2 className={styles.heading}>{t(`${page}.sections.${key}.title`)}</h2>
            {t.rich(`${page}.sections.${key}.body`, richValues)}
          </section>
        ))}
        {t.has(`${page}.updated`) ? <p className={styles.updated}>{t(`${page}.updated`)}</p> : null}
      </div>
    </Section>
  );
}
