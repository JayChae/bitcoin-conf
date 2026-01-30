import { ReactNode } from "react";

type Props = {
  id: string;
  title: string;
  children: ReactNode;
};

export default function Section({ id, title, children }: Props) {
  return (
    <section id={id} className="w-full scroll-mt-24 mt-40 md:mt-44">
      <div className="relative inline-block mb-12 w-full text-center">
        <div className="absolute inset-0 section-title-glow pointer-events-none" />
        <h2
          className="relative text-3xl md:text-4xl lg:text-5xl font-bold pointer-events-none text-accent animate-fade-in px-6 py-3"
          style={{ color: "#FFFFFF" }}
        >
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}
