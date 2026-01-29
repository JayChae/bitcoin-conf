import BlurText from "@/components/BlurText";

type Props = {
  tagline: string;
  title: string;
  location: string;
  date: string;
};

export default function Hero({ tagline, title, location, date }: Props) {
  // Split title to apply different fonts
  // For "Bitcoin Korea Conference" or "비트코인 코리아 컨퍼런스"
  const titleParts = title.split(/\s+/);
  const bitcoinPart = titleParts[0]; // "Bitcoin" or "비트코인"
  const restOfTitle = titleParts.slice(1).join(" "); // "Korea Conference" or "코리아 컨퍼런스"

  return (
    <section className="h-dvh flex flex-col items-center justify-center gap-4 md:gap-6 text-white px-4">
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
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-2xl md:text-3xl font-semibold mt-8">
        <BlurText
          text={location}
          className="text-2xl md:text-3xl font-semibold"
          delay={100}
          animateBy="letters"
        />
        <div className="hidden md:block">|</div>
        <div>{date}</div>
      </div>
    </section>
  );
}
