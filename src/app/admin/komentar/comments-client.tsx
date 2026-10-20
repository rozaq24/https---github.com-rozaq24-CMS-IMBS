"use client";

import { useEffect, useState } from "react";
type Comment = { id: string; name: string; body: string; approved: boolean; createdAt: string; post: { title: string; slug: string } };
export function CommentsClient() {
  const [items, setItems] = useState<Comment[]>([]); const [message, setMessage] = useState("");
  async function load() { const r = await fetch("/api/comments?admin=1"); const j = await r.json(); if (r.ok) setItems(j.data); else setMessage(j.error); }
  useEffect(() => { load(); }, []);
  async function moderate(id: string, approved?: boolean) { const r = approved === undefined ? await fetch(`/api/comments/${id}`, { method: "DELETE" }) : await fetch(`/api/comments/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ approved }) }); const j = await r.json(); setMessage(r.ok ? (approved ? "Komentar disetujui" : approved === false ? "Komentar ditolak" : "Komentar dihapus") : j.error); if (r.ok) load(); }
  return <div className="space-y-[13px]">{message && <p role="status" className="card">{message}</p>}{items.map((c) => <article key={c.id} className="card"><div className="flex justify-between gap-[13px]"><strong>{c.name}</strong><span className="text-[13px]">{c.approved ? "Disetujui" : "Menunggu"}</span></div><p className="text-[13px] mt-[4px]">Di berita: <a className="underline" href={`/berita/${c.post.slug}`} target="_blank">{c.post.title}</a></p><p className="my-[13px]">{c.body}</p><div className="flex gap-[13px]">{!c.approved && <button onClick={() => moderate(c.id, true)} className="underline">Setujui</button>}{c.approved && <button onClick={() => moderate(c.id, false)} className="underline">Tarik</button>}<button onClick={() => moderate(c.id)} className="underline text-rose-600">Hapus</button></div></article>)}{!items.length && <p className="card text-slate-500">Belum ada komentar.</p>}</div>;
}
