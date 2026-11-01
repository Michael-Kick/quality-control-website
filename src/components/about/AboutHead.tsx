import { getTranslations } from "next-intl/server";
import { Portrait } from "@/components/ui/Portrait";
import { Eyebrow } from "@/components/ui/Section";
import { siteConfig } from "@/config/site";
import styles from "./AboutHead.module.css";

const FACT_KEYS = ["industries"] as const;

/** Navy page header with portrait, name, role line, intro and fact chips. */
export async function AboutHead() {
  const t = await getTranslations("about.head");
  const common = await getTranslations("common.person");

  return (
    <div className={styles.band}>
      <div className={`container ${styles.inner}`}>
        <Portrait label={common("photo")} size="lg" tone="dark" />
        <div className={styles.copy}>
          <Eyebrow onDark>{t("eyebrow")}</Eyebrow>
          <h1 className={styles.title}>{siteConfig.personName}</h1>
          <p className={styles.role}>{t("role")}</p>
          <p className={styles.lead}>{t("lead")}</p>
          <ul className={styles.facts} aria-label={t("factsLabel")}>
            {FACT_KEYS.map((key) => (
              <li key={key} className={styles.fact}>
                {t(`facts.${key}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
