import { getTranslations } from "next-intl/server";
import type { Speaker } from "@/app/messages/2026/speakers";
import SpeakerCard from "./SpeakerCard";
import { getSpeakerLabels } from "./labels";

type Props = {
  speakers: Speaker[];
};

export default async function SpeakersGrid({ speakers }: Props) {
  const t = await getTranslations("Speakers2026");
  const labels = getSpeakerLabels(t);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
      {speakers.map((speaker) => (
        <SpeakerCard key={speaker.slug} speaker={speaker} labels={labels} />
      ))}
    </div>
  );
}
