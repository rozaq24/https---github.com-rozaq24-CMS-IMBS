"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_IDENTITY, type SiteIdentity } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
type ImageKey="logo"|"favicon";
export function IdentitySettingsClient(){
 const [form,setForm]=useState<SiteIdentity>(DEFAULT_IDENTITY);const [message,setMessage]=useState("");const [busy,setBusy]=useState(false);const router=useRouter();
 useEffect(()=>{fetch("/api/settings").then(r=>r.json()).then(v=>setForm(v.identity)).catch(()=>setMessage("Identitas gagal dimuat"))},[]);
 function set<K extends keyof SiteIdentity>(key:K,value:SiteIdentity[K]){setForm(current=>({...current,[key]:value}))}
 async function upload(key:ImageKey,file?:File){if(!file)return;const data=new FormData();data.append("file",file);const r=await fetch("/api/upload",{method:"POST",body:data});const j=await r.json();if(r.ok)set(key,j.url);else setMessage(j.error)}
 async function save(e:React.FormEvent){e.preventDefault();setBusy(true);const r=await fetch("/api/settings",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({identity:form})});const j=await r.json();setBusy(false);setMessage(r.ok?"Identitas situs disimpan":j.error);if(r.ok)router.refresh()}
 const fields:[keyof SiteIdentity,string,boolean?][]=[["siteTitle","Judul situs"],["description","Deskripsi SEO"],["keywords","Kata kunci (pisahkan dengan koma)"],["address","Alamat sekolah"],["phone","Telepon"],["email","Email"],["mapUrl","Tautan peta (http/https)"],["facebook","URL Facebook"],["instagram","URL Instagram"],["youtube","URL YouTube"]];
 return <form onSubmit={save} className="space-y-[21px]">{message&&<Card role="status" className="" as="p">{message}</Card>}<Card className="grid md:grid-cols-2 gap-[13px]" as="section"><h2 className="h-gold-3 md:col-span-2">Identitas & SEO</h2>{fields.map(([key,label])=><label key={key} className="block">{label}{key==="description"?<Textarea required value={form[key]} onChange={e=>set(key,e.target.value)} rows={3} className="mt-[4px] w-full border rounded-[13px] p-[13px]"/>:<Input required={key==="siteTitle"} type={key==="email"?"email":"text"} value={form[key]} onChange={e=>set(key,e.target.value)} className="mt-[4px] w-full border rounded-[13px] p-[13px]"/>}</label>)}</Card><Card className="grid md:grid-cols-2 gap-[21px]" as="section"><h2 className="h-gold-3 md:col-span-2">Logo & Favicon</h2>{([["logo","Logo"],["favicon","Favicon"]] as [ImageKey,string][]).map(([key,label])=><label key={key} className="block">{label}<Input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={e=>upload(key,e.target.files?.[0])} className="mt-[8px] block"/>{form[key]&&<img src={form[key]} alt={`Pratinjau ${label}`} className="mt-[8px] h-24 w-24 object-contain"/>}</label>)}</Card><Button disabled={busy} className="" variant="default">{busy?"Menyimpan…":"Simpan Identitas"}</Button></form>;
}
