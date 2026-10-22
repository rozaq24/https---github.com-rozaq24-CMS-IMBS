"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
type Message = { id: string; name: string; email: string | null; phone: string | null; subject: string; body: string; read: boolean; replied: boolean; createdAt: string };
export function InboxClient() {
  const [items, setItems] = useState<Message[]>([]); const [unread, setUnread] = useState(0); const [message, setMessage] = useState("");
  async function load() { const r = await fetch("/api/messages"); const j = await r.json(); if (r.ok) { setItems(j.data); setUnread(j.unread); } else setMessage(j.error); }
  useEffect(() => { load(); }, []);
  async function update(id: string, fields: { read?: boolean; replied?: boolean }) { const r = await fetch(`/api/messages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields) }); const j = await r.json(); setMessage(r.ok ? "Status pesan diperbarui" : j.error); if (r.ok) load(); }
  async function remove(m: Message) { if (!confirm(`Hapus pesan dari ${m.name}?`)) return; const r = await fetch(`/api/messages/${m.id}`, { method: "DELETE" }); const j = await r.json(); setMessage(r.ok ? "Pesan dihapus" : j.error); if (r.ok) load(); }
  return <div className="space-y-[13px]"><Card className="">Belum dibaca: <strong>{unread}</strong></Card>{message && <p role="status">{message}</p>}{items.map((m) => <Card key={m.id} className="" as="article"><header className="flex justify-between gap-[13px]"><div><h2 className="font-bold">{m.subject}</h2><p className="text-[13px]">{m.name} · {m.email || m.phone || "Tanpa kontak"}</p></div><span>{m.read ? "Dibaca" : "Baru"}</span></header><p className="my-[13px] whitespace-pre-wrap">{m.body}</p><div className="flex gap-[13px] flex-wrap"><Button onClick={() => update(m.id, { read: !m.read })} className="underline" variant="ghost">Tandai {m.read ? "belum dibaca" : "dibaca"}</Button><Button onClick={() => update(m.id, { replied: !m.replied })} className="underline" variant="ghost">{m.replied ? "Batalkan status dibalas" : "Tandai dibalas"}</Button><Button onClick={() => remove(m)} className="underline text-rose-600" variant="ghost">Hapus</Button></div></Card>)}</div>;
}
