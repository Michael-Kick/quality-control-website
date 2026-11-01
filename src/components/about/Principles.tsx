import { getTranslations } from "next-intl/server";
import { Card, CardGrid, CardText, CardTitle } from "@/components/ui/Card";
import { Section, SectionHead } from "@/components/ui/Section";

const PRINCIPLE_KEYS = ["independent", "confidential", "insured"] as const;

/** "Grundsätze": independence, confidentiality and liability insurance. */
export async function Principles() {
  const t = await getTranslations("about.principles");

  return (
    <Section labelledBy="principles-title">
      <SectionHead eyebrow={t("eyebrow")} title={t("title")} titleId="principles-title" />
      <CardGrid columns={3}>
        {PRINCIPLE_KEYS.map((key) => (
          <Card key={key}>
            <CardTitle>{t(`items.${key}.title`)}</CardTitle>
            <CardText>{t(`items.${key}.text`)}</CardText>
          </Card>
        ))}
      </CardGrid>
    </Section>
  );
}
