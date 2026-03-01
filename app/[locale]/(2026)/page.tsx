import { getTranslations } from "next-intl/server";
import Hero from "./_components/Hero";
import TicketsSection from "./_components/Tickets/TicketsSection";
import FloatingLines from "@/components/FloatingLines";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home2026({ params }: Props) {
  const { locale } = await params;
  const tHero = await getTranslations("Hero2026");

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
    </main>
  );
}
