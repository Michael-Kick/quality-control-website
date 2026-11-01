import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { AboutHead } from "@/components/about/AboutHead";
import { CareerTimeline } from "@/components/about/CareerTimeline";
import { Certificates } from "@/components/about/Certificates";
import { Principles } from "@/components/about/Principles";
import { CtaBand } from "@/components/ui/CtaBand";
import { alternatesFor } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await rootLocale();
  const t = await getTranslations("about.meta");

  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor("/ueber-mich", locale as Locale),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("about.cta");
  const common = await getTranslations("common.cta");

  return (
    <>
      <AboutHead />
      <CareerTimeline />
      <Certificates />
      <Principles />
      <CtaBand title={t("title")} text={t("text")} ctaLabel={common("bookIntroCall")} />
    </>
  );
}
