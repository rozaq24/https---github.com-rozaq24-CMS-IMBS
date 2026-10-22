import { ArrowDown, ArrowUpRight, BookOpen, FlaskConical, Languages } from "lucide-react";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { PublicImage } from "@/components/PublicImage";

export const revalidate = 60;
export const metadata = { title: "Program dan Jurusan", description: "Program pendidikan dan jurusan sekolah" };

const artwork = (name: string, index: number) => {
  if (/sains|science|lab/i.test(name)) return "/brand/stories/laboratorium.svg";
  if (/bahasa|literasi|baca/i.test(name)) return "/brand/stories/perpustakaan.svg";
  return index % 2 ? "/brand/stories/kolaborasi.svg" : "/brand/stories/ruang-belajar.svg";
};

export default async function ProgramsPage() {
  const majors = await db.major.findMany({ orderBy: { name: "asc" } });
  return <main className="program-story">
    <div aria-hidden="true" className="story-progress"><span /></div>
    <header className="program-hero">
      <div className="program-hero__copy"><p className="story-eyebrow">AKADEMIK IMBS</p><h1 className="font-display">Belajar sesuai <em>potensi.</em></h1><p>Ruang untuk menguatkan rasa ingin tahu, menguji gagasan, dan bertumbuh melalui pengalaman belajar.</p><a href="#program-pilihan" className="story-link">Jelajahi program <ArrowDown aria-hidden="true" /></a><span className="program-hero__count">{String(majors.length).padStart(2, "0")} program terdaftar</span></div>
      <div className="program-hero__visual"><PublicImage src="/brand/stories/laboratorium.svg" alt="Ilustrasi ruang belajar dan laboratorium" className="program-hero__image" /><span className="program-hero__seal"><BookOpen aria-hidden="true" /> Belajar · mencoba · bertumbuh</span><span className="program-hero__orbit" aria-hidden="true" /></div>
    </header>
    <section id="program-pilihan" className="program-list">
      <div className="program-list__heading"><p className="story-eyebrow">JALUR BELAJAR</p><h2 className="font-display">Kenali bidang yang ingin kamu tekuni.</h2></div>
      {majors.length ? majors.map((major, index) => {
        const isDemo = major.code.startsWith("DEMO") || /contoh/i.test(major.name);
        const Icon = /sains/i.test(major.name) ? FlaskConical : /bahasa|literasi/i.test(major.name) ? Languages : BookOpen;
        return <article key={major.id} className={`program-chapter ${index % 2 ? "program-chapter--reverse" : ""}`}>
          <div className="program-chapter__visual"><PublicImage src={artwork(major.name, index)} alt={`Ilustrasi ${major.name}`} loading="lazy" className="program-chapter__image" /><span className="program-chapter__index">{String(index + 1).padStart(2, "0")}</span></div>
          <Card className="program-chapter__copy" as="div"><p className="story-eyebrow">{major.code}{isDemo && <span className="demo-chip">DATA DEMO</span>}</p><span className="program-chapter__icon"><Icon aria-hidden="true" /></span><h3 className="font-display">{major.name}</h3><p>{major.desc || "Informasi program sedang disiapkan oleh sekolah."}</p><span className="program-chapter__foot">Program pendidikan · IMBS <ArrowUpRight aria-hidden="true" /></span></Card>
        </article>;
      }) : <Card as="p" className="program-empty">Informasi program belum tersedia.</Card>}
    </section>
  </main>;
}
