import { db } from "@/lib/db";
export const revalidate = 60;
export const metadata = { title: "Agenda Sekolah", description: "Jadwal kegiatan dan agenda sekolah" };
export default async function AgendaPage({ searchParams }: { searchParams: { view?: string; month?: string } }) {
  const now = new Date(); const archive = searchParams.view === "archive";
  const month = /^\d{4}-\d{2}$/.test(searchParams.month || "") ? searchParams.month! : "";
  const monthStart = month ? new Date(`${month}-01T00:00:00.000Z`) : null;
  const monthEnd = monthStart ? new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 1)) : null;
  const where = monthStart ? { startAt: { gte: monthStart, lt: monthEnd! } } : { startAt: archive ? { lt: now } : { gte: now } };
  const items = await db.agenda.findMany({ where, orderBy: { startAt: archive ? "desc" : "asc" } });
  const grouped = new Map<string, typeof items>(); for (const item of items) { const key = item.startAt.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }); grouped.set(key, [...(grouped.get(key) || []), item]); }
  return <main className="mx-auto max-w-4xl px-[21px] py-[34px] space-y-[21px]"><h1 className="h-gold-1">Agenda <span className="grad-text">Sekolah</span></h1><div className="card flex flex-wrap gap-[13px] items-end"><a className={!archive ? "btn-primary !py-[8px]" : "btn-outline !py-[8px]"} href="/agenda">Mendatang</a><a className={archive ? "btn-primary !py-[8px]" : "btn-outline !py-[8px]"} href="/agenda?view=archive">Arsip</a><form className="ml-auto flex gap-[8px] items-end"><label className="text-[13px]">Tampilan bulan<input type="month" name="month" defaultValue={month} className="mt-[4px] block border rounded-[8px] p-[8px]" /></label><button className="btn-outline !py-[8px]">Lihat</button></form></div>{items.length ? Array.from(grouped, ([date, agenda]) => <section key={date} className="space-y-[8px]"><h2 className="h-gold-3">{date}</h2>{agenda.map((a) => <article key={a.id} className="card"><h3 className="font-bold text-[20px]">{a.title}</h3><p className="text-[14px] text-slate-500">{a.startAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" })}{a.location ? ` · ${a.location}` : ""}</p>{a.desc && <p className="mt-[8px] whitespace-pre-wrap">{a.desc}</p>}</article>)}</section>) : <p className="card text-slate-500">Tidak ada agenda pada periode ini.</p>}</main>;
}
