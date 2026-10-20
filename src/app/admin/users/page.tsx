import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, hasRole } from "@/lib/auth";
import { UsersClient } from "./users-client";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login?callbackUrl=/admin/users");
  if (!hasRole(session.user.role, ["SUPERADMIN"])) {
    return (
      <main className="mx-auto max-w-6xl px-[21px] py-[34px]">
        <div className="card"><h1 className="h-gold-2">403 — Akses Ditolak</h1>
        <p className="text-slate-500 mt-[8px]">Halaman Users khusus SUPERADMIN. Role kamu: {session.user.role}</p></div>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-6xl px-[21px] py-[34px] space-y-[21px]">
      <div><h1 className="h-gold-1">Manajemen <span className="grad-text">Pengguna</span></h1>
      <p className="text-slate-500 mt-[8px]">Buat akun, atur role, nonaktifkan. Semua tercatat di System Log.</p></div>
      <UsersClient />
    </main>
  );
}
