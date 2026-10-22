"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Page = { id: string; slug: string; title: string; showInMenu: boolean; order: number; builderData?: string | null };

export function PagesClient() {
  const router = useRouter();
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

  async function duplicate(page: Page) {
    const r = await fetch(`/api/pages/${page.id}/duplicate`, { method: "POST" });
    const j = await r.json();
    if (!r.ok) { setMsg(j.error || "Gagal menduplikasi halaman"); return; }
    router.push(page.builderData ? `/admin/builder/${j.id}` : `/admin/pages/${j.id}`);
  }

  async function toggleMenu(page: Page) {
    const r = await fetch(`/api/pages/${page.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ showInMenu: !page.showInMenu }) });
    const j = await r.json();
    setMsg(r.ok ? (page.showInMenu ? "Halaman disembunyikan dari menu" : "Halaman ditampilkan di menu") : (j.error || "Gagal memperbarui menu"));
    if (r.ok) load();
  }

  return (
    <div className="space-y-[21px]">
      {msg && <Card className="text-[14px]" as="p">{msg}</Card>}
      <Card className="flex gap-[13px] flex-wrap">
        <Input className="border rounded-[13px] px-[13px] py-[8px]" placeholder="Cari judul/slug..." value={q} onChange={(e) => setQ(e.target.value)} />
        <Button className="!py-[8px]" onClick={load} variant="outline">Cari</Button>
        <Button asChild variant="default"><Link href="/admin/pages/baru" className="!py-[8px]">+ Halaman Baru</Link></Button>
      </Card>
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Judul</TableHead><TableHead>Slug</TableHead><TableHead>Urutan</TableHead><TableHead>Menu</TableHead><TableHead>Aksi</TableHead></TableRow></TableHeader>
          <TableBody>
            {data.map((p) => (
              <TableRow key={p.id}>
                <TableCell><Link className="underline" href={`/admin/pages/${p.id}`}>{p.title}</Link></TableCell>
                <TableCell><a className="underline text-[13px]" href={`/${p.slug}`} target="_blank">/{p.slug}</a></TableCell>
                <TableCell>{p.order}</TableCell>
                <TableCell><Button className="underline text-[14px]" onClick={() => toggleMenu(p)} variant="ghost">{p.showInMenu ? "Tampil" : "Tersembunyi"}</Button></TableCell>
                <TableCell><div className="flex flex-wrap gap-[4px]"><Button className="underline text-[14px]" onClick={() => duplicate(p)} variant="ghost">Duplikat</Button><Button className="underline text-rose-600 text-[14px]" onClick={() => remove(p.id, p.title)} variant="ghost">Hapus</Button></div></TableCell>
              </TableRow>
            ))}
            {data.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-slate-500">Belum ada halaman. Contoh: Visi-Misi, Sejarah.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
