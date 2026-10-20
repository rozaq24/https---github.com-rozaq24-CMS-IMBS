"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { THEMES, THEME_META, type ThemeName } from "@/lib/theme";
export function ThemeSettingsClient(){
 const [theme,setTheme]=useState<ThemeName>("emerald");const [message,setMessage]=useState("");const router=useRouter();
 useEffect(()=>{fetch("/api/settings").then(r=>r.json()).then(v=>setTheme(v.theme)).catch(()=>setMessage("Pengaturan tema gagal dimuat"))},[]);
 async function save(){const r=await fetch("/api/settings",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({theme})});const j=await r.json();setMessage(r.ok?"Tema situs diperbarui":j.error);if(r.ok){document.documentElement.dataset.theme=theme;router.refresh()}}
 return <div className="space-y-[21px]">{message&&<p role="status" className="card">{message}</p>}<section className="card space-y-[13px]"><h2 className="h-gold-3">Pilih tema</h2><div className="grid grid-cols-2 gap-[13px] sm:grid-cols-3 lg:grid-cols-5">{THEMES.map(name=><button key={name} onClick={()=>{setTheme(name);document.documentElement.dataset.theme=name}} aria-pressed={theme===name} className={`rounded-[13px] border p-[13px] text-left ${theme===name?"ring-2 ring-slate-900":""}`}><span className="mb-[8px] block h-[34px] rounded-[8px]" style={{background:THEME_META[name].grad}}/><span className="font-semibold">{THEME_META[name].label}</span></button>)}</div></section><section className="card"><h2 className="h-gold-3">Pratinjau</h2><div className="mt-[13px] rounded-[21px] border p-[21px]"><h3 className="h-gold-2 grad-text">Judul halaman</h3><p className="mt-[8px]">Teks isi mengikuti palet tema terpilih.</p><button className="btn-primary mt-[13px]">Tombol Utama</button></div><button onClick={save} className="btn-primary mt-[21px]">Simpan Tema</button></section></div>;
}
