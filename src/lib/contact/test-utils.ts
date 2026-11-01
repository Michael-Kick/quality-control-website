// Test helpers only (not imported by app code).
import { createTranslator } from "next-intl";
import de from "../../../messages/de/contact.json";
import en from "../../../messages/en/contact.json";
import type { Locale } from "@/i18n/routing";
import type { Translate } from "./emails";
import type { ContactData } from "./schema";

const messages = { de: { contact: de }, en: { contact: en } };

/** Real next-intl translator over messages/<locale>/contact.json, like `getTranslations` returns. */
export function translatorFor(locale: Locale, namespace = "contact.email"): Translate {
  const t = createTranslator({ locale, messages: messages[locale], namespace: namespace as "contact.email" });
  // Keys are checked at runtime here; the static key typing of createTranslator is not needed.
  return (key, values) => t(key as never, values as never);
}

export function contactData(overrides: Partial<ContactData> = {}): ContactData {
  return {
    topic: "audit",
    salutation: "ms",
    name: "Anna Muster",
    company: "Muster Medizintechnik GmbH",
    email: "anna.muster@example.com",
    phone: "+49 711 123456",
    timeframe: "1-3",
    message: "Lieferantenaudit nach ISO 13485,\nein Standort.",
    consent: true,
    locale: "de",
    ...overrides,
  };
}

/** A complete, valid submission as the browser sends it (incl. spam-check fields). */
export function validFormData(overrides: Record<string, string | null> = {}): FormData {
  const entries: Record<string, string | null> = {
    topic: "audit",
    salutation: "ms",
    name: "Anna Muster",
    company: "Muster Medizintechnik GmbH",
    email: "anna.muster@example.com",
    phone: "",
    timeframe: "asap",
    message: "Bitte um ein Erstgespräch.",
    consent: "on",
    locale: "de",
    website: "",
    startedAt: "1000000",
    submittedAt: "1060000",
    ...overrides,
  };
  const formData = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    if (value !== null) formData.set(key, value);
  }
  return formData;
}
