import { getTranslations } from "next-intl/server";
import TicketCard from "./TicketCard";

type TicketDef = {
  tier: "vip" | "premium" | "general";
  totalSeats: number;
  benefitKeys: string[];
  addonKeys?: string[];
};

const tickets: TicketDef[] = [
  {
    tier: "vip",
    totalSeats: 21,
    benefitKeys: [
      "welcomeGift",
      "fastEntry",
      "frontSeats",
      "lunchWithSpeakers",
      "lunchSpecial",
      "speakerMaterials",
      "workshopPriority",
      "dinnerParty",
      "afterParty",
      "seating",
    ],
  },
  {
    tier: "premium",
    totalSeats: 512,
    benefitKeys: [
      "welcomeGift",
      "fastEntry",
      "centerSeats",
      "lunchSpecial",
      "speakerMaterials",
      "workshopPriority",
    ],
    addonKeys: ["afterPartyOption"],
  },
  {
    tier: "general",
    totalSeats: 506,
    benefitKeys: ["lunchProvided"],
    addonKeys: ["afterPartyOption"],
  },
];

export default async function TicketsGrid() {
  const t = await getTranslations("Tickets2026");

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
      {tickets.map((ticket) => {
        const benefits = ticket.benefitKeys.map((key) => ({
          text: t(key),
        }));

        if (ticket.addonKeys) {
          ticket.addonKeys.forEach((key) => {
            benefits.push({
              text: t(key),
              addon: t("afterPartyAddon"),
            } as { text: string; addon?: string });
          });
        }

        return (
          <div key={ticket.tier} className="flex-1 min-w-0">
            <TicketCard
              tier={ticket.tier}
              tierLabel={t(ticket.tier)}
              totalSeats={ticket.totalSeats}
              seatsLabel={t("seats")}
              benefits={benefits}
              ctaLabel={t("cta")}
            />
          </div>
        );
      })}
    </div>
  );
}
