import { db } from "@/lib/db";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
export const revalidate = 60;
export const metadata = { title: "Pusat Unduhan", description: "Unduh formulir, materi, dan dokumen sekolah" };
export default async function DownloadsPage({ searchParams }: { searchParams: { q?: string; kategori?: string } }) {
  const q = searchParams.q?.trim() || ""; const category = searchParams.kategori || "";
  const [items, categories] = await Promise.all([
    db.downloadFile.findMany({ where: { public: true, ...(category ? { category } : {}), ...(q ? { OR: [{ title: { contains: q } }, { desc: { contains: q } }] } : {}) }, orderBy: { createdAt: "desc" } }),
    db.downloadFile.findMany({ where: { public: true }, select: { category: true }, distinct: ["category"], orderBy: { category: "asc" } }),
  ]);
  return <main className="mx-auto max-w-5xl px-[21px] py-[34px] space-y-[21px]"><h1 className="h-gold-1">Pusat <span className="grad-text">Unduhan</span></h1><Card className="flex gap-[13px] flex-wrap" as="form"><label className="grow">Cari dokumen<Input name="q" defaultValue={q} className="mt-[4px] w-full border rounded-[13px] p-[13px]" /></label><label>Kategori<NativeSelect name="kategori" defaultValue={category} className="mt-[4px] block border rounded-[13px] p-[13px]"><option value="">Semua</option>{categories.map((c) => <option key={c.category}>{c.category}</option>)}</NativeSelect></label><Button className="self-end" variant="default">Cari</Button></Card><Card className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Dokumen</TableHead><TableHead>Kategori</TableHead><TableHead>Ukuran</TableHead><TableHead>Unduhan</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>{items.map((f) => <TableRow key={f.id}><TableCell><strong>{f.title}</strong>{f.desc && <p className="text-[13px] text-slate-500">{f.desc}</p>}</TableCell><TableCell>{f.category}</TableCell><TableCell>{f.size ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : "—"}</TableCell><TableCell>{f.downloads}</TableCell><TableCell><Button asChild variant="outline"><a href={`/api/downloads/${f.id}/file`} className="!py-[8px]">Unduh</a></Button></TableCell></TableRow>)}{!items.length && <TableRow><TableCell colSpan={5} className="text-center text-slate-500">Belum ada dokumen publik.</TableCell></TableRow>}</TableBody></Table></Card></main>;
}
