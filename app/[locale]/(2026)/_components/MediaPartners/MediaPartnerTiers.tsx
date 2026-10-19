import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import mediaPartners from "@/app/messages/2026/mediaPartners";
import { cn } from "@/lib/utils";

const MONO = "font-[family-name:var(--font-ubuntu-mono)]";

// 모든 미디어 파트너 로고가 공유하는 4:1 칸. 비율이 다른 로고는 object-contain 으로 칸 안에 맞춘다.
// 검정 그림자(가장자리 3px + 번짐 14px)는 배경의 밝은 빛줄기가 로고 뒤를 지날 때만 드러나 로고를 떼어 준다.
// 검정 위에선 보이지 않는다.
const LOGO_BOX =
  "h-[64px] w-[256px] md:h-[76px] md:w-[304px] lg:h-[88px] lg:w-[352px] [filter:drop-shadow(0_0_3px_rgba(0,0,0,0.95))_drop-shadow(0_0_14px_rgba(0,0,0,0.85))]";

// 신문 1면 머리의 겹줄 괘선(굵은 줄 + 가는 줄). 아래쪽 마감은 flip 으로 순서를 뒤집어 대칭을 맞춘다.
function DoubleRule({ flip }: { flip?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn("flex flex-col gap-[3px]", flip && "flex-col-reverse")}
    >
      <div className="h-[2px] bg-white/45" />
      <div className="h-px bg-white/20" />
    </div>
  );
}

// "https://www.tokyobitcoin.space/" → "tokyobitcoin.space"
function displayHost(url: string) {
  return new URL(url).hostname.replace(/^www\./, "");
}

// 랜딩(MediaPartnersSection)과 /sponsors 페이지가 공유.
// 미디어 파트너는 신문·방송사라 후원사의 가운데 금속 라벨 대신 지면(紙面) 문법을 쓴다:
// 겹줄 괘선 사이를 티어별 칸으로 나누고, 칸 왼쪽 위에 티어 이름(조용한 글자), 로고 밑에 매체 도메인.
// 로고는 티어와 상관없이 모두 같은 크기 칸(LOGO_BOX)에 넣는다 — 어느 매체도 더 크게 보이지 않게.
// 빈 티어는 칸째 숨긴다.
export default async function MediaPartnerTiers() {
  const t = await getTranslations("MediaPartners2026");

  const tiers = [
    {
      key: "main",
      title: t("main"),
      partners: mediaPartners.main,
      rowPadding: "pb-12 md:pb-16",
    },
    {
      key: "media",
      title: t("media"),
      partners: mediaPartners.media,
      rowPadding: "pb-10 md:pb-12",
    },
  ].filter((tier) => tier.partners.length > 0);

  if (tiers.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8">
      <DoubleRule />

      {tiers.map((tier, i) => (
        <div
          key={tier.key}
          className={cn(
            "pt-4 md:pt-5",
            tier.rowPadding,
            i > 0 && "border-t border-white/15",
          )}
        >
          <p
            className={cn(
              MONO,
              "text-[13px] md:text-sm uppercase tracking-[0.22em] text-[#F8C8FF]",
            )}
          >
            {tier.title}
          </p>

          {/* items-end — 높이가 다른 로고끼리도 도메인 줄이 한 기준선에 선다. */}
          <ul className="mt-8 md:mt-10 flex flex-wrap items-end justify-center gap-x-14 gap-y-12 md:gap-x-20">
            {tier.partners.map((partner) => (
              <li key={partner.name}>
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-4 md:gap-5"
                >
                  <Image
                    src={partner.image}
                    alt={partner.alt}
                    width={400}
                    height={200}
                    className={cn(
                      "object-contain transition-transform duration-300 group-hover:scale-[1.03]",
                      LOGO_BOX,
                    )}
                  />
                  <span
                    className={cn(
                      MONO,
                      "inline-flex items-center gap-1 text-[13px] md:text-sm tracking-[0.06em] text-white/55 transition-colors duration-200 group-hover:text-white",
                    )}
                  >
                    {displayHost(partner.url)}
                    <ArrowUpRight
                      aria-hidden
                      className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <DoubleRule flip />
    </div>
  );
}
