"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MenuNode } from "@/lib/menus";
import type { SiteIdentity } from "@/lib/settings";
import { ThemeToggle } from "@/components/ThemeToggle";

function href(item:MenuNode){return item.href||"#"}
function LinkItem({item,onNavigate}:{item:MenuNode;onNavigate?:()=>void}){return <Link onClick={onNavigate} href={href(item)} target={item.target} rel={item.target==="_blank"?"noopener noreferrer":undefined} className="block rounded-[8px] px-[13px] py-[8px] hover:bg-slate-100 dark:hover:bg-slate-700">{item.label}</Link>}
function Dropdown({item,onNavigate}:{item:MenuNode;onNavigate?:()=>void}){return <details className="group relative"><summary className="cursor-pointer list-none rounded-[8px] px-[13px] py-[8px] hover:bg-slate-100 dark:hover:bg-slate-700">{item.label}<span aria-hidden="true" className="ml-[8px]">⌄</span></summary><div className="min-w-[200px] rounded-[13px] border border-slate-200 bg-white p-[8px] shadow-lg dark:border-slate-700 dark:bg-slate-800 lg:absolute lg:left-0 lg:top-full lg:z-20">{item.href!=="#"&&<LinkItem item={{...item,children:undefined}} onNavigate={onNavigate}/ >}{item.children?.map(child=><MenuEntry key={child.id} item={child} onNavigate={onNavigate}/>)}</div></details>}
function MenuEntry({item,onNavigate}:{item:MenuNode;onNavigate?:()=>void}){return item.children?.length?<Dropdown item={item} onNavigate={onNavigate}/>:<LinkItem item={item} onNavigate={onNavigate}/>}

export function NavbarClient({items,title,logo,identity}:{items:MenuNode[];title:string;logo:string;identity:SiteIdentity}){
 const [open,setOpen]=useState(false);
 useEffect(()=>{if(!open)return;const close=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(false)};window.addEventListener("keydown",close);return()=>window.removeEventListener("keydown",close)},[open]);
 const close=()=>setOpen(false);
 const socials=[["Facebook",identity.facebook],["Instagram",identity.instagram],["YouTube",identity.youtube]].filter((item)=>item[1]);
 const hasContact=identity.phone||identity.email||socials.length>0;
 return <><a href="#konten-utama" className="skip-link">Lewati ke konten utama</a><header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:bg-slate-900/95">
  {hasContact&&<div className="bg-slate-900 text-slate-200 dark:bg-slate-950"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-[8px] px-[21px] py-[8px] text-[13px]"><address className="flex flex-wrap gap-x-[21px] gap-y-[4px] not-italic">{identity.phone&&<a href={`tel:${identity.phone}`}>{identity.phone}</a>}{identity.email&&<a href={`mailto:${identity.email}`}>{identity.email}</a>}</address><nav aria-label="Media sosial" className="flex gap-[13px]">{socials.map(([name,url])=><a key={name} href={url!} target="_blank" rel="noopener noreferrer">{name}</a>)}</nav></div></div>}
  <nav aria-label="Navigasi utama" className="mx-auto flex max-w-6xl items-center justify-between gap-[8px] px-[21px] py-[8px]"><Link href="/" className="flex shrink-0 items-center gap-[8px] font-extrabold grad-text">{logo&&<img src={logo} alt="" className="h-9 w-9 object-contain"/>}{title}</Link><div className="hidden items-center gap-[4px] lg:flex">{items.map(item=><MenuEntry key={item.id} item={item}/>)}</div><div className="flex shrink-0 items-center gap-[8px]"><Link href="/spmb" className="btn-primary hidden !px-[13px] !py-[8px] text-[14px] lg:inline-flex">SPMB Online</Link><ThemeToggle/><button type="button" className="rounded-[8px] border border-slate-200 p-[8px] text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden" aria-label={open?"Tutup menu":"Buka menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={()=>setOpen(!open)}><svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><path d={open?"M6 6l12 12M18 6 6 18":"M4 6h16M4 12h16M4 18h16"}/></svg></button></div></nav>{open&&<div id="mobile-menu" className="absolute inset-x-0 top-full z-40 max-h-[calc(100vh-4rem)] overflow-y-auto bg-white p-[21px] dark:bg-slate-900 lg:hidden"><nav aria-label="Menu mobile" className="space-y-[8px]">{items.map(item=><MenuEntry key={item.id} item={item} onNavigate={close}/>)}</nav><Link onClick={close} href="/spmb" className="btn-primary mt-[13px] w-full">SPMB Online</Link></div>}</header></>;
}
