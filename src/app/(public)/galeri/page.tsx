import { db } from "@/lib/db";
import { Masonry } from "@/components/Masonry";

export const revalidate = 60;
export const metadata = { title: "Galeri", description: "Dokumentasi kegiatan sekolah" };

export default async function GalleryPage() {
  const albums = await db.album.findMany({ include: { photos: { orderBy: { createdAt: "desc" } } }, orderBy: { createdAt: "desc" } });
  return <main className="public-story-route"><Masonry albums={albums} /></main>;
}
