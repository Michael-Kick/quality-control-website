import { getTranslations } from "next-intl/server";
import { Card, CardGrid, CardText, CardTitle, SpecList, Tag } from "@/components/ui/Card";
import { Section, SectionHead } from "@/components/ui/Section";
import type { ServiceGroup } from "./serviceGroups";
import styles from "./ServiceSection.module.css";

/**
 * One service area (Audits, Schulungen, Beratung) with its cards.
 * A card's tag and text are optional: they are shown when the message exists.
 */
export async function ServiceSection({ group }: { group: ServiceGroup }) {
  const t = await getTranslations("services");
  const titleId = `${group.id}-title`;

  return (
    <Section id={group.id} tone={group.tone} labelledBy={titleId} className={styles.anchor}>
      <SectionHead
        eyebrow={t(`${group.id}.label`)}
        title={t(`${group.id}.title`)}
        intro={t(`${group.id}.intro`)}
        titleId={titleId}
      />
      <CardGrid columns={2}>
        {group.items.map((item) => {
          const base = `${group.id}.items.${item.key}`;
          const specs = (item.specs ?? group.specs).map((spec) => ({
            label: t(`specLabels.${spec}`),
            value: t(`${base}.specs.${spec}`),
          }));

          return (
            <Card key={item.key} featured={item.featured}>
              {t.has(`${base}.tag`) ? <Tag>{t(`${base}.tag`)}</Tag> : null}
              <CardTitle>{t(`${base}.title`)}</CardTitle>
              {t.has(`${base}.text`) ? <CardText>{t(`${base}.text`)}</CardText> : null}
              <SpecList items={specs} />
            </Card>
          );
        })}
      </CardGrid>
    </Section>
  );
}
