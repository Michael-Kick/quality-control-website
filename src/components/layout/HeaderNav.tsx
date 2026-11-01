"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { LanguageSwitch } from "./LanguageSwitch";
import styles from "./Header.module.css";

const NAV_ITEMS: { href: AppPathname; key: "services" | "about" | "contact" }[] = [
  { href: "/leistungen", key: "services" },
  { href: "/ueber-mich", key: "about" },
  { href: "/kontakt", key: "contact" },
];

export function HeaderNav() {
  const t = useTranslations("common.nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className={styles.right}>
      <nav id="main-nav" aria-label={t("mainNav")} className={[styles.nav, open && styles.navOpen].filter(Boolean).join(" ")}>
        <ul className={styles.links}>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={styles.link}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={close}
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/kontakt" className={`${styles.cta} ${styles.ctaMobile}`} onClick={close}>
          {t("cta")}
        </Link>
      </nav>
      <LanguageSwitch />
      <Link href="/kontakt" className={`${styles.cta} ${styles.ctaDesktop}`}>
        {t("cta")}
      </Link>
      <button
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="visually-hidden">{open ? t("closeMenu") : t("openMenu")}</span>
        <span className={styles.burger} data-open={open} aria-hidden="true" />
      </button>
    </div>
  );
}
