import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { CustomRequest } from "@/components/services/CustomRequest";
import { JumpNav } from "@/components/services/JumpNav";
import { ServiceSection } from "@/components/services/ServiceSection";
import { serviceGroups } from "@/components/services/serviceGroups";
import { PageHead } from "@/components/ui/PageHead";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { alternatesFor } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await rootLocale();
  const t = await getTranslations("services.meta");

  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor("/leistungen", locale as Locale),
  };
}

export default async function ServicesPage() {
  const t = await getTranslations("services");

  return (
    <>
      <PageHead eyebrow={t("head.eyebrow")} title={t("head.title")} lead={t("head.lead")}>
        <JumpNav
          label={t("head.jumpNavLabel")}
          links={serviceGroups.map((group) => ({ id: group.id, label: t(`${group.id}.label`) }))}
        />
      </PageHead>
      {serviceGroups.map((group) => (
        <ServiceSection key={group.id} group={group} />
      ))}
      <CustomRequest />
      <ProcessSteps showIntro={false} />
    </>
  );
}
