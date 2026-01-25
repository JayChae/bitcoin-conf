type Props = {
  tagline: string;
  title: string;
  location: string;
  date: string;
};

export default function Hero({ tagline, title, location, date }: Props) {
  return (
    <section className="h-screen flex flex-col items-center justify-center gap-4 md:gap-6 text-white px-4">
      <div className="text-2xl md:text-4xl lg:text-5xl font-semibold text-center">
        {tagline}
      </div>
      <div className="text-5xl md:text-7xl lg:text-9xl font-extrabold text-center">
        {title}
      </div>
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-2xl md:text-3xl font-semibold mt-8">
        <div>{location}</div>
        <div className="hidden md:block">|</div>
        <div>{date}</div>
      </div>
    </section>
  );
}
