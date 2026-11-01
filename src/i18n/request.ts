import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { loadMessages } from "./messages";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  // `locale` is only set when passed explicitly, e.g. getTranslations({ locale })
  // inside a Server Action. Otherwise read the `[locale]` root segment.
  const requested = locale ?? (await rootLocale());
  if (!hasLocale(routing.locales, requested)) notFound();

  return {
    locale: requested,
    messages: await loadMessages(requested),
  };
});
