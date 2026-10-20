"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MenuNode } from "@/lib/menus";
import { ThemeToggle } from "@/components/ThemeToggle";

function href(item:MenuNode){return item.href||"#"}
function LinkItem({item,onNavigate}:{item:MenuNode;onNavigate?:()=>void}){return <Link onClick={onNavigate} href={href(item)} target={item.target} rel={item.target==="_blank"?"noopener noreferrer":undefined} className="block rounded-[8px] px-[13px] py-[8px] hover:bg-slate-100 dark:hover:bg-slate-700">{item.label}</Link>}
function Dropdown({item,onNavigate}:{item:MenuNode;onNavigate?:()=>void}){return <details className="group relative"><summary className="cursor-pointer list-none rounded-[8px] px-[13px] py-[8px] hover:bg-slate-100 dark:hover:bg-slate-700">{item.label}<span aria-hidden="true" className="ml-[8px]">⌄</span></summary><div className="min-w-[200px] rounded-[13px] border border-slate-200 bg-white p-[8px] shadow-lg dark:border-slate-700 dark:bg-slate-800 md:absolute md:left-0 md:top-full md:z-20">{item.href!=="#"&&<LinkItem item={{...item,children:undefined}} onNavigate={onNavigate}/ >}{item.children?.map(child=><MenuEntry key={child.id} item={child} onNavigate={onNavigate}/>)}</div></details>}
function MenuEntry({item,onNavigate}:{item:MenuNode;onNavigate?:()=>void}){return item.children?.length?<Dropdown item={item} onNavigate={onNavigate}/>:<LinkItem item={item} onNavigate={onNavigate}/>}

export function NavbarClient({items,title,logo}:{items:MenuNode[];title:string;logo:string}){
 const [open,setOpen]=useState(false);
 useEffect(()=>{if(!open)return;const close=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(false)};window.addEventListener("keydown",close);return()=>window.removeEventListener("keydown",close)},[open]);
 const close=()=>setOpen(false);
 return <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:bg-slate-900/95"><nav aria-label="Navigasi utama" className="mx-auto flex max-w-6xl items-center justify-between gap-[8px] px-[21px] py-[8px]"><Link href="/" className="flex items-center gap-[8px] font-extrabold grad-text">{logo&&<img src={logo} alt="" className="h-9 w-9 object-contain"/>}{title}</Link><div className="hidden items-center gap-[4px] md:flex">{items.map(item=><MenuEntry key={item.id} item={item}/>)}</div><div className="flex items-center gap-[8px]"><ThemeToggle/><button type="button" className="rounded-[8px] border px-[13px] py-[8px] md:hidden" aria-label={open?"Tutup menu":"Buka menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={()=>setOpen(!open)}>{open?"Tutup":"Menu"}</button></div></nav>{open&&<div id="mobile-menu" className="fixed inset-0 top-[57px] z-40 overflow-y-auto bg-white p-[21px] dark:bg-slate-900 md:hidden"><nav aria-label="Menu mobile" className="space-y-[8px]">{items.map(item=><MenuEntry key={item.id} item={item} onNavigate={close}/>)}</nav></div>}</header>;
}
