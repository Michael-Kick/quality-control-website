import { getTranslations } from "next-intl/server";
import { ContactPersonCard } from "@/components/ui/ContactPersonCard";
import { siteConfig } from "@/config/site";
import styles from "./ContactAside.module.css";

const NEXT_STEPS = ["confirmation", "reply", "call", "proposal"] as const;

/** Right column of the contact page: response promise, direct contact details and next steps. */
export async function ContactAside() {
  const t = await getTranslations("contact");

  return (
    <div className={styles.aside}>
      <div className={`${styles.box} ${styles.promise}`}>
        <ContactPersonCard tone="dark" longRole />
        <p>{t("aside.promise")}</p>
      </div>

      <div className={styles.box}>
        <h2 className={styles.title}>{t("aside.direct.title")}</h2>
        <dl className={styles.details}>
          <div className={styles.detail}>
            <dt>{t("aside.direct.phone")}</dt>
            <dd>
              <a href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}>{siteConfig.phone}</a>
            </dd>
          </div>
          <div className={styles.detail}>
            <dt>{t("aside.direct.email")}</dt>
            <dd>
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </dd>
          </div>
          <div className={styles.detail}>
            <dt>{t("aside.direct.linkedin")}</dt>
            <dd>
              <a href={siteConfig.linkedin.href} target="_blank" rel="noopener noreferrer">
                {siteConfig.linkedin.label}
                <span className="visually-hidden"> {t("newTab")}</span>
              </a>
            </dd>
          </div>
          <div className={styles.detail}>
            <dt>{t("aside.direct.location")}</dt>
            <dd>{t("aside.direct.locationText", { city: siteConfig.city })}</dd>
          </div>
        </dl>
      </div>

      <div className={styles.box}>
        <h2 className={styles.title}>{t("aside.next.title")}</h2>
        <ol className={styles.steps}>
          {NEXT_STEPS.map((step) => (
            <li key={step}>{t(`aside.next.steps.${step}`)}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
