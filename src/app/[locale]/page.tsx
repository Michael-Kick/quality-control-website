import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { Hero } from "@/components/home/Hero";
import { ServicesTeaser } from "@/components/home/ServicesTeaser";
import { CtaBand } from "@/components/ui/CtaBand";
import { ProcessSteps } from "@/components/ui/ProcessSteps";
import { StandardsBar } from "@/components/ui/StandardsBar";
import { brandName } from "@/config/site";
import { alternatesFor } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await rootLocale();
  const t = await getTranslations("home.meta");

  return {
    // Absolute, so the layout's "%s | NAME.QM" template is not applied twice.
    title: { absolute: `${t("title")} | ${brandName}` },
    description: t("description"),
    alternates: alternatesFor("/", locale as Locale),
  };
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const tc = await getTranslations("common.cta");

  return (
    <>
      <Hero />
      <StandardsBar label={t("standardsLabel")} />
      <ServicesTeaser />
      <ProcessSteps />
      <AboutTeaser />
      <CtaBand title={t("cta.title")} text={t("cta.text")} ctaLabel={tc("bookIntroCall")} />
    </>
  );
}
