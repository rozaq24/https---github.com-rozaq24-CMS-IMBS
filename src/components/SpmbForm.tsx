"use client";
import { useEffect, useState } from "react";

type Period = { id: string; name: string; year: string; quota: number; openAt: string; closeAt: string; terms: string | null; _count: { applicants: number } };
export function SpmbForm() {
  const [periods, setPeriods] = useState<Period[]>([]); const [periodId, setPeriodId] = useState("");
  const [step, setStep] = useState(1); const [message, setMessage] = useState(""); const [code, setCode] = useState(""); const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", nik: "", email: "", phone: "", origin: "", parentName: "" });
  useEffect(() => { fetch("/api/spmb/periods").then((r) => r.json()).then((v) => setPeriods(v.data || [])).catch(() => setMessage("Periode gagal dimuat.")); }, []);
  const now = Date.now(); const period = periods.find((p) => p.id === periodId);
  const open = Boolean(period && now >= Date.parse(period.openAt) && now <= Date.parse(period.closeAt) && period._count.applicants < period.quota);
  function set(key: keyof typeof form, value: string) { setForm((current) => ({ ...current, [key]: value })); }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMessage(""); const data = new FormData(e.currentTarget); data.set("periodId", periodId); Object.entries(form).forEach(([key, value]) => data.set(key, value));
    const response = await fetch("/api/spmb/applicants", { method: "POST", body: data }); const result = await response.json(); setBusy(false);
    if (response.ok) { setCode(result.code); setStep(3); } else setMessage(result.error || "Pendaftaran gagal.");
  }
  return <section className="space-y-[21px]">
    {message && <p role="alert" className="card">{message}</p>}
    {step === 3 ? <div className="card space-y-[13px]"><h2 className="h-gold-2">Pendaftaran berhasil</h2><p>Simpan kode ini untuk memeriksa status:</p><strong className="block text-[25px]" aria-label="Kode pendaftaran">{code}</strong><a className="btn-primary inline-flex" href={`/spmb/status?code=${encodeURIComponent(code)}`}>Cek status</a></div> : <>
      <div className="card"><label className="block font-semibold">Periode pendaftaran<select className="mt-[8px] block w-full rounded-[13px] border p-[13px]" value={periodId} onChange={(e) => { setPeriodId(e.target.value); setStep(1); }}><option value="">Pilih periode</option>{periods.map((p) => <option key={p.id} value={p.id}>{p.name} {p.year}</option>)}</select></label>{period && <div className="mt-[13px] space-y-[8px]"><p>Kuota {period._count.applicants}/{period.quota} · {new Date(period.openAt).toLocaleDateString("id-ID")}–{new Date(period.closeAt).toLocaleDateString("id-ID")}</p>{period.terms && <p className="whitespace-pre-wrap">{period.terms}</p>}{!open && <p role="status" className="font-semibold text-rose-700">Pendaftaran periode ini sedang tutup atau kuotanya terpenuhi.</p>}</div>}</div>
      {open && <form onSubmit={submit} className="card space-y-[13px]">{step === 1 ? <><h2 className="h-gold-3">Langkah 1: Biodata</h2>{([ ["name", "Nama calon murid"], ["nik", "NIK (16 digit)"], ["email", "Email"], ["phone", "Nomor telepon"], ["origin", "Asal sekolah"], ["parentName", "Nama orang tua/wali"] ] as const).map(([key, label]) => <label key={key} className="block text-[14px] font-semibold">{label}<input required name={key} value={form[key]} onChange={(e) => set(key, e.target.value)} type={key === "email" ? "email" : "text"} inputMode={key === "nik" || key === "phone" ? "numeric" : undefined} maxLength={key === "nik" ? 16 : undefined} className="mt-[4px] block w-full rounded-[13px] border p-[13px]" /></label>)}<button type="button" className="btn-primary" onClick={(e) => { if (e.currentTarget.closest("form")?.reportValidity()) setStep(2); }}>Lanjut ke berkas</button></> : <><h2 className="h-gold-3">Langkah 2: Berkas</h2><p>Unggah berkas yang tersedia (PDF/JPG, maks. 8 MB per berkas). Berkas yang kurang dapat dilengkapi melalui operator.</p>{(["document1", "document2", "document3"] as const).map((key, i) => <label key={key} className="block text-[14px] font-semibold">Berkas {i + 1}<input name={key} type="file" accept="application/pdf,image/jpeg" className="mt-[4px] block w-full" /></label>)}<div className="flex gap-[8px]"><button type="button" className="btn-outline" onClick={() => setStep(1)}>Kembali</button><button disabled={busy} className="btn-primary">{busy ? "Mengirim…" : "Kirim Pendaftaran"}</button></div></>}</form>}
    </>}
  </section>;
}
