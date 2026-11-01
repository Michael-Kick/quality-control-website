import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import { buildConfirmationEmail, buildNotificationEmail, escapeHtml } from "./emails";
import { contactData, translatorFor } from "./test-utils";

const de = translatorFor("de");
const en = translatorFor("en");

describe("escapeHtml", () => {
  it("escapes markup characters", () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
  });
});

describe("notification email", () => {
  it("has a German subject with topic and company", () => {
    const email = buildNotificationEmail(contactData({ topic: "training", company: "ACME GmbH" }), de);
    expect(email.subject).toBe("Neue Anfrage: Schulung · ACME GmbH");
  });

  it("stays German for English-speaking requesters and names their language", () => {
    const email = buildNotificationEmail(contactData({ locale: "en" }), de);
    expect(email.subject).toContain("Neue Anfrage: Audit");
    expect(email.html).toContain('<html lang="de">');
    expect(email.text).toContain("Sprache: Englisch");
  });

  it("lists all fields", () => {
    const email = buildNotificationEmail(contactData(), de);
    for (const line of [
      "Anliegen: Audit",
      "Anrede: Frau",
      "Name: Anna Muster",
      "Unternehmen: Muster Medizintechnik GmbH",
      "E-Mail: anna.muster@example.com",
      "Telefon: +49 711 123456",
      "Gewünschter Zeitraum: In 1–3 Monaten",
      "Nachricht:\nLieferantenaudit nach ISO 13485,\nein Standort.",
    ]) {
      expect(email.text).toContain(line);
    }
    expect(email.html).toContain('href="mailto:anna.muster@example.com"');
    expect(email.html).toContain('href="tel:+49711123456"');
    expect(email.html).toContain("Lieferantenaudit nach ISO 13485,<br>ein Standort.");
  });

  it("shows optional fields that were left empty as not specified", () => {
    const email = buildNotificationEmail(contactData({ phone: "", timeframe: "", salutation: "none" }), de);
    expect(email.text).toContain("Telefon: Keine Angabe");
    expect(email.text).toContain("Gewünschter Zeitraum: Keine Angabe");
    expect(email.text).toContain("Anrede: Keine Angabe");
  });

  it("escapes user input in the HTML", () => {
    const evil = "<script>alert(1)</script>";
    const email = buildNotificationEmail(
      contactData({ name: evil, company: `${evil} "GmbH"`, message: `${evil}\n<img src=x onerror=alert(1)>` }),
      de,
    );
    expect(email.html).not.toContain("<script>");
    expect(email.html).not.toContain("<img");
    expect(email.html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(email.html).toContain("&quot;GmbH&quot;");
    // The plain-text part keeps the input as typed.
    expect(email.text).toContain(evil);
  });

  it("keeps the subject on one line", () => {
    const email = buildNotificationEmail(contactData({ company: "ACME\r\nBcc: victim@example.com" }), de);
    expect(email.subject).toBe("Neue Anfrage: Audit · ACME Bcc: victim@example.com");
  });
});

describe("confirmation email", () => {
  it.each([
    ["de", "ms", "Sehr geehrte Frau Anna Muster,"],
    ["de", "mr", "Sehr geehrter Herr Anna Muster,"],
    ["de", "none", "Guten Tag Anna Muster,"],
    ["en", "ms", "Dear Ms Anna Muster,"],
    ["en", "mr", "Dear Mr Anna Muster,"],
    ["en", "none", "Dear Anna Muster,"],
  ] as const)("greets in %s with salutation %s", (locale, salutation, greeting) => {
    const email = buildConfirmationEmail(contactData({ locale, salutation }), translatorFor(locale));
    expect(email.text.startsWith(greeting)).toBe(true);
    expect(email.html).toContain(greeting);
  });

  it("is written in the requester's language", () => {
    const german = buildConfirmationEmail(contactData({ locale: "de" }), de);
    const english = buildConfirmationEmail(contactData({ locale: "en", timeframe: "asap" }), en);

    expect(german.subject).toBe("Ihre Anfrage bei NAME.QM ist angekommen");
    expect(german.html).toContain('<html lang="de">');
    expect(german.text).toContain("innerhalb eines Werktags");
    expect(german.text).toContain("ca. 30 Minuten");

    expect(english.subject).toBe("Your enquiry to NAME.QM has been received");
    expect(english.html).toContain('<html lang="en">');
    expect(english.text).toContain("within one working day");
    expect(english.text).toContain("Preferred timeframe: As soon as possible");
  });

  it("summarises the request and signs with the contact details", () => {
    const email = buildConfirmationEmail(contactData(), de);
    expect(email.text).toContain("Anliegen: Audit");
    expect(email.text).toContain("Unternehmen: Muster Medizintechnik GmbH");
    for (const value of [siteConfig.personName, siteConfig.phone, siteConfig.email]) {
      expect(email.text).toContain(value);
      expect(email.html).toContain(value);
    }
  });

  it("does not echo the free-text message", () => {
    const email = buildConfirmationEmail(contactData({ message: "Buy cheap pills at spam.example" }), de);
    expect(email.text).not.toContain("spam.example");
    expect(email.html).not.toContain("spam.example");
  });

  it("escapes user input in the HTML", () => {
    const email = buildConfirmationEmail(
      contactData({ name: "<script>alert(1)</script>", company: "<b>ACME</b>" }),
      de,
    );
    expect(email.html).not.toContain("<script>");
    expect(email.html).not.toContain("<b>ACME</b>");
    expect(email.html).toContain("Sehr geehrte Frau &lt;script&gt;alert(1)&lt;/script&gt;,");
  });
});
