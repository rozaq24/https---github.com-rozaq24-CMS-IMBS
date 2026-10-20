import Link from "next/link";
import { db } from "@/lib/db";
import { GreetingCard } from "@/components/GreetingCard";
import { FaqAccordion } from "@/components/FaqAccordion";

export const revalidate = 60;
export const metadata = { title: "Beranda", description: "Website resmi sekolah IMBS: profil, berita, akademik, dan layanan murid baru.", openGraph: { title: "Beranda", description: "Profil, berita, akademik, dan layanan sekolah IMBS.", type: "website" as const } };

export default async function Home() {
  const now = new Date();
  const [greeting, posts, pages, students, teachers, achievements, agendas, albums] = await Promise.all([
    db.greeting.findUnique({ where: { id: 1 } }),
    db.post.findMany({ where: { status: "PUBLISHED", publishedAt: { lte: now } }, orderBy: { publishedAt: "desc" }, take: 3 }),
    db.customPage.findMany({ where: { showInMenu: true }, orderBy: [{ order: "asc" }, { title: "asc" }], take: 6 }),
    db.student.count({ where: { status: "AKTIF" } }), db.teacher.count({ where: { active: true } }), db.achievement.count(),
    db.agenda.findMany({ where: { startAt: { gte: now } }, orderBy: { startAt: "asc" }, take: 3 }),
    db.album.findMany({ include: { photos: { orderBy: { createdAt: "desc" }, take: 1 } }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);
  return <main className="mx-auto max-w-6xl space-y-[34px] px-[21px] py-[34px]">
    <header className="card spotlight-card"><p className="text-[13px] uppercase tracking-widest text-slate-500">Website Sekolah IMBS</p><h1 className="h-gold-1 grad-text mt-[13px]">Selamat Datang di Website Sekolah</h1><p className="mt-[13px] text-[16px] text-slate-600">Berita, profil, akademik, dan layanan sekolah dalam satu tempat.</p><div className="mt-[21px] flex flex-wrap gap-[13px]"><Link className="btn-primary" href="/spmb">Daftar SPMB</Link><Link className="btn-outline" href="/berita">Baca Berita</Link><Link className="btn-outline" href="/profil">Profil Sekolah</Link></div></header>
    <GreetingCard greeting={greeting} compact />
    <section aria-label="Statistik sekolah" className="grid grid-cols-3 gap-[13px]">{[[students,"Murid aktif"],[teachers,"Guru & tendik"],[achievements,"Prestasi"]].map(([count,label])=><article key={label} className="card spotlight-card text-center"><strong className="h-gold-2 grad-text">{count}</strong><p className="mt-[4px] text-[14px] text-slate-600">{label}</p></article>)}</section>
    <section className="space-y-[13px]"><div className="flex items-end justify-between"><h2 className="h-gold-2">Berita Terbaru</h2><Link href="/berita" className="text-[14px] underline">Semua berita →</Link></div><div className="grid gap-[21px] md:grid-cols-3">{posts.map((p, i) => <Link key={p.id} href={`/berita/${p.slug}`} style={{ animationDelay: `${i * 50}ms` }} className="card animate-list hover:shadow-xl transition">{p.cover && <img src={p.cover} alt={p.title} className="mb-[13px] h-[140px] w-full rounded-[13px] object-cover" />}<h3 className="h-gold-3">{p.title}</h3><p className="mt-[8px] text-[13px] text-slate-500">{p.publishedAt?.toLocaleDateString("id-ID")}</p></Link>)}{!posts.length && <p className="card text-center text-slate-500 md:col-span-3">Belum ada berita yang dipublikasikan.</p>}</div></section>
    <section className="grid gap-[21px] md:grid-cols-2"><div className="space-y-[13px]"><div className="flex items-end justify-between"><h2 className="h-gold-2">Agenda Mendatang</h2><Link href="/agenda" className="text-[14px] underline">Semua agenda</Link></div>{agendas.map((a)=><article key={a.id} className="card"><h3 className="h-gold-3">{a.title}</h3><p className="mt-[4px] text-[14px] text-slate-500">{a.startAt.toLocaleString("id-ID",{dateStyle:"medium",timeStyle:"short",timeZone:"Asia/Jakarta"})}{a.location?` · ${a.location}`:""}</p></article>)}{!agendas.length&&<p className="card text-slate-500">Belum ada agenda mendatang.</p>}</div><div className="space-y-[13px]"><div className="flex items-end justify-between"><h2 className="h-gold-2">Prestasi</h2><Link href="/prestasi" className="text-[14px] underline">Semua prestasi</Link></div>{achievements ? <AchievementPreview /> : <p className="card text-slate-500">Belum ada prestasi yang dipublikasikan.</p>}</div></section>
    <section className="space-y-[13px]"><div className="flex items-end justify-between"><h2 className="h-gold-2">Galeri Kegiatan</h2><Link href="/galeri" className="text-[14px] underline">Buka galeri</Link></div><div className="grid gap-[13px] sm:grid-cols-3">{albums.flatMap((album)=>album.photos.map((photo)=><Link key={photo.id} href="/galeri" className="card spotlight-card !p-[8px]"><img src={photo.url} alt={photo.caption || album.title} className="h-[180px] w-full rounded-[13px] object-cover" /><p className="p-[8px] text-[14px] font-semibold">{album.title}</p></Link>))}{!albums.some((a)=>a.photos.length)&&<p className="card text-slate-500 sm:col-span-3">Belum ada foto kegiatan.</p>}</div></section>
    {pages.length>0&&<section className="space-y-[13px]"><h2 className="h-gold-2">Jelajahi</h2><div className="flex flex-wrap gap-[13px]">{pages.map((p)=><Link key={p.id} href={`/${p.slug}`} className="btn-outline !py-[8px]">{p.title}</Link>)}</div></section>}
    <section className="grid gap-[21px] md:grid-cols-2"><div className="space-y-[13px]"><div className="flex items-end justify-between"><h2 className="h-gold-2">FAQ</h2><Link href="/faq" className="text-[14px] underline">Semua pertanyaan</Link></div><FaqAccordion limit={3}/></div><aside className="card flex flex-col items-start justify-center gap-[13px] bg-slate-900 text-white"><h2 className="h-gold-2">Bergabung bersama kami</h2><p>Informasi penerimaan murid baru tersedia pada halaman SPMB.</p><Link className="btn-primary" href="/spmb">Lihat SPMB</Link></aside></section>
  </main>;
}

async function AchievementPreview() {
  const items = await db.achievement.findMany({ take: 2, orderBy: [{ year: "desc" }, { createdAt: "desc" }] });
  return <div className="space-y-[13px]">{items.map((item)=><article key={item.id} className="card spotlight-card"><p className="text-[13px] text-slate-500">{item.year} · {item.level}</p><h3 className="h-gold-3">{item.title}</h3></article>)}</div>;
}
