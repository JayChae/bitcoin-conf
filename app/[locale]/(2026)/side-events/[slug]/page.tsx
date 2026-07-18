import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import sideEvents, { type SideEvent } from "@/app/messages/2026/sideEvents";
import {
  EYEBROW_CLASS,
  badgeVariants,
} from "../../_components/Speakers/InfoField";
import SideEventImage from "../../_components/SideEvents/SideEventImage";
import { pageMetadata } from "../../_utils/metadata";

type Params = { locale: Locale; slug: string };

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    sideEvents[locale].map((e) => ({ locale, slug: e.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;
  const event = sideEvents[locale].find((e) => e.slug === slug);
  if (!event) return {};
  return pageMetadata({
    locale,
    pathname: `/side-events/${slug}`,
    title: event.title,
    description: event.shortDescription,
    ogImage: event.image ? { url: event.image } : undefined,
  });
}

export default async function SideEventDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;
  const list = sideEvents[locale];
  const i = list.findIndex((e) => e.slug === slug);

  if (i === -1) notFound();

  const event = list[i];
  const prev = list[i - 1] ?? null;
  const next = list[i + 1] ?? null;

  const t = await getTranslations("SideEvents2026");
  const registerLink = event.links.find((l) => l.type === "website");

  return (
    <main className="relative z-10 min-h-screen pt-28 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/side-events"
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors mb-10 md:mb-14"
        >
          <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          {t("backToList")}
        </Link>

        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10 md:mb-12 bg-[#0d0a1c]">
          <SideEventImage
            src={event.image}
            alt={event.title}
            placeholderLabel={t("imageComingSoon")}
            size="hero"
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className={EYEBROW_CLASS}>{event.date}</span>
            {event.theme && (
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border tracking-wide ${badgeVariants.stage}`}
              >
                {event.theme}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight">
            {event.title}
          </h1>

          <p className="text-lg md:text-xl text-white/60 leading-relaxed">
            <span className="text-white/40">{t("hostLabel")} · </span>
            <span>{event.host}</span>
          </p>

          {registerLink && (
            <div className="mt-3">
              <a
                href={registerLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 px-8 py-4 md:px-10 md:py-5 rounded-full border border-[#E947F5]/50 bg-[#E947F5]/5 text-[#F490FF] text-base md:text-lg font-bold tracking-wide transition-all duration-200 ease-out hover:bg-[#E947F5] hover:border-[#E947F5] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_0_28px_-6px_rgba(233,71,245,0.7)] active:scale-[0.98]"
              >
                {t("register")}
                <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          )}

          <div className="mt-8 md:mt-10 text-base md:text-lg text-white/75 leading-[1.85] whitespace-pre-line font-light">
            {event.description}
          </div>
        </div>

        {(prev || next) && (
          <nav className="mt-20 md:mt-28 pt-8 border-t border-white/15 flex items-center justify-between gap-4">
            <AdjacentLink direction="prev" event={prev} label={t("prev")} />
            <AdjacentLink direction="next" event={next} label={t("next")} />
          </nav>
        )}
      </div>
    </main>
  );
}

function AdjacentLink({
  direction,
  event,
  label,
}: {
  direction: "prev" | "next";
  event: SideEvent | null;
  label: string;
}) {
  if (!event) return <div />;

  const isPrev = direction === "prev";
  const Arrow = isPrev ? ArrowLeft : ArrowRight;

  return (
    <Link
      href={`/side-events/${event.slug}`}
      className={`group flex items-center gap-3 min-w-0 max-w-[45%] ${isPrev ? "" : "ml-auto"}`}
    >
      {isPrev && (
        <Arrow className="size-5 text-white/80 group-hover:text-white transition-all duration-300 group-hover:-translate-x-1 shrink-0" />
      )}
      <div
        className={`flex flex-col min-w-0 ${isPrev ? "text-left" : "text-right"}`}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">
          {label}
        </span>
        <span className="text-sm font-semibold text-white truncate">
          {event.title}
        </span>
      </div>
      {!isPrev && (
        <Arrow className="size-5 text-white/80 group-hover:text-white transition-all duration-300 group-hover:translate-x-1 shrink-0" />
      )}
    </Link>
  );
}
