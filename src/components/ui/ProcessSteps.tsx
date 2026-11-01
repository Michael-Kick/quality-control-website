import { getTranslations } from "next-intl/server";
import { ButtonLink } from "./Button";
import { Section, SectionHead } from "./Section";
import styles from "./ProcessSteps.module.css";

const STEP_KEYS = ["contact", "call", "proposal", "delivery"] as const;

/**
 * "Ihr Weg zur Zusammenarbeit": the four steps from first contact to delivery,
 * followed by the "Jetzt unverbindlich beraten lassen" button. Used on the home and services pages.
 */
export async function ProcessSteps({ showIntro = true }: { showIntro?: boolean }) {
  const t = await getTranslations("common");

  return (
    <Section tone="muted" labelledBy="process-title">
      <SectionHead
        eyebrow={t("process.eyebrow")}
        title={t("process.title")}
        intro={showIntro ? t("process.intro") : undefined}
        titleId="process-title"
      />
      <ol className={styles.steps}>
        {STEP_KEYS.map((key, i) => (
          <li key={key} className={styles.step}>
            <span className={styles.number} aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <strong className={styles.title}>{t(`process.steps.${key}.title`)}</strong>
            <span className={styles.text}>{t(`process.steps.${key}.text`)}</span>
          </li>
        ))}
      </ol>
      <div>
        <ButtonLink href="/kontakt" variant="dark">
          {t("cta.adviceNoObligation")}
        </ButtonLink>
      </div>
    </Section>
  );
}
