import { ArrowDown, Award, Medal, Trophy } from "lucide-react";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { PublicImage } from "@/components/PublicImage";

export const revalidate = 60;
export const metadata = { title: "Prestasi", description: "Prestasi siswa dan guru" };

export default async function AchievementsPage() {
  const items = await db.achievement.findMany({ include: { student: { select: { name: true } }, teacher: { select: { name: true } } }, orderBy: [{ year: "desc" }, { createdAt: "desc" }] });
  return <main className="achievement-story">
    <div aria-hidden="true" className="story-progress"><span /></div>
    <header className="achievement-hero"><div><p className="story-eyebrow">IKHTIAR DAN APRESIASI</p><h1 className="font-display">Prestasi <em>bertumbuh.</em></h1><p>Setiap pencapaian menyimpan cerita tentang latihan, keberanian mencoba, dan dukungan bersama.</p><a href="#rekam-jejak" className="story-link">Lihat rekam jejak <ArrowDown aria-hidden="true" /></a></div><div className="achievement-hero__mark"><Trophy aria-hidden="true" /><strong>{String(items.length).padStart(2, "0")}</strong><span>catatan prestasi</span><i aria-hidden="true" /></div></header>
    <section id="rekam-jejak" className="achievement-timeline"><aside className="achievement-timeline__aside"><p className="story-eyebrow">REKAM JEJAK</p><h2 className="font-display">Proses yang patut dirayakan.</h2><p>Prestasi adalah bagian dari perjalanan belajar. Setiap cerita di halaman ini dapat dilengkapi dokumentasi resmi sekolah.</p></aside>
      <div className="achievement-timeline__items">{items.length ? items.map((item, index) => {
        const isDemo = /contoh|demo/i.test(`${item.title} ${item.desc || ""}`);
        const person = item.student?.name || item.teacher?.name;
        return <article key={item.id} className="achievement-entry"><div className="achievement-entry__year"><span>{item.year || "—"}</span><i aria-hidden="true" /></div><Card className="achievement-entry__card" as="div"><div className="achievement-entry__visual">{item.photo ? <PublicImage src={item.photo} alt={item.title} loading="lazy" className="achievement-entry__image" /> : <><span className="achievement-entry__halo" /><Medal aria-hidden="true" /><span className="achievement-entry__number">{String(index + 1).padStart(2, "0")}</span></>}</div><div className="achievement-entry__copy"><p className="story-eyebrow">{item.level || "Apresiasi sekolah"}{isDemo && <span className="demo-chip">DATA DEMO</span>}</p><h3 className="font-display">{item.title}</h3>{person && <p className="achievement-entry__person"><Award aria-hidden="true" /> {person}</p>}{item.desc && <p className="achievement-entry__description">{item.desc}</p>}</div></Card></article>;
      }) : <Card as="p" className="achievement-empty">Belum ada prestasi yang dipublikasikan.</Card>}</div>
    </section>
  </main>;
}
