import { getTranslations } from "next-intl/server";
import Image from "next/image";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home2026({ params }: Props) {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "ko";

  return (
    <main className="bg-black size-full">
      <section className="relative w-full h-screen">
        <Image
          src="/2026/coex_3.jpeg"
          alt="Bitcoin Mini Conf 2026"
          fill
          className="object-cover"
          priority
        />
        {/* 어두운 오버레이 */}
        <div className="absolute inset-0 bg-black/50" />
      </section>
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
