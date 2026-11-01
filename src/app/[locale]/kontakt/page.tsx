import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { ContactSection } from "@/components/contact/ContactSection";
import { PageHead } from "@/components/ui/PageHead";
import { alternatesFor } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await rootLocale();
  const t = await getTranslations("contact.meta");

  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor("/kontakt", locale as Locale),
  };
}

export default async function ContactPage() {
  const t = await getTranslations("contact.head");

  return (
    <>
      <PageHead eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <ContactSection />
    </>
  );
}
