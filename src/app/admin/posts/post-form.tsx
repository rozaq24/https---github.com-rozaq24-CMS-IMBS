"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Editor } from "@/components/ui/Editor";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const TYPES = ["BERITA", "PENGUMUMAN", "AGENDA", "ARTIKEL"];
const STATUS = ["DRAFT", "SCHEDULED", "PUBLISHED"];

export function PostForm({ initial }: { initial?: { id?: string; title?: string; slug?: string; excerpt?: string; content?: string; cover?: string | null; type?: string; status?: string; publishedAt?: string | null } }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [content, setContent] = useState(initial?.content || "<p></p>");
  const [cover, setCover] = useState(initial?.cover || "");
  const [type, setType] = useState(initial?.type || "BERITA");
  const [status, setStatus] = useState(initial?.status || "DRAFT");
  const [publishedAt, setPublishedAt] = useState(initial?.publishedAt ? initial.publishedAt.slice(0, 16) : "");
  const [msg, setMsg] = useState("");
  const [preview, setPreview] = useState(false);
  const router = useRouter();
  const isEdit = !!initial?.id;

  async function uploadCover(f: File) {
    const form = new FormData();
    form.append("file", f);
    const r = await fetch("/api/upload", { method: "POST", body: form });
    const j = await r.json();
    if (!r.ok) { setMsg(j.error || "Upload cover gagal"); return; }
    setCover(j.url);
  }

  async function save() {
    setMsg("");
    const payload = { title, slug: slug || undefined, excerpt, content, cover, type, status, publishedAt: publishedAt || undefined };
    const url = isEdit ? `/api/posts/${initial!.id}` : "/api/posts";
    const r = await fetch(url, { method: isEdit ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const j = await r.json();
    if (!r.ok) { setMsg(j.error || "Gagal menyimpan"); return; }
    setMsg(`Tersimpan: ${j.slug}`);
    if (!isEdit) router.push(`/admin/posts/${j.id}`);
  }

  return (
    <div className="space-y-[21px]">
      {msg && <Card className="text-[14px]" as="p">{msg}</Card>}
      <Card className="grid md:grid-cols-2 gap-[13px]">
        <label className="md:col-span-2 block"><span className="text-[13px] font-semibold">Judul (min 5 karakter)</span>
          <Input className="mt-[8px] w-full border rounded-[13px] px-[13px] py-[13px]" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <label className="block"><span className="text-[13px] font-semibold">Slug (opsional — otomatis bila kosong)</span>
          <Input className="mt-[8px] w-full border rounded-[13px] px-[13px] py-[13px]" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="berita-sekolah" /></label>
        <label className="block"><span className="text-[13px] font-semibold">Cover (upload /uploads)</span>
          <span className="mt-[8px] flex gap-[8px]"><Input className="w-full border rounded-[13px] px-[13px] py-[8px] text-[14px]" value={cover} onChange={(e) => setCover(e.target.value)} placeholder="/uploads/..." />
          <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])} /></span></label>
        <label className="md:col-span-2 block"><span className="text-[13px] font-semibold">Ringkasan (maks 300)</span>
          <Input className="mt-[8px] w-full border rounded-[13px] px-[13px] py-[13px]" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} /></label>
        <label className="block"><span className="text-[13px] font-semibold">Tipe</span>
          <NativeSelect className="mt-[8px] w-full border rounded-[13px] px-[13px] py-[13px]" value={type} onChange={(e) => setType(e.target.value)}>{TYPES.map((t) => <option key={t}>{t}</option>)}</NativeSelect></label>
        <div className="grid grid-cols-2 gap-[13px]">
          <label className="block"><span className="text-[13px] font-semibold">Status</span>
            <NativeSelect className="mt-[8px] w-full border rounded-[13px] px-[13px] py-[13px]" value={status} onChange={(e) => setStatus(e.target.value)}>{STATUS.map((s) => <option key={s}>{s}</option>)}</NativeSelect></label>
          <label className="block"><span className="text-[13px] font-semibold">Jadwal terbit (wajib bila SCHEDULED)</span>
            <Input type="datetime-local" className="mt-[8px] w-full border rounded-[13px] px-[13px] py-[13px]" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} /></label>
        </div>
      </Card>
      <Card className="space-y-[13px]">
        <div className="flex items-center justify-between">
          <h2 className="h-gold-3">Konten</h2>
          <Button type="button" className="!py-[8px]" onClick={() => setPreview(!preview)} variant="outline">{preview ? "Tutup Preview" : "Preview"}</Button>
        </div>
        <Editor value={content} onChange={setContent} />
        {preview && <article className="border rounded-[13px] p-[21px] prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />}
      </Card>
      <div className="flex gap-[13px]">
        <Button className="" onClick={save} variant="default">{isEdit ? "Simpan Perubahan" : "Simpan Post"}</Button>
        {cover && <Button asChild variant="outline"><a className="" href={cover} target="_blank">Lihat Cover</a></Button>}
      </div>
    </div>
  );
}
