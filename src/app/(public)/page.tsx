import Link from "next/link";
import { db } from "@/lib/db";
import { GreetingCard } from "@/components/GreetingCard";

export const revalidate = 60;

export default async function Home() {
  const now = new Date();
  const [greeting, posts, pages] = await Promise.all([
    db.greeting.findUnique({ where: { id: 1 } }),
    db.post.findMany({ where: { status: "PUBLISHED", publishedAt: { lte: now } }, orderBy: { publishedAt: "desc" }, take: 3 }),
    db.customPage.findMany({ where: { showInMenu: true }, orderBy: [{ order: "asc" }, { title: "asc" }], take: 6 }),
  ]);
  return (
    <main className="mx-auto max-w-6xl px-[21px] py-[34px] space-y-[34px]">
      <header className="card">
        <p className="text-[13px] uppercase tracking-widest text-slate-500">CMS IMBS • Website Sekolah</p>
        <h1 className="h-gold-1 grad-text mt-[13px]">Selamat Datang di Website Sekolah</h1>
        <p className="mt-[13px] text-[16px] text-slate-600">Berita, profil, akademik, dan layanan SPMB dalam satu tempat.</p>
        <div className="mt-[21px] flex gap-[13px] flex-wrap">
          <Link className="btn-primary" href="/spmb">Daftar SPMB</Link>
          <Link className="btn-outline" href="/berita">Baca Berita</Link>
          <Link className="btn-outline" href="/profil">Profil Sekolah</Link>
        </div>
      </header>
      <GreetingCard greeting={greeting} compact />
      <section className="space-y-[13px]">
        <div className="flex items-end justify-between">
          <h2 className="h-gold-2">Berita Terbaru</h2>
          <Link href="/berita" className="underline text-[14px]">Semua berita →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-[21px]">
          {posts.map((p) => (
            <Link key={p.id} href={`/berita/${p.slug}`} className="card hover:shadow-xl transition">
              {p.cover && <img src={p.cover} alt={p.title} className="rounded-[13px] w-full h-[140px] object-cover mb-[13px]" />}
              <h3 className="h-gold-3">{p.title}</h3>
              <p className="text-[13px] text-slate-500 mt-[8px]">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("id-ID") : ""}</p>
            </Link>
          ))}
          {posts.length === 0 && <p className="card md:col-span-3 text-center text-slate-500">Belum ada berita — tulis via /admin/posts.</p>}
        </div>
      </section>
      {pages.length > 0 && (
        <section className="space-y-[13px]">
          <h2 className="h-gold-2">Jelajahi</h2>
          <div className="flex gap-[13px] flex-wrap">
            {pages.map((p) => <Link key={p.id} href={`/${p.slug}`} className="btn-outline !py-[8px]">{p.title}</Link>)}
          </div>
        </section>
      )}
    </main>
  );
}

