import { Beaker, BookOpen, Compass, Mic2, Music2 } from "lucide-react";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { PublicImage } from "@/components/PublicImage";

export const revalidate = 60;
export const metadata = { title: "Ekstrakurikuler", description: "Kegiatan ekstrakurikuler sekolah" };
const icons = [BookOpen, Beaker, Compass, Mic2, Music2];

export default async function ExtracurricularPage() {
  const items = await db.extracurricular.findMany({ where: { active: true }, orderBy: { name: "asc" } });
  return (
    <main className="activity-page">
      <div aria-hidden="true" className="story-progress"><span /></div>
      <header className="activity-hero">
        <div><p className="story-eyebrow">BELAJAR DI LUAR KELAS</p><h1 className="font-display">Minat yang<br /><em>menjadi karya.</em></h1><p>Ruang untuk mencoba, berlatih, dan tumbuh bersama teman.</p><span className="activity-hero__count">{String(items.length).padStart(2, "0")} KEGIATAN</span></div>
        <div aria-hidden="true" className="activity-hero__art"><div className="activity-hero__book"><BookOpen /><span>IMBS</span></div><i /><i /><i /></div>
      </header>
      <section className="activity-chapters">
        <div className="activity-chapters__heading"><p className="story-eyebrow">PILIH JALANMU</p><h2 className="font-display">Setiap minat punya ruang.</h2></div>
        {items.length ? items.map((item, index) => {
          const Icon = icons[index % icons.length];
          const demo = /contoh|demo/i.test(item.desc || "") || /contoh|demo/i.test(item.schedule || "");
          return <article key={item.id} className={`activity-chapter ${index % 2 ? "activity-chapter--reverse" : ""}`}>
            <div className="activity-chapter__visual">
              {item.photo ? <PublicImage src={item.photo} alt={item.name} fallbackLabel={item.name} className="activity-chapter__image" /> : <div aria-hidden="true" className="activity-chapter__art"><span>{String(index + 1).padStart(2, "0")}</span><Icon /></div>}
            </div>
            <div className="activity-chapter__copy">
              <p className="story-eyebrow">KEGIATAN {String(index + 1).padStart(2, "0")}{demo ? " · DATA DEMO" : ""}</p>
              <h3 className="font-display">{item.name}</h3>
              {item.desc && <p className="activity-chapter__description">{item.desc}</p>}
              <dl>{item.coach && <div><dt>Pembina</dt><dd>{item.coach}</dd></div>}{item.schedule && <div><dt>Jadwal</dt><dd>{item.schedule}</dd></div>}</dl>
            </div>
          </article>;
        }) : <Card className="activity-empty" as="p">Informasi kegiatan belum tersedia.</Card>}
      </section>
    </main>
  );
}
