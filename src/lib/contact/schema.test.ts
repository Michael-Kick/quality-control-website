import { describe, expect, it } from "vitest";
import { MAX_LENGTH } from "./fields";
import { readContactFormData, validateContact } from "./schema";
import { validFormData } from "./test-utils";

const valid = {
  topic: "training",
  salutation: "mr",
  name: "  Max Beispiel  ",
  company: "Beispiel Pharma AG",
  email: " max@beispiel-pharma.de ",
  phone: "+49 89 1234567",
  timeframe: "3-6",
  message: "GMP-Schulung für 12 Personen.",
  consent: "on",
  locale: "en",
};

function errorsFor(input: Record<string, unknown>) {
  const result = validateContact(input);
  if (result.success) throw new Error("expected validation to fail");
  return result.errors;
}

describe("contact schema", () => {
  it("accepts a valid submission and trims strings", () => {
    const result = validateContact(valid);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).toMatchObject({
      topic: "training",
      salutation: "mr",
      name: "Max Beispiel",
      email: "max@beispiel-pharma.de",
      timeframe: "3-6",
      consent: true,
      locale: "en",
    });
  });

  it("treats empty optional fields as not specified", () => {
    const result = validateContact({ ...valid, salutation: "", phone: "", timeframe: "" });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.salutation).toBe("none");
    expect(result.data.phone).toBe("");
    expect(result.data.timeframe).toBe("");
  });

  it("reports missing required fields", () => {
    const errors = errorsFor({ ...valid, name: "", company: "   ", email: "", message: "" });
    expect(errors).toEqual({ name: "required", company: "required", email: "required", message: "required" });
  });

  it("reports absent fields as required", () => {
    const errors = errorsFor({ topic: "audit", consent: "on", locale: "de", salutation: "", phone: "", timeframe: "" });
    expect(errors).toMatchObject({ name: "required", company: "required", email: "required", message: "required" });
  });

  it("rejects an invalid email address", () => {
    expect(errorsFor({ ...valid, email: "max@beispiel" })).toEqual({ email: "email" });
    expect(errorsFor({ ...valid, email: "kein-at-zeichen.de" })).toEqual({ email: "email" });
  });

  it("rejects values outside the enums", () => {
    expect(errorsFor({ ...valid, topic: "webdesign" })).toEqual({ topic: "invalid" });
    expect(errorsFor({ ...valid, topic: "" })).toEqual({ topic: "invalid" });
    expect(errorsFor({ ...valid, salutation: "dr" })).toEqual({ salutation: "invalid" });
    expect(errorsFor({ ...valid, timeframe: "tomorrow" })).toEqual({ timeframe: "invalid" });
    expect(errorsFor({ ...valid, locale: "fr" })).toEqual({ locale: "invalid" });
  });

  it("requires consent", () => {
    expect(errorsFor({ ...valid, consent: "" })).toEqual({ consent: "consent" });
    expect(errorsFor({ ...valid, consent: "off" })).toEqual({ consent: "consent" });
    expect(validateContact({ ...valid, consent: true }).success).toBe(true);
  });

  it("limits the length of free text", () => {
    expect(errorsFor({ ...valid, message: "x".repeat(MAX_LENGTH.message + 1) })).toEqual({ message: "tooLong" });
    expect(errorsFor({ ...valid, name: "x".repeat(MAX_LENGTH.name + 1) })).toEqual({ name: "tooLong" });
  });

  it("reads FormData including the spam-check fields", () => {
    const raw = readContactFormData(validFormData({ consent: null, website: "spam" }));
    expect(raw.fields.consent).toBe("");
    expect(raw.fields.name).toBe("Anna Muster");
    expect(raw.honeypot).toBe("spam");
    expect(raw.startedAt).toBe("1000000");
    expect(raw.submittedAt).toBe("1060000");
  });
});
