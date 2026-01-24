import GradientText from "@/components/GradientText";
import Link from "next/link";
import { type TicketButton } from "../messages/tickets";
import BlurText from "@/components/BlurText";
import ShinyText from "@/components/ShinyText";
import Attendees from "./Attendees";
import StarBorder from "@/components/StarBorder";

type Props = {
  title: string;
  subtitle: string;
  tickets: TicketButton[];
  date: string;
  location: string;
};

export default async function Hero({
  title,
  subtitle,
  tickets,
  date,
  location,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-14 pt-16">
      <section className="flex flex-col items-center justify-center">
        {/* Hero Title Section */}
        <h1 className="text-center mb-8 md:mt-8 mt-12">
          <GradientText
            colors={["#ff4040", "#ff4040", "#ff4040", "#ff4040", "#6a0dad"]}
            animationSpeed={8}
            showBorder={false}
            className="text-5xl md:text-6xl lg:text-7xl lg:font-bold md:font-extrabold sm:font-bold xs:font-bold pointer-events-none"
          >
            {title}
          </GradientText>
        </h1>

        {/* Subtitle with emphasis */}
        <div className="mb-5 flex items-center gap-2">
          <BlurText
            text={subtitle}
            delay={500}
            className="text-xl md:text-3xl lg:text-4xl font-semibold pointer-events-none text-accent/70 tracking-tight"
          />
        </div>

        {/* Date and Location with different styling */}
        <div className="flex flex-row md:flex-row items-center gap-1 md:gap-4">
          <span className="text-lg lg:text-2xl font-medium pointer-events-none text-accent/70">
            {date}
          </span>
          <span className="text-lg lg:text-2xl font-medium pointer-events-none text-accent/70">
            /
          </span>

          <span className="text-lg lg:text-2xl font-semibold pointer-events-none text-accent/70">
            {location}
          </span>
        </div>
      </section>
      <section className="w-full md:w-3/5 lg:w-4/5 flex flex-col items-center lg:flex-row gap-3">
        {tickets.map((ticket) => (
          <Link
            key={ticket.url}
            href={ticket.url}
            className="w-full hover:scale-105 transition-all duration-300"
            target="_blank"
          >
            <StarBorder
              as="button"
              className="cursor-pointer w-full text-lg md:text-xl font-bold"
              color={ticket.color}
              speed="2.5s"
              thickness={4}
            >
              {ticket.name}
            </StarBorder>
          </Link>
        ))}
      </section>
    </div>
  );
}
