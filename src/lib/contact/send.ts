import { Resend } from "resend";
import { brandName, siteConfig } from "@/config/site";
import type { EmailContent } from "./emails";

/** Resend's shared test sender; works without a verified domain. */
export const DEFAULT_FROM = `${brandName} <onboarding@resend.dev>`;

type ContactEmails = {
  /** To the site owner (`CONTACT_TO_EMAIL`), reply-to the requester. */
  notification: EmailContent;
  /** To the requester, reply-to the public contact address. */
  confirmation: EmailContent;
  requesterEmail: string;
};

type Outgoing = EmailContent & { from: string; to: string; replyTo: string };

/** Sends one email; Resend returns `{ data, error }` instead of throwing, network errors may still throw. */
async function deliver(resend: Resend, email: Outgoing, label: string): Promise<boolean> {
  try {
    const { error } = await resend.emails.send(email);
    if (error) {
      console.error(`[contact] ${label} could not be sent: ${error.name} (${error.statusCode ?? "-"}) ${error.message}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`[contact] ${label} could not be sent:`, error);
    return false;
  }
}

function logInsteadOfSending(email: Omit<Outgoing, "from" | "html">, label: string) {
  console.info(
    [
      `[contact] ${label} (not sent: RESEND_API_KEY or CONTACT_TO_EMAIL missing, see docs/resend.md)`,
      `To: ${email.to}`,
      `Reply-To: ${email.replyTo}`,
      `Subject: ${email.subject}`,
      "",
      email.text,
      "",
    ].join("\n"),
  );
}

/**
 * Sends the notification (must succeed) and then the confirmation (best effort:
 * without a verified domain Resend only delivers to the account owner's address).
 * Without configuration it logs both emails in development and fails in production.
 */
export async function sendContactEmails({
  notification,
  confirmation,
  requesterEmail,
}: ContactEmails): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || DEFAULT_FROM;

  if (!apiKey || !to) {
    if (process.env.NODE_ENV !== "production") {
      logInsteadOfSending({ ...notification, to: to || "(CONTACT_TO_EMAIL)", replyTo: requesterEmail }, "Notification");
      logInsteadOfSending({ ...confirmation, to: requesterEmail, replyTo: siteConfig.email }, "Confirmation");
      return { ok: true };
    }
    console.error("[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set, enquiry could not be sent.");
    return { ok: false };
  }

  const resend = new Resend(apiKey);

  const notified = await deliver(resend, { ...notification, from, to, replyTo: requesterEmail }, "Notification");
  if (!notified) return { ok: false };

  // The enquiry has reached the owner; a failed confirmation is logged but not shown as an error.
  await deliver(resend, { ...confirmation, from, to: requesterEmail, replyTo: siteConfig.email }, "Confirmation");

  return { ok: true };
}
