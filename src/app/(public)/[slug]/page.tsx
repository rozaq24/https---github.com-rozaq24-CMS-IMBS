import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";

export const revalidate = 60;

export async function generateStaticParams() {
  const pages = await db.customPage.findMany({ select: { slug: true } });
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await db.customPage.findUnique({ where: { slug: params.slug } });
  if (!page) return { title: "Tidak ditemukan" };
  const desc = page.content.replace(/<[^>]+>/g, "").slice(0, 160);
  return { title: page.title, description: desc, openGraph: { title: page.title, description: desc } };
}

export default async function CustomPagePublic({ params }: { params: { slug: string } }) {
  const page = await db.customPage.findUnique({ where: { slug: params.slug } });
  if (!page) notFound();
  const isDemo = /demo|contoh|ganti konten/i.test(page.content);
  return (
    <main className="public-static-page">
      <header className="public-static-page__hero">
        <p className="story-eyebrow">{isDemo ? "MATERI CONTOH · UNTUK REVIEW" : "CERITA SEKOLAH"}</p>
        <h1 className="font-display">{page.title}</h1>
      </header>
      <div className="public-static-page__content">
        <aside className="public-static-page__rail"><span>IMBS / {page.slug.replaceAll("-", " ")}</span><br />Baca perlahan, ikuti setiap bab.</aside>
        <Card as="article" className="public-rich-text public-static-page__body" dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </main>
  );
}
