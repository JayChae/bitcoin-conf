import { getTranslations } from "next-intl/server";
import Hero from "./_components/Hero";
import ComingSoon from "./_components/ComingSoon";
import Section from "./_components/Section";
import Sponsor from "./_components/Sponsor";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home2026({ params }: Props) {
  const { locale } = await params;
  const tHero = await getTranslations("Hero2026");
  const tSponsor = await getTranslations("Sponsor");

  return (
    <main className="">
      <Hero
        tagline={tHero("tagline")}
        title={tHero("title")}
        location={tHero("location")}
        date={tHero("date")}
      />
      <ComingSoon />
      <Section id="sponsors" title={tSponsor("title")}>
        <Sponsor
          diamondTitle={tSponsor("diamond")}
          goldTitle={tSponsor("gold")}
          silverTitle={tSponsor("silver")}
          bronzeTitle={tSponsor("bronze")}
          comingSoonText={tSponsor("comingSoon")}
        />
      </Section>
    </main>
  );
}
