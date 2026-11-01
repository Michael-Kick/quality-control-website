import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { HeaderNav } from "./HeaderNav";
import styles from "./Header.module.css";

export async function Header() {
  const t = await getTranslations("common.nav");

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.logo} aria-label={t("homeLink")}>
          {siteConfig.brand.name}
          <span>{siteConfig.brand.suffix}</span>
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
