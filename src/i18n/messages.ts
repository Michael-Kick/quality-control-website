import type { Locale } from "./routing";

// Every namespace lives in its own file per locale (messages/<locale>/<namespace>.json),
// so pages can be translated independently. Add new namespaces here.
export const namespaces = [
  "common",
  "home",
  "services",
  "about",
  "contact",
  "legal",
] as const;

export type Namespace = (typeof namespaces)[number];

export async function loadMessages(locale: Locale) {
  const entries = await Promise.all(
    namespaces.map(async (ns) => {
      const mod = await import(`../../messages/${locale}/${ns}.json`);
      return [ns, mod.default] as const;
    }),
  );
  return Object.fromEntries(entries);
}
