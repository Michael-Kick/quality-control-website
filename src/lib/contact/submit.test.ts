import { afterEach, describe, expect, it, vi } from "vitest";
import { sendContactEmails } from "./send";
import { isLikelySpam, MIN_FILL_TIME_MS } from "./spam";
import { processContactForm } from "./submit";
import { validFormData } from "./test-utils";

vi.mock("./send", () => ({ sendContactEmails: vi.fn(async () => ({ ok: true })) }));

// next-intl/server only works inside Next.js; use real translators over the JSON messages instead.
vi.mock("next-intl/server", async () => {
  const { translatorFor } = await import("./test-utils");
  return {
    getTranslations: async ({ locale, namespace }: { locale: "de" | "en"; namespace: string }) =>
      translatorFor(locale, namespace),
  };
});

const send = vi.mocked(sendContactEmails);

afterEach(() => {
  send.mockClear();
});

describe("spam rules", () => {
  const human = { honeypot: "", startedAt: "1000", submittedAt: String(1000 + MIN_FILL_TIME_MS + 5000) };

  it("lets a normal submission through", () => {
    expect(isLikelySpam(human)).toBe(false);
  });

  it("flags a filled honeypot", () => {
    expect(isLikelySpam({ ...human, honeypot: "https://spam.example" })).toBe(true);
  });

  it("flags submissions faster than the minimum fill time", () => {
    expect(isLikelySpam({ ...human, submittedAt: String(1000 + MIN_FILL_TIME_MS - 1) })).toBe(true);
    expect(isLikelySpam({ ...human, submittedAt: String(1000 + MIN_FILL_TIME_MS) })).toBe(false);
  });

  it("flags partial or garbled timestamps", () => {
    expect(isLikelySpam({ ...human, startedAt: "" })).toBe(true);
    expect(isLikelySpam({ ...human, submittedAt: "" })).toBe(true);
    expect(isLikelySpam({ ...human, startedAt: "yesterday" })).toBe(true);
  });

  it("relies on the honeypot alone when the form was sent without JavaScript", () => {
    expect(isLikelySpam({ honeypot: "", startedAt: "", submittedAt: "" })).toBe(false);
    expect(isLikelySpam({ honeypot: "spam", startedAt: "", submittedAt: "" })).toBe(true);
  });
});

describe("processContactForm", () => {
  it("sends both emails for a valid submission", async () => {
    await expect(processContactForm(validFormData())).resolves.toEqual({ status: "success" });

    expect(send).toHaveBeenCalledTimes(1);
    const [{ notification, confirmation, requesterEmail }] = send.mock.calls[0];
    expect(requesterEmail).toBe("anna.muster@example.com");
    expect(notification.subject).toBe("Neue Anfrage: Audit · Muster Medizintechnik GmbH");
    expect(confirmation.text.startsWith("Sehr geehrte Frau Anna Muster,")).toBe(true);
  });

  it("writes the confirmation in the requester's language but notifies in German", async () => {
    await processContactForm(validFormData({ locale: "en", topic: "consulting" }));

    const [{ notification, confirmation }] = send.mock.calls[0];
    expect(notification.subject).toBe("Neue Anfrage: Beratung · Muster Medizintechnik GmbH");
    expect(confirmation.subject).toBe("Your enquiry to NAME.QM has been received");
  });

  it("pretends success without sending when the honeypot is filled", async () => {
    await expect(processContactForm(validFormData({ website: "https://spam.example" }))).resolves.toEqual({
      status: "success",
    });
    expect(send).not.toHaveBeenCalled();
  });

  it("pretends success without sending when submitted too fast", async () => {
    await expect(processContactForm(validFormData({ startedAt: "1000000", submittedAt: "1001500" }))).resolves.toEqual({
      status: "success",
    });
    expect(send).not.toHaveBeenCalled();
  });

  it("still sends when the form was submitted without JavaScript (no timestamps)", async () => {
    await expect(processContactForm(validFormData({ startedAt: null, submittedAt: null }))).resolves.toEqual({
      status: "success",
    });
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("returns field errors and does not send invalid input", async () => {
    const result = await processContactForm(validFormData({ email: "nope", consent: null, name: "" }));
    expect(result).toEqual({ status: "invalid", errors: { email: "email", consent: "consent", name: "required" } });
    expect(send).not.toHaveBeenCalled();
  });

  it("returns a general error for a tampered locale", async () => {
    await expect(processContactForm(validFormData({ locale: "xx" }))).resolves.toEqual({ status: "error" });
    expect(send).not.toHaveBeenCalled();
  });

  it("returns a general error when sending fails", async () => {
    send.mockResolvedValueOnce({ ok: false });
    await expect(processContactForm(validFormData())).resolves.toEqual({ status: "error" });
  });
});
