"use client";

import { useEffect, useState } from "react";
import { DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { NativeSelect } from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Item={id:string;label:string;href:string;pageSlug:string|null;parentId:string|null;order:number;visible:boolean;target:"_self"|"_blank"};
type Page={id:string;slug:string;title:string;anchors:string[]};
type MenuForm={label:string;href:string;pageSlug:string;anchorId:string;parentId:string;visible:boolean;target:"_self"|"_blank"};
const EMPTY:MenuForm={label:"",href:"#",pageSlug:"",anchorId:"",parentId:"",visible:true,target:"_self"};
function depthOf(item:Item,items:Item[]){let depth=1;let parent=item.parentId;while(parent){depth++;parent=items.find(x=>x.id===parent)?.parentId||null}return depth}
function flatten(items:Item[],parentId:string|null=null):Item[]{return items.filter(x=>x.parentId===parentId).sort((a,b)=>a.order-b.order).flatMap(x=>[x,...flatten(items,x.id)])}
function DragRow({item,depth,onEdit,onVisible,onDelete}:{item:Item;depth:number;onEdit:()=>void;onVisible:()=>void;onDelete:()=>void}){
 const {attributes,listeners,setNodeRef,transform,transition,isDragging}=useSortable({id:item.id});
 return <Card ref={setNodeRef} style={{transform:CSS.Transform.toString(transform),transition,marginLeft:`${(depth-1)*21}px`,opacity:isDragging?.5:1}} className="flex items-center gap-[13px] !p-[13px]">
  <Button {...attributes} {...listeners} aria-label={`Pindahkan ${item.label}`} className="cursor-grab touch-none text-[20px]" variant="ghost">⠿</Button><div className="min-w-0 grow"><strong>{item.label}</strong><p className="truncate text-[13px] text-slate-500">{item.href} · level {depth}</p></div><Button onClick={onVisible} aria-label={item.visible?"Sembunyikan menu":"Tampilkan menu"} className="underline" variant="ghost">{item.visible?"Tampil":"Tersembunyi"}</Button><Button onClick={onEdit} className="underline" variant="ghost">Edit</Button><Button onClick={onDelete} className="underline text-rose-600" variant="ghost">Hapus</Button>
 </Card>;
}
function RootDrop(){const {setNodeRef,isOver}=useDroppable({id:"menu-root-drop"});return <div ref={setNodeRef} className={`rounded-[13px] border-2 border-dashed p-[13px] text-center text-[14px] ${isOver?"border-emerald-500 bg-emerald-50":"border-slate-300"}`}>Lepas di sini untuk menjadikan menu level utama</div>}

export function MenuBuilder(){
 const [items,setItems]=useState<Item[]>([]);const [pages,setPages]=useState<Page[]>([]);const [form,setForm]=useState<MenuForm>(EMPTY);const [editId,setEditId]=useState("");const [message,setMessage]=useState("");
 async function load(){const r=await fetch("/api/menus?admin=1");const j=await r.json();if(r.ok){setItems(j.data);setPages(j.pages)}else setMessage(j.error)} useEffect(()=>{load()},[]);
 function edit(x:Item){setEditId(x.id);setForm({label:x.label,href:x.href,pageSlug:x.pageSlug||"",anchorId:x.href.includes("#")?x.href.split("#").slice(1).join("#"):"",parentId:x.parentId||"",visible:x.visible,target:x.target})}
 async function save(e:React.FormEvent){e.preventDefault();const parentId=form.parentId||null;if(parentId&&depthOf(items.find(x=>x.id===parentId)!,items)>=3){setMessage("Menu maksimal 3 level");return}const payload={...form,parentId,pageSlug:form.pageSlug||null,href:form.pageSlug?`/${form.pageSlug}${form.anchorId?`#${form.anchorId}`:""}`:form.href};const r=await fetch(editId?`/api/menus/${editId}`:"/api/menus",{method:editId?"PATCH":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const j=await r.json();setMessage(r.ok?"Menu disimpan":j.error);if(r.ok){setForm(EMPTY);setEditId("");load()}}
 async function remove(x:Item){if(!confirm(`Hapus menu ${x.label} beserta turunannya?`))return;const r=await fetch(`/api/menus/${x.id}`,{method:"DELETE"});const j=await r.json();setMessage(r.ok?"Menu dihapus":j.error);if(r.ok)load()}
 async function visible(x:Item){const r=await fetch(`/api/menus/${x.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({visible:!x.visible})});const j=await r.json();setMessage(r.ok?"Visibilitas diperbarui":j.error);if(r.ok)load()}
 async function dragEnd(e:DragEndEvent){if(!e.over)return;const active=items.find(x=>x.id===String(e.active.id));if(!active)return;let next=items.map(x=>({...x}));if(String(e.over.id)==="menu-root-drop"){const moving=next.find(x=>x.id===active.id)!;moving.parentId=null;moving.order=Math.max(-1,...next.filter(x=>!x.parentId&&x.id!==moving.id).map(x=>x.order))+1}else{const target=next.find(x=>x.id===String(e.over!.id));if(!target||target.id===active.id)return;const moving=next.find(x=>x.id===active.id)!;if(moving.parentId===target.parentId){const siblings=next.filter(x=>x.parentId===moving.parentId).sort((a,b)=>a.order-b.order);const reordered=arrayMove(siblings,siblings.findIndex(x=>x.id===moving.id),siblings.findIndex(x=>x.id===target.id));reordered.forEach((x,i)=>{const item=next.find(y=>y.id===x.id)!;item.order=i})}else{moving.parentId=target.id;moving.order=Math.max(-1,...next.filter(x=>x.parentId===target.id).map(x=>x.order))+1}}
   const r=await fetch("/api/menus/reorder",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:next.map(x=>({id:x.id,parentId:x.parentId,order:x.order}))})});const j=await r.json();setMessage(r.ok?"Susunan menu disimpan":j.error);if(r.ok)setItems(next)
 }
 const flat=flatten(items);
 const selectedPage=pages.find(page=>page.slug===form.pageSlug);
 return <div className="space-y-[21px]">
  {message&&<Card role="status" as="p">{message}</Card>}
  <Card onSubmit={save} className="grid gap-[13px] md:grid-cols-2" as="form">
   <h2 className="h-gold-3 md:col-span-2">{editId?"Edit Menu":"Tambah Menu"}</h2>
   <label>Label<Input required minLength={2} value={form.label} onChange={e=>setForm({...form,label:e.target.value})} className="mt-[4px] w-full border rounded-[13px] p-[13px]"/></label>
   <label>Target halaman statis<NativeSelect value={form.pageSlug} onChange={e=>setForm({...form,pageSlug:e.target.value,anchorId:"",href:e.target.value?`/${e.target.value}`:form.href==="#"?"":form.href})} className="mt-[4px] w-full border rounded-[13px] p-[13px]"><option value="">Tautan manual</option>{pages.map(p=><option key={p.id} value={p.slug}>{p.title} (/{p.slug})</option>)}</NativeSelect></label>
   {form.pageSlug&&selectedPage&&<div className="grid gap-[6px]"><label>Anchor halaman<NativeSelect value={form.anchorId} onChange={e=>setForm({...form,anchorId:e.target.value})} className="mt-[4px] w-full border rounded-[13px] p-[13px]"><option value="">Awal halaman</option>{selectedPage.anchors.map(anchor=><option key={anchor} value={anchor}>#{anchor}</option>)}</NativeSelect></label>{!selectedPage.anchors.length&&<small className="text-slate-500">Tambahkan Anchor ID pada elemen di Builder terlebih dahulu.</small>}</div>}
   <label>Tautan<Input value={form.pageSlug?`/${form.pageSlug}${form.anchorId?`#${form.anchorId}`:""}`:form.href} onChange={e=>setForm({...form,href:e.target.value,pageSlug:"",anchorId:""})} placeholder="/profil atau https://..." className="mt-[4px] w-full border rounded-[13px] p-[13px]"/></label>
   <label>Parent<NativeSelect value={form.parentId} onChange={e=>setForm({...form,parentId:e.target.value})} className="mt-[4px] w-full border rounded-[13px] p-[13px]"><option value="">Menu utama</option>{flat.filter(x=>x.id!==editId&&depthOf(x,items)<3).map(x=><option key={x.id} value={x.id}>{"— ".repeat(depthOf(x,items)-1)}{x.label}</option>)}</NativeSelect></label>
   <label>Target link<NativeSelect value={form.target} onChange={e=>setForm({...form,target:e.target.value as "_self"|"_blank"})} className="mt-[4px] w-full border rounded-[13px] p-[13px]"><option value="_self">Tab yang sama</option><option value="_blank">Tab baru</option></NativeSelect></label>
   <label className="flex items-center gap-[8px]"><Input type="checkbox" checked={form.visible} onChange={e=>setForm({...form,visible:e.target.checked})}/>Tampilkan di publik</label>
   <div className="flex gap-[13px] md:col-span-2"><Button variant="default">Simpan Menu</Button>{editId&&<Button type="button" onClick={()=>{setEditId("");setForm(EMPTY)}} variant="outline">Batal</Button>}</div>
  </Card>
  <Card className="space-y-[13px]" as="section"><h2 className="h-gold-3">Susunan Navigasi</h2><p className="text-[14px] text-slate-500">Seret menu ke menu lain untuk membuat submenu; gunakan area level utama untuk melepas parent.</p><DndContext onDragEnd={dragEnd}><SortableContext items={flat.map(x=>x.id)} strategy={verticalListSortingStrategy}><div className="space-y-[8px]">{flat.map(x=><DragRow key={x.id} item={x} depth={depthOf(x,items)} onEdit={()=>edit(x)} onVisible={()=>visible(x)} onDelete={()=>remove(x)}/>)}</div></SortableContext><RootDrop/></DndContext>{!items.length&&<p className="text-slate-500">Belum ada menu.</p>}</Card>
 </div>;
}
