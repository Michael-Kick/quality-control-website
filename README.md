# Quality Control Website

Zweisprachige Website (Deutsch/Englisch) für eine selbstständige QM-Beratung in Medizintechnik und Pharma: Audits, Schulungen und Beratung nach ISO 9001, ISO 13485, ISO 19011 und GMP.

- **Stack:** Next.js 16, next-intl, Resend, TypeScript, CSS Modules
- **Design und Entscheidungen:** [`docs/superpowers/specs/2026-11-01-qm-website-design.md`](docs/superpowers/specs/2026-11-01-qm-website-design.md)
- **Klickbares Mockup:** [`docs/design/mockup.html`](docs/design/mockup.html)

## Loslegen

```bash
npm install
cp .env.example .env.local   # Resend-Zugangsdaten eintragen, siehe docs/resend.md
npm run dev                  # http://localhost:3000 -> /de
```

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | Entwicklungsserver |
| `npm run build` | Produktions-Build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Routen-Typen erzeugen und TypeScript prüfen |
| `npm test` | Tests (Übersetzungen, Kontaktformular) |

## Inhalte ändern

- **Texte:** `messages/de/*.json` und `messages/en/*.json`, je eine Datei pro Seite plus `common.json`. Beide Sprachen müssen dieselben Schlüssel haben (prüft `npm test`).
- **Name, Telefon, E-Mail, LinkedIn, Ort:** `src/config/site.ts`.
- **Farben und Abstände:** Design-Tokens in `src/app/globals.css`.
- **Portraitfoto:** Platzhalter in `src/components/ui/Portrait.tsx`, später durch `next/image` ersetzen.

## Projektstruktur

```
messages/<locale>/<namespace>.json   Übersetzungen
src/app/[locale]/                    Seiten (de/en über next-intl)
src/components/layout/               Header, Footer, Sprachschalter
src/components/ui/                   Gemeinsame Bausteine (Section, Card, Button, ...)
src/components/<seite>/              Seitenspezifische Komponenten
src/i18n/                            Routing, Navigation, Request-Config, Metadaten
src/lib/contact/                     Kontaktformular: Validierung, Server Action, E-Mails
src/proxy.ts                         Sprach-Routing (Next.js 16 Proxy)
```
