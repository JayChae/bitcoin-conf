import { getTranslations } from "next-intl/server";
import type { SideEvent } from "@/app/messages/2026/sideEvents";
import SideEventCard from "./SideEventCard";
import { getSideEventLabels } from "./labels";

type Props = {
  events: SideEvent[];
};

export default async function SideEventsGrid({ events }: Props) {
  const t = await getTranslations("SideEvents2026");
  const labels = getSideEventLabels(t);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
      {events.map((event) => (
        <SideEventCard key={event.slug} event={event} labels={labels} />
      ))}
    </div>
  );
}
