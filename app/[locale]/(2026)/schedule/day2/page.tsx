import { setRequestLocale } from "next-intl/server";
import { toLocale } from "@/app/_utils/seo";
import ScheduleDayPage, {
  scheduleDayMetadata,
} from "../../_components/Schedule/ScheduleDayPage";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return scheduleDayMetadata("day2", toLocale(locale));
}

export default async function ScheduleDay2Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ScheduleDayPage dayId="day2" locale={toLocale(locale)} />;
}
