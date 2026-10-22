import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, hasRole } from "@/lib/auth";
import { PagesClient } from "./pages-client";
import { Card } from "@/components/ui/card";

export default async function PagesAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login?callbackUrl=/admin/pages");
  if (!hasRole(session.user.role, ["SUPERADMIN", "OPERATOR_BERITA"])) {
    return (
      <main className="mx-auto max-w-6xl px-[21px] py-[34px]">
        <Card className=""><h1 className="h-gold-2">403 — Akses Ditolak</h1>
        <p className="text-slate-500 mt-[8px]">Halaman statis hanya untuk SUPERADMIN / OPERATOR_BERITA. Role kamu: {session.user.role}</p></Card>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-6xl px-[21px] py-[34px] space-y-[21px]">
      <div><h1 className="h-gold-1">Halaman <span className="grad-text">Statis</span></h1>
      <p className="text-slate-500 mt-[8px]">Visi-Misi, Sejarah, Hubungi Kami — tampil di /[slug]. Slug sistem (admin, berita, spmb...) ditolak otomatis.</p></div>
      <PagesClient />
    </main>
  );
}
