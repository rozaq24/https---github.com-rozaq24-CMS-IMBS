import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
export const revalidate = 60;
export const metadata = { title: "Ekstrakurikuler", description: "Kegiatan ekstrakurikuler sekolah" };
export default async function ExtracurricularPage() {
  const items = await db.extracurricular.findMany({ where: { active: true }, orderBy: { name: "asc" } });
  return <main className="mx-auto max-w-6xl px-[21px] py-[34px] space-y-[21px]"><h1 className="h-gold-1">Kegiatan <span className="grad-text">Ekstrakurikuler</span></h1>{items.length ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[21px]">{items.map((x) => <Card key={x.id} className="" as="article">{x.photo && <img src={x.photo} alt={x.name} className="mb-[13px] h-[200px] w-full rounded-[13px] object-cover" />}<h2 className="h-gold-3">{x.name}</h2>{x.coach && <p className="mt-[8px] text-[14px]">Pembina: {x.coach}</p>}{x.schedule && <p className="text-[14px]">Jadwal: {x.schedule}</p>}{x.desc && <p className="mt-[8px] whitespace-pre-wrap">{x.desc}</p>}</Card>)}</div> : <Card className="text-slate-500" as="p">Informasi ekstrakurikuler belum tersedia.</Card>}</main>;
}
