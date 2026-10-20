"use client";

import { useState } from "react";

export function ContactForm() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMessage("");
    const element = e.currentTarget;
    const form = new FormData(element);
    const res = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
    const data = await res.json();
    setMessage(data.message || data.error || "Pesan gagal dikirim"); setBusy(false);
    if (res.ok) element.reset();
  }
  return <form onSubmit={submit} className="card space-y-[13px]">
    <label className="block">Nama<input required name="name" maxLength={100} className="mt-[4px] w-full border rounded-[13px] p-[13px]" /></label>
    <div className="grid sm:grid-cols-2 gap-[13px]"><label className="block">Email<input type="email" name="email" className="mt-[4px] w-full border rounded-[13px] p-[13px]" /></label><label className="block">Telepon<input name="phone" maxLength={30} className="mt-[4px] w-full border rounded-[13px] p-[13px]" /></label></div>
    <label className="block">Subjek<input required name="subject" maxLength={150} className="mt-[4px] w-full border rounded-[13px] p-[13px]" /></label>
    <label className="block">Pesan<textarea required name="body" minLength={5} maxLength={5000} rows={6} className="mt-[4px] w-full border rounded-[13px] p-[13px]" /></label>
    <label className="absolute -left-[10000px]" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <button disabled={busy} className="btn-primary">{busy ? "Mengirim…" : "Kirim Pesan"}</button>{message && <p role="status">{message}</p>}
  </form>;
}
