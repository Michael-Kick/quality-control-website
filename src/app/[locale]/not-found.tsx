import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { PageHead } from "@/components/ui/PageHead";

export default async function NotFound() {
  const t = await getTranslations("common.notFound");

  return (
    <PageHead eyebrow="404" title={t("title")} lead={t("text")}>
      <div style={{ marginTop: 20 }}>
        <ButtonLink href="/">{t("back")}</ButtonLink>
      </div>
    </PageHead>
  );
}
