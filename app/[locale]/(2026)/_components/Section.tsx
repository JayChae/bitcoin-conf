import { ReactNode } from "react";
import SectionTitle from "./SectionTitle";

type Props = {
  id: string;
  title: string;
  children: ReactNode;
};

export default function Section({ id, title, children }: Props) {
  return (
    <section id={id} className="w-full scroll-mt-24 mt-40 md:mt-44">
      <SectionTitle title={title} className="mb-12" />

      {children}
    </section>
  );
}
