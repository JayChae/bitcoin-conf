import HeroTicketCta from "./HeroTicketCta";

type Props = {
  tagline: string;
  title: string;
  day1Location: string;
  day2Location: string;
  ctaLabel: string;
  ctaHref: string;
};

export default function Hero({
  tagline,
  title,
  day1Location,
  day2Location,
  ctaLabel,
  ctaHref,
}: Props) {
  // Split title to apply different fonts
  // For "Bitcoin Korea Conference" or "비트코인 코리아 컨퍼런스"
  const titleParts = title.split(/\s+/);
  const bitcoinPart = titleParts[0]; // "Bitcoin" or "비트코인"
  const restOfTitle = titleParts.slice(1).join(" "); // "Korea Conference" or "코리아 컨퍼런스"

  return (
    // min-h-lvh: 모바일 주소창이 접혀도(뷰포트 최대 기준) 아래 섹션이 첫 화면에 안 비친다.
    // min-*이라 작은 화면에서 콘텐츠가 늘어나면 잘리지 않고 자란다.
    // pt-*: 고정 Nav 높이만큼 비워둬야 영문처럼 긴 슬로건이 Nav에 가려지지 않는다.
    <section className="flex min-h-lvh flex-col px-4 pt-20 text-white mb-5 md:pt-24 md:mb-0">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 md:gap-6">
        <div className="text-2xl md:text-4xl lg:text-5xl font-semibold text-center">
          {tagline}
        </div>
        <div className="text-5xl md:text-7xl lg:text-9xl font-extrabold text-center">
          <span className="font-[family-name:var(--font-ubuntu-mono)]">
            {bitcoinPart}
          </span>{" "}
          <span className="font-[family-name:var(--font-neurimbo-gothic)]">
            {restOfTitle}
          </span>
        </div>
        {/* 이틀간 장소가 다르므로 날짜별 장소를 따로 세워 첫 화면에서 바로 구분되게 한다. */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-2xl md:text-3xl font-semibold mt-8">
          <div className="text-2xl md:text-3xl font-semibold">{day1Location}</div>
          <div className="hidden md:block text-white/40">|</div>
          <div className="text-2xl md:text-3xl font-semibold">{day2Location}</div>
        </div>
        <HeroTicketCta label={ctaLabel} href={ctaHref} />
      </div>
    </section>
  );
}
