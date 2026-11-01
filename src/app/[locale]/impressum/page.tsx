import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { LegalText } from "@/components/legal/LegalText";
import { PageHead } from "@/components/ui/PageHead";
import { brandName } from "@/config/site";
import { alternatesFor } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";

const SECTIONS = ["provider", "contact", "vat", "responsible", "dispute"] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await rootLocale();
  const t = await getTranslations("legal.imprint.meta");

  return {
    title: t("title"),
    description: t("description", { brand: brandName }),
    alternates: alternatesFor("/impressum", locale as Locale),
  };
}

export default async function ImprintPage() {
  const t = await getTranslations("legal.imprint");
  const common = await getTranslations("common.footer");

  return (
    <>
      <PageHead eyebrow={common("legal")} title={t("title")} lead={t("lead")} />
      <LegalText page="imprint" sections={SECTIONS} />
    </>
  );
}
