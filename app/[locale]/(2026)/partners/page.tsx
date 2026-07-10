import { getTranslations } from "next-intl/server";
import partners from "@/app/messages/2026/partners";
import PartnersGrid from "../_components/Partners/PartnersGrid";
import { pageMetadata } from "../_utils/metadata";

export async function generateMetadata() {
  const t = await getTranslations("Partners2026");
  return pageMetadata({
    pathname: "/partners",
    title: t("pageTitle"),
    description: t("pageSubtitle"),
  });
}

export default async function PartnersPage() {
  const t = await getTranslations("Partners2026");

  return (
    <main className="relative z-10 min-h-screen px-4 pt-28 pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
            {t("pageTitle")}
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/60 md:text-lg">
            {t("pageSubtitle")}
          </p>
        </div>
        <PartnersGrid partners={partners} />
      </div>
    </main>
  );
}
