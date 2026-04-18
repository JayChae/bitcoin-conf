import { getTranslations } from "next-intl/server";
import Hero from "./_components/Hero";
import TicketsSection from "./_components/Tickets/TicketsSection";
import FloatingLines from "@/components/FloatingLines";
import ComingSoon from "./_components/ComingSoon";
import Section from "./_components/Section";
import Sponsor from "./_components/Sponsor";
import SpeakersSection from "./_components/Speakers/SpeakersSection";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home2026({ params }: Props) {
  const { locale } = await params;
  const tHero = await getTranslations("Hero2026");
  const tSponsor = await getTranslations("Sponsor");

  return (
    <main className="">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <FloatingLines />
      </div>
      <Hero
        tagline={tHero("tagline")}
        title={tHero("title")}
        location={tHero("location")}
        date={tHero("date")}
      />
      <TicketsSection />
      <SpeakersSection />
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
