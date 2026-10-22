import Link from "next/link";
import { ArrowDown, ArrowRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export const revalidate = 60;
export const metadata = { title: "Agenda Sekolah", description: "Jadwal kegiatan dan agenda sekolah" };

export default async function AgendaPage({ searchParams }: { searchParams: { view?: string; month?: string } }) {
  const now = new Date();
  const archive = searchParams.view === "archive";
  const month = /^\d{4}-\d{2}$/.test(searchParams.month || "") ? searchParams.month! : "";
  const monthStart = month ? new Date(`${month}-01T00:00:00.000Z`) : null;
  const monthEnd = monthStart ? new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 1)) : null;
  const where = monthStart ? { startAt: { gte: monthStart, lt: monthEnd! } } : { startAt: archive ? { lt: now } : { gte: now } };
  const items = await db.agenda.findMany({ where, orderBy: { startAt: archive ? "desc" : "asc" } });
  const grouped = new Map<string, typeof items>();
  for (const item of items) {
    const key = item.startAt.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });
    grouped.set(key, [...(grouped.get(key) || []), item]);
  }
  return <main className="agenda-story">
    <div aria-hidden="true" className="story-progress"><span /></div>
    <header className="agenda-hero"><div className="agenda-hero__copy"><p className="story-eyebrow">KALENDER KEGIATAN</p><h1 className="font-display">Langkah kecil,<br /><em>cerita besar.</em></h1><p>Ruang untuk belajar bersama, bertemu keluarga, dan merayakan karya murid.</p><a href="#kalender" className="story-link">Jelajahi agenda <ArrowDown aria-hidden="true" /></a></div><div className="agenda-hero__calendar" aria-hidden="true"><CalendarDays /><span>IMBS</span><strong>{String(items.length).padStart(2, "0")}</strong><small>{archive ? "agenda arsip" : "agenda mendatang"}</small><i /></div></header>
    <section id="kalender" className="agenda-content"><aside className="agenda-content__aside"><p className="story-eyebrow">KALENDER SEKOLAH</p><h2 className="font-display">Atur perjalananmu.</h2><p>Pilih agenda mendatang atau telusuri kembali kegiatan sebelumnya.</p></aside>
      <div className="agenda-content__main"><Card className="agenda-controls"><div className="agenda-controls__tabs"><Button asChild variant={!archive ? "default" : "outline"}><Link href="/agenda">Mendatang</Link></Button><Button asChild variant={archive ? "default" : "outline"}><Link href="/agenda?view=archive">Arsip</Link></Button></div><form action="/agenda" className="agenda-controls__month"><label htmlFor="agenda-month">Tampilan bulan<Input id="agenda-month" type="month" name="month" defaultValue={month} /></label>{archive && <input type="hidden" name="view" value="archive" />}<Button type="submit" variant="outline">Lihat</Button></form></Card>
        {items.length ? <div className="agenda-timeline">{Array.from(grouped, ([date, agenda], index) => <section key={date} className="agenda-day"><div className="agenda-day__date"><span>{String(index + 1).padStart(2, "0")}</span><h3 className="font-display">{date}</h3></div><div className="agenda-day__events">{agenda.map((item) => <Card key={item.id} className="agenda-event" as="article"><div className="agenda-event__top"><span>{item.location?.toLowerCase().includes("contoh") || /contoh|demo/i.test(`${item.title} ${item.desc || ""}`) ? "AGENDA DEMO" : "AGENDA SEKOLAH"}</span><ArrowRight aria-hidden="true" /></div><h4 className="font-display">{item.title}</h4><p>{item.desc}</p><div className="agenda-event__meta"><span><Clock3 aria-hidden="true" />{item.startAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" })}</span>{item.location && <span><MapPin aria-hidden="true" />{item.location}</span>}</div></Card>)}</div></section>)}</div> : <Card className="agenda-empty" as="p">Tidak ada agenda pada periode ini.</Card>}
      </div>
    </section>
  </main>;
}
