import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, hasRole } from "@/lib/auth";
import { LogsClient } from "./logs-client";

export default async function LogsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login?callbackUrl=/admin/logs");
  if (!hasRole(session.user.role, ["SUPERADMIN", "OPERATOR_BERITA", "OPERATOR_SPMB"])) {
    return (
      <main className="mx-auto max-w-6xl px-[21px] py-[34px]">
        <div className="card"><h1 className="h-gold-2">403 — Akses Ditolak</h1>
        <p className="text-slate-500 mt-[8px]">System Log hanya untuk admin/operator. Role kamu: {session.user.role}</p></div>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-6xl px-[21px] py-[34px] space-y-[21px]">
      <div><h1 className="h-gold-1">System <span className="grad-text">Log</span></h1>
      <p className="text-slate-500 mt-[8px]">Jejak login, IP, MAC, dan aktivitas penting (Blueprint Admin #5).</p></div>
      <LogsClient />
    </main>
  );
}
