"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicImage } from "@/components/PublicImage";

type Photo = { id: string; url: string; caption: string | null };
type Album = { id: string; title: string; category: string; photos: Photo[] };

const DEMO_ALBUMS: Album[] = [
  {
    id: "demo-belajar",
    title: "Ruang untuk Bertumbuh",
    category: "Akademik",
    photos: [
      { id: "demo-classroom", url: "/brand/stories/ruang-belajar.svg", caption: "Belajar dimulai dari rasa ingin tahu." },
      { id: "demo-library", url: "/brand/stories/perpustakaan.svg", caption: "Mencari jawaban di antara halaman buku." },
      { id: "demo-study", url: "/brand/stories/kolaborasi.svg", caption: "Berbagi gagasan, menyusun pemahaman." },
      { id: "demo-class", url: "/brand/stories/ruang-belajar.svg", caption: "Ruang kelas menjadi ruang bertanya." },
    ],
  },
  {
    id: "demo-exploration",
    title: "Mencoba, Mengamati, Menemukan",
    category: "Eksplorasi",
    photos: [
      { id: "demo-science", url: "/brand/stories/laboratorium.svg", caption: "Eksperimen kecil membuka pertanyaan baru." },
      { id: "demo-lab", url: "/brand/stories/laboratorium.svg", caption: "Belajar sains lewat pengamatan langsung." },
      { id: "demo-notes", url: "/brand/stories/menulis.svg", caption: "Mencatat proses sama pentingnya dengan hasil." },
      { id: "demo-workshop", url: "/brand/stories/karya-murid.svg", caption: "Ide tumbuh saat dikerjakan bersama." },
    ],
  },
  {
    id: "demo-work",
    title: "Karya yang Dibuat Bersama",
    category: "Karya Murid",
    photos: [
      { id: "demo-team", url: "/brand/stories/kolaborasi.svg", caption: "Setiap murid membawa sudut pandang." },
      { id: "demo-writing", url: "/brand/stories/menulis.svg", caption: "Dari catatan sederhana menjadi cerita." },
      { id: "demo-reading", url: "/brand/stories/perpustakaan.svg", caption: "Merawat kebiasaan membaca." },
      { id: "demo-presentation", url: "/brand/stories/karya-murid.svg", caption: "Berani berbagi hasil dan proses." },
    ],
  },
];

export function Masonry({ albums }: { albums: Album[] }) {
  const source = albums.length ? albums : DEMO_ALBUMS;
  const categories = ["Semua", ...Array.from(new Set(source.map((album) => album.category)))];
  const [category, setCategory] = useState("Semua");
  const [photo, setPhoto] = useState<Photo | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const shown = source.filter((album) => category === "Semua" || album.category === category);
  const photos = shown.flatMap((album) => album.photos);

  useEffect(() => {
    if (photo) closeRef.current?.focus();
    else triggerRef.current?.focus();
  }, [photo]);

  useEffect(() => {
    if (!photo) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setPhoto(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [photo]);

  return (
    <div className="gallery-story">
      <div aria-hidden="true" className="story-progress"><span /></div>
      <header className="gallery-intro">
        <div className="gallery-intro__copy">
          <p className="story-eyebrow">ARSIP KEHIDUPAN SEKOLAH</p>
          <h1 className="font-display">Ruang <em>bertumbuh.</em></h1>
          <p className="gallery-intro__lead">Potongan proses belajar, mencoba hal baru, dan membuat sesuatu bersama di IMBS.</p>
          <a href="#cerita-galeri" className="story-link">Jelajahi cerita <ArrowDown aria-hidden="true" /></a>
          <div className="gallery-intro__count"><strong>{photos.length.toString().padStart(2, "0")}</strong><span>momen pilihan<br />dari {shown.length} album</span></div>
        </div>
        <figure className="gallery-intro__frame">
          {photos[0] && <PublicImage src={photos[0].url} alt={photos[0].caption || "Kegiatan belajar di IMBS"} fallbackLabel="Cerita belajar IMBS" className="gallery-intro__image" />}
          <figcaption><span>01 / BELAJAR</span><span>{photos[0]?.caption || "Momen pilihan dari sekolah"}</span></figcaption>
          <span aria-hidden="true" className="gallery-intro__orbit" />
        </figure>
        <p className="gallery-intro__side-note">Momen kecil<br />menjadi cerita besar.</p>
      </header>

      <section id="cerita-galeri" className="gallery-archive">
        <div className="gallery-archive__heading">
          <div><p className="story-eyebrow">JEJAK KEGIATAN</p><h2 className="font-display">Cerita di dalam bingkai</h2></div>
          <nav aria-label="Filter kategori galeri" className="gallery-filters">
            {categories.map((item) => <Button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} variant={category === item ? "default" : "outline"} size="sm">{item}</Button>)}
          </nav>
        </div>

        {shown.length ? <div className="gallery-chapters">
          {shown.map((album, index) => (
            <section key={album.id} className="gallery-chapter" aria-labelledby={`gallery-title-${album.id}`}>
              <aside className="gallery-chapter__aside">
                <div className="gallery-chapter__sticky">
                  <p className="story-eyebrow">{String(index + 1).padStart(2, "0")} / {album.category}</p>
                  <h3 id={`gallery-title-${album.id}`} className="font-display">{album.title}</h3>
                  <p className="gallery-chapter__summary">Satu bab dari perjalanan belajar: gagasan yang dibagi, hal baru yang dicoba, dan karya yang tumbuh dari kerja bersama.</p>
                  <span className="gallery-chapter__total">{album.photos.length} momen</span>
                </div>
              </aside>
              <div className="gallery-chapter__photos">
                {album.photos.map((item, photoIndex) => (
                  <button
                    key={item.id}
                    ref={photoIndex === 0 ? triggerRef : undefined}
                    type="button"
                    onClick={() => setPhoto(item)}
                    aria-label={`Perbesar foto: ${item.caption || album.title}`}
                    className={`gallery-photo gallery-photo--${photoIndex % 4}`}
                  >
                    <PublicImage src={item.url} alt={item.caption || album.title} loading="lazy" fallbackLabel={album.title} className="gallery-photo__image" />
                    <span className="gallery-photo__caption"><span>{String(photoIndex + 1).padStart(2, "0")}</span>{item.caption || album.title}<ArrowUpRight aria-hidden="true" /></span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div> : <div className="gallery-empty"><p>Belum ada foto dalam kategori ini.</p><Button type="button" variant="outline" onClick={() => setCategory("Semua")}>Lihat semua momen</Button></div>}
      </section>

      {photo && <div role="dialog" aria-modal="true" aria-label={photo.caption || "Foto galeri"} onClick={() => setPhoto(null)} onKeyDown={(event) => { if (event.key === "Escape") setPhoto(null); if (event.key === "Tab") { event.preventDefault(); closeRef.current?.focus(); } }} tabIndex={-1} className="gallery-lightbox">
        <Button ref={closeRef} type="button" onClick={() => setPhoto(null)} aria-label="Tutup foto" className="gallery-lightbox__close" variant="ghost"><X aria-hidden="true" /></Button>
        <PublicImage src={photo.url} alt={photo.caption || "Foto kegiatan IMBS"} fallbackLabel={photo.caption || "Galeri sekolah IMBS"} className="gallery-lightbox__image" />
        {photo.caption && <p className="gallery-lightbox__caption">{photo.caption}</p>}
      </div>}
    </div>
  );
}
