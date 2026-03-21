import "../[locale]/globals.css";

export const metadata = {
  title: "Admin - Bitcoin Korea Conference",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" style={{ colorScheme: "dark" }}>
      <body className="bg-neutral-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
