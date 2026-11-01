import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppPathname, type Locale } from "@/i18n/routing";

const PAGES: AppPathname[] = ["/", "/leistungen", "/ueber-mich", "/kontakt", "/impressum", "/datenschutz"];

function absoluteUrl(href: AppPathname, locale: Locale) {
  return siteConfig.url + getPathname({ href, locale });
}

/**
 * Every page in every locale, each with its hreflang alternates.
 * No `lastModified`: `new Date()` would make the route dynamic under Cache Components.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((href) => {
    const languages = Object.fromEntries(routing.locales.map((locale) => [locale, absoluteUrl(href, locale)]));

    return routing.locales.map((locale) => ({
      url: absoluteUrl(href, locale),
      alternates: {
        languages: { ...languages, "x-default": absoluteUrl(href, routing.defaultLocale) },
      },
    }));
  });
}
