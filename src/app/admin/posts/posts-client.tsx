"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Post = { id: string; slug: string; title: string; type: string; status: string; publishedAt: string | null; author: { name: string } };
const TYPES = ["", "BERITA", "PENGUMUMAN", "AGENDA", "ARTIKEL"];
const STATUS = ["", "DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"];

export function PostsClient() {
  const [data, setData] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    const p = new URLSearchParams({ q, type, status });
    const r = await fetch(`/api/posts?${p.toString()}`);
    const j = await r.json();
    if (r.ok) { setData(j.data); setTotal(j.total); } else setMsg(j.error || "Gagal memuat");
  }
  useEffect(() => { load(); }, []);

  async function publish(id: string) {
    const r = await fetch(`/api/posts/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "PUBLISHED" }) });
    const j = await r.json();
    setMsg(r.ok ? `Diterbitkan: ${j.slug}` : (j.error || "Gagal menerbitkan"));
    load();
  }

  async function remove(id: string, title: string) {
    if (!confirm(`Hapus "${title}"?`)) return;
    const r = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    const j = await r.json();
    setMsg(r.ok ? "Post dihapus" : (j.error || "Gagal menghapus"));
    load();
  }

  return (
    <div className="space-y-[21px]">
      {msg && <p className="card text-[14px]">{msg}</p>}
      <div className="card flex gap-[13px] flex-wrap items-end">
        <input className="border rounded-[13px] px-[13px] py-[8px]" placeholder="Cari judul..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="border rounded-[13px] px-[13px] py-[8px]" value={type} onChange={(e) => setType(e.target.value)}>
          {TYPES.map((t) => <option key={t} value={t}>{t || "Semua tipe"}</option>)}
        </select>
        <select className="border rounded-[13px] px-[13px] py-[8px]" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUS.map((s) => <option key={s} value={s}>{s || "Semua status"}</option>)}
        </select>
        <button className="btn-outline !py-[8px]" onClick={load}>Filter</button>
        <Link href="/admin/posts/baru" className="btn-primary !py-[8px]">+ Tulis Baru</Link>
        <span className="text-[13px] text-slate-500">Total: {total}</span>
      </div>
      <div className="card overflow-x-auto">
        <table className="tbl">
          <thead><tr><th>Judul</th><th>Tipe</th><th>Status</th><th>Terbit</th><th>Penulis</th><th>Aksi</th></tr></thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id}>
                <td><Link className="underline" href={`/admin/posts/${p.id}`}>{p.title}</Link><br /><span className="text-[13px] text-slate-500">/{p.slug}</span></td>
                <td className="text-[13px]">{p.type}</td>
                <td><span className="text-[13px] font-bold bg-slate-100 rounded-[8px] px-[8px] py-[4px]">{p.status}</span></td>
                <td className="text-[13px]">{p.publishedAt ? new Date(p.publishedAt).toLocaleString("id-ID") : "-"}</td>
                <td className="text-[13px]">{p.author?.name}</td>
                <td className="whitespace-nowrap text-[14px]">
                  {p.status !== "PUBLISHED" && <button className="underline mr-[8px]" onClick={() => publish(p.id)}>Terbitkan</button>}
                  <button className="underline text-rose-600" onClick={() => remove(p.id, p.title)}>Hapus</button>
                </td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={6} className="text-center text-slate-500">Belum ada post. Klik Tulis Baru.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
