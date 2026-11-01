import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getPathname } from "./navigation";
import { routing, type AppPathname, type Locale } from "./routing";

/**
 * Canonical URL plus hreflang alternates for a page, e.g. for "/leistungen":
 * de -> /de/leistungen, en -> /en/services, x-default -> German version.
 */
export function alternatesFor(pathname: AppPathname, locale: Locale): Metadata["alternates"] {
  const urls = Object.fromEntries(
    routing.locales.map((l) => [l, siteConfig.url + getPathname({ href: pathname, locale: l })]),
  ) as Record<Locale, string>;

  return {
    canonical: urls[locale],
    languages: { ...urls, "x-default": urls[routing.defaultLocale] },
  };
}
