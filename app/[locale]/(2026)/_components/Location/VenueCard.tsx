import { ArrowUpRight, MapPin } from "lucide-react";

type SubVenue = {
  name: string;
  address: string;
  mapUrl: string;
};

type DayNumber = "01" | "02";

type Props = {
  dayNumber: DayNumber;
  dayBadgeText: string;
  fullDate: string;
  viewMapText: string;
  venues: SubVenue[];
};

const dayStyle: Record<
  DayNumber,
  {
    text: string;
    numeral: string;
    dot: string;
    side: "left" | "right";
  }
> = {
  "01": {
    text: "text-[#C8A0FF]",
    numeral: "text-[#8C50C8]/[0.36]",
    dot: "bg-[#8C50C8]",
    side: "right",
  },
  "02": {
    text: "text-[#F490FF]",
    numeral: "text-[#E947F5]/[0.28]",
    dot: "bg-[#E947F5]",
    side: "left",
  },
};

export default function VenueCard({
  dayNumber,
  dayBadgeText,
  fullDate,
  viewMapText,
  venues,
}: Props) {
  const isDual = venues.length > 1;
  const style = dayStyle[dayNumber];

  return (
    <article className="relative px-1 md:px-2 py-16 md:py-24 overflow-hidden">
      <span
        aria-hidden
        className={`pointer-events-none select-none absolute -top-4 md:-top-8
                   font-[family-name:var(--font-ubuntu-mono)] font-extrabold leading-none
                   text-[7rem] sm:text-[10rem] md:text-[14rem] tracking-tighter
                   ${style.numeral} ${style.side === "right" ? "right-0" : "left-0"}`}
      >
        {dayNumber}
      </span>

      <header className="relative z-10">
        <div
          className={`flex items-center gap-3 text-xs md:text-sm font-[family-name:var(--font-ubuntu-mono)] uppercase tracking-[0.25em] mb-3 ${style.text}`}
        >
          <span
            className={`size-1.5 rounded-full ${style.dot}`}
            aria-hidden
          />
          <span className="font-bold">{dayBadgeText}</span>
          <span className="text-white/25">·</span>
          <time className="text-white/55">{fullDate}</time>
        </div>
      </header>

      <div
        className={`relative z-10 mt-6 ${
          isDual ? "grid grid-cols-1 md:grid-cols-2 gap-y-10 md:gap-x-12" : ""
        }`}
      >
        {venues.map((v, i) => (
          <div key={v.name} className="relative">
            {isDual && i > 0 && (
              <div
                aria-hidden
                className="md:hidden border-t border-dashed border-white/10 mb-10"
              />
            )}
            <h3
              className={`font-extrabold text-white leading-[0.95] ${
                isDual
                  ? "text-3xl md:text-4xl lg:text-5xl"
                  : "text-5xl md:text-6xl lg:text-7xl"
              }`}
            >
              {v.name}
            </h3>

            <div className="mt-4 flex items-start gap-2 text-white/55 text-sm md:text-base leading-relaxed">
              <MapPin
                className="size-4 mt-1 flex-shrink-0 text-white/30"
                aria-hidden
              />
              <span>{v.address}</span>
            </div>

            <a
              href={v.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-1.5
                         font-[family-name:var(--font-ubuntu-mono)] uppercase tracking-[0.18em] text-xs md:text-sm
                         text-white/75 hover:text-white transition-colors duration-200
                         border-b border-white/20 hover:border-white/60 pb-1"
            >
              <span>{viewMapText}</span>
              <ArrowUpRight
                className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </a>
          </div>
        ))}
      </div>
    </article>
  );
}
