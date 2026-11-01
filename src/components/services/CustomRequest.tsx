import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { ContactPersonCard } from "@/components/ui/ContactPersonCard";
import { Section } from "@/components/ui/Section";
import styles from "./CustomRequest.module.css";

/** "Ihr Anliegen ist nicht dabei?": bordered box with a call to action and the contact person. */
export async function CustomRequest() {
  const t = await getTranslations("services.custom");
  const tCommon = await getTranslations("common");

  return (
    <Section labelledBy="custom-request-title">
      <div className={styles.box}>
        <div className={styles.copy}>
          <h2 id="custom-request-title" className={styles.title}>
            {t("title")}
          </h2>
          <p className={styles.text}>{t("text")}</p>
          <ButtonLink href="/kontakt" variant="dark">
            {tCommon("cta.adviceNoObligation")}
          </ButtonLink>
        </div>
        <ContactPersonCard withLink />
      </div>
    </Section>
  );
}
