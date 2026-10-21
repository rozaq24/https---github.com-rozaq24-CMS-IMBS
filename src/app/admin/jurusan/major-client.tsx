"use client";
import { useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
type Major = { id: string; code: string; name: string; desc: string | null };
const EMPTY = { code: "", name: "", desc: "" };
export function MajorClient() {
  const [items,setItems]=useState<Major[]>([]); const [form,setForm]=useState(EMPTY); const [id,setId]=useState(""); const [message,setMessage]=useState("");
  async function load(){const r=await fetch("/api/majors");const j=await r.json();if(r.ok)setItems(j.data);else setMessage(j.error)} useEffect(()=>{load()},[]);
  async function save(e:React.FormEvent){e.preventDefault();const r=await fetch(id?`/api/majors/${id}`:"/api/majors",{method:id?"PATCH":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});const j=await r.json();setMessage(r.ok?"Jurusan disimpan":j.error);if(r.ok){setForm(EMPTY);setId("");load()}}
  async function remove(m:Major){if(!confirm(`Hapus jurusan ${m.name}?`))return;const r=await fetch(`/api/majors/${m.id}`,{method:"DELETE"});const j=await r.json();setMessage(r.ok?"Jurusan dihapus":j.error);if(r.ok)load()}
  return <div className="space-y-[21px]">{message&&<Card role="status" className="" as="p">{message}</Card>}<Card onSubmit={save} className="grid md:grid-cols-3 gap-[13px]" as="form"><h2 className="h-gold-3 md:col-span-3">{id?"Edit Jurusan":"Tambah Jurusan"}</h2><label>Kode<Input required value={form.code} onChange={e=>setForm({...form,code:e.target.value})} className="mt-[4px] w-full border rounded-[13px] p-[13px]"/></label><label>Nama<Input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-[4px] w-full border rounded-[13px] p-[13px]"/></label><label>Deskripsi<Input value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} className="mt-[4px] w-full border rounded-[13px] p-[13px]"/></label><div><Button className="" variant="default">Simpan</Button></div></Card><Card className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Kode</TableHead><TableHead>Nama</TableHead><TableHead>Deskripsi</TableHead><TableHead>Aksi</TableHead></TableRow></TableHeader><TableBody>{items.map(m=><TableRow key={m.id}><TableCell>{m.code}</TableCell><TableCell>{m.name}</TableCell><TableCell>{m.desc}</TableCell><TableCell><Button onClick={()=>{setId(m.id);setForm({code:m.code,name:m.name,desc:m.desc||""})}} className="underline mr-[8px]" variant="ghost">Edit</Button><Button onClick={()=>remove(m)} className="underline text-rose-600" variant="ghost">Hapus</Button></TableCell></TableRow>)}</TableBody></Table></Card></div>;
}
