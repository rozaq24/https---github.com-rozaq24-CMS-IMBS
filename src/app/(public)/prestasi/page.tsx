import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
export const revalidate = 60;
export const metadata = { title: "Prestasi", description: "Prestasi siswa dan guru" };
export default async function AchievementsPage() {
  const items = await db.achievement.findMany({ include: { student: { select: { name: true } }, teacher: { select: { name: true } } }, orderBy: [{ year: "desc" }, { createdAt: "desc" }] });
  return <main className="mx-auto max-w-6xl px-[21px] py-[34px] space-y-[21px]"><h1 className="h-gold-1">Prestasi <span className="grad-text">Sekolah</span></h1>{items.length ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[21px]">{items.map((x) => <Card key={x.id} className="spotlight-card" as="article">{x.photo && <img src={x.photo} alt={x.title} className="mb-[13px] h-[200px] w-full rounded-[13px] object-cover" />}<p className="text-[13px] font-semibold text-slate-500">{x.year}{x.level ? ` · ${x.level}` : ""}</p><h2 className="h-gold-3 mt-[8px]">{x.title}</h2><p className="mt-[4px] text-[14px]">{x.student?.name || x.teacher?.name}</p>{x.desc && <p className="mt-[8px] whitespace-pre-wrap">{x.desc}</p>}</Card>)}</div> : <Card className="text-slate-500" as="p">Belum ada prestasi yang dipublikasikan.</Card>}</main>;
}
