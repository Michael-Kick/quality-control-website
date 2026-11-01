import { getTranslations } from "next-intl/server";
import { TextLink } from "@/components/ui/Button";
import { Card, CardGrid, CardIcon, CardText, CardTitle } from "@/components/ui/Card";
import { Section, SectionHead } from "@/components/ui/Section";
import styles from "./ServicesTeaser.module.css";

/**
 * `anchor` is the id of the matching section on the services page,
 * so "Zu den Schulungen" lands directly on the training offers.
 */
const SERVICES = [
  { key: "audits", icon: "✓", anchor: "audits" },
  { key: "training", icon: "≡", anchor: "training" },
  { key: "consulting", icon: "◇", anchor: "consulting" },
] as const;

/** "Drei Leistungsbereiche": one card per service area, each linking to the services page. */
export async function ServicesTeaser() {
  const t = await getTranslations("home.services");

  return (
    <Section labelledBy="home-services-title">
      <SectionHead eyebrow={t("eyebrow")} title={t("title")} titleId="home-services-title" />
      <CardGrid columns={3}>
        {SERVICES.map(({ key, icon, anchor }) => (
          <Card key={key}>
            <CardIcon>{icon}</CardIcon>
            <CardTitle>{t(`items.${key}.title`)}</CardTitle>
            <CardText>{t(`items.${key}.text`)}</CardText>
            <TextLink href={{ pathname: "/leistungen", hash: anchor }} className={styles.link}>
              {t(`items.${key}.link`)}
              <span aria-hidden="true"> →</span>
            </TextLink>
          </Card>
        ))}
      </CardGrid>
    </Section>
  );
}
