"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const element = e.currentTarget;
    const form = new FormData(element);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    const data = await res.json();
    setMessage(data.message || data.error || "Pesan gagal dikirim");
    setBusy(false);
    if (res.ok) element.reset();
  }

  return (
    <Card className="p-5 sm:p-6">
      <form onSubmit={submit} className="space-y-4">
        <label className="block space-y-1.5 text-sm font-medium">Nama<Input required name="name" maxLength={100} /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5 text-sm font-medium">Email<Input type="email" name="email" /></label>
          <label className="block space-y-1.5 text-sm font-medium">Telepon<Input name="phone" maxLength={30} /></label>
        </div>
        <label className="block space-y-1.5 text-sm font-medium">Subjek<Input required name="subject" maxLength={150} /></label>
        <label className="block space-y-1.5 text-sm font-medium">Pesan<Textarea required name="body" minLength={5} maxLength={5000} rows={6} /></label>
        <label className="absolute -left-[10000px]" aria-hidden="true">Website<Input name="website" tabIndex={-1} autoComplete="off" /></label>
        <Button disabled={busy}>{busy ? "Mengirim…" : "Kirim Pesan"}</Button>
        {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
      </form>
    </Card>
  );
}
