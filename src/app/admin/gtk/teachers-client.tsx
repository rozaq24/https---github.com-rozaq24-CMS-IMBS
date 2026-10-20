"use client";

import { useEffect, useState } from "react";

type Teacher = { id: string; nip: string; name: string; position: string; rank: string | null; education: string | null; experience: string | null; subjects: string | null; photo: string | null; active: boolean };
const EMPTY = { nip: "", name: "", position: "Guru", rank: "", education: "", experience: "", subjects: "", photo: "", active: true };

export function TeachersClient() {
  const [teachers, setTeachers] = useState<Teacher[]>([]); const [form, setForm] = useState(EMPTY); const [editId, setEditId] = useState(""); const [query, setQuery] = useState(""); const [message, setMessage] = useState("");
  async function load() { const r = await fetch("/api/teachers"); const j = await r.json(); if (r.ok) setTeachers(j.data); else setMessage(j.error); }
  useEffect(() => { load(); }, []);
  const set = (key: keyof typeof EMPTY, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
  function edit(t: Teacher) { setEditId(t.id); setForm({ nip: t.nip, name: t.name, position: t.position, rank: t.rank || "", education: t.education || "", experience: t.experience || "", subjects: t.subjects || "", photo: t.photo || "", active: t.active }); window.scrollTo({ top: 0, behavior: "smooth" }); }
  async function upload(file?: File) { if (!file) return; const body = new FormData(); body.append("file", file); const r = await fetch("/api/upload", { method: "POST", body }); const j = await r.json(); if (r.ok) set("photo", j.url); else setMessage(j.error); }
  async function save(e: React.FormEvent) { e.preventDefault(); const url = editId ? `/api/teachers/${editId}` : "/api/teachers"; const r = await fetch(url, { method: editId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const j = await r.json(); setMessage(r.ok ? "Data GTK disimpan" : j.error); if (r.ok) { setForm(EMPTY); setEditId(""); load(); } }
  async function remove(t: Teacher) { if (!confirm(`Hapus data ${t.name}?`)) return; const r = await fetch(`/api/teachers/${t.id}`, { method: "DELETE" }); const j = await r.json(); setMessage(r.ok ? "Data dihapus" : j.error); if (r.ok) load(); }
  const shown = teachers.filter((t) => `${t.name} ${t.nip} ${t.position}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="space-y-[21px]">{message && <p role="status" className="card">{message}</p>}
    <form onSubmit={save} className="card grid md:grid-cols-2 gap-[13px]">
      <h2 className="h-gold-3 md:col-span-2">{editId ? "Edit Data GTK" : "Tambah Guru/Tendik"}</h2>
      {([ ["nip","NIP"], ["name","Nama lengkap"], ["position","Jabatan"], ["rank","Pangkat/golongan"], ["education","Pendidikan"], ["subjects","Mata pelajaran"] ] as const).map(([key,label]) => <label key={key} className="block">{label}<input required={key === "nip" || key === "name"} value={form[key]} onChange={(e) => set(key, e.target.value)} className="mt-[4px] w-full border rounded-[13px] p-[13px]" /></label>)}
      <label className="md:col-span-2 block">Pengalaman<input value={form.experience} onChange={(e) => set("experience", e.target.value)} className="mt-[4px] w-full border rounded-[13px] p-[13px]" /></label>
      <label className="block">Foto<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => upload(e.target.files?.[0])} className="mt-[4px] block" />{form.photo && <img src={form.photo} alt="Pratinjau foto" className="mt-[8px] w-24 h-24 object-cover rounded-full" />}</label>
      <label className="flex items-center gap-[8px]"><input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} /> Tampilkan di direktori publik</label>
      <div className="md:col-span-2 flex gap-[13px]"><button className="btn-primary">{editId ? "Simpan Perubahan" : "Tambah GTK"}</button>{editId && <button type="button" onClick={() => { setEditId(""); setForm(EMPTY); }} className="btn-outline">Batal</button>}</div>
    </form>
    <div className="card space-y-[13px]"><div className="flex gap-[13px] flex-wrap items-center"><h2 className="h-gold-3">Direktori GTK</h2><input placeholder="Cari nama, NIP, jabatan" value={query} onChange={(e) => setQuery(e.target.value)} className="border rounded-[13px] px-[13px] py-[8px]" /></div>
      <div className="overflow-x-auto"><table className="tbl"><thead><tr><th>Nama</th><th>NIP</th><th>Jabatan</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{shown.map((t) => <tr key={t.id}><td>{t.name}</td><td>{t.nip}</td><td>{t.position}</td><td>{t.active ? "Aktif" : "Nonaktif"}</td><td className="whitespace-nowrap"><button onClick={() => edit(t)} className="underline mr-[8px]">Edit</button><button onClick={() => remove(t)} className="underline text-rose-600">Hapus</button></td></tr>)}{!shown.length && <tr><td colSpan={5} className="text-center text-slate-500">Belum ada GTK.</td></tr>}</tbody></table></div>
    </div>
  </div>;
}
