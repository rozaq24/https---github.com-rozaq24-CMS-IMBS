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
  return (
    <main className="mx-auto max-w-3xl px-[21px] py-[34px] space-y-[21px]">
      <h1 className="h-gold-1">{page.title}</h1>
      <Card as="article" className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
    </main>
  );
}
