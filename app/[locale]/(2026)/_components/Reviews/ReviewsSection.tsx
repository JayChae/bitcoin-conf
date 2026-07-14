import { getTranslations } from "next-intl/server";
import ReviewsBlock from "./ReviewsBlock";
import SectionTitle from "../SectionTitle";
import ViewAllLink from "../ViewAllLink";

export default async function ReviewsSection() {
  const t = await getTranslations("Reviews2026");

  return (
    <section id="reviews" className="scroll-mt-24 mt-40 md:mt-44">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle title={t("sectionTitle")} className="mb-4" />

        <p className="mx-auto mb-12 max-w-2xl text-center text-base text-white/60 md:mb-14 md:text-lg">
          {t("lead")}
        </p>

        <ReviewsBlock variant="wall" />

        <ViewAllLink href="/recap" label={t("viewAllNews")} />
      </div>
    </section>
  );
}
