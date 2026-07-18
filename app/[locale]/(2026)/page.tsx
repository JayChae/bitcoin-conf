import { getTranslations } from "next-intl/server";
import Hero from "./_components/Hero";
import TicketsSection from "./_components/Tickets/TicketsSection";
import FloatingLines from "@/components/FloatingLines";
import SponsorsSection from "./_components/Sponsors/SponsorsSection";
import SpeakersSection from "./_components/Speakers/SpeakersSection";
import StatsSection from "./_components/Stats/StatsSection";
import RecapSection from "./_components/Recap/RecapSection";
import ReviewsSection from "./_components/Reviews/ReviewsSection";
import SideEventsSection from "./_components/SideEvents/SideEventsSection";
import GetInvolvedSection from "./_components/GetInvolved/GetInvolvedSection";
import LocationSection from "./_components/Location/LocationSection";
import FaqSection from "./_components/Faq/FaqSection";
import { ticketCta } from "@/app/messages/2026/nav";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home2026({ params }: Props) {
  const { locale } = await params;
  const tHero = await getTranslations("Hero2026");
  // Nav와 같은 출처를 쓰면 티켓 CTA 문구가 저절로 동기화된다.
  const cta = ticketCta[locale];

  return (
    <main className="pb-28 md:pb-36">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <FloatingLines />
      </div>
      <Hero
        tagline={tHero("tagline")}
        title={tHero("title")}
        day1Location={tHero("day1Location")}
        day2Location={tHero("day2Location")}
        ctaLabel={cta.label}
        ctaHref={cta.href}
      />
      <StatsSection />
      <RecapSection />
      <ReviewsSection />
      <SpeakersSection />
      <SideEventsSection />
      <TicketsSection />
      <GetInvolvedSection />
      <LocationSection />
      <SponsorsSection />
      <FaqSection />
    </main>
  );
}
