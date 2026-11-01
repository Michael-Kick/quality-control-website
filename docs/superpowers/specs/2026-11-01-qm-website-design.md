# QM-Website: Design und Umsetzung

Stand: 2026-11-01. Visuelle Referenz: [`docs/design/mockup.html`](../../design/mockup.html) (im Browser öffnen, DE/EN-Schalter und Seiten sind klickbar).

## Zweck

Website für eine Person, die sich im Qualitätsmanagement selbstständig macht. Zielgruppe sind kleine und mittlere Unternehmen (KMU) aus Medizintechnik und Pharma. Die Seite soll professionell wirken, leicht zu navigieren sein und Besucher zu einem **kostenlosen, unverbindlichen Erstgespräch** (ca. 30 Minuten) führen. Die Kontaktaufnahme ist an qmh-group.com/leistungsuebersicht angelehnt.

## Inhalt

- **Leistungen:** Audits, Schulungen, Beratung (inkl. „Beauftragter der Leitung (extern)“ nach ISO 13485 Abschnitt 5.5.2 bzw. QMB nach ISO 9001).
- **Normen:** ISO 9001, ISO 13485, ISO 19011, GMP.
- **Seiten:** Startseite, Leistungen, Über mich (Werdegang, Zertifikate), Kontakt (Formular), Impressum, Datenschutz.
- **Zweisprachig:** Die ganze Website lässt sich per Schiebeschalter im Header zwischen Deutsch und Englisch umschalten. Der Schalter führt auf die gleiche Seite in der anderen Sprache.
- Alle Namen, Zahlen, Stationen, Zertifikate und Kontaktdaten sind **Platzhalter** und werden später ersetzt.

## Entscheidungen

| Thema | Entscheidung |
| --- | --- |
| Framework | Next.js 16 (App Router, Cache Components, `proxy.ts`), TypeScript |
| i18n | next-intl 4, Locale-Präfix immer (`/de`, `/en`), keine automatische Spracherkennung, `/` → `/de` |
| URLs | `/de/leistungen` ↔ `/en/services`, `/de/ueber-mich` ↔ `/en/about`, `/de/kontakt` ↔ `/en/contact`, `/de/impressum` ↔ `/en/legal-notice`, `/de/datenschutz` ↔ `/en/privacy` |
| Texte | `messages/<locale>/<namespace>.json`, ein Namespace pro Seite plus `common` |
| Personendaten | `src/config/site.ts` (sprachunabhängig) |
| Styling | CSS Modules pro Komponente, Design-Tokens in `src/app/globals.css`, Schrift IBM Plex Sans über `next/font` |
| Design | Variante C „Corporate & strukturiert“: Navy-Header, Akzent Himmelblau, helle Grau-Bänder im Wechsel |
| Kontaktformular | Server Action, Validierung mit zod, Versand über Resend: Benachrichtigung an `CONTACT_TO_EMAIL` und automatische Eingangsbestätigung an die anfragende Person in deren Sprache |
| Spam-Schutz | Honeypot-Feld und Mindest-Ausfüllzeit |
| Tests | vitest: Übersetzungs-Parität DE/EN, Formular-Validierung, E-Mail-Inhalte |

## Kontaktformular

Felder: Anliegen (Audit / Schulung / Beratung / Sonstiges, Pflicht), Anrede (Frau / Herr / Keine Angabe, optional), Name*, Unternehmen*, geschäftliche E-Mail*, Telefon (optional), gewünschter Zeitraum (optional), Nachricht*, Datenschutz-Einwilligung*.

Ablauf nach dem Absenden: Erfolgsmeldung im Formular, Mail an die Person (Reply-To = anfragende Person), Bestätigungsmail an die anfragende Person. Ohne `RESEND_API_KEY` wird in der Entwicklung nur in die Konsole geloggt; in Produktion gibt es eine verständliche Fehlermeldung mit Hinweis auf Telefon und E-Mail.

Umgebungsvariablen: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.

## Nicht Teil dieser Version

Preise, Referenzen/Kundenstimmen, Online-Terminkalender, Blog, Cookie-Banner (keine Tracking-Cookies im Einsatz), echte Impressums- und Datenschutztexte (Platzhalter mit Gliederung).

## Aufteilung der Umsetzung

Fundament (i18n, Layout, Header, Footer, Sprachschalter, gemeinsame UI-Bausteine in `src/components/ui`) ist gebaut. Die Seiten werden parallel umgesetzt, jede Einheit besitzt eigene Dateien:

| Einheit | Dateien |
| --- | --- |
| Startseite | `src/app/[locale]/page.tsx`, `src/components/home/**`, `messages/*/home.json` |
| Leistungen | `src/app/[locale]/leistungen/**`, `src/components/services/**`, `messages/*/services.json` |
| Über mich, Rechtliches, SEO | `src/app/[locale]/ueber-mich/**`, `impressum/**`, `datenschutz/**`, `src/components/about/**`, `src/components/legal/**`, `messages/*/about.json`, `messages/*/legal.json`, `src/app/sitemap.ts`, `src/app/robots.ts` |
| Kontakt | `src/app/[locale]/kontakt/**`, `src/components/contact/**`, `src/lib/contact/**`, `messages/*/contact.json`, `.env.example`, `docs/resend.md` |
