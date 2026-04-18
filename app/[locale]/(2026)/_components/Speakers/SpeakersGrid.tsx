import type { Speaker } from "@/app/messages/2026/speakers";
import SpeakerCard from "./SpeakerCard";

type Props = {
  speakers: Speaker[];
};

export default function SpeakersGrid({ speakers }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-8 md:gap-x-6 md:gap-y-10">
      {speakers.map((speaker) => (
        <SpeakerCard key={speaker.slug} speaker={speaker} />
      ))}
    </div>
  );
}
