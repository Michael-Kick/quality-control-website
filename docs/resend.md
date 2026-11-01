# E-Mail-Versand mit Resend

Das Kontaktformular verschickt zwei E-Mails über [Resend](https://resend.com):

1. **Benachrichtigung** an Sie (`CONTACT_TO_EMAIL`), immer auf Deutsch, mit allen Angaben. „Antworten“ geht direkt an die anfragende Person (Reply-To).
2. **Eingangsbestätigung** an die anfragende Person, in ihrer Sprache (Deutsch oder Englisch). „Antworten“ geht an die öffentliche Kontaktadresse aus `src/config/site.ts`.

Die Benachrichtigung muss ankommen, sonst sieht die Person eine Fehlermeldung mit Telefonnummer und E-Mail-Adresse als Alternative. Scheitert nur die Bestätigung, wird das im Server-Log vermerkt und die Anfrage gilt trotzdem als gesendet.

Code: `src/lib/contact/` (Validierung `schema.ts`, Server Action `actions.ts`, E-Mail-Texte `emails.ts` mit den Texten aus `messages/<sprache>/contact.json` unter `email`, Versand `send.ts`).

## Umgebungsvariablen

| Variable | Pflicht | Bedeutung |
| --- | --- | --- |
| `RESEND_API_KEY` | ja (Produktion) | API-Schlüssel von Resend, beginnt mit `re_` |
| `CONTACT_TO_EMAIL` | ja (Produktion) | Ihr Postfach für neue Anfragen |
| `CONTACT_FROM_EMAIL` | empfohlen | Absender, z. B. `NAME.QM <kontakt@name-qm.de>`. Ohne Angabe: `NAME.QM <onboarding@resend.dev>` |

Die Schlüssel gehören nie ins Repository. `.env.local` ist über `.gitignore` ausgeschlossen.

## 1. Konto und API-Schlüssel anlegen

1. Auf [resend.com](https://resend.com) registrieren (der kostenlose Tarif reicht für ein Kontaktformular).
2. Im Dashboard unter **API Keys** auf **Create API Key** klicken.
3. Name vergeben (z. B. `website-produktion`), Berechtigung **Sending access** wählen und, sobald die Domain verifiziert ist, auf diese Domain beschränken.
4. Den Schlüssel sofort kopieren, er wird nur einmal angezeigt.

## 2. Domain verifizieren

Ohne verifizierte Domain gilt eine wichtige Einschränkung: Resend stellt dann **nur an die E-Mail-Adresse des eigenen Resend-Kontos** zu, und als Absender ist nur `onboarding@resend.dev` erlaubt. Die Benachrichtigung an Sie funktioniert also (wenn `CONTACT_TO_EMAIL` die Konto-Adresse ist), die **Eingangsbestätigung an Besucher aber erst nach der Domain-Verifizierung**.

1. Im Dashboard unter **Domains** auf **Add Domain** klicken und die Domain eintragen, z. B. `name-qm.de`. Resend empfiehlt eine Subdomain nur für den Versand (z. B. `mail.name-qm.de` oder `send.name-qm.de`), damit der Ruf der Hauptdomain geschützt bleibt; beides funktioniert.
2. Resend zeigt die nötigen DNS-Einträge an. Diese beim Domain-Anbieter (z. B. IONOS, Strato, Cloudflare) eintragen:
   - **SPF**: ein `TXT`-Eintrag (und ein `MX`-Eintrag für die Rückläufer-Adresse), der Resend als erlaubten Absender ausweist.
   - **DKIM**: ein `TXT`-Eintrag (`resend._domainkey`) mit dem öffentlichen Schlüssel, mit dem Resend jede E-Mail signiert.
   - **DMARC** (optional, empfohlen): ein `TXT`-Eintrag `_dmarc`, z. B. `v=DMARC1; p=none; rua=mailto:dmarc@name-qm.de;`. Mit `p=none` wird nur beobachtet; später auf `p=quarantine` verschärfen.
3. Auf **Verify DNS Records** klicken. Die Prüfung dauert meist wenige Minuten, kann aber bis zu 72 Stunden brauchen.
4. Danach `CONTACT_FROM_EMAIL` auf eine Adresse dieser Domain setzen, z. B. `NAME.QM <kontakt@name-qm.de>` (bzw. `kontakt@mail.name-qm.de` bei einer Subdomain).

## 3. Variablen setzen

**Lokal:** `.env.example` nach `.env.local` kopieren und ausfüllen:

```bash
cp .env.example .env.local
```

```dotenv
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
CONTACT_TO_EMAIL=kontakt@name-qm.de
CONTACT_FROM_EMAIL=NAME.QM <kontakt@name-qm.de>
```

Nach einer Änderung an `.env.local` den Entwicklungsserver neu starten.

**Hosting (z. B. Vercel):** Im Projekt unter **Settings → Environment Variables** die drei Variablen anlegen, mindestens für die Umgebung **Production** (für Vorschau-Deployments optional auch **Preview**). Danach neu deployen, damit die Werte greifen. Bei anderen Anbietern die Variablen in deren Projekteinstellungen bzw. als Umgebungsvariablen des Node-Prozesses setzen.

## 4. Lokal testen

- **Ohne API-Schlüssel** (`npm run dev`, `RESEND_API_KEY` leer): Nichts wird verschickt. Beide E-Mails (Betreff, Empfänger, Text) erscheinen in der Konsole des Entwicklungsservers, das Formular zeigt die Erfolgsmeldung. So lassen sich Formular und E-Mail-Texte ohne Konto prüfen.
- **Mit API-Schlüssel, ohne verifizierte Domain:** `CONTACT_FROM_EMAIL` leer lassen und `CONTACT_TO_EMAIL` auf die Adresse Ihres Resend-Kontos setzen. Die Benachrichtigung kommt an; die Bestätigung an andere Adressen lehnt Resend ab (steht im Server-Log, das Formular meldet trotzdem Erfolg). Zum Testen der Bestätigung im Formular ebenfalls die Konto-Adresse eingeben.
- **Mit verifizierter Domain:** Beide E-Mails werden an beliebige Adressen zugestellt. Versendete E-Mails und Fehler sind im Resend-Dashboard unter **Emails** bzw. **Logs** einsehbar.

Hinweise:

- Der Spam-Schutz verwirft Anfragen, die schneller als 3 Sekunden nach dem Laden der Seite abgeschickt werden oder ein verstecktes Feld ausfüllen, und meldet trotzdem Erfolg. Beim Testen also kurz warten.
- In Produktion (`next build` + `next start`, oder auf dem Hosting) führt ein fehlender `RESEND_API_KEY` oder `CONTACT_TO_EMAIL` zu einer Fehlermeldung im Formular mit Telefon und E-Mail als Alternative; im Server-Log steht der Grund.
