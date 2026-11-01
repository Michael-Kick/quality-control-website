import { getTranslations } from "next-intl/server";
import { brandName, siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import styles from "./Footer.module.css";

export async function Footer() {
  const t = await getTranslations("common.footer");
  // Fixed instead of new Date(): keeps the footer fully static under Cache Components.
  const year = 2026;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.cols}`}>
        <div className={styles.col}>
          <strong className={styles.heading}>{brandName}</strong>
          <span>{t("tagline")}</span>
        </div>
        <div className={styles.col}>
          <strong className={styles.heading}>{t("contact")}</strong>
          <a href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}>{siteConfig.phone}</a>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        </div>
        <div className={styles.col}>
          <strong className={styles.heading}>{t("legal")}</strong>
          <Link href="/impressum">{t("imprint")}</Link>
          <Link href="/datenschutz">{t("privacy")}</Link>
          <a href={siteConfig.linkedin.href} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
      <div className={`container ${styles.legal}`}>
        © {year} {siteConfig.personName}. {t("rights")}
      </div>
    </footer>
  );
}
