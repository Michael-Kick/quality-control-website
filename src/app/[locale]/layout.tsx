import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { brandName, siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import "../globals.css";

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("common.meta");
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t("defaultTitle"), template: `%s | ${brandName}` },
    description: t("description"),
  };
}

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();
  const t = await getTranslations("common.nav");
  const messages = await getMessages();
  // Only the strings that client components render go to the browser.
  const clientMessages = {
    common: { nav: messages.common.nav, langSwitch: messages.common.langSwitch },
    contact: { form: messages.contact.form, newTab: messages.contact.newTab },
  };

  return (
    <html lang={locale} className={plex.variable}>
      <body>
        <NextIntlClientProvider messages={clientMessages}>
          <a className="skip-link" href="#main">
            {t("skipToContent")}
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
