import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { LegalText } from "@/components/legal/LegalText";
import { PageHead } from "@/components/ui/PageHead";
import { brandName } from "@/config/site";
import { alternatesFor } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";

const SECTIONS = ["controller", "hosting", "contact", "resend", "fonts", "cookies", "rights", "complaint"] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await rootLocale();
  const t = await getTranslations("legal.privacy.meta");

  return {
    title: t("title"),
    description: t("description", { brand: brandName }),
    alternates: alternatesFor("/datenschutz", locale as Locale),
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations("legal.privacy");
  const common = await getTranslations("common.footer");

  return (
    <>
      <PageHead eyebrow={common("legal")} title={t("title")} lead={t("lead")} />
      <LegalText page="privacy" sections={SECTIONS} />
    </>
  );
}
