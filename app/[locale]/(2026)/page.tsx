import ColorBends from "@/components/ColorBends";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home2026({ params }: Props) {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "ko";

  return (
    <main className="">
      <section className="h-screen flex flex-col items-center justify-center gap-8 text-white">
        <div className="text-5xl font-semibold">대한민국 대표 비트코인 컨퍼런스</div>
        <div className="text-9xl font-extrabold">Bitcoin Mini Conf 2026</div>
        <div className="flex gap-4 text-3xl font-semibold mt-4">
          <div>코엑스 삼성</div>
          <div>|</div>
          <div>2026년 1월 25일 ~ 26일</div>
        </div>
      </section>

      {/* 
      <main className="size-full">
      <section className="relative w-full h-screen">
        <Image
          src="/2026/coex_3.jpeg"
          alt="Bitcoin Mini Conf 2026"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 text-white ">
          <div className="text-5xl font-semibold">대한민국 대표 비트코인 컨퍼런스</div>
          <div className="text-9xl font-extrabold">Bitcoin Mini Conf 2026</div>
          <div className="flex gap-4 text-4xl font-semibold">
            <div>코엑스 삼성</div>
            <div>|</div>
            <div>2026년 1월 25일 ~ 26일</div>
          </div>
        </div>
      </section> */}
    </main>
  );
}
