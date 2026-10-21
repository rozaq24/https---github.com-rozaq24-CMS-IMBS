import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export const revalidate = 60;
export const metadata = { title: "Direktori Guru", description: "Profil guru dan tenaga kependidikan sekolah" };

export default async function TeachersPage({ searchParams }: { searchParams: { q?: string; jabatan?: string } }) {
  const q = searchParams.q?.trim() || "";
  const jabatan = searchParams.jabatan?.trim() || "";
  const [teachers, positions] = await Promise.all([
    db.teacher.findMany({ where: { active: true, ...(jabatan ? { position: { contains: jabatan } } : {}), ...(q ? { OR: [{ name: { contains: q } }, { position: { contains: q } }] } : {}) }, orderBy: { name: "asc" } }),
    db.teacher.findMany({ where: { active: true }, select: { position: true }, distinct: ["position"], orderBy: { position: "asc" } }),
  ]);
  return <main className="mx-auto max-w-6xl px-[21px] py-[34px] space-y-[21px]">
    <header><h1 className="h-gold-1">Guru & <span className="grad-text">Tenaga Kependidikan</span></h1><p className="mt-[8px] text-slate-600">Kenali tenaga pendidik dan kependidikan sekolah.</p></header>
    <Card className="flex gap-[13px] flex-wrap" as="form"><label className="grow">Cari nama/jabatan<Input name="q" defaultValue={q} placeholder="Contoh: Matematika" className="mt-[4px] w-full border rounded-[13px] p-[13px]" /></label><label>Jabatan<NativeSelect name="jabatan" defaultValue={jabatan} className="mt-[4px] block border rounded-[13px] p-[13px]"><option value="">Semua jabatan</option>{positions.map((p) => <option key={p.position} value={p.position}>{p.position}</option>)}</NativeSelect></label><Button className="self-end" variant="default">Cari</Button></Card>
    {teachers.length ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[21px]">{teachers.map((t) => <Card asChild className="group text-center transition hover:-translate-y-1 hover:shadow-xl" key={t.id}><Link href={`/guru/${t.id}`}><div className="mx-auto mb-[13px] h-[144px] w-[144px] overflow-hidden rounded-full bg-slate-100">{t.photo ? <img src={t.photo} alt={t.name} className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-[50px] font-bold grad-text">{t.name.slice(0,1)}</span>}</div><h2 className="h-gold-3 group-hover:grad-text">{t.name}</h2><p className="mt-[4px] text-slate-500">{t.position}</p><span className="mt-[13px] inline-block text-[14px] underline">Lihat Profil</span></Link></Card>)}</div> : <Card className="text-center text-slate-500" as="p">Data guru tidak ditemukan.</Card>}
  </main>;
}
