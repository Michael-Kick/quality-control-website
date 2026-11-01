import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["de", "en"],
  defaultLocale: "de",
  localePrefix: "always",
  // No automatic redirect based on browser language: `/` always goes to German,
  // the visitor switches with the toggle in the header.
  localeDetection: false,
  // Without detection the NEXT_LOCALE cookie is never read; disabling it keeps
  // the site cookie-free, as stated in the privacy policy.
  localeCookie: false,
  pathnames: {
    "/": "/",
    "/leistungen": { de: "/leistungen", en: "/services" },
    "/ueber-mich": { de: "/ueber-mich", en: "/about" },
    "/kontakt": { de: "/kontakt", en: "/contact" },
    "/impressum": { de: "/impressum", en: "/legal-notice" },
    "/datenschutz": { de: "/datenschutz", en: "/privacy" },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
