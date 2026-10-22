import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Eye } from "lucide-react";
import { db } from "@/lib/db";
import { Comments } from "@/components/Comments";
import { Card } from "@/components/ui/card";
import { PublicImage } from "@/components/PublicImage";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await db.post.findUnique({ where: { slug: params.slug } });
  if (!post) return { title: "Tidak ditemukan" };
  return { title: post.title, description: post.excerpt || post.title, openGraph: { title: post.title, description: post.excerpt || post.title, ...(post.cover ? { images: [post.cover] } : {}) } };
}

export default async function BeritaDetail({ params }: { params: { slug: string } }) {
  const post = await db.post.findUnique({ where: { slug: params.slug }, include: { author: { select: { name: true } } } });
  if (!post || post.status !== "PUBLISHED" || (post.publishedAt && post.publishedAt > new Date())) notFound();
  db.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {});
  const related = await db.post.findMany({
    where: { status: "PUBLISHED", type: post.type, id: { not: post.id } },
    orderBy: { publishedAt: "desc" }, take: 3,
  });
  return (
    <main className="journal-detail">
      <div aria-hidden="true" className="story-progress"><span /></div>
      <header className="journal-detail__heading">
        <Link href="/berita" className="journal-back"><ArrowLeft aria-hidden="true" />Semua cerita</Link>
        <p className="story-eyebrow">{post.type} · JURNAL IMBS</p>
        <h1 className="font-display">{post.title}</h1>
        <div className="journal-meta journal-detail__meta"><span>Oleh {post.author?.name || "Tim IMBS"}</span><span><CalendarDays aria-hidden="true" />{post.publishedAt?.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) || "Belum dijadwalkan"}</span><span><Eye aria-hidden="true" />{post.views + 1} dibaca</span></div>
      </header>
      <div className="journal-detail__reading">
        <figure className="journal-detail__visual">
          <PublicImage src={post.cover || "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=85"} alt={post.title} fallbackLabel={post.title} className="journal-detail__image" />
          <figcaption>JURNAL IMBS · {post.type}</figcaption>
        </figure>
        <div className="journal-detail__body">
          <Card as="article" className="public-rich-text journal-detail__content" dangerouslySetInnerHTML={{ __html: post.content }} />
          {related.length > 0 && <section className="journal-related">
            <p className="story-eyebrow">LANJUTKAN MEMBACA</p><h2 className="font-display">Cerita lain</h2>
            <div>{related.map((item) => <Card key={item.id} asChild className="journal-related__item"><Link href={`/berita/${item.slug}`}><span>{item.type}</span><strong>{item.title}</strong><ArrowLeft aria-hidden="true" /></Link></Card>)}</div>
          </section>}
          <Comments postId={post.id} />
        </div>
      </div>
    </main>
  );
}
