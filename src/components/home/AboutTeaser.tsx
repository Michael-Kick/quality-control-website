import { getTranslations } from "next-intl/server";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { Portrait } from "@/components/ui/Portrait";
import { Eyebrow, Section } from "@/components/ui/Section";
import { siteConfig } from "@/config/site";
import styles from "./AboutTeaser.module.css";

/** Portrait plus short introduction of the person, linking to the intro call and the about page. */
export async function AboutTeaser() {
  const t = await getTranslations("home.about");
  const tc = await getTranslations("common");

  return (
    <Section labelledBy="home-about-title">
      <div className={styles.split}>
        <Portrait label={tc("person.photo")} />
        <div className={styles.body}>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 id="home-about-title" className={styles.name}>
            {siteConfig.personName}
          </h2>
          <p className={styles.role}>{t("role")}</p>
          <p className={styles.text}>{t("text")}</p>
          <div className={styles.actions}>
            <ButtonLink href="/kontakt" variant="dark">
              {tc("cta.bookIntroCall")}
            </ButtonLink>
            <TextLink href="/ueber-mich">
              {t("link")}
              <span aria-hidden="true"> →</span>
            </TextLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
