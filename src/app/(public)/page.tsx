import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, CalendarDays, School } from "lucide-react";
import { db } from "@/lib/db";
import AnimatedContent from "@/components/AnimatedContent";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrandEmblem } from "@/components/BrandEmblem";
import { PublicImage } from "@/components/PublicImage";

export const revalidate = 60;
export const metadata = { title: "Beranda", description: "Website resmi sekolah IMBS: profil, berita, akademik, dan layanan murid baru.", openGraph: { title: "Beranda", description: "Profil, berita, akademik, dan layanan sekolah IMBS.", type: "website" as const } };

export default async function Home() {
  const now = new Date();
  const [greeting, posts, pages, students, teachers, achievements, agendas, albums, majors, extracurriculars, teacherProfiles] = await Promise.all([
    db.greeting.findUnique({ where: { id: 1 } }),
    db.post.findMany({ where: { status: "PUBLISHED", publishedAt: { lte: now } }, orderBy: { publishedAt: "desc" }, take: 3 }),
    db.customPage.findMany({ where: { showInMenu: true }, orderBy: [{ order: "asc" }, { title: "asc" }], take: 6 }),
    db.student.count({ where: { status: "AKTIF" } }),
    db.teacher.count({ where: { active: true } }),
    db.achievement.count(),
    db.agenda.findMany({ where: { startAt: { gte: now } }, orderBy: { startAt: "asc" }, take: 3 }),
    db.album.findMany({ include: { photos: { orderBy: { createdAt: "desc" }, take: 1 } }, orderBy: { createdAt: "desc" }, take: 3 }),
    db.major.findMany({ orderBy: { name: "asc" }, take: 3 }),
    db.extracurricular.findMany({ where: { active: true }, orderBy: { name: "asc" }, take: 3 }),
    db.teacher.findMany({ where: { active: true }, orderBy: { name: "asc" }, take: 3 }),
  ]);
  const heroPhoto = greeting?.photo || albums[0]?.photos[0]?.url;

  return <main id="main-content" className="public-shell overflow-hidden">
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-[var(--echo-text)] text-[var(--echo-paper-stock)]">
      <div aria-hidden="true" className="hero-orbit pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full border border-[color-mix(in_srgb,var(--echo-paper-stock)_10%,transparent)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-10 size-[25rem] rounded-full bg-[color-mix(in_srgb,var(--echo-accent-glow)_10%,transparent)] blur-[100px]" />
      <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:px-12 lg:py-24">
        <AnimatedContent trigger="mount" distance={30} blur={5} duration={1}>
          <p className="mb-7 flex items-center gap-3 text-xs font-semibold text-[var(--echo-accent-1)]"><span className="h-px w-8 bg-[var(--echo-accent-glow)]" />Sekolah IMBS · Tumbuh dalam ilmu dan adab</p>
          <h1 id="hero-title" className="max-w-3xl font-display text-[clamp(3.25rem,7vw,6.25rem)] font-medium leading-[.98] tracking-[-.045em]">Ruang tumbuh untuk <em className="text-[var(--echo-accent-1)]">masa depan.</em></h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-[color-mix(in_srgb,var(--echo-paper-stock)_70%,transparent)] sm:text-lg">Belajar dengan rasa ingin tahu, membangun karakter, dan menyiapkan langkah nyata untuk dunia yang terus berkembang.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 rounded-full bg-[var(--echo-accent-1)] px-6 text-[var(--echo-text)] hover:bg-[var(--echo-paper-stock)]"><Link href="/profil">Jelajahi sekolah <ArrowUpRight aria-hidden="true" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-[color-mix(in_srgb,var(--echo-paper-stock)_30%,transparent)] bg-transparent px-6 text-[var(--echo-paper-stock)] hover:bg-[color-mix(in_srgb,var(--echo-paper-stock)_10%,transparent)] hover:text-[var(--echo-paper-stock)]"><Link href="/spmb">Penerimaan murid</Link></Button>
          </div>
          <div aria-label="Statistik sekolah" className="mt-14 grid max-w-lg grid-cols-3 border-t border-[color-mix(in_srgb,var(--echo-paper-stock)_15%,transparent)] pt-6">
            {[[students, "Murid aktif"], [teachers, "Guru & tendik"], [achievements, "Prestasi"]].map(([count, label]) => <div key={label}><strong className="font-display text-3xl font-medium sm:text-4xl">{count}</strong><p className="mt-1 text-xs text-[color-mix(in_srgb,var(--echo-paper-stock)_55%,transparent)] sm:text-sm">{label}</p></div>)}
          </div>
        </AnimatedContent>

        <AnimatedContent trigger="mount" distance={20} rotate={2} delay={0.15} duration={1.1} className="relative mx-auto w-full max-w-[490px]">
          <BrandEmblem />
          <div className="hero-depth relative rounded-[var(--echo-radius-3xl)] border border-[color-mix(in_srgb,var(--echo-paper-stock)_20%,transparent)] bg-[color-mix(in_srgb,var(--echo-paper-stock)_10%,transparent)] p-3 backdrop-blur-sm">
            <div className="relative min-h-[470px] overflow-hidden rounded-[var(--echo-radius-3xl)] bg-[var(--echo-well)] sm:min-h-[540px]">
              {heroPhoto ? <PublicImage src={heroPhoto} alt={greeting?.principalName ? `Kepala sekolah ${greeting.principalName}` : "Kegiatan sekolah IMBS"} className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" fallbackLabel="Sekolah IMBS" /> : <div aria-hidden="true" className="hero-placeholder absolute inset-0"><span className="absolute -bottom-10 -left-12 h-[28rem] w-[25rem] rounded-[48%_48%_12%_12%] border border-[color-mix(in_srgb,var(--echo-paper-stock)_40%,transparent)] bg-[color-mix(in_srgb,var(--echo-text)_20%,transparent)]" /></div>}
              <div className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--echo-text)_90%,transparent)] via-[color-mix(in_srgb,var(--echo-text)_10%,transparent)] to-transparent" />
              <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--echo-paper-stock)_30%,transparent)] bg-[color-mix(in_srgb,var(--echo-text)_30%,transparent)] px-3 py-2 text-[10px] font-semibold uppercase  text-[var(--echo-paper-stock)] backdrop-blur-md"><School aria-hidden="true" className="size-3.5" />Mengenal IMBS</div>
              <div className="absolute inset-x-6 bottom-7 text-[var(--echo-paper-stock)] sm:inset-x-8 sm:bottom-9">
                <p className="text-xs uppercase  text-[color-mix(in_srgb,var(--echo-accent-1)_80%,transparent)]">{greeting?.title || "Sambutan Kepala Sekolah"}</p>
                <h2 className="mt-2 font-display text-3xl font-medium leading-tight sm:text-4xl">{greeting?.principalName || "Pendidikan yang bermakna"}</h2>
                <p className="mt-3 line-clamp-2 max-w-sm text-sm leading-6 text-[color-mix(in_srgb,var(--echo-paper-stock)_75%,transparent)]">{greeting?.body?.replace(/\s+/g, " ") || "Membentuk generasi berilmu, berkarakter, dan siap memberi manfaat bagi sesama."}</p>
                <Link href="/sambutan" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--echo-paper-stock)] underline decoration-[color-mix(in_srgb,var(--echo-paper-stock)_50%,transparent)] underline-offset-4 hover:decoration-[var(--echo-paper-stock)]">Baca sambutan <ArrowRight aria-hidden="true" className="size-4" /></Link>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="absolute -bottom-6 -left-7 -z-10 h-32 w-32 rounded-full border border-[color-mix(in_srgb,var(--echo-accent-2)_20%,transparent)]" />
        </AnimatedContent>
        <a href="#cerita-sekolah" className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[10px] font-semibold uppercase  text-[color-mix(in_srgb,var(--echo-paper-stock)_70%,transparent)] transition-colors hover:text-[var(--echo-paper-stock)] lg:flex">Jelajahi cerita <ArrowDown aria-hidden="true" className="size-3.5" /></a>
      </div>
    </section>

    {(majors.length > 0 || extracurriculars.length > 0) && <section id="cerita-sekolah" className="public-section mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <AnimatedContent distance={24} tilt={2} blur={4} className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="public-kicker">Belajar sesuai potensi</p><h2 className="h-gold-2 mt-3">Program yang membuka cakrawala</h2></div><Link href="/program" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground underline decoration-brand-500/40 underline-offset-4 hover:decoration-brand-600">Jelajahi program <ArrowRight aria-hidden="true" className="size-4" /></Link></AnimatedContent>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{majors.map((major, index) => <AnimatedContent key={major.id} distance={20} tilt={3} delay={index * 0.08}><Card className="spotlight-card group h-full !rounded-2xl !p-6 sm:!p-7" as="article"><span className="mb-8 flex size-11 items-center justify-center rounded-full bg-[var(--echo-accent-1)] text-[var(--echo-accent-ink)]"><BookOpen aria-hidden="true" className="size-5" /></span><p className="public-kicker !text-[10px]">Program pendidikan · 0{index + 1}</p><h3 className="h-gold-3 mt-2">{major.name}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{major.desc || major.code}</p><Link className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-foreground" href="/program">Pelajari program <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" /></Link></Card></AnimatedContent>)}{extracurriculars.map((activity, index) => <AnimatedContent key={activity.name} distance={20} tilt={3} delay={(majors.length + index) * 0.08}><Card className="spotlight-card group h-full !rounded-2xl !p-0 overflow-hidden" as="article">{activity.photo && <PublicImage src={activity.photo} alt="" loading="lazy" className="h-48 w-full object-cover" fallbackLabel={activity.name} />}<div className="p-6 sm:p-7"><p className="public-kicker !text-[10px]">Ekstrakurikuler · 0{majors.length + index + 1}</p><h3 className="h-gold-3 mt-2">{activity.name}</h3>{activity.desc && <p className="mt-3 text-sm leading-6 text-muted-foreground">{activity.desc}</p>}</div></Card></AnimatedContent>)}</div>
    </section>}

    {teacherProfiles.length > 0 && <section className="bg-[var(--echo-surface)] py-16 sm:py-20"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <AnimatedContent distance={24} blur={4} className="mb-10 flex items-end justify-between gap-4"><div><p className="public-kicker">Orang-orang di balik cerita</p><h2 className="h-gold-2 mt-3">Guru & tendik</h2></div><Link href="/guru" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4">Kenali semua <ArrowRight aria-hidden="true" className="size-4" /></Link></AnimatedContent>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{teacherProfiles.map((teacher, index) => <AnimatedContent key={teacher.id} distance={20} tilt={2} delay={index * 0.08}><Card asChild className="spotlight-card group !rounded-2xl !p-5"><Link href={`/guru/${teacher.id}`} className="flex min-h-32 items-center gap-5"><div className="size-24 shrink-0 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--echo-text)_10%,transparent)]">{teacher.photo ? <PublicImage src={teacher.photo} alt={teacher.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" fallbackLabel={teacher.name} /> : <span aria-hidden="true" className="flex h-full items-center justify-center font-display text-4xl text-[var(--echo-accent-ink)]">{teacher.name.slice(0, 1)}</span>}</div><div><h3 className="font-display text-xl font-semibold leading-tight">{teacher.name}</h3><p className="mt-2 text-sm text-muted-foreground">{teacher.position}</p></div></Link></Card></AnimatedContent>)}</div>
    </div></section>}

    <section className="public-section mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <AnimatedContent distance={24} tilt={2} blur={4} className="mb-10 flex items-end justify-between"><div><p className="public-kicker">Dari kehidupan sekolah</p><h2 className="h-gold-2 mt-3">Cerita terbaru</h2></div><Link href="/berita" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4">Semua berita <ArrowRight aria-hidden="true" className="size-4" /></Link></AnimatedContent>
      <div className="grid gap-5 md:grid-cols-3">{posts.map((post, index) => <AnimatedContent key={post.id} distance={24} rotate={index % 2 ? -1 : 1} delay={index * 0.08}><Card asChild className="spotlight-card group h-full !rounded-2xl !p-0 overflow-hidden"><Link href={`/berita/${post.slug}`}><div className="overflow-hidden"><PublicImage src={post.cover || `https://picsum.photos/seed/imbs-${post.slug}/720/420`} alt={post.cover ? post.title : ""} loading="lazy" decoding="async" className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" fallbackLabel={post.title} /></div><div className="p-6"><p className="public-kicker !text-[10px]">{post.publishedAt?.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p><h3 className="h-gold-3 mt-3">{post.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p><span className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold">Baca cerita <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" /></span></div></Link></Card></AnimatedContent>)}{!posts.length && <Card className="text-center text-muted-foreground md:col-span-3" as="p">Belum ada berita yang dipublikasikan.</Card>}</div>
    </section>

    <section className="bg-[var(--echo-text)] py-16 text-[var(--echo-paper-stock)] sm:py-20"><div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 md:grid-cols-[.8fr_1.2fr] lg:px-12">
      <AnimatedContent distance={24} blur={4}><p className="text-xs font-semibold text-[var(--echo-accent-1)]">Kalender sekolah</p><h2 className="mt-3 font-display text-4xl font-medium leading-tight sm:text-5xl">Langkah kecil, cerita besar.</h2><p className="mt-5 max-w-sm text-sm leading-7 text-[color-mix(in_srgb,var(--echo-paper-stock)_65%,transparent)]">Ikuti agenda dan rayakan pencapaian para murid bersama kami.</p><Link href="/agenda" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--echo-accent-1)] underline underline-offset-4">Lihat semua agenda <ArrowRight aria-hidden="true" className="size-4" /></Link></AnimatedContent>
      <div className="space-y-3">{agendas.map((agenda, index) => <AnimatedContent key={agenda.id} distance={20} direction="horizontal" delay={index * 0.08}><Card className="agenda-card group flex gap-4 !rounded-xl border-[color-mix(in_srgb,var(--echo-paper-stock)_15%,transparent)] !bg-[var(--echo-paper-stock)]/[.06] !p-5 text-[var(--echo-paper-stock)] transition-colors hover:!bg-[color-mix(in_srgb,var(--echo-paper-stock)_10%,transparent)]" as="article"><span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--echo-accent-2)_10%,transparent)] text-[var(--echo-accent-1)]"><CalendarDays aria-hidden="true" className="size-5" /></span><div className="min-w-0"><h3 className="font-display text-xl font-medium">{agenda.title}</h3><p className="mt-2 text-xs leading-5 text-[color-mix(in_srgb,var(--echo-paper-stock)_55%,transparent)]">{agenda.startAt.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" })}{agenda.location ? ` · ${agenda.location}` : ""}</p></div></Card></AnimatedContent>)}{achievements > 0 ? <AnimatedContent distance={20} direction="horizontal" delay={0.16}><AchievementPreview /></AnimatedContent> : !agendas.length ? <p className="rounded-xl border border-[color-mix(in_srgb,var(--echo-paper-stock)_15%,transparent)] p-5 text-sm text-[color-mix(in_srgb,var(--echo-paper-stock)_55%,transparent)]">Agenda sekolah akan ditampilkan di sini.</p> : null}</div>
    </div></section>

    <section className="public-section mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <AnimatedContent distance={22} tilt={2} className="mb-9 flex items-end justify-between"><div><p className="public-kicker">Belajar dan berkarya</p><h2 className="h-gold-2 mt-3">Potongan momen IMBS</h2></div><Link href="/galeri" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4">Buka galeri <ArrowRight aria-hidden="true" className="size-4" /></Link></AnimatedContent>
      <div className="grid gap-4 sm:grid-cols-3">{albums.flatMap((album, index) => album.photos.map((photo) => <AnimatedContent key={photo.id} distance={20} tilt={3} delay={index * 0.08}><Card asChild className="spotlight-card group !rounded-2xl !p-2"><Link href="/galeri" className="overflow-hidden rounded-xl"><PublicImage src={photo.url} alt={photo.caption || album.title} loading="lazy" className="h-56 w-full rounded-xl object-cover transition-transform duration-700 group-hover:scale-[1.04]" fallbackLabel={album.title} /><p className="px-3 py-4 font-display text-lg">{album.title}</p></Link></Card></AnimatedContent>))}{!albums.some((album) => album.photos.length) && <Card className="text-muted-foreground sm:col-span-3" as="p">Belum ada foto kegiatan.</Card>}</div>
    </section>

    <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-12">
      <div className="grid gap-10 rounded-[var(--echo-radius-3xl)] bg-[var(--echo-surface)] p-7 sm:p-10 lg:grid-cols-[.8fr_1.2fr] lg:p-14"><AnimatedContent distance={22} blur={4}><p className="public-kicker">Informasi yang sering dicari</p><h2 className="h-gold-2 mt-3">Ada yang ingin diketahui?</h2><p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">Temukan jawaban tentang sekolah dan layanan untuk keluarga IMBS.</p><Link href="/faq" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4">Kunjungi pusat bantuan <ArrowRight aria-hidden="true" className="size-4" /></Link></AnimatedContent><AnimatedContent distance={22} delay={0.12}><FaqAccordion limit={3} /></AnimatedContent></div>
      <AnimatedContent distance={24} tilt={2} className="relative mt-5 overflow-hidden rounded-[var(--echo-radius-3xl)] bg-[var(--echo-accent-ink)] px-7 py-10 text-[var(--echo-paper-stock)] sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-14"><div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-32 size-80 rounded-full border border-[color-mix(in_srgb,var(--echo-paper-stock)_15%,transparent)]" /><div className="relative"><p className="text-xs font-semibold text-[var(--echo-accent-1)]">Awal perjalanan baru</p><h2 className="mt-3 font-display text-3xl font-medium sm:text-4xl">Bergabung bersama keluarga IMBS</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[color-mix(in_srgb,var(--echo-paper-stock)_75%,transparent)]">Informasi penerimaan murid dan tahapan pendaftaran tersedia di halaman SPMB.</p></div><Button asChild size="lg" className="relative mt-6 h-12 shrink-0 rounded-full bg-[var(--echo-paper-stock)] px-6 text-[var(--echo-text)] hover:bg-[var(--echo-paper-stock)] lg:mt-0"><Link href="/spmb">Lihat SPMB <ArrowUpRight aria-hidden="true" /></Link></Button></AnimatedContent>
      {pages.length > 0 && <nav aria-label="Jelajahi halaman" className="mt-10 flex flex-wrap gap-x-6 gap-y-1 border-t border-border pt-6">{pages.map((page) => <Link key={page.id} href={`/${page.slug}`} className="inline-flex min-h-11 items-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">{page.title}</Link>)}</nav>}
    </section>
  </main>;
}

async function AchievementPreview() {
  const items = await db.achievement.findMany({ take: 2, orderBy: [{ year: "desc" }, { createdAt: "desc" }] });
  return <div className="space-y-3">{items.map((item) => <Card key={item.id} className="agenda-card !rounded-xl border-[color-mix(in_srgb,var(--echo-paper-stock)_15%,transparent)] !bg-[var(--echo-paper-stock)]/[.06] !p-5 text-[var(--echo-paper-stock)]" as="article"><p className="text-[10px] font-semibold uppercase text-[var(--echo-accent-1)]">{item.year} · {item.level}</p><h3 className="mt-2 font-display text-xl font-medium">{item.title}</h3></Card>)}</div>;
}
