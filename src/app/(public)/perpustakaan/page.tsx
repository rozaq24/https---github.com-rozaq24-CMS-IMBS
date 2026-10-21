import { getSiteSettings } from "@/lib/settings";
import { Card } from "@/components/ui/card";
export const metadata = { title: "Perpustakaan Digital", description: "Informasi layanan perpustakaan sekolah." };
export default async function LibraryPage() {
  const { identity } = await getSiteSettings();
  return <main className="mx-auto max-w-4xl space-y-[21px] px-[21px] py-[34px]"><header><h1 className="h-gold-1">Perpustakaan <span className="grad-text">Digital</span></h1><p className="mt-[8px] text-slate-600">Informasi koleksi dan layanan perpustakaan sekolah.</p></header><section className="grid gap-[21px] md:grid-cols-2"><Card className="" as="article"><h2 className="h-gold-3">Jam layanan</h2><p className="mt-[8px]">Silakan hubungi sekolah untuk jadwal layanan perpustakaan terbaru.</p>{identity.email && <a className="mt-[13px] inline-block underline" href={`mailto:${identity.email}?subject=${encodeURIComponent("Jam layanan perpustakaan")}`}>Tanyakan jadwal</a>}</Card><Card className="" as="article"><h2 className="h-gold-3">Buku unggulan</h2><p className="mt-[8px]">Katalog digital belum tersedia. Koleksi unggulan dapat ditambahkan setelah data katalog sekolah disiapkan.</p><a className="mt-[13px] inline-block underline" href="/pengaduan">Tanyakan ketersediaan buku</a></Card></section></main>;
}
