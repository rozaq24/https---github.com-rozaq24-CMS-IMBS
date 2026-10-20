import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, hasRole } from "@/lib/auth";
import { StudentsClient } from "./students-client";

export default async function StudentsAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login?callbackUrl=/admin/siswa");
  if (!hasRole(session.user.role, ["SUPERADMIN", "OPERATOR_SPMB"])) return <main className="mx-auto max-w-6xl p-[34px]"><div className="card">Akses data siswa ditolak.</div></main>;
  return <main className="mx-auto max-w-6xl px-[21px] py-[34px] space-y-[21px]"><header><h1 className="h-gold-1">Data <span className="grad-text">Siswa</span></h1><p className="text-slate-500 mt-[8px]">Kelola siswa, impor Excel, dan proses rombel.</p></header><StudentsClient /></main>;
}
