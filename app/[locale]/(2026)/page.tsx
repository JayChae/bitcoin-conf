import { getTranslations } from "next-intl/server";
import Hero from "./_components/Hero";
import TicketsSection from "./_components/Tickets/TicketsSection";
import FloatingLines from "@/components/FloatingLines";
import ComingSoon from "./_components/ComingSoon";
import Section from "./_components/Section";
import Sponsor from "./_components/Sponsor";
import SpeakersSection from "./_components/Speakers/SpeakersSection";
import RecapSection from "./_components/Recap/RecapSection";
import ReviewsSection from "./_components/Reviews/ReviewsSection";
import PartnersSection from "./_components/Partners/PartnersSection";
import SideEventsSection from "./_components/SideEvents/SideEventsSection";
import LocationSection from "./_components/Location/LocationSection";
import { ticketCta } from "@/app/messages/2026/nav";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home2026({ params }: Props) {
  const { locale } = await params;
  const tHero = await getTranslations("Hero2026");
  const tSponsor = await getTranslations("Sponsor");
  // Nav와 같은 출처를 쓰면 티켓 CTA 문구가 저절로 동기화된다.
  const cta = ticketCta[locale];

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
        ctaLabel={cta.label}
        ctaHref={cta.href}
        statAttendeesLabel={tHero("statAttendeesLabel")}
        statMarketValue={tHero("statMarketValue")}
        statMarketLabel={tHero("statMarketLabel")}
      />
      <RecapSection />
      <ReviewsSection />
      <SpeakersSection />
      <SideEventsSection />
      <TicketsSection />
      <LocationSection />
      <Section id="sponsors" title={tSponsor("title")}>
        <Sponsor
          goldTitle={tSponsor("gold")}
          silverTitle={tSponsor("silver")}
          bronzeTitle={tSponsor("bronze")}
          comingSoonText={tSponsor("comingSoon")}
        />
      </Section>
      <PartnersSection />
      <ComingSoon />
    </main>
  );
}
