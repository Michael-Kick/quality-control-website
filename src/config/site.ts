// Person- and business-specific data that is the same in every language.
// All values are placeholders until the real details are known.
export const siteConfig = {
  url: "https://www.name-qm.de",
  brand: { name: "NAME", suffix: ".QM" },
  personName: "Vorname Nachname",
  phone: "+49 000 0000000",
  email: "kontakt@name-qm.de",
  linkedin: {
    href: "https://www.linkedin.com/in/name",
    label: "linkedin.com/in/name",
  },
  city: "Musterstadt",
  standards: ["ISO 9001", "ISO 13485", "ISO 19011", "GMP"],
} as const;

export const brandName = `${siteConfig.brand.name}${siteConfig.brand.suffix}`;
