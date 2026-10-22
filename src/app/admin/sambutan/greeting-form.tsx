"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function GreetingForm({ initial }: { initial?: { title: string; body: string; principalName: string; photo: string; active: boolean } }) {
  const [title, setTitle] = useState(initial?.title || "Sambutan Kepala Sekolah");
  const [body, setBody] = useState(initial?.body || "");
  const [principalName, setPrincipalName] = useState(initial?.principalName || "");
  const [photo, setPhoto] = useState(initial?.photo || "");
  const [active, setActive] = useState(initial?.active ?? true);
  const [msg, setMsg] = useState("");

  async function uploadPhoto(f: File) {
    const form = new FormData();
    form.append("file", f);
    const r = await fetch("/api/upload", { method: "POST", body: form });
    const j = await r.json();
    if (!r.ok) { setMsg(j.error || "Upload foto gagal"); return; }
    setPhoto(j.url);
  }

  async function save() {
    setMsg("");
    const r = await fetch("/api/greeting", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, body, principalName, photo, active }) });
    const j = await r.json();
    setMsg(r.ok ? `Tersimpan — ${j.principalName}` : (j.error || "Gagal menyimpan"));
  }

  return (
    <div className="space-y-[21px]">
      {msg && <Card className="text-[14px]" as="p">{msg}</Card>}
      <Card className="grid md:grid-cols-2 gap-[13px]">
        <label className="block"><span className="text-[13px] font-semibold">Judul blok</span>
          <Input className="mt-[8px] w-full border rounded-[13px] px-[13px] py-[13px]" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <label className="block"><span className="text-[13px] font-semibold">Nama Kepala Sekolah</span>
          <Input className="mt-[8px] w-full border rounded-[13px] px-[13px] py-[13px]" value={principalName} onChange={(e) => setPrincipalName(e.target.value)} /></label>
        <label className="md:col-span-2 block"><span className="text-[13px] font-semibold">Isi sambutan (pisahkan paragraf dengan baris kosong)</span>
          <Textarea className="mt-[8px] w-full border rounded-[13px] px-[13px] py-[13px] min-h-[200px]" value={body} onChange={(e) => setBody(e.target.value)} /></label>
        <label className="block"><span className="text-[13px] font-semibold">Foto (upload /uploads)</span>
          <span className="mt-[8px] flex gap-[8px]"><Input className="w-full border rounded-[13px] px-[13px] py-[8px] text-[14px]" value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="/uploads/..." />
          <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])} /></span></label>
        <label className="flex items-center gap-[8px] text-[14px]"><Input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Tampilkan di publik</label>
      </Card>
      {photo && <img src={photo} alt="Foto kepala sekolah" className="rounded-[21px] w-[220px] h-[260px] object-cover" />}
      <Button className="" onClick={save} variant="default">Simpan Sambutan</Button>
    </div>
  );
}
