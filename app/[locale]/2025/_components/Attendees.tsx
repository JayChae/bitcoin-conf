import { type AttendeeItem } from "../../../messages/attendees";
import CountUp from "@/components/CountUp";
import GradientText from "@/components/GradientText";

type Props = {
  items: AttendeeItem[];
};

export default function Attendees({ items }: Props) {
  return (
    <section className="w-full rounded-2xl px-8 pt-16 md:px-16 md:py-20 lg:pt-48">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* 왼쪽: 1번 아이템 크게 */}
          {items[1] && (
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center justify-center gap-6">
                <GradientText
                  colors={[
                    "#FFFFFF", // 빛
                    "#FF80ED", // 네온 핑크
                    //   "#FFFB80", // 네온 옐로우
                    //   "#80FFEA", // 네온 민트
                    "#809BFF", // 네온 블루
                    "#FFFFFF", // 다시 빛
                  ]}
                  className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white leading-tight"
                >
                  {items[1].title}
                </GradientText>
                <p className="text-gray-400 text-center md:text-left text-base md:text-xl lg:text-2xl leading-relaxed max-w-md">
                  {items[1].subtitle}
                </p>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-12 lg:gap-16">
            <div className="flex flex-col items-center justify-center gap-6">
              <span className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white">
                200+
              </span>
              <p className="text-gray-400 text-base md:text-lg lg:text-xl leading-relaxed">
                {items[0]?.subtitle}
              </p>
            </div>

            {/* 2번 아이템 */}
            {items[2] && (
              <div className="flex flex-col items-center justify-center gap-6">
                <span className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white">
                  <CountUp
                    to={400}
                    from={350}
                    duration={1}
                    className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white"
                  />
                  +
                </span>

                <p className="text-gray-400 text-base md:text-lg lg:text-xl leading-relaxed">
                  {items[2].subtitle}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
