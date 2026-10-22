"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Comment = { id: string; name: string; body: string; createdAt: string };

export function Comments({ postId }: { postId: string }) {
  const [items, setItems] = useState<Comment[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}`);
    const result = await response.json();
    if (response.ok) setItems(result.data);
  }

  useEffect(() => { load(); }, [postId]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, postId }),
    });
    const result = await response.json();
    setMessage(result.message || result.error || "Komentar gagal dikirim");
    if (response.ok) form.reset();
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Komentar</h2>
      {items.map((comment) => (
        <Card key={comment.id} className="p-5">
          <strong>{comment.name}</strong>
          <p className="mt-2 text-muted-foreground">{comment.body}</p>
        </Card>
      ))}
      <Card className="p-5 sm:p-6">
        <form onSubmit={submit} className="space-y-4">
          <h3 className="text-lg font-semibold">Tulis Komentar</h3>
          <label className="block space-y-1.5 text-sm font-medium">Nama<Input name="name" required maxLength={100} /></label>
          <label className="block space-y-1.5 text-sm font-medium">Email (opsional)<Input name="email" type="email" /></label>
          <label className="block space-y-1.5 text-sm font-medium">Komentar<Textarea name="body" required minLength={3} maxLength={2000} rows={4} /></label>
          <label className="absolute -left-[10000px]" aria-hidden="true">Website<Input name="website" tabIndex={-1} autoComplete="off" /></label>
          <Button>Kirim Komentar</Button>
          {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
        </form>
      </Card>
    </section>
  );
}
