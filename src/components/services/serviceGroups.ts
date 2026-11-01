/**
 * Structure of the services page. All texts live in `messages/<locale>/services.json`:
 * - section texts under `services.<group id>` (label, title, intro),
 * - card texts under `services.<group id>.items.<item key>` (title, optional tag and text, specs),
 * - spec row labels under `services.specLabels`.
 * To add a card, append its key here and add the texts to both message files.
 */

export type SpecKey = "basis" | "duration" | "scope" | "format" | "deliverable" | "audience" | "completion";

export type ServiceItem = {
  /** Message key under `services.<group id>.items`. */
  key: string;
  /** Highlighted with the accent border. */
  featured?: boolean;
  /** Spec rows for this card if they differ from the group's. */
  specs?: readonly SpecKey[];
};

export type ServiceGroup = {
  /** Section anchor (`#audits`) and message key under `services`. */
  id: "audits" | "training" | "consulting";
  tone: "default" | "muted";
  /** Spec rows shown on every card of the group, in this order. */
  specs: readonly SpecKey[];
  items: readonly ServiceItem[];
};

export const serviceGroups: readonly ServiceGroup[] = [
  {
    id: "audits",
    tone: "default",
    specs: ["basis", "duration", "format", "deliverable"],
    items: [{ key: "internal" }, { key: "supplier" }, { key: "mock" }, { key: "gmp" }],
  },
  {
    id: "training",
    tone: "muted",
    specs: ["audience", "duration", "format", "completion"],
    items: [{ key: "iso13485" }, { key: "gmp" }, { key: "auditor" }, { key: "iso9001" }],
  },
  {
    id: "consulting",
    tone: "default",
    specs: ["basis", "duration", "format", "deliverable"],
    items: [
      { key: "managementRep", featured: true, specs: ["basis", "scope", "format", "deliverable"] },
      { key: "gapAnalysis" },
      { key: "qmsSetup" },
      { key: "certification" },
    ],
  },
];
