"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import styles from "./LanguageSwitch.module.css";

/**
 * DE/EN slider. Switches the whole site to the other language and keeps the
 * visitor on the equivalent page (/de/leistungen <-> /en/services).
 */
export function LanguageSwitch() {
  const locale = useLocale();
  const t = useTranslations("common.langSwitch");
  const router = useRouter();
  const pathname = usePathname() as AppPathname;
  const [isPending, startTransition] = useTransition();
  const isEnglish = locale === "en";

  function toggle() {
    startTransition(() => {
      router.replace(pathname, { locale: isEnglish ? "de" : "en", scroll: false });
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEnglish}
      aria-label={t("label")}
      aria-busy={isPending}
      onClick={toggle}
      className={styles.switch}
    >
      <span className={styles.label} data-active={!isEnglish}>
        DE
      </span>
      <span className={styles.track} aria-hidden="true">
        <span className={styles.knob} />
      </span>
      <span className={styles.label} data-active={isEnglish}>
        EN
      </span>
    </button>
  );
}
