import { brandName, siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import type { ContactData } from "./schema";

/**
 * Translator for the `contact.email` namespace, e.g. from
 * `getTranslations({ locale, namespace: "contact.email" })`. Injected so the
 * builders stay pure and testable.
 */
export type Translate = (key: string, values?: Record<string, string | number>) => string;

export type EmailContent = { subject: string; html: string; text: string };

const COLORS = {
  navy: "#0d1b2a",
  sky: "#4fb3ff",
  skyInk: "#1a6fb3",
  ink: "#13202b",
  ink2: "#4a5d6f",
  rule: "#dde5ec",
  mist: "#f0f4f8",
} as const;

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

/** Escapes and keeps line breaks of multi-line input such as the message. */
function escapeMultiline(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br>");
}

/** Collapses whitespace incl. line breaks, e.g. for subject lines built from user input. */
function oneLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

const siteHost = siteConfig.url.replace(/^https?:\/\//, "");
const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

type Row = {
  label: string;
  value: string;
  /** Link target; built from validated values only. */
  href?: string;
  multiline?: boolean;
};

function renderRowsHtml(rows: Row[]): string {
  const border = `border-top:1px solid ${COLORS.rule};vertical-align:top;`;
  const thStyle = `padding:10px 16px 10px 0;${border}width:36%;font-weight:normal;color:${COLORS.ink2};`;
  const tdStyle = `padding:10px 0;${border}`;
  const body = rows
    .map((row) => {
      const value = row.multiline ? escapeMultiline(row.value) : escapeHtml(row.value);
      const content = row.href
        ? `<a href="${escapeHtml(row.href)}" style="color:${COLORS.skyInk};">${value}</a>`
        : value;
      return (
        `<tr><th scope="row" align="left" style="${thStyle}">${escapeHtml(row.label)}</th>` +
        `<td style="${tdStyle}">${content}</td></tr>`
      );
    })
    .join("\n");

  return (
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" ` +
    `style="border-collapse:collapse;margin:0 0 20px;font-size:15px;line-height:1.5;">\n${body}\n</table>`
  );
}

function renderRowsText(rows: Row[]): string {
  return rows
    .map((row) => (row.multiline ? `${row.label}:\n${row.value}` : `${row.label}: ${row.value}`))
    .join("\n");
}

/** `html` must already be escaped. */
function paragraph(html: string, style = "margin:0 0 16px;"): string {
  return `<p style="${style}">${html}</p>`;
}

/** Simple, image-free single-column layout with inline styles. */
function renderLayout({ lang, title, body }: { lang: string; title: string; body: string }): string {
  return [
    "<!DOCTYPE html>",
    `<html lang="${escapeHtml(lang)}">`,
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${escapeHtml(title)}</title>`,
    "</head>",
    `<body style="margin:0;padding:0;background:${COLORS.mist};">`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.mist};">`,
    '<tr><td align="center" style="padding:24px 12px;">',
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid ${COLORS.rule};font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:${COLORS.ink};">`,
    `<tr><td style="background:${COLORS.navy};padding:18px 24px;font-size:18px;font-weight:bold;color:#ffffff;">` +
      `${escapeHtml(siteConfig.brand.name)}<span style="color:${COLORS.sky};">${escapeHtml(siteConfig.brand.suffix)}</span></td></tr>`,
    `<tr><td style="padding:24px;">\n${body}\n</td></tr>`,
    "</table>",
    "</td></tr>",
    "</table>",
    "</body>",
    "</html>",
  ].join("\n");
}

function footerHtml(text: string): string {
  return paragraph(escapeHtml(text), `margin:24px 0 0;font-size:13px;color:${COLORS.ink2};`);
}

const timeframeLabel = (data: ContactData, t: Translate) =>
  data.timeframe ? t(`timeframes.${data.timeframe}`) : t("notSpecified");

/**
 * Notification to the site owner about a new enquiry. Pass a German translator:
 * the owner always gets German mail. Send with `replyTo` set to the requester.
 */
export function buildNotificationEmail(data: ContactData, t: Translate, locale: Locale = "de"): EmailContent {
  const topic = t(`topics.${data.topic}`);
  const subject = t("notification.subject", { topic, company: oneLine(data.company) });

  const rows: Row[] = [
    { label: t("fields.topic"), value: topic },
    { label: t("fields.salutation"), value: t(`salutations.${data.salutation}`) },
    { label: t("fields.name"), value: data.name },
    { label: t("fields.company"), value: data.company },
    { label: t("fields.email"), value: data.email, href: `mailto:${data.email}` },
    data.phone
      ? { label: t("fields.phone"), value: data.phone, href: telHref(data.phone) }
      : { label: t("fields.phone"), value: t("notSpecified") },
    { label: t("fields.timeframe"), value: timeframeLabel(data, t) },
    { label: t("fields.language"), value: t(`languages.${data.locale}`) },
    { label: t("fields.message"), value: data.message, multiline: true },
  ];

  const heading = t("notification.heading");
  const intro = t("notification.intro", { name: data.name, company: data.company, email: data.email });
  const footer = t("notification.footer", { site: siteHost });

  const html = renderLayout({
    lang: locale,
    title: subject,
    body: [
      `<h1 style="margin:0 0 12px;font-size:20px;line-height:1.3;">${escapeHtml(heading)}</h1>`,
      paragraph(escapeHtml(intro)),
      renderRowsHtml(rows),
      footerHtml(footer),
    ].join("\n"),
  });

  const text = [heading, "", intro, "", renderRowsText(rows), "", "--", footer].join("\n");

  return { subject, html, text };
}

/**
 * Confirmation to the requester in their language. Pass a translator for
 * `data.locale`. Deliberately leaves out the free-text message, so the form
 * cannot be abused to send arbitrary text to third-party addresses.
 */
export function buildConfirmationEmail(data: ContactData, t: Translate): EmailContent {
  const subject = t("confirmation.subject", { brand: brandName });
  const greeting = t(`confirmation.greeting.${data.salutation}`, { name: oneLine(data.name) });
  const thanks = t("confirmation.thanks");
  const next = t("confirmation.next");
  const summaryTitle = t("confirmation.summary");
  const questions = t("confirmation.questions", { phone: siteConfig.phone });
  const closing = t("confirmation.closing");
  const footer = t("confirmation.footer", { site: siteHost });

  const rows: Row[] = [
    { label: t("fields.topic"), value: t(`topics.${data.topic}`) },
    { label: t("fields.company"), value: data.company },
    { label: t("fields.timeframe"), value: timeframeLabel(data, t) },
  ];

  const phoneLabel = t("fields.phone");
  const emailLabel = t("fields.email");
  const link = (href: string, label: string) =>
    `<a href="${escapeHtml(href)}" style="color:${COLORS.skyInk};">${escapeHtml(label)}</a>`;

  const signatureHtml = paragraph(
    [
      escapeHtml(closing),
      `<strong>${escapeHtml(siteConfig.personName)}</strong>`,
      escapeHtml(brandName),
      `${escapeHtml(phoneLabel)}: ${link(telHref(siteConfig.phone), siteConfig.phone)}`,
      `${escapeHtml(emailLabel)}: ${link(`mailto:${siteConfig.email}`, siteConfig.email)}`,
      link(siteConfig.url, siteHost),
    ].join("<br>"),
    "margin:24px 0 0;",
  );

  const html = renderLayout({
    lang: data.locale,
    title: subject,
    body: [
      paragraph(escapeHtml(greeting)),
      paragraph(escapeHtml(thanks)),
      paragraph(escapeHtml(next)),
      `<h2 style="margin:24px 0 8px;font-size:16px;line-height:1.3;">${escapeHtml(summaryTitle)}</h2>`,
      renderRowsHtml(rows),
      paragraph(escapeHtml(questions)),
      signatureHtml,
      footerHtml(footer),
    ].join("\n"),
  });

  const text = [
    greeting,
    "",
    thanks,
    "",
    next,
    "",
    `${summaryTitle}:`,
    renderRowsText(rows),
    "",
    questions,
    "",
    closing,
    siteConfig.personName,
    brandName,
    `${phoneLabel}: ${siteConfig.phone}`,
    `${emailLabel}: ${siteConfig.email}`,
    siteConfig.url,
    "",
    "--",
    footer,
  ].join("\n");

  return { subject, html, text };
}
