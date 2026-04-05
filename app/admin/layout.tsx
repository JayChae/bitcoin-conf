import { cookies } from "next/headers";
import "../[locale]/globals.css";
import AdminLogin from "./_components/AdminLogin";

export const metadata = {
  title: "Admin - Bitcoin Korea Conference",
  robots: "noindex, nofollow",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const isAuthed =
    !!process.env.ADMIN_PASSWORD &&
    session === process.env.ADMIN_PASSWORD;

  return (
    <html lang="ko" style={{ colorScheme: "dark" }}>
      <body className="bg-neutral-950 text-white min-h-screen">
        {isAuthed ? children : <AdminLogin />}
      </body>
    </html>
  );
}
