import Link from "next/link";
import { db } from "@/lib/db";
import { GreetingCard } from "@/components/GreetingCard";
import { FaqAccordion } from "@/components/FaqAccordion";

export const revalidate = 60;
export const metadata = { title: "Beranda", description: "Website resmi sekolah IMBS: profil, berita, akademik, dan layanan murid baru.", openGraph: { title: "Beranda", description: "Profil, berita, akademik, dan layanan sekolah IMBS.", type: "website" as const } };

export default async function Home() {
  const now = new Date();
  const [greeting, posts, pages, students, teachers, achievements, agendas, albums, majors, extracurriculars, teacherProfiles] = await Promise.all([
    db.greeting.findUnique({ where: { id: 1 } }),
    db.post.findMany({ where: { status: "PUBLISHED", publishedAt: { lte: now } }, orderBy: { publishedAt: "desc" }, take: 3 }),
    db.customPage.findMany({ where: { showInMenu: true }, orderBy: [{ order: "asc" }, { title: "asc" }], take: 6 }),
    db.student.count({ where: { status: "AKTIF" } }), db.teacher.count({ where: { active: true } }), db.achievement.count(),
    db.agenda.findMany({ where: { startAt: { gte: now } }, orderBy: { startAt: "asc" }, take: 3 }),
    db.album.findMany({ include: { photos: { orderBy: { createdAt: "desc" }, take: 1 } }, orderBy: { createdAt: "desc" }, take: 3 }),
    db.major.findMany({ orderBy: { name: "asc" }, take: 3 }),
    db.extracurricular.findMany({ where: { active: true }, orderBy: { name: "asc" }, take: 3 }),
    db.teacher.findMany({ where: { active: true }, orderBy: { name: "asc" }, take: 3 }),
  ]);
  return <main id="main-content" className="mx-auto max-w-6xl space-y-[34px] px-[21px] pb-[34px]">
    <section aria-label="Selamat datang" className="relative left-1/2 -ml-[50vw] w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 left-[12%] h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-[34px] px-[21px] py-[55px] md:grid-cols-[1.08fr_.92fr] md:py-[72px]">
        <div>
          <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-[13px] py-[8px] text-[13px] font-semibold text-slate-100">Website Sekolah IMBS</p>
          <h1 className="mt-[21px] max-w-[540px] text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">Selamat Datang di Sekolah <span className="text-emerald-300">IMBS</span></h1>
          <p className="mt-[13px] max-w-[560px] text-[16px] leading-relaxed text-slate-300">Berita, profil, akademik, dan layanan sekolah dalam satu tempat.</p>
          <div className="mt-[21px] flex flex-wrap gap-[13px]"><Link className="btn-primary" href="/profil">Jelajahi Sekolah</Link><Link className="btn-outline border-white/50 !text-white hover:!bg-white/15" href="/pengaduan">Hubungi Kami</Link></div>
          <div aria-label="Statistik sekolah" className="mt-[34px] grid max-w-[460px] grid-cols-3 border-t border-white/15 pt-[21px]">
            {[[students,"Murid aktif"],[teachers,"Guru & tendik"],[achievements,"Prestasi"]].map(([count,label])=><div key={label}><strong className="text-2xl font-extrabold sm:text-3xl">{count}</strong><p className="mt-[4px] text-[13px] text-slate-300">{label}</p></div>)}
          </div>
        </div>
        <div className="animate-list">{greeting ? <GreetingCard greeting={greeting} compact /> : <aside className="card spotlight-card"><h2 className="h-gold-2">Profil Sekolah IMBS</h2><p className="mt-[13px] text-slate-600">Informasi profil, program, berita, dan layanan sekolah tersedia di sini.</p><Link className="btn-outline mt-[21px]" href="/profil">Lihat Profil</Link></aside>}</div>
      </div>
    </section>
    {(majors.length > 0 || extracurriculars.length > 0) && <section className="space-y-[13px]"><div className="flex items-end justify-between"><div><p className="text-[13px] uppercase tracking-widest text-slate-500">Akademik & minat</p><h2 className="h-gold-2 mt-[4px]">Program Unggulan</h2></div><Link href="/program" className="text-[14px] underline">Semua program</Link></div><div className="grid gap-[21px] sm:grid-cols-2 lg:grid-cols-3">{majors.map((major)=><article key={major.id} className="card spotlight-card"><p className="text-[13px] font-bold uppercase tracking-wide text-slate-500">Program pendidikan</p><h3 className="h-gold-3 mt-[8px]">{major.name}</h3><p className="mt-[8px] text-[14px] text-slate-600">{major.desc || major.code}</p></article>)}{extracurriculars.map((activity)=><article key={activity.name} className="card spotlight-card">{activity.photo&&<img src={activity.photo} alt="" loading="lazy" className="mb-[13px] h-[150px] w-full rounded-[13px] object-cover"/>}<p className="text-[13px] font-bold uppercase tracking-wide text-slate-500">Ekstrakurikuler</p><h3 className="h-gold-3 mt-[8px]">{activity.name}</h3>{activity.desc&&<p className="mt-[8px] text-[14px] text-slate-600">{activity.desc}</p>}</article>)}</div></section>}
    {teacherProfiles.length > 0 && <section className="space-y-[13px]"><div className="flex items-end justify-between"><div><p className="text-[13px] uppercase tracking-widest text-slate-500">Tenaga pendidik</p><h2 className="h-gold-2 mt-[4px]">Guru & Tendik</h2></div><Link href="/guru" className="text-[14px] underline">Lihat semua guru</Link></div><div className="grid gap-[21px] sm:grid-cols-2 lg:grid-cols-3">{teacherProfiles.map((teacher)=><Link key={teacher.id} href={`/guru/${teacher.id}`} className="card spotlight-card text-center"><div className="mx-auto mb-[13px] h-[120px] w-[120px] overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">{teacher.photo?<img src={teacher.photo} alt={teacher.name} loading="lazy" className="h-full w-full object-cover"/>:<span className="flex h-full items-center justify-center text-[40px] font-bold grad-text">{teacher.name.slice(0,1)}</span>}</div><h3 className="h-gold-3">{teacher.name}</h3><p className="mt-[4px] text-[14px] text-slate-500">{teacher.position}</p></Link>)}</div></section>}
    <section className="space-y-[13px]">
      <div className="flex items-end justify-between"><h2 className="h-gold-2">Berita Terbaru</h2><Link href="/berita" className="text-[14px] underline">Semua berita →</Link></div>
      <div className="grid gap-[21px] md:grid-cols-3">{posts.map((p, i) => <Link key={p.id} href={`/berita/${p.slug}`} style={{ animationDelay: `${i * 50}ms` }} className="card spotlight-card animate-list !p-0 overflow-hidden"><img src={p.cover || `https://picsum.photos/seed/imbs-${p.slug}/720/420`} alt={p.cover ? p.title : ""} loading="lazy" decoding="async" className="h-[180px] w-full object-cover" /><div className="p-[21px]"><h3 className="h-gold-3">{p.title}</h3><p className="mt-[8px] text-[14px] text-slate-600">{p.excerpt}</p><p className="mt-[13px] text-[13px] text-slate-500">{p.publishedAt?.toLocaleDateString("id-ID")}</p></div></Link>)}{!posts.length && <p className="card text-center text-slate-500 md:col-span-3">Belum ada berita yang dipublikasikan.</p>}</div>
    </section>
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
