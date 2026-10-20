import { db } from "@/lib/db";
export const revalidate = 60;
export const metadata = { title: "Pusat Unduhan", description: "Unduh formulir, materi, dan dokumen sekolah" };
export default async function DownloadsPage({ searchParams }: { searchParams: { q?: string; kategori?: string } }) {
  const q = searchParams.q?.trim() || ""; const category = searchParams.kategori || "";
  const [items, categories] = await Promise.all([
    db.downloadFile.findMany({ where: { public: true, ...(category ? { category } : {}), ...(q ? { OR: [{ title: { contains: q } }, { desc: { contains: q } }] } : {}) }, orderBy: { createdAt: "desc" } }),
    db.downloadFile.findMany({ where: { public: true }, select: { category: true }, distinct: ["category"], orderBy: { category: "asc" } }),
  ]);
  return <main className="mx-auto max-w-5xl px-[21px] py-[34px] space-y-[21px]"><h1 className="h-gold-1">Pusat <span className="grad-text">Unduhan</span></h1><form className="card flex gap-[13px] flex-wrap"><label className="grow">Cari dokumen<input name="q" defaultValue={q} className="mt-[4px] w-full border rounded-[13px] p-[13px]" /></label><label>Kategori<select name="kategori" defaultValue={category} className="mt-[4px] block border rounded-[13px] p-[13px]"><option value="">Semua</option>{categories.map((c) => <option key={c.category}>{c.category}</option>)}</select></label><button className="btn-primary self-end">Cari</button></form><div className="card overflow-x-auto"><table className="tbl"><thead><tr><th>Dokumen</th><th>Kategori</th><th>Ukuran</th><th>Unduhan</th><th></th></tr></thead><tbody>{items.map((f) => <tr key={f.id}><td><strong>{f.title}</strong>{f.desc && <p className="text-[13px] text-slate-500">{f.desc}</p>}</td><td>{f.category}</td><td>{f.size ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : "—"}</td><td>{f.downloads}</td><td><a href={`/api/downloads/${f.id}/file`} className="btn-outline !py-[8px]">Unduh</a></td></tr>)}{!items.length && <tr><td colSpan={5} className="text-center text-slate-500">Belum ada dokumen publik.</td></tr>}</tbody></table></div></main>;
}
