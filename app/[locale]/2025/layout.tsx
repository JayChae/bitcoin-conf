import { setRequestLocale } from "next-intl/server";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function Layout2025({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <>{children}</>;
}
