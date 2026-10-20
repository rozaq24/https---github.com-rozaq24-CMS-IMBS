"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Page = { id: string; slug: string; title: string; showInMenu: boolean; order: number };

export function PagesClient() {
  const [data, setData] = useState<Page[]>([]);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    const r = await fetch(`/api/pages?q=${encodeURIComponent(q)}`);
    const j = await r.json();
    if (r.ok) setData(j.data); else setMsg(j.error || "Gagal memuat");
  }
  useEffect(() => { load(); }, []);

  async function remove(id: string, title: string) {
    if (!confirm(`Hapus halaman "${title}"?`)) return;
    const r = await fetch(`/api/pages/${id}`, { method: "DELETE" });
    const j = await r.json();
    setMsg(r.ok ? "Halaman dihapus" : (j.error || "Gagal menghapus"));
    load();
  }

  return (
    <div className="space-y-[21px]">
      {msg && <p className="card text-[14px]">{msg}</p>}
      <div className="card flex gap-[13px] flex-wrap">
        <input className="border rounded-[13px] px-[13px] py-[8px]" placeholder="Cari judul/slug..." value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn-outline !py-[8px]" onClick={load}>Cari</button>
        <Link href="/admin/pages/baru" className="btn-primary !py-[8px]">+ Halaman Baru</Link>
      </div>
      <div className="card overflow-x-auto">
        <table className="tbl">
          <thead><tr><th>Judul</th><th>Slug</th><th>Urutan</th><th>Menu</th><th>Aksi</th></tr></thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id}>
                <td><Link className="underline" href={`/admin/pages/${p.id}`}>{p.title}</Link></td>
                <td><a className="underline text-[13px]" href={`/${p.slug}`} target="_blank">/{p.slug}</a></td>
                <td>{p.order}</td>
                <td>{p.showInMenu ? "✅" : "—"}</td>
                <td><button className="underline text-rose-600 text-[14px]" onClick={() => remove(p.id, p.title)}>Hapus</button></td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={5} className="text-center text-slate-500">Belum ada halaman. Contoh: Visi-Misi, Sejarah.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
