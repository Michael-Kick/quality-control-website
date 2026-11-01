import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Section";
import styles from "./Hero.module.css";

const STAT_KEYS = ["experience", "audits", "standards", "languages"] as const;

/** Navy opening band of the home page: claim, two calls to action and four key figures. */
export async function Hero() {
  const t = await getTranslations("home.hero");
  const tc = await getTranslations("common.cta");

  return (
    <div className={styles.band}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <Eyebrow onDark>{t("eyebrow")}</Eyebrow>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.lead}>{t("lead")}</p>
          <div className={styles.ctas}>
            <ButtonLink href="/kontakt">{tc("introCall")}</ButtonLink>
            <ButtonLink href="/leistungen" variant="secondary">
              {tc("viewServices")}
            </ButtonLink>
          </div>
        </div>
        <ul className={styles.stats} aria-label={t("statsLabel")}>
          {STAT_KEYS.map((key) => (
            <li key={key} className={styles.stat}>
              <strong className={styles.value}>{t(`stats.${key}.value`)}</strong>{" "}
              <span className={styles.label}>{t(`stats.${key}.label`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
