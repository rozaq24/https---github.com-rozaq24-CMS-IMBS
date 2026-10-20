import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, hasRole } from "@/lib/auth";
import { GalleryClient } from "./gallery-client";

export default async function GalleryAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login?callbackUrl=/admin/galeri");
  if (!hasRole(session.user.role, ["SUPERADMIN", "OPERATOR_BERITA"])) return <main className="mx-auto max-w-6xl p-[34px]"><div className="card">Akses galeri ditolak.</div></main>;
  return <main className="mx-auto max-w-6xl px-[21px] py-[34px] space-y-[21px]"><header><h1 className="h-gold-1">Galeri <span className="grad-text">Foto</span></h1><p className="text-slate-500 mt-[8px]">Kelola album, kategori, dan unggah banyak foto.</p></header><GalleryClient /></main>;
}
