import { z } from "zod";
import { routing } from "@/i18n/routing";
import {
  ERROR_KEYS,
  HONEYPOT_FIELD,
  MAX_LENGTH,
  SALUTATIONS,
  STARTED_AT_FIELD,
  SUBMITTED_AT_FIELD,
  TIMEFRAMES,
  TOPICS,
  type ContactErrorKey,
  type ContactField,
  type FieldErrors,
} from "./fields";

const requiredText = (max: number) =>
  z.string("required").trim().min(1, "required").max(max, "tooLong");

/**
 * Server-side validation of the contact form. Error messages are message keys
 * (see `ERROR_KEYS`), translated by the client.
 */
export const contactSchema = z.object({
  topic: z.enum(TOPICS, "invalid"),
  // Optional: nothing selected means "no salutation".
  salutation: z
    .enum(["", ...SALUTATIONS], "invalid")
    .transform((value) => (value === "" ? "none" : value)),
  name: requiredText(MAX_LENGTH.name),
  company: requiredText(MAX_LENGTH.company),
  email: requiredText(MAX_LENGTH.email).pipe(z.email("email")),
  phone: z.string("invalid").trim().max(MAX_LENGTH.phone, "tooLong"),
  // Optional: "" means "please select" was left as is.
  timeframe: z.enum(["", ...TIMEFRAMES], "invalid"),
  message: requiredText(MAX_LENGTH.message),
  // An unchecked checkbox is not submitted at all, which arrives here as "".
  consent: z.literal(["on", true], "consent").transform(() => true as const),
  locale: z.enum(routing.locales, "invalid"),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

const FORM_FIELDS = [
  "topic",
  "salutation",
  "name",
  "company",
  "email",
  "phone",
  "timeframe",
  "message",
  "consent",
  "locale",
] as const satisfies readonly ContactField[];

/** Reads the raw form submission; missing or non-string entries become "". */
export function readContactFormData(formData: FormData) {
  const get = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  };

  return {
    fields: Object.fromEntries(FORM_FIELDS.map((name) => [name, get(name)])) as Record<
      (typeof FORM_FIELDS)[number],
      string
    >,
    honeypot: get(HONEYPOT_FIELD),
    startedAt: get(STARTED_AT_FIELD),
    submittedAt: get(SUBMITTED_AT_FIELD),
  };
}

function isErrorKey(value: string): value is ContactErrorKey {
  return (ERROR_KEYS as readonly string[]).includes(value);
}

function isFormField(value: unknown): value is ContactField {
  return typeof value === "string" && (FORM_FIELDS as readonly string[]).includes(value);
}

/** One error key per field (the first issue wins). */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (!isFormField(field) || errors[field]) continue;
    errors[field] = isErrorKey(issue.message) ? issue.message : "invalid";
  }
  return errors;
}

export type ValidationResult =
  | { success: true; data: ContactData }
  | { success: false; errors: FieldErrors };

export function validateContact(input: unknown): ValidationResult {
  const result = contactSchema.safeParse(input);
  return result.success
    ? { success: true, data: result.data }
    : { success: false, errors: toFieldErrors(result.error) };
}
