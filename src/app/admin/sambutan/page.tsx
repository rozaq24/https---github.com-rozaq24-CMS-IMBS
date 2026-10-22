import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, hasRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { GreetingForm } from "./greeting-form";
import { Card } from "@/components/ui/card";

export default async function GreetingAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login?callbackUrl=/admin/sambutan");
  if (!hasRole(session.user.role, ["SUPERADMIN", "OPERATOR_BERITA"])) {
    return (
      <main className="mx-auto max-w-6xl px-[21px] py-[34px]">
        <Card className=""><h1 className="h-gold-2">403 — Akses Ditolak</h1>
        <p className="text-slate-500 mt-[8px]">Sambutan hanya untuk SUPERADMIN / OPERATOR_BERITA.</p></Card>
      </main>
    );
  }
  const greeting = await db.greeting.findUnique({ where: { id: 1 } });
  return (
    <main className="mx-auto max-w-6xl px-[21px] py-[34px] space-y-[21px]">
      <div><h1 className="h-gold-1">Kata <span className="grad-text">Sambutan</span></h1>
      <p className="text-slate-500 mt-[8px]">Teks + foto Kepala Sekolah — tampil di homepage, /profil, /sambutan (ISR 60 detik).</p></div>
      <GreetingForm initial={greeting ? { title: greeting.title, body: greeting.body, principalName: greeting.principalName, photo: greeting.photo || "", active: greeting.active } : undefined} />
    </main>
  );
}
