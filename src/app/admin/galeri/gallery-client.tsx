"use client";

import { useEffect, useState } from "react";
import { NativeSelect } from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Photo = { id: string; url: string; caption: string | null };
type Album = { id: string; title: string; category: string; photos: Photo[] };
export function GalleryClient() {
  const [albums, setAlbums] = useState<Album[]>([]); const [albumId, setAlbumId] = useState(""); const [title, setTitle] = useState(""); const [category, setCategory] = useState("Kegiatan"); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  async function load() { const r = await fetch("/api/albums"); const j = await r.json(); if (r.ok) { setAlbums(j.data); setAlbumId((id) => id || j.data[0]?.id || ""); } else setMessage(j.error); }
  useEffect(() => { load(); }, []);
  async function create(e: React.FormEvent) { e.preventDefault(); const r = await fetch("/api/albums", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, category }) }); const j = await r.json(); setMessage(r.ok ? "Album dibuat" : j.error); if (r.ok) { setTitle(""); await load(); setAlbumId(j.id); } }
  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []); if (!files.length || !albumId) return; if (files.length > 20) { setMessage("Maksimal 20 foto setiap unggahan"); return; } setBusy(true); setMessage("");
    const input = e.target;
    try {
      const uploaded = await Promise.all(files.map(async (file) => { const form = new FormData(); form.append("file", file); const r = await fetch("/api/upload", { method: "POST", body: form }); const j = await r.json(); if (!r.ok) throw new Error(j.error); return { url: j.url }; }));
      const r = await fetch("/api/photos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ albumId, photos: uploaded }) }); const j = await r.json(); if (!r.ok) throw new Error(j.error); setMessage(`${j.count} foto disimpan`); await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload gagal"); } finally { setBusy(false); input.value = ""; }
  }
  async function remove(id: string, title: string) { if (!confirm(`Hapus foto dari ${title}?`)) return; const r = await fetch(`/api/photos/${id}`, { method: "DELETE" }); const j = await r.json(); setMessage(r.ok ? "Foto dihapus" : j.error); if (r.ok) load(); }
  async function updateCaption(e: React.FormEvent<HTMLFormElement>, id: string) { e.preventDefault(); const caption = new FormData(e.currentTarget).get("caption"); const r = await fetch(`/api/photos/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ caption }) }); const j = await r.json(); setMessage(r.ok ? "Keterangan disimpan" : j.error); if (r.ok) load(); }
  async function updateAlbum(e: React.FormEvent<HTMLFormElement>, id: string) { e.preventDefault(); const values = Object.fromEntries(new FormData(e.currentTarget)); const r = await fetch(`/api/albums/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) }); const j = await r.json(); setMessage(r.ok ? "Album diperbarui" : j.error); if (r.ok) load(); }
  async function removeAlbum(a: Album) { if (!confirm(`Hapus album ${a.title} beserta semua fotonya?`)) return; const r = await fetch(`/api/albums/${a.id}`, { method: "DELETE" }); const j = await r.json(); setMessage(r.ok ? "Album dihapus" : j.error); if (r.ok) { setAlbumId(""); load(); } }
  return <div className="space-y-[21px]">{message && <Card role="status" className="" as="p">{message}</Card>}
    <Card onSubmit={create} className="grid sm:grid-cols-3 gap-[13px] items-end" as="form"><label>Nama album<Input required minLength={2} value={title} onChange={(e) => setTitle(e.target.value)} className="mt-[4px] w-full border rounded-[13px] p-[13px]" /></label><label>Kategori<Input value={category} onChange={(e) => setCategory(e.target.value)} className="mt-[4px] w-full border rounded-[13px] p-[13px]" /></label><Button className="" variant="default">Buat Album</Button></Card>
    <Card className="space-y-[13px]" as="section"><h2 className="h-gold-3">Unggah Foto</h2><label className="block">Album<NativeSelect value={albumId} onChange={(e) => setAlbumId(e.target.value)} className="mt-[4px] w-full border rounded-[13px] p-[13px]"><option value="">Pilih album</option>{albums.map((a) => <option key={a.id} value={a.id}>{a.title} — {a.category}</option>)}</NativeSelect></label><label className="block">Pilih foto (maksimal 20 sekaligus)<Input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple disabled={!albumId || busy} onChange={upload} className="mt-[4px] block" /></label></Card>
    {albums.map((a) => <Card key={a.id} className="space-y-[13px]" as="section"><form onSubmit={(e) => updateAlbum(e, a.id)} className="grid sm:grid-cols-3 gap-[13px] items-end"><label>Nama album<Input name="title" defaultValue={a.title} required minLength={2} className="mt-[4px] w-full border rounded-[13px] p-[8px]" /></label><label>Kategori<Input name="category" defaultValue={a.category} className="mt-[4px] w-full border rounded-[13px] p-[8px]" /></label><div className="flex gap-[13px]"><Button className="underline" variant="ghost">Simpan</Button><Button type="button" onClick={() => removeAlbum(a)} className="text-rose-600 underline" variant="ghost">Hapus Album</Button></div></form><p className="text-[14px] text-slate-500">{a.photos.length} foto</p><div className="grid grid-cols-2 md:grid-cols-4 gap-[13px]">{a.photos.map((p) => <div key={p.id}><img src={p.url} alt={p.caption || a.title} className="w-full aspect-square object-cover rounded-[13px]" /><form onSubmit={(e) => updateCaption(e, p.id)} className="mt-[4px] flex gap-[4px]"><Input name="caption" defaultValue={p.caption || ""} placeholder="Keterangan foto" maxLength={250} className="min-w-0 w-full border rounded-[8px] px-[8px] py-[4px] text-[13px]" /><Button className="text-[13px] underline" variant="ghost">Simpan</Button></form><Button onClick={() => remove(p.id, a.title)} className="mt-[4px] text-[13px] underline text-rose-600" variant="ghost">Hapus foto</Button></div>)}</div></Card>)}
  </div>;
}
