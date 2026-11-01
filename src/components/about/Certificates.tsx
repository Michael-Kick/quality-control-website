import { getTranslations } from "next-intl/server";
import { Section, SectionHead } from "@/components/ui/Section";
import styles from "./Certificates.module.css";

/** Each key has `standard`, `name` and `issuer` in about.certificates.items. */
const CERTIFICATE_KEYS = ["iso13485", "iso9001", "iso19011", "gmp"] as const;

/** "Zertifikate": qualification tiles with standard, certificate name and issuing body. */
export async function Certificates() {
  const t = await getTranslations("about.certificates");

  return (
    <Section tone="muted" labelledBy="certificates-title">
      <SectionHead eyebrow={t("eyebrow")} title={t("title")} titleId="certificates-title" />
      <ul className={styles.grid}>
        {CERTIFICATE_KEYS.map((key) => (
          <li key={key} className={styles.cert}>
            <span className={styles.standard}>{t(`items.${key}.standard`)}</span>
            <h3 className={styles.name}>{t(`items.${key}.name`)}</h3>
            <span className={styles.issuer}>{t(`items.${key}.issuer`)}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
