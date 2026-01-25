import { getTranslations } from "next-intl/server";
import Hero from "./_components/Hero";
import ComingSoon from "./_components/ComingSoon";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home2026({ params }: Props) {
  const { locale } = await params;
  const tHero = await getTranslations("Hero2026");

  return (
    <main className="">
      <Hero
        tagline={tHero("tagline")}
        title={tHero("title")}
        location={tHero("location")}
        date={tHero("date")}
      />
      <ComingSoon />
    </main>
  );
}
