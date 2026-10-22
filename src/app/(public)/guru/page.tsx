import Link from "next/link";
import { ArrowUpRight, BookOpen, GraduationCap, Search, Users } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PublicImage } from "@/components/PublicImage";

export const revalidate = 60;
export const metadata = { title: "Direktori Guru", description: "Kenali guru dan tenaga kependidikan IMBS." };

export default async function TeachersPage({ searchParams }: { searchParams: { q?: string; jabatan?: string } }) {
  const q = searchParams.q?.trim() || "";
  const jabatan = searchParams.jabatan?.trim() || "";
  const [teachers, positions, total] = await Promise.all([
    db.teacher.findMany({
      where: { active: true, ...(jabatan ? { position: { contains: jabatan } } : {}), ...(q ? { OR: [{ name: { contains: q } }, { position: { contains: q } }, { subjects: { contains: q } }] } : {}) },
      orderBy: { name: "asc" },
    }),
    db.teacher.findMany({ where: { active: true }, select: { position: true }, distinct: ["position"], orderBy: { position: "asc" } }),
    db.teacher.count({ where: { active: true } }),
  ]);

  return <main className="faculty-page">
    <div aria-hidden="true" className="story-progress"><span /></div>
    <header className="faculty-hero">
      <div className="faculty-hero__copy">
        <p className="story-eyebrow">ORANG-ORANG DI BALIK SETIAP CERITA</p>
        <h1 className="font-display">Guru & tenaga <em>pendidik.</em></h1>
        <p>Temui para pendamping belajar yang membantu rasa ingin tahu tumbuh menjadi pengetahuan dan karya.</p>
        <a className="faculty-hero__jump" href="#cerita-pendidik">Kenali para pendidik <ArrowUpRight aria-hidden="true" /></a>
      </div>
      <div aria-hidden="true" className="faculty-hero__art">
        <div className="faculty-hero__orb faculty-hero__orb--one" />
        <div className="faculty-hero__orb faculty-hero__orb--two" />
        <div className="faculty-hero__book"><BookOpen /><span>IMBS</span></div>
        <div className="faculty-hero__note"><GraduationCap /><span>Belajar<br />bersama</span></div>
        <span className="faculty-hero__caption">Cerita belajar di IMBS</span>
      </div>
      <div className="faculty-hero__index"><span>{String(total).padStart(2, "0")}</span><small>pendidik aktif<br />dalam direktori</small></div>
    </header>

    <Card as="form" className="faculty-filters" id="direktori">
      <label className="faculty-filters__search"><span>Cari nama, jabatan, atau bidang ajar</span><span className="faculty-filters__input"><Search aria-hidden="true" /><Input name="q" defaultValue={q} placeholder="Contoh: Sains, Bahasa, atau Ahmad" /></span></label>
      <label className="faculty-filters__position"><span>Bidang tugas</span><NativeSelect name="jabatan" defaultValue={jabatan}><option value="">Semua bidang</option>{positions.map((item) => <option key={item.position} value={item.position}>{item.position}</option>)}</NativeSelect></label>
      <Button className="faculty-filters__submit" variant="default">Tampilkan</Button>
    </Card>

    <section className="faculty-directory" id="cerita-pendidik" aria-label="Cerita para pendidik">
      <aside className="faculty-directory__aside">
        <p className="story-eyebrow">KOMUNITAS PENDIDIK</p>
        <h2 className="font-display">Belajar tumbuh lewat <em>kebersamaan.</em></h2>
        <p>Setiap pendidik membawa pengalaman dan cara pandang yang berbeda ke dalam ruang belajar.</p>
        <div className="faculty-directory__stat"><Users aria-hidden="true" /><strong>{String(teachers.length).padStart(2, "0")}</strong><span>{q || jabatan ? "hasil pencarian" : "profil ditampilkan"}</span></div>
        <div aria-hidden="true" className="faculty-directory__seal"><span>IMBS</span><BookOpen /><i /></div>
        <a className="faculty-directory__reset" href="/guru">Lihat semua pendidik <ArrowUpRight aria-hidden="true" /></a>
      </aside>

      <div className="faculty-directory__chapters">
        {teachers.length ? teachers.map((teacher, index) => {
          const isDemo = teacher.nip.startsWith("DEMO-GURU-") || /demo|contoh/i.test(`${teacher.education || ""} ${teacher.experience || ""}`);
          return <article className="faculty-chapter" key={teacher.id}>
            <Link href={`/guru/${teacher.id}`} className="faculty-chapter__link">
              <div className="faculty-chapter__portrait">
                {teacher.photo ? <PublicImage src={teacher.photo} alt={`Ilustrasi profil ${teacher.name}`} className="faculty-chapter__image" /> : <div className="faculty-chapter__initial" aria-hidden="true">{teacher.name.slice(0, 1)}</div>}
                <span className="faculty-chapter__number">{String(index + 1).padStart(2, "0")}</span>
                {isDemo && <span className="faculty-chapter__demo">PROFIL DEMO</span>}
              </div>
              <div className="faculty-chapter__body">
                <p className="story-eyebrow">PENDIDIK · {String(index + 1).padStart(2, "0")}</p>
                <h3 className="font-display">{teacher.name}</h3>
                <p className="faculty-chapter__role">{teacher.position}</p>
                {teacher.subjects && <p className="faculty-chapter__subjects">{teacher.subjects}</p>}
                {teacher.education && <p className="faculty-chapter__education"><GraduationCap aria-hidden="true" />{teacher.education}</p>}
                <span className="faculty-chapter__more">Lihat profil <ArrowUpRight aria-hidden="true" /></span>
              </div>
            </Link>
          </article>;
        }) : <Card className="faculty-empty" as="div"><Search aria-hidden="true" /><h3>Tidak ada profil yang cocok</h3><p>Coba kata kunci atau bidang tugas yang berbeda.</p><Link href="/guru">Hapus pencarian</Link></Card>}
      </div>
    </section>
  </main>;
}
