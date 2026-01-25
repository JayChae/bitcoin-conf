import Hero from "./_components/Hero";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home2026({ params }: Props) {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "ko";

  return (
    <main className="">
      <Hero lang={lang} />
    </main>
  );
}
