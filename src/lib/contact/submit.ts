import { getTranslations } from "next-intl/server";
import { buildConfirmationEmail, buildNotificationEmail, type Translate } from "./emails";
import type { ContactFormState } from "./fields";
import { readContactFormData, validateContact } from "./schema";
import { sendContactEmails } from "./send";
import { isLikelySpam } from "./spam";

/** Validates a contact form submission, filters bots and sends the emails. */
export async function processContactForm(formData: FormData): Promise<ContactFormState> {
  const { fields, honeypot, startedAt, submittedAt } = readContactFormData(formData);

  const result = validateContact(fields);
  if (!result.success) {
    // `locale` is a hidden field, so an invalid value means a tampered request.
    if (result.errors.locale) return { status: "error" };
    return { status: "invalid", errors: result.errors };
  }

  if (isLikelySpam({ honeypot, startedAt, submittedAt })) {
    // Pretend it worked so bots get no hint that they were filtered out.
    return { status: "success" };
  }

  const data = result.data;
  try {
    // `next/root-params` is not available in Server Actions, so the locale is passed explicitly.
    const [ownerT, requesterT]: Translate[] = await Promise.all([
      getTranslations({ locale: "de", namespace: "contact.email" }),
      getTranslations({ locale: data.locale, namespace: "contact.email" }),
    ]);

    const { ok } = await sendContactEmails({
      notification: buildNotificationEmail(data, ownerT, "de"),
      confirmation: buildConfirmationEmail(data, requesterT),
      requesterEmail: data.email,
    });
    return ok ? { status: "success" } : { status: "error" };
  } catch (error) {
    console.error("[contact] Unexpected error while sending the enquiry:", error);
    return { status: "error" };
  }
}
