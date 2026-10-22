"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

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
      {msg && <Card className="text-[14px]" as="p">{msg}</Card>}
      <Card className="flex gap-[13px] flex-wrap items-end">
        <Input className="border rounded-[13px] px-[13px] py-[8px]" placeholder="Cari judul..." value={q} onChange={(e) => setQ(e.target.value)} />
        <NativeSelect className="border rounded-[13px] px-[13px] py-[8px]" value={type} onChange={(e) => setType(e.target.value)}>
          {TYPES.map((t) => <option key={t} value={t}>{t || "Semua tipe"}</option>)}
        </NativeSelect>
        <NativeSelect className="border rounded-[13px] px-[13px] py-[8px]" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUS.map((s) => <option key={s} value={s}>{s || "Semua status"}</option>)}
        </NativeSelect>
        <Button className="!py-[8px]" onClick={load} variant="outline">Filter</Button>
        <Button asChild variant="default"><Link href="/admin/posts/baru" className="!py-[8px]">+ Tulis Baru</Link></Button>
        <span className="text-[13px] text-slate-500">Total: {total}</span>
      </Card>
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Judul</TableHead><TableHead>Tipe</TableHead><TableHead>Status</TableHead><TableHead>Terbit</TableHead><TableHead>Penulis</TableHead><TableHead>Aksi</TableHead></TableRow></TableHeader>
          <TableBody>
            {data.map((p) => (
              <TableRow key={p.id}>
                <TableCell><Link className="underline" href={`/admin/posts/${p.id}`}>{p.title}</Link><br /><span className="text-[13px] text-slate-500">/{p.slug}</span></TableCell>
                <TableCell className="text-[13px]">{p.type}</TableCell>
                <TableCell><span className="text-[13px] font-bold bg-slate-100 rounded-[8px] px-[8px] py-[4px]">{p.status}</span></TableCell>
                <TableCell className="text-[13px]">{p.publishedAt ? new Date(p.publishedAt).toLocaleString("id-ID") : "-"}</TableCell>
                <TableCell className="text-[13px]">{p.author?.name}</TableCell>
                <TableCell className="whitespace-nowrap text-[14px]">
                  {p.status !== "PUBLISHED" && <Button className="underline mr-[8px]" onClick={() => publish(p.id)} variant="ghost">Terbitkan</Button>}
                  <Button className="underline text-rose-600" onClick={() => remove(p.id, p.title)} variant="ghost">Hapus</Button>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-slate-500">Belum ada post. Klik Tulis Baru.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
