import Link from "next/link";
import { ArrowRight, CalendarDays, Eye, Search } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PublicImage } from "@/components/PublicImage";

export const revalidate = 60;

const categories = ["", "BERITA", "PENGUMUMAN", "AGENDA", "ARTIKEL"];
const dateLabel = (date: Date | null) => date?.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) || "Belum dijadwalkan";
const excerptOf = (post: { excerpt: string | null; content: string }) => post.excerpt || `${post.content.replace(/<[^>]+>/g, "").slice(0, 145)}…`;

export default async function BeritaPage({ searchParams }: { searchParams: { type?: string; q?: string } }) {
  const type = searchParams.type || "";
  const q = searchParams.q || "";
  const now = new Date();
  const posts = await db.post.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { lte: now },
      ...(type ? { type } : {}),
      ...(q ? { OR: [{ title: { contains: q } }, { excerpt: { contains: q } }] } : {}),
    },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: "desc" },
    take: 30,
  });
  const [featured, ...stories] = posts;
  const coverByType: Record<string, string> = {
    BERITA: "/brand/stories/kolaborasi.svg",
    PENGUMUMAN: "/brand/stories/karya-murid.svg",
    AGENDA: "/brand/stories/menulis.svg",
    ARTIKEL: "/brand/stories/perpustakaan.svg",
  };

  return (
    <main className="journal-page">
      <div aria-hidden="true" className="story-progress"><span /></div>
      <header className="journal-hero">
        <div className="journal-hero__heading">
          <p className="story-eyebrow">KABAR DARI SEKOLAH</p>
          <h1 className="font-display">Jurnal <em>IMBS.</em></h1>
          <p>Catatan kegiatan, pengumuman, dan gagasan yang tumbuh bersama warga sekolah.</p>
        </div>
        {featured ? <Card asChild className="journal-feature">
          <Link href={`/berita/${featured.slug}`}>
            <div className="journal-feature__visual">
              <PublicImage src={featured.cover || coverByType[featured.type] || "/brand/stories/ruang-belajar.svg"} alt={featured.title} fallbackLabel={featured.title} className="journal-feature__image" />
              <span className="journal-feature__index">CERITA PILIHAN · 01</span>
            </div>
            <div className="journal-feature__copy">
              <p className="journal-meta"><span>{featured.type}</span><span><CalendarDays aria-hidden="true" />{dateLabel(featured.publishedAt)}</span></p>
              <h2 className="font-display">{featured.title}</h2>
              <p>{excerptOf(featured)}</p>
              <span className="journal-read">Baca cerita lengkap <ArrowRight aria-hidden="true" /></span>
            </div>
          </Link>
        </Card> : <div className="journal-feature journal-feature--empty"><p>Belum ada cerita untuk ditampilkan.</p></div>}
      </header>

      <section className="journal-archive" aria-label="Arsip publikasi sekolah">
        <aside className="journal-archive__aside">
          <p className="story-eyebrow">ARSIP SEKOLAH</p>
          <h2 className="font-display">Baca sesuai minat</h2>
          <nav aria-label="Kategori publikasi" className="journal-categories">
            {categories.map((item) => {
              const label = item || "Semua cerita";
              const active = type === item;
              return <Link key={item || "all"} href={item ? `/berita?type=${item}${q ? `&q=${encodeURIComponent(q)}` : ""}` : `/berita${q ? `?q=${encodeURIComponent(q)}` : ""}`} aria-current={active ? "page" : undefined} className={active ? "is-active" : ""}>{label}</Link>;
            })}
          </nav>
          <Card as="form" action="/berita" className="journal-search">
            <label htmlFor="journal-search-input">Cari dalam jurnal</label>
            <div><Input id="journal-search-input" name="q" defaultValue={q} placeholder="Kata kunci…" /><Button type="submit" size="icon" aria-label="Cari berita"><Search aria-hidden="true" /></Button></div>
            {type && <Input type="hidden" name="type" value={type} />}
          </Card>
        </aside>
        <div className="journal-feed">
          <div className="journal-feed__top"><p className="story-eyebrow">MENYUSURI CERITA</p><span>{posts.length.toString().padStart(2, "0")} publikasi</span></div>
          {stories.map((post, index) => (
            <Card asChild key={post.id} className="journal-story">
              <Link href={`/berita/${post.slug}`} className={index % 2 ? "journal-story__link journal-story__link--reverse" : "journal-story__link"}>
                <div className="journal-story__visual">
                  <PublicImage src={post.cover || coverByType[post.type] || "/brand/stories/ruang-belajar.svg"} alt={post.title} fallbackLabel={post.title} className="journal-story__image" />
                  <span>{String(index + 2).padStart(2, "0")}</span>
                </div>
                <div className="journal-story__copy">
                  <p className="journal-meta"><span>{post.type}</span><span><CalendarDays aria-hidden="true" />{dateLabel(post.publishedAt)}</span></p>
                  <h2 className="font-display">{post.title}</h2>
                  <p>{excerptOf(post)}</p>
                  <div className="journal-story__byline"><span>Oleh {post.author?.name || "Tim IMBS"}</span><span><Eye aria-hidden="true" />{post.views}</span></div>
                </div>
              </Link>
            </Card>
          ))}
          {!posts.length && <Card className="journal-empty" as="p">Belum ada publikasi untuk filter ini. Coba kategori lain atau hapus kata kunci pencarian.</Card>}
        </div>
      </section>
    </main>
  );
}
