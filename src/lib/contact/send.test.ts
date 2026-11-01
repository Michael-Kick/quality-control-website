import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { siteConfig } from "@/config/site";
import { DEFAULT_FROM, sendContactEmails } from "./send";

const { sendMock, constructed } = vi.hoisted(() => ({ sendMock: vi.fn(), constructed: vi.fn() }));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
    constructor(key?: string) {
      constructed(key);
    }
  },
}));

const emails = {
  notification: { subject: "Neue Anfrage", html: "<p>n</p>", text: "n" },
  confirmation: { subject: "Bestätigung", html: "<p>c</p>", text: "c" },
  requesterEmail: "anna@example.com",
};

const ok = { data: { id: "1" }, error: null, headers: null };
const failed = {
  data: null,
  error: { name: "validation_error", statusCode: 403, message: "You can only send testing emails to your own email address" },
  headers: null,
};

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "info").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  sendMock.mockReset();
  constructed.mockReset();
});

describe("sendContactEmails", () => {
  describe("with configuration", () => {
    beforeEach(() => {
      vi.stubEnv("RESEND_API_KEY", "re_test");
      vi.stubEnv("CONTACT_TO_EMAIL", "owner@example.com");
      vi.stubEnv("CONTACT_FROM_EMAIL", "");
    });

    it("sends the notification, then the confirmation", async () => {
      sendMock.mockResolvedValue(ok);
      await expect(sendContactEmails(emails)).resolves.toEqual({ ok: true });

      expect(constructed).toHaveBeenCalledWith("re_test");
      expect(sendMock).toHaveBeenCalledTimes(2);
      expect(sendMock.mock.calls[0][0]).toMatchObject({
        from: DEFAULT_FROM,
        to: "owner@example.com",
        replyTo: "anna@example.com",
        subject: "Neue Anfrage",
      });
      expect(sendMock.mock.calls[1][0]).toMatchObject({
        to: "anna@example.com",
        replyTo: siteConfig.email,
        subject: "Bestätigung",
      });
    });

    it("uses CONTACT_FROM_EMAIL as sender when set", async () => {
      vi.stubEnv("CONTACT_FROM_EMAIL", "NAME.QM <kontakt@name-qm.de>");
      sendMock.mockResolvedValue(ok);
      await sendContactEmails(emails);
      expect(sendMock.mock.calls[0][0].from).toBe("NAME.QM <kontakt@name-qm.de>");
    });

    it("fails and skips the confirmation when the notification fails", async () => {
      sendMock.mockResolvedValueOnce(failed);
      await expect(sendContactEmails(emails)).resolves.toEqual({ ok: false });
      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalled();
    });

    it("fails when Resend throws (e.g. network error)", async () => {
      sendMock.mockRejectedValueOnce(new Error("fetch failed"));
      await expect(sendContactEmails(emails)).resolves.toEqual({ ok: false });
    });

    it("still succeeds when only the confirmation fails", async () => {
      sendMock.mockResolvedValueOnce(ok).mockResolvedValueOnce(failed);
      await expect(sendContactEmails(emails)).resolves.toEqual({ ok: true });
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining("Confirmation could not be sent"));
    });
  });

  describe("without configuration", () => {
    beforeEach(() => {
      vi.stubEnv("RESEND_API_KEY", "");
      vi.stubEnv("CONTACT_TO_EMAIL", "");
    });

    it("logs both emails in development and succeeds", async () => {
      vi.stubEnv("NODE_ENV", "development");
      await expect(sendContactEmails(emails)).resolves.toEqual({ ok: true });
      expect(constructed).not.toHaveBeenCalled();
      expect(console.info).toHaveBeenCalledTimes(2);
    });

    it("fails in production", async () => {
      vi.stubEnv("NODE_ENV", "production");
      await expect(sendContactEmails(emails)).resolves.toEqual({ ok: false });
      expect(constructed).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });
  });
});
