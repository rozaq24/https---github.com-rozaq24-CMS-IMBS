"use client";

import { useEffect, useState } from "react";

type Comment = { id: string; name: string; body: string; createdAt: string };
export function Comments({ postId }: { postId: string }) {
  const [items, setItems] = useState<Comment[]>([]);
  const [message, setMessage] = useState("");
  async function load() { const r = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}`); const j = await r.json(); if (r.ok) setItems(j.data); }
  useEffect(() => { load(); }, [postId]);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget; const values = Object.fromEntries(new FormData(form));
    const r = await fetch("/api/comments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, postId }) }); const j = await r.json();
    setMessage(j.message || j.error || "Komentar gagal dikirim"); if (r.ok) form.reset();
  }
  return <section className="space-y-[13px]"><h2 className="h-gold-2">Komentar</h2>{items.map((c) => <article key={c.id} className="card"><strong>{c.name}</strong><p className="mt-[8px]">{c.body}</p></article>)}
    <form onSubmit={submit} className="card space-y-[13px]"><h3 className="h-gold-3">Tulis Komentar</h3><label className="block">Nama<input name="name" required maxLength={100} className="mt-[4px] w-full border rounded-[13px] p-[13px]" /></label><label className="block">Email (opsional)<input name="email" type="email" className="mt-[4px] w-full border rounded-[13px] p-[13px]" /></label><label className="block">Komentar<textarea name="body" required minLength={3} maxLength={2000} className="mt-[4px] w-full border rounded-[13px] p-[13px]" rows={4} /></label><label className="absolute -left-[10000px]" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label><button className="btn-primary">Kirim Komentar</button>{message && <p role="status">{message}</p>}</form>
  </section>;
}
