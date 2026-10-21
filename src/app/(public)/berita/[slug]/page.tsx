import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Comments } from "@/components/Comments";
import { Card } from "@/components/ui/card";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await db.post.findUnique({ where: { slug: params.slug } });
  if (!post) return { title: "Tidak ditemukan" };
  return { title: post.title, description: post.excerpt || post.title, openGraph: { title: post.title, description: post.excerpt || post.title, ...(post.cover ? { images: [post.cover] } : {}) } };
}

export default async function BeritaDetail({ params }: { params: { slug: string } }) {
  const post = await db.post.findUnique({ where: { slug: params.slug }, include: { author: { select: { name: true } } } });
  if (!post || post.status !== "PUBLISHED" || (post.publishedAt && post.publishedAt > new Date())) notFound();
  // tambah views (tanpa await agar tidak blokir render)
  db.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {});
  const related = await db.post.findMany({
    where: { status: "PUBLISHED", type: post.type, id: { not: post.id } },
    orderBy: { publishedAt: "desc" }, take: 3,
  });
  return (
    <main className="mx-auto max-w-3xl px-[21px] py-[34px] space-y-[21px]">
      <Link href="/berita" className="text-[14px] underline">← Kembali ke Berita</Link>
      <span className="text-[13px] font-bold bg-slate-100 rounded-[8px] px-[8px] py-[4px]">{post.type}</span>
      <h1 className="h-gold-1">{post.title}</h1>
      <p className="text-[13px] text-slate-500">Oleh {post.author?.name} • {post.publishedAt ? new Date(post.publishedAt).toLocaleString("id-ID") : ""} • 👁 {post.views + 1}</p>
      {post.cover && <img src={post.cover} alt={post.title} className="rounded-[21px] w-full object-cover" />}
      <Card as="article" className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      {related.length > 0 && (
        <section className="space-y-[13px]">
          <h2 className="h-gold-2">Terkait</h2>
          <div className="grid md:grid-cols-3 gap-[13px]">
            {related.map((r) => <Card key={r.id} asChild className="text-[14px] font-semibold"><Link href={`/berita/${r.slug}`}>{r.title}</Link></Card>)}
          </div>
        </section>
      )}
      <Comments postId={post.id} />
    </main>
  );
}
