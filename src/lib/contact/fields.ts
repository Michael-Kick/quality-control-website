// Contact form definitions shared by the client form and the server action.
// Keep this file free of server-only imports (zod, resend, next-intl/server).

export const TOPICS = ["audit", "training", "consulting", "other"] as const;
export const SALUTATIONS = ["ms", "mr", "none"] as const;
export const TIMEFRAMES = ["asap", "1-3", "3-6", "open"] as const;

export type Topic = (typeof TOPICS)[number];
export type Salutation = (typeof SALUTATIONS)[number];
export type Timeframe = (typeof TIMEFRAMES)[number];

export const MAX_LENGTH = {
  name: 100,
  company: 150,
  email: 254,
  phone: 40,
  message: 5000,
} as const;

/** Honeypot: hidden from people, bots tend to fill it. */
export const HONEYPOT_FIELD = "website";
/** Client timestamp (ms) set once the form is interactive. */
export const STARTED_AT_FIELD = "startedAt";
/** Client timestamp (ms) added on submit; compared with `startedAt` on the same clock. */
export const SUBMITTED_AT_FIELD = "submittedAt";

/** Visible fields in display order (used to focus the first invalid one). */
export const VISIBLE_FIELDS = [
  "topic",
  "salutation",
  "name",
  "company",
  "email",
  "phone",
  "timeframe",
  "message",
  "consent",
] as const;

export type ContactField = (typeof VISIBLE_FIELDS)[number] | "locale";

/** Validation errors are message keys, translated on the client (`contact.form.errors.<key>`). */
export const ERROR_KEYS = ["required", "email", "tooLong", "invalid", "consent"] as const;
export type ContactErrorKey = (typeof ERROR_KEYS)[number];
export type FieldErrors = Partial<Record<ContactField, ContactErrorKey>>;

export type ContactFormState =
  | { status: "idle" }
  | { status: "invalid"; errors: FieldErrors }
  | { status: "error" }
  | { status: "success" };

export const initialContactState: ContactFormState = { status: "idle" };
