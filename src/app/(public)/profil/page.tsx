import Link from "next/link";
import { db } from "@/lib/db";
import { GreetingCard } from "@/components/GreetingCard";
import { Card } from "@/components/ui/card";

export const revalidate = 60;

export const metadata = { title: "Profil Sekolah", description: "Visi-misi, sejarah, dan sambutan Kepala Sekolah", openGraph: { title: "Profil Sekolah", description: "Visi-misi, sejarah, dan sambutan Kepala Sekolah." } };

export default async function ProfilPage() {
  const [greeting, visi, sejarah] = await Promise.all([
    db.greeting.findUnique({ where: { id: 1 } }),
    db.customPage.findUnique({ where: { slug: "visi-misi" } }),
    db.customPage.findUnique({ where: { slug: "sejarah" } }),
  ]);
  return (
    <main className="mx-auto max-w-6xl px-[21px] py-[34px] space-y-[21px]">
      <h1 className="h-gold-1">Profil <span className="grad-text">Sekolah</span></h1>
      <GreetingCard greeting={greeting} compact />
      <div className="grid md:grid-cols-2 gap-[21px]">
        <Card className="" as="article">
          <h2 className="h-gold-2">Visi-Misi</h2>
          {visi ? <div className="prose max-w-none mt-[13px]" dangerouslySetInnerHTML={{ __html: visi.content }} /> : <p className="text-slate-500 mt-[13px]">Belum diisi — buat via /admin/pages (slug visi-misi).</p>}
          {visi && <Link href="/visi-misi" className="underline text-[14px]">Buka halaman penuh →</Link>}
        </Card>
        <Card className="" as="article">
          <h2 className="h-gold-2">Sejarah</h2>
          {sejarah ? <div className="prose max-w-none mt-[13px]" dangerouslySetInnerHTML={{ __html: sejarah.content }} /> : <p className="text-slate-500 mt-[13px]">Belum diisi — buat via /admin/pages (slug sejarah).</p>}
          {sejarah && <Link href="/sejarah" className="underline text-[14px]">Buka halaman penuh →</Link>}
        </Card>
      </div>
    </main>
  );
}
