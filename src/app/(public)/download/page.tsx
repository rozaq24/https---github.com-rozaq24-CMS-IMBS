import { ArrowDownToLine, FileArchive, FileText, Search } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export const revalidate = 60;
export const metadata = { title: "Pusat Unduhan", description: "Unduh formulir, materi, dan dokumen sekolah" };

const formatSize = (bytes: number | null) => bytes ? bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB` : "Ukuran file —";
const formatType = (path: string) => path.split(".").pop()?.toUpperCase() || "FILE";

export default async function DownloadsPage({ searchParams }: { searchParams: { q?: string; kategori?: string } }) {
  const q = searchParams.q?.trim() || "";
  const category = searchParams.kategori || "";
  const [items, categories] = await Promise.all([
    db.downloadFile.findMany({ where: { public: true, ...(category ? { category } : {}), ...(q ? { OR: [{ title: { contains: q } }, { desc: { contains: q } }] } : {}) }, orderBy: { createdAt: "desc" } }),
    db.downloadFile.findMany({ where: { public: true }, select: { category: true }, distinct: ["category"], orderBy: { category: "asc" } }),
  ]);
  return <main className="download-story">
    <div aria-hidden="true" className="story-progress"><span /></div>
    <header className="download-hero"><div><p className="story-eyebrow">ARSIP DOKUMEN SEKOLAH</p><h1 className="font-display">Semua yang<br /><em>perlu dibawa.</em></h1><p>Temukan formulir, panduan, dan informasi sekolah dalam satu ruang unduhan.</p><a href="#arsip-unduhan" className="story-link">Jelajahi dokumen <span aria-hidden="true">↓</span></a></div><div className="download-hero__stack" aria-hidden="true"><div><FileText /><span>PANDUAN</span></div><div><FileArchive /><span>FORMULIR</span></div><div><ArrowDownToLine /><span>UNDUH</span></div><i /></div></header>
    <section id="arsip-unduhan" className="download-archive"><aside className="download-archive__aside"><p className="story-eyebrow">PUSAT INFORMASI</p><h2 className="font-display">Berkas untuk setiap langkah.</h2><p>Filter kategori atau cari judul dokumen. Berkas contoh diberi label supaya mudah dibedakan dari dokumen resmi.</p><div className="download-archive__count"><strong>{String(items.length).padStart(2, "0")}</strong><span>dokumen ditemukan</span></div></aside>
      <div className="download-archive__main"><Card as="form" action="/download" className="download-filters"><label htmlFor="download-search">Cari dokumen<Input id="download-search" name="q" defaultValue={q} placeholder="Ketik nama dokumen…" /></label><label htmlFor="download-category">Kategori<NativeSelect id="download-category" name="kategori" defaultValue={category}><option value="">Semua</option>{categories.map((item) => <option key={item.category} value={item.category}>{item.category}</option>)}</NativeSelect></label><Button type="submit" aria-label="Cari dokumen"><Search aria-hidden="true" />Cari</Button></Card>
        <div className="download-list">{items.map((file, index) => <Card key={file.id} className="download-entry" as="article"><div className="download-entry__index">{String(index + 1).padStart(2, "0")}</div><div className="download-entry__icon"><FileText aria-hidden="true" /></div><div className="download-entry__copy"><p className="story-eyebrow">{file.category}{file.fileUrl.includes("/demo/") && <span className="demo-chip">DATA DEMO</span>}</p><h3 className="font-display">{file.title}</h3>{file.desc && <p>{file.desc}</p>}<span>{formatSize(file.size)} · {formatType(file.fileUrl)}</span></div><Button asChild variant="outline" aria-label={`Unduh ${file.title}`}><a href={file.fileUrl.startsWith("/brand/downloads/") ? file.fileUrl : `/api/downloads/${file.id}/file`} download><ArrowDownToLine aria-hidden="true" /><span>Unduh</span></a></Button></Card>)}
          {!items.length && <Card className="download-empty"><FileArchive aria-hidden="true" /><h3 className="font-display">Belum ada dokumen untuk filter ini.</h3><p>Hapus kata pencarian atau pilih kategori lain.</p><Button asChild variant="outline"><a href="/download">Lihat semua dokumen</a></Button></Card>}
        </div>
      </div>
    </section>
  </main>;
}
