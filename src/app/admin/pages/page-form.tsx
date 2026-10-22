"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Editor } from "@/components/ui/Editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function PageForm({ initial }: { initial?: { id?: string; title?: string; slug?: string; content?: string; showInMenu?: boolean; order?: number } }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [content, setContent] = useState(initial?.content || "<p></p>");
  const [showInMenu, setShowInMenu] = useState(initial?.showInMenu ?? true);
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [msg, setMsg] = useState("");
  const router = useRouter();
  const isEdit = !!initial?.id;

  async function save() {
    setMsg("");
    const url = isEdit ? `/api/pages/${initial!.id}` : "/api/pages";
    const r = await fetch(url, { method: isEdit ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, slug: slug || undefined, content, showInMenu, order: Number(order) }) });
    const j = await r.json();
    if (!r.ok) { setMsg(j.error || "Gagal menyimpan"); return; }
    setMsg(`Tersimpan: /${j.slug}`);
    if (!isEdit) router.push(`/admin/pages/${j.id}`);
  }

  return (
    <div className="space-y-[21px]">
      {msg && <Card className="text-[14px]" as="p">{msg}</Card>}
      <Card className="grid md:grid-cols-2 gap-[13px]">
        <label className="block"><span className="text-[13px] font-semibold">Judul</span>
          <Input className="mt-[8px] w-full border rounded-[13px] px-[13px] py-[13px]" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Visi-Misi" /></label>
        <label className="block"><span className="text-[13px] font-semibold">Slug (huruf kecil + strip; sistem menolak: admin, berita, spmb...)</span>
          <Input className="mt-[8px] w-full border rounded-[13px] px-[13px] py-[13px]" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="visi-misi" /></label>
        <label className="flex items-center gap-[8px] text-[14px]"><Input type="checkbox" checked={showInMenu} onChange={(e) => setShowInMenu(e.target.checked)} /> Tampilkan di menu</label>
        <label className="block"><span className="text-[13px] font-semibold">Urutan</span>
          <Input type="number" min={0} className="mt-[8px] w-full border rounded-[13px] px-[13px] py-[13px]" value={order} onChange={(e) => setOrder(Number(e.target.value))} /></label>
      </Card>
      <Card className="space-y-[13px]">
        <h2 className="h-gold-3">Konten</h2>
        <Editor value={content} onChange={setContent} />
      </Card>
      <Button className="" onClick={save} variant="default">{isEdit ? "Simpan Perubahan" : "Simpan Halaman"}</Button>
    </div>
  );
}
