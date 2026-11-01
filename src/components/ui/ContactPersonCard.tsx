import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { TextLink } from "./Button";
import { Portrait } from "./Portrait";
import styles from "./ContactPersonCard.module.css";

type ContactPersonCardProps = {
  /** `dark` for placement on navy boxes (contact page aside). */
  tone?: "light" | "dark";
  /** Long role line ("… für Audits und Schulungen") instead of the short one. */
  longRole?: boolean;
  /** Adds the "Erstgespräch vereinbaren →" link. */
  withLink?: boolean;
};

/** Photo, name and role of the contact person, modelled on the QMH reference cards. */
export async function ContactPersonCard({ tone = "light", longRole = false, withLink = false }: ContactPersonCardProps) {
  const t = await getTranslations("common");

  return (
    <div className={[styles.card, tone === "dark" && styles.dark].filter(Boolean).join(" ")}>
      <Portrait label={t("person.photoShort")} size="sm" tone={tone} />
      <div className={styles.body}>
        <strong className={styles.name}>{siteConfig.personName}</strong>
        <span className={styles.role}>{longRole ? t("person.roleLong") : t("person.role")}</span>
        {withLink ? <TextLink href="/kontakt">{t("cta.bookIntroCallArrow")}</TextLink> : null}
      </div>
    </div>
  );
}
