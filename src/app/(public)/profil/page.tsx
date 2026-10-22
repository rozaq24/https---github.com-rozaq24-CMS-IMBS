import Link from "next/link";
import { ArrowDown, ArrowRight, BookOpenCheck, Compass } from "lucide-react";
import { db } from "@/lib/db";
import { GreetingCard } from "@/components/GreetingCard";
import { Card } from "@/components/ui/card";
import { PublicImage } from "@/components/PublicImage";

export const revalidate = 60;
export const metadata = { title: "Profil Sekolah", description: "Visi-misi, sejarah, dan sambutan Kepala Sekolah", openGraph: { title: "Profil Sekolah", description: "Visi-misi, sejarah, dan sambutan Kepala Sekolah." } };

export default async function ProfilPage() {
  const [greeting, visi, sejarah] = await Promise.all([
    db.greeting.findUnique({ where: { id: 1 } }),
    db.customPage.findUnique({ where: { slug: "visi-misi" } }),
    db.customPage.findUnique({ where: { slug: "sejarah" } }),
  ]);
  return <main className="profile-story">
    <div aria-hidden="true" className="story-progress"><span /></div>
    <header className="profile-hero"><div><p className="story-eyebrow">MENGENAL IMBS</p><h1 className="font-display">Sebuah ruang untuk <em>bertumbuh.</em></h1><p>Kenali nilai yang kami rawat, perjalanan yang kami tempuh, dan cita-cita yang kami bangun bersama.</p><a href="#sambutan" className="story-link">Mulai mengenal IMBS <ArrowDown aria-hidden="true" /></a></div><div className="profile-hero__visual"><PublicImage src="/brand/stories/ruang-belajar.svg" alt="Ilustrasi ruang belajar yang kolaboratif" className="profile-hero__image" /><span className="profile-hero__stamp">IMBS<br />BELAJAR BERSAMA</span><i aria-hidden="true" /></div></header>
    <section id="sambutan" className="profile-greeting"><div className="profile-section-intro"><p className="story-eyebrow">PESAN SEKOLAH</p><h2 className="font-display">Salam pembuka.</h2><p>Sepenggal sambutan untuk keluarga besar IMBS.</p></div><GreetingCard greeting={greeting} compact /></section>
    <section id="nilai" className="profile-chapter profile-chapter--values"><div className="profile-chapter__visual"><PublicImage src="/brand/stories/perpustakaan.svg" alt="Ilustrasi murid belajar dan membaca" loading="lazy" className="profile-chapter__image" /><span className="profile-chapter__caption"><BookOpenCheck aria-hidden="true" /> NILAI PENDIDIKAN</span></div><div className="profile-chapter__body"><p className="story-eyebrow">01 / ARAH PENDIDIKAN</p><h2 className="font-display">Belajar dengan tujuan dan kepedulian.</h2><Card className="profile-chapter__text" as="article">{visi ? <div className="public-rich-text" dangerouslySetInnerHTML={{ __html: visi.content }} /> : <p>Informasi visi dan misi sedang disiapkan.</p>}<Link href="/visi-misi" className="story-inline-link">Baca visi dan misi <ArrowRight aria-hidden="true" /></Link></Card></div></section>
    <section id="perjalanan" className="profile-chapter profile-chapter--history"><div className="profile-chapter__body"><p className="story-eyebrow">02 / PERJALANAN</p><h2 className="font-display">Dari cita-cita menuju hari esok.</h2><Card className="profile-chapter__text" as="article">{sejarah ? <div className="public-rich-text" dangerouslySetInnerHTML={{ __html: sejarah.content }} /> : <p>Informasi sejarah sekolah sedang disiapkan.</p>}<Link href="/sejarah" className="story-inline-link">Jelajahi sejarah <ArrowRight aria-hidden="true" /></Link></Card></div><div className="profile-chapter__visual"><PublicImage src="/brand/stories/karya-murid.svg" alt="Ilustrasi karya dan proses belajar murid" loading="lazy" className="profile-chapter__image" /><span className="profile-chapter__caption"><Compass aria-hidden="true" /> TUMBUH BERSAMA</span></div></section>
  </main>;
}
