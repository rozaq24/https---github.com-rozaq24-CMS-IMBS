"use client";

import { useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Classroom = { id: string; name: string; year: string; majorId: string | null; homeroomTeacherId: string | null; major: { name: string } | null; homeroomTeacher: { name: string } | null; _count: { students: number } };
type Option = { id: string; name: string };
const EMPTY = { name: "", year: "", majorId: "", homeroomTeacherId: "" };
export function ClassesClient() {
  const [classes, setClasses] = useState<Classroom[]>([]); const [teachers, setTeachers] = useState<Option[]>([]); const [majors, setMajors] = useState<Option[]>([]); const [form, setForm] = useState(EMPTY); const [editId, setEditId] = useState(""); const [message, setMessage] = useState("");
  async function load() { const r = await fetch("/api/classes"); const j = await r.json(); if (r.ok) { setClasses(j.data); setTeachers(j.teachers); setMajors(j.majors); } else setMessage(j.error); }
  useEffect(() => { load(); }, []);
  function edit(c: Classroom) { setEditId(c.id); setForm({ name: c.name, year: c.year, majorId: c.majorId || "", homeroomTeacherId: c.homeroomTeacherId || "" }); }
  async function save(e: React.FormEvent) { e.preventDefault(); const payload = { ...form, majorId: form.majorId || null, homeroomTeacherId: form.homeroomTeacherId || null }; const r = await fetch(editId ? `/api/classes/${editId}` : "/api/classes", { method: editId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); const j = await r.json(); setMessage(r.ok ? "Data kelas disimpan" : j.error); if (r.ok) { setForm(EMPTY); setEditId(""); load(); } }
  async function remove(c: Classroom) { if (!confirm(`Hapus kelas ${c.name}?`)) return; const r = await fetch(`/api/classes/${c.id}`, { method: "DELETE" }); const j = await r.json(); setMessage(r.ok ? "Kelas dihapus" : j.error); if (r.ok) load(); }
  return <div className="space-y-[21px]">{message && <Card role="status" className="" as="p">{message}</Card>}
    <Card onSubmit={save} className="grid md:grid-cols-2 gap-[13px]" as="form"><h2 className="h-gold-3 md:col-span-2">{editId ? "Edit Kelas" : "Tambah Kelas"}</h2><label>Nama kelas<Input required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-[4px] w-full border rounded-[13px] p-[13px]" /></label><label>Tahun ajaran<Input required minLength={4} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2026/2027" className="mt-[4px] w-full border rounded-[13px] p-[13px]" /></label><label>Jurusan<NativeSelect value={form.majorId} onChange={(e) => setForm({ ...form, majorId: e.target.value })} className="mt-[4px] w-full border rounded-[13px] p-[13px]"><option value="">Tidak ditentukan</option>{majors.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</NativeSelect></label><label>Wali kelas<NativeSelect value={form.homeroomTeacherId} onChange={(e) => setForm({ ...form, homeroomTeacherId: e.target.value })} className="mt-[4px] w-full border rounded-[13px] p-[13px]"><option value="">Belum ditentukan</option>{teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</NativeSelect></label><div className="md:col-span-2 flex gap-[13px]"><Button className="" variant="default">Simpan</Button>{editId && <Button type="button" onClick={() => { setEditId(""); setForm(EMPTY); }} className="" variant="outline">Batal</Button>}</div></Card>
    <Card className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Kelas</TableHead><TableHead>Tahun</TableHead><TableHead>Jurusan</TableHead><TableHead>Wali</TableHead><TableHead>Siswa</TableHead><TableHead>Aksi</TableHead></TableRow></TableHeader><TableBody>{classes.map((c) => <TableRow key={c.id}><TableCell>{c.name}</TableCell><TableCell>{c.year}</TableCell><TableCell>{c.major?.name || "—"}</TableCell><TableCell>{c.homeroomTeacher?.name || "—"}</TableCell><TableCell>{c._count.students}</TableCell><TableCell className="whitespace-nowrap"><Button onClick={() => edit(c)} className="underline mr-[8px]" variant="ghost">Edit</Button><Button onClick={() => remove(c)} className="underline text-rose-600" variant="ghost">Hapus</Button></TableCell></TableRow>)}{!classes.length && <TableRow><TableCell colSpan={6} className="text-center text-slate-500">Belum ada kelas.</TableCell></TableRow>}</TableBody></Table></Card>
  </div>;
}
