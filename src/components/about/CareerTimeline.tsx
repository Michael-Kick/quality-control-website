import { getTranslations } from "next-intl/server";
import { Section, SectionHead } from "@/components/ui/Section";
import { brandName, siteConfig } from "@/config/site";
import styles from "./CareerTimeline.module.css";

/** Newest first. Each key has `period`, `role` and `org` in about.career.entries. */
const ENTRY_KEYS = ["selfEmployed", "headOfQuality", "qualityAssurance", "qualityEngineering", "degree"] as const;

/** "Werdegang": vertical timeline with years, dot and line, role and organisation. */
export async function CareerTimeline() {
  const t = await getTranslations("about.career");

  return (
    <Section labelledBy="career-title">
      <SectionHead eyebrow={t("eyebrow")} title={t("title")} titleId="career-title" />
      <ol className={styles.timeline}>
        {ENTRY_KEYS.map((key) => (
          <li key={key} className={styles.entry}>
            <span className={styles.period}>{t(`entries.${key}.period`)}</span>
            <div className={styles.what}>
              <strong className={styles.role}>{t(`entries.${key}.role`)}</strong>
              <span className={styles.org}>
                {t(`entries.${key}.org`, { brand: brandName, city: siteConfig.city })}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
