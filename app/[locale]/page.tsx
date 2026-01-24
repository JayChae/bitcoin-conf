import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home2026({ params }: Props) {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "ko";

  return (
    <main className="">
      {/* <div className="flex flex-col items-center justify-center max-w-6xl mx-auto">
        <section className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Bitcoin Mini Conf 2026
            </h1>
            <p className="text-xl text-gray-400">
              {lang === "ko" ? "준비 중입니다" : "Coming Soon"}
            </p>
          </div>
        </section>
      </div> */}
    </main>
  );
}
