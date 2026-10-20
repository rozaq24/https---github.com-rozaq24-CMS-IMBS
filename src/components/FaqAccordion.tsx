"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FAQ } from "@/lib/faq";

export function FaqAccordion({ limit }: { limit?: number }) {
  const [query, setQuery] = useState("");
  const [allItems, setAllItems] = useState(FAQ);
  useEffect(() => { fetch("/api/faq").then((r) => r.json()).then((data) => { if (Array.isArray(data.items)) setAllItems(data.items); }).catch(() => undefined); }, []);
  const items = useMemo(() => allItems.filter((item) => `${item.question} ${item.answer}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, limit), [allItems, query, limit]);
  return <section className="space-y-[13px]"><label className="block">Cari pertanyaan<input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Contoh: beasiswa" className="mt-[4px] w-full rounded-[13px] border p-[13px]" /></label><div className="space-y-[8px]">{items.map((item) => <details key={item.question} className="card !p-[13px]"><summary className="cursor-pointer font-semibold">{item.question}</summary><p className="mt-[8px]">{item.answer}</p><Link className="mt-[8px] inline-block underline" href={item.href}>Informasi terkait</Link></details>)}{!items.length && <p role="status" className="card">Tidak ada jawaban yang cocok.</p>}</div></section>;
}
