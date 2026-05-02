type Props = {
  title: string;
  subtitle: string;
};

export default function ScheduleHero({ title, subtitle }: Props) {
  return (
    <div className="text-center mb-10 md:mb-12">
      <div className="relative inline-block">
        <div className="absolute inset-0 section-title-glow pointer-events-none" />
        <h1
          className="relative text-4xl md:text-5xl lg:text-6xl font-bold pointer-events-none animate-fade-in px-6 py-3"
          style={{ color: "#FFFFFF" }}
        >
          {title}
        </h1>
      </div>
      <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto mt-3 px-4">
        {subtitle}
      </p>
    </div>
  );
}
