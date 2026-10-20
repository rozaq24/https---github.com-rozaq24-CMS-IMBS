import { db } from "@/lib/db";
export const revalidate = 60;
export const metadata = { title: "Program dan Jurusan", description: "Program pendidikan dan jurusan sekolah" };
export default async function ProgramsPage() {
  const majors = await db.major.findMany({ orderBy: { name: "asc" } });
  return <main className="mx-auto max-w-6xl px-[21px] py-[34px] space-y-[21px]"><h1 className="h-gold-1">Program <span className="grad-text">Pendidikan</span></h1>{majors.length ? <div className="grid md:grid-cols-2 gap-[21px]">{majors.map((m) => <article key={m.id} className="card"><p className="text-[13px] font-bold text-slate-500">{m.code}</p><h2 className="h-gold-2 mt-[8px]">{m.name}</h2>{m.desc && <p className="mt-[13px] whitespace-pre-wrap">{m.desc}</p>}</article>)}</div> : <p className="card text-slate-500">Informasi program belum tersedia.</p>}</main>;
}
