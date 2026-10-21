"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
type Result = { code: string; name: string; status: string; note: string | null; createdAt: string; period: { name: string; year: string } };
export default function SpmbStatusPage() {
  const [code, setCode] = useState(""); const [nik, setNik] = useState(""); const [result, setResult] = useState<Result | null>(null); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { const value = new URLSearchParams(window.location.search).get("code"); if (value) setCode(value); }, []);
  async function submit(e: React.FormEvent) { e.preventDefault(); setBusy(true); setMessage(""); const r = await fetch("/api/spmb/status", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, nik }) }); const j = await r.json(); setBusy(false); if (r.ok) setResult(j.data); else { setResult(null); setMessage(j.error); } }
  const statuses: Record<string, string> = { PENDING: "Menunggu verifikasi", VERIFIED: "Berkas terverifikasi", REJECTED: "Ditolak", ACCEPTED: "Diterima" };
  return <main className="mx-auto max-w-2xl space-y-[21px] px-[21px] py-[34px]"><h1 className="h-gold-1">Cek <span className="grad-text">Status SPMB</span></h1><Card onSubmit={submit} className="space-y-[13px]" as="form"><label className="block">Kode pendaftaran<Input required value={code} onChange={(e) => setCode(e.target.value)} className="mt-[4px] block w-full rounded-[13px] border p-[13px]" /></label><label className="block">NIK<Input required inputMode="numeric" maxLength={16} value={nik} onChange={(e) => setNik(e.target.value)} className="mt-[4px] block w-full rounded-[13px] border p-[13px]" /></label><Button disabled={busy} className="" variant="default">{busy ? "Memeriksa…" : "Periksa Status"}</Button>{message && <p role="alert">{message}</p>}</Card>{result && <Card className="space-y-[8px]" aria-live="polite" as="section"><h2 className="h-gold-3">{statuses[result.status] || result.status}</h2><p>{result.name} · {result.period.name} {result.period.year}</p>{result.note && <p>Catatan: {result.note}</p>}<p className="text-[14px] text-slate-500">Dikirim {new Date(result.createdAt).toLocaleDateString("id-ID")}</p></Card>}</main>;
}
