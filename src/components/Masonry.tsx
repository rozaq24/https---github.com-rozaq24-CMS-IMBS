"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Photo = { id: string; url: string; caption: string | null };
type Album = { id: string; title: string; category: string; photos: Photo[] };

export function Masonry({ albums }: { albums: Album[] }) {
  const categories = ["Semua", ...Array.from(new Set(albums.map((a) => a.category)))];
  const [category, setCategory] = useState("Semua");
  const [photo, setPhoto] = useState<Photo | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (photo) closeRef.current?.focus();
    else triggerRef.current?.focus();
  }, [photo]);
  useEffect(() => {
    if (!photo) return;
    const close = (e: KeyboardEvent) => { if (e.key === "Escape") setPhoto(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [photo]);
  const shown = albums.filter((a) => category === "Semua" || a.category === category);
  return (
    <div className="space-y-[21px]">
      <nav aria-label="Filter kategori galeri" className="flex gap-[8px] flex-wrap">
        {categories.map((c) => <Button key={c} className={category === c ? "!py-[8px]" : "!py-[8px]"} onClick={() => setCategory(c)} variant={category === c ? "default" : "outline"}>{c}</Button>)}
      </nav>
      {shown.length === 0 && <Card className="text-center text-slate-500" as="p">Belum ada foto galeri.</Card>}
      {shown.map((album) => <section key={album.id} className="space-y-[13px]"><div><h2 className="h-gold-2">{album.title}</h2><p className="text-[14px] text-slate-500">{album.category}</p></div>
        {album.photos.length ? <div className="columns-1 sm:columns-2 lg:columns-3 gap-[13px]">{album.photos.map((p) => <Button key={p.id} onClick={(e) => { triggerRef.current = e.currentTarget; setPhoto(p); }} aria-label={`Perbesar ${p.caption || album.title}`} className="mb-[13px] block w-full break-inside-avoid text-left" variant="ghost"><img src={p.url} alt={p.caption || album.title} className="w-full rounded-[13px]" />{p.caption && <span className="block mt-[4px] text-[13px] text-slate-500">{p.caption}</span>}</Button>)}</div> : <p className="text-[14px] text-slate-500">Belum ada foto di album ini.</p>}
      </section>)}
      {photo && <div role="dialog" aria-modal="true" aria-label={photo.caption || "Foto galeri"} onClick={() => setPhoto(null)} onKeyDown={(e) => { if (e.key === "Escape") setPhoto(null); if (e.key === "Tab") { e.preventDefault(); closeRef.current?.focus(); } }} tabIndex={-1} className="fixed inset-0 z-50 bg-black/90 p-[21px] flex items-center justify-center"><Button ref={closeRef} onClick={() => setPhoto(null)} aria-label="Tutup" className="absolute right-5 top-5 text-white text-3xl" variant="ghost">×</Button><img src={photo.url} alt={photo.caption || "Foto galeri"} className="max-h-full max-w-full object-contain" /></div>}
    </div>
  );
}
