import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, hasRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { BuilderFlatButton } from "./BuilderControls";
import "./builder.css";

export default async function BuilderIndex() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login?callbackUrl=/admin/builder");
  if (!hasRole(session.user.role, ["SUPERADMIN", "OPERATOR_BERITA"])) redirect("/admin");
  const pages = await db.customPage.findMany({ where: { builderData: { not: null } }, orderBy: [{ updatedAt: "desc" }], select: { id: true, title: true, slug: true, updatedAt: true, builderData: true } });
  return <main className="mx-auto max-w-6xl space-y-[21px] px-[21px] py-[34px]">
    <header className="flex flex-wrap items-end justify-between gap-[13px]"><div><p className="text-[12px] font-bold uppercase tracking-[.12em] text-slate-500">IMBS BUILDER</p><h1 className="h-gold-1">Halaman <span className="grad-text">Statis</span></h1><p className="mt-[8px] text-slate-600">Susun elemen halaman pada kanvas dan simpan ke website.</p></div><BuilderFlatButton href="/admin/builder/baru">Buat halaman</BuilderFlatButton></header>
    <section className="grid gap-[13px] md:grid-cols-2 xl:grid-cols-3" aria-label="Daftar halaman statis">
      {pages.map((page) => <article key={page.id} className="rounded-[16px] border border-slate-200 bg-white p-[21px] shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-[11px] font-bold uppercase tracking-[.1em] text-slate-500">{page.builderData ? "IMBS Builder" : "Konten HTML"}</p><h2 className="mt-[8px] text-[20px] font-bold">{page.title}</h2><p className="mt-[4px] text-[13px] text-slate-500">/{page.slug}</p><div className="mt-[21px] flex gap-[13px]"><Link className="text-[14px] font-semibold underline" href={`/admin/builder/${page.id}`}>{page.builderData ? "Buka di Builder" : "Edit di Builder"}</Link><a className="text-[14px] underline" href={`/${page.slug}`} target="_blank" rel="noreferrer">Lihat halaman</a></div>
      </article>)}
      {!pages.length && <div className="rounded-[16px] border border-dashed border-slate-300 p-[34px] text-center text-slate-600">Belum ada halaman. Buat halaman pertama dari kanvas.</div>}
    </section>
  </main>;
}
