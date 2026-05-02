type Props = {
  title: string;
  meta: string;
};

export default function ScheduleHero({ title, meta }: Props) {
  return (
    <div className="text-center mb-10 md:mb-12">
      <p className="font-[family-name:var(--font-ubuntu-mono)] uppercase tracking-[0.3em] text-[10px] md:text-xs text-white/55 mb-4 md:mb-5">
        {meta}
      </p>
      <div className="relative inline-block">
        <div className="absolute inset-0 section-title-glow pointer-events-none" />
        <h1
          className="relative text-4xl md:text-5xl lg:text-6xl font-bold pointer-events-none animate-fade-in px-6 py-3"
          style={{ color: "#FFFFFF" }}
        >
          {title}
        </h1>
      </div>
    </div>
  );
}
