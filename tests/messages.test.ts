import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { namespaces } from "@/i18n/messages";

const root = join(__dirname, "..", "messages");

function load(locale: string, ns: string) {
  return JSON.parse(readFileSync(join(root, locale, `${ns}.json`), "utf8"));
}

/** Flattens nested messages into dotted keys: { a: { b: "x" } } -> ["a.b"]. */
function keys(value: unknown, prefix = ""): string[] {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}

describe("translations", () => {
  it("has a file for every registered namespace in both languages", () => {
    for (const locale of ["de", "en"]) {
      const files = readdirSync(join(root, locale)).map((f) => f.replace(/\.json$/, ""));
      expect(files.sort()).toEqual([...namespaces].sort());
    }
  });

  it.each(namespaces)("namespace %s has the same keys in German and English", (ns) => {
    expect(keys(load("en", ns)).sort()).toEqual(keys(load("de", ns)).sort());
  });

  it.each(namespaces)("namespace %s has no empty strings", (ns) => {
    for (const locale of ["de", "en"]) {
      const flat = keys(load(locale, ns));
      for (const key of flat) {
        const value = key.split(".").reduce((obj: Record<string, unknown>, k) => obj?.[k] as Record<string, unknown>, load(locale, ns));
        if (typeof value === "string") expect(value.trim(), `${locale}/${ns}: ${key}`).not.toBe("");
      }
    }
  });
});
