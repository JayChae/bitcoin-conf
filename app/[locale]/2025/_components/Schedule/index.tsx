import Image from "next/image";
import { cn } from "@/lib/utils";
import { type Schedule } from "../../messages/schedules";
import { MapPin } from "lucide-react";
import BrochureModalTrigger from "./BrochureModal";

type Props = {
  schedules: Schedule[];
  triggerText: string;
};

const scheduleImages = ["/schedules/day1.jpg", "/schedules/day2.jpg"];

export default function Schedule({ schedules, triggerText }: Props) {
  return (
    <div className="w-full space-y-12 md:space-y-16">
      {schedules.map((schedule, index) => (
        <div
          key={index}
          className={cn(
            "flex flex-col items-center gap-8 md:gap-12",
            index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
          )}
        >
          <div className="w-full md:w-1/2 aspect-[4/3] bg-gray-800/30 border border-gray-700/50 rounded-lg overflow-hidden">
            <Image
              src={schedule.image || ""}
              alt={schedule.alt || "image"}
              width={800}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl md:text-2xl font-semibold text-silver">
                {schedule.title}
              </h3>
              <time className="text-gray-400 text-sm font-medium">
                {schedule.date}
              </time>
              <span className="text-gray-400 text-sm">|</span>
              <time className="text-gray-400 text-sm font-medium">
                {schedule.time}
              </time>
            </div>
            {schedule.description && (
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                {schedule.description}
              </p>
            )}
            <p className="text-gray-400 text-lg leading-relaxed">
              {schedule.content}
            </p>
            <div className="space-y-1">
              <div className="space-y-3">
                {schedule.locations.map((location, locationIndex) => (
                  <div key={locationIndex} className="text-gray-300">
                    <div className="flex flex-col lg:flex-row items-center lg:gap-2 text-sm font-medium text-orange-400/80">
                      <MapPin className="w-4 h-4 text-orange-400/80" />{" "}
                      {location}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-start gap-2">
                {schedule.locationDescription && (
                  <span className="text-gray-400 text-sm pl-1">
                    {schedule.locationDescription}
                  </span>
                )}
              </div>
              {/* 자세히 보기 버튼 */}
              <div className="flex justify-center my-4">
                <BrochureModalTrigger
                  triggerText={triggerText}
                  image={scheduleImages[index]}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
