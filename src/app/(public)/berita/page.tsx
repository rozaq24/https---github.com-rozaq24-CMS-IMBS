import Link from "next/link";
import { db } from "@/lib/db";

export const revalidate = 60;

export default async function BeritaPage({ searchParams }: { searchParams: { type?: string; q?: string } }) {
  const type = searchParams.type || undefined;
  const q = searchParams.q || "";
  const now = new Date();
  const where = {
    status: "PUBLISHED",
    publishedAt: { lte: now },
    ...(type ? { type } : {}),
    ...(q ? { OR: [{ title: { contains: q } }, { excerpt: { contains: q } }] } : {}),
  };
  const posts = await db.post.findMany({ where, include: { author: { select: { name: true } } }, orderBy: { publishedAt: "desc" }, take: 30 });
  return (
    <main className="mx-auto max-w-6xl px-[21px] py-[34px] space-y-[21px]">
      <div className="flex items-end justify-between flex-wrap gap-[13px]">
        <h1 className="h-gold-1">Berita & <span className="grad-text">Artikel</span></h1>
        <div className="flex gap-[8px]">
          {["", "BERITA", "PENGUMUMAN", "AGENDA", "ARTIKEL"].map((t) => (
            <Link key={t} href={t ? `/berita?type=${t}` : "/berita"} className={`text-[13px] px-[13px] py-[8px] border rounded-[13px] ${type === t || (!type && !t) ? "bg-slate-900 text-white" : ""}`}>{t || "Semua"}</Link>
          ))}
        </div>
      </div>
      <form action="/berita" className="card flex gap-[8px]">
        <input name="q" defaultValue={q} placeholder="Cari berita..." className="w-full border rounded-[13px] px-[13px] py-[8px]" />
        {type && <input type="hidden" name="type" value={type} />}
        <button className="btn-outline !py-[8px]">Cari</button>
      </form>
      <div className="grid md:grid-cols-3 gap-[21px]">
        {posts.map((p) => (
          <Link key={p.id} href={`/berita/${p.slug}`} className="card hover:shadow-xl transition">
            {p.cover && <img src={p.cover} alt={p.title} className="rounded-[13px] w-full h-[160px] object-cover mb-[13px]" />}
            <span className="text-[13px] font-bold text-slate-500">{p.type} • {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("id-ID") : ""}</span>
            <h2 className="h-gold-3 mt-[8px]">{p.title}</h2>
            <p className="text-[14px] text-slate-600 mt-[8px]">{p.excerpt || p.content.replace(/<[^>]+>/g, "").slice(0, 120) + "..."}</p>
            <p className="text-[13px] text-slate-500 mt-[8px]">Oleh {p.author?.name} • 👁 {p.views}</p>
          </Link>
        ))}
        {posts.length === 0 && <p className="card md:col-span-3 text-center text-slate-500">Belum ada publikasi. Admin bisa tulis via /admin/posts.</p>}
      </div>
    </main>
  );
}
