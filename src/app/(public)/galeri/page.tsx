import { db } from "@/lib/db";
import { Masonry } from "@/components/Masonry";

export const revalidate = 60;
export const metadata = { title: "Galeri", description: "Dokumentasi kegiatan sekolah" };

export default async function GalleryPage() {
  const albums = await db.album.findMany({ include: { photos: { orderBy: { createdAt: "desc" } } }, orderBy: { createdAt: "desc" } });
  return <main className="mx-auto max-w-6xl px-[21px] py-[34px] space-y-[21px]"><h1 className="h-gold-1">Galeri <span className="grad-text">Sekolah</span></h1><Masonry albums={albums} /></main>;
}
