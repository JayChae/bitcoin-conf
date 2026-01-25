export default function Hero({ lang }: { lang: string }) {
    return (
        <section className="h-screen flex flex-col items-center justify-center gap-4 md:gap-6 text-white px-4">
            <div className="text-2xl md:text-4xl lg:text-5xl font-semibold text-center">
                대한민국 대표 비트코인 컨퍼런스
            </div>
            <div className="text-5xl md:text-7xl lg:text-9xl font-extrabold text-center">
                Bitcoin Mini Conf 2026
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-2xl md:text-3xl font-semibold mt-8">
                <div>코엑스 삼성</div>
                <div className="hidden md:block">|</div>
                <div>2026년 1월 25일 ~ 26일</div>
            </div>
        </section>
    );
}