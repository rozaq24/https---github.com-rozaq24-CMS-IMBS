import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, hasRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { SpmbAdmin } from "./spmb-admin";
export default async function SpmbAdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login?callbackUrl=/admin/spmb");
  if (!hasRole(session.user.role, ["SUPERADMIN", "OPERATOR_SPMB"])) return <main className="mx-auto max-w-6xl p-[34px]"><div className="card">Akses SPMB ditolak.</div></main>;
  const periods = await db.sPMBPeriod.findMany({ orderBy: [{ year: "desc" }, { openAt: "desc" }], include: { _count: { select: { applicants: true } } } });
  return <main className="mx-auto max-w-6xl space-y-[21px] px-[21px] py-[34px]"><header><h1 className="h-gold-1">Penerimaan <span className="grad-text">Murid Baru</span></h1><p className="mt-[8px] text-slate-600">Kelola periode, verifikasi berkas, dan pantau pendaftar.</p></header><SpmbAdmin periods={periods.map((p) => ({ ...p, openAt: p.openAt.toISOString(), closeAt: p.closeAt.toISOString() }))} /></main>;
}
