"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";

type Period = {
  id: string;
  name: string;
  year: string;
  quota: number;
  openAt: string;
  closeAt: string;
  terms: string | null;
  _count: { applicants: number };
};

export function SpmbForm() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [periodId, setPeriodId] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", nik: "", email: "", phone: "", origin: "", parentName: "" });

  useEffect(() => {
    fetch("/api/spmb/periods")
      .then((response) => response.json())
      .then((result) => setPeriods(result.data || []))
      .catch(() => setMessage("Periode gagal dimuat."));
  }, []);

  const period = periods.find((item) => item.id === periodId);
  const open = Boolean(
    period && Date.now() >= Date.parse(period.openAt) && Date.now() <= Date.parse(period.closeAt)
    && period._count.applicants < period.quota,
  );

  function updateField(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const data = new FormData(e.currentTarget);
    data.set("periodId", periodId);
    Object.entries(form).forEach(([key, value]) => data.set(key, value));
    const response = await fetch("/api/spmb/applicants", { method: "POST", body: data });
    const result = await response.json();
    setBusy(false);
    if (response.ok) {
      setCode(result.code);
      setStep(3);
    } else {
      setMessage(result.error || "Pendaftaran gagal.");
    }
  }

  return (
    <section className="space-y-5">
      {message && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{message}</p>}

      {step === 3 ? (
        <Card className="space-y-3 p-5 sm:p-6">
          <h2 className="text-xl font-semibold">Pendaftaran berhasil</h2>
          <p className="text-sm text-muted-foreground">Simpan kode ini untuk memeriksa status:</p>
          <strong className="block text-2xl" aria-label="Kode pendaftaran">{code}</strong>
          <Button asChild><a href={`/spmb/status?code=${encodeURIComponent(code)}`}>Cek status</a></Button>
        </Card>
      ) : (
        <>
          <Card className="p-5 sm:p-6">
            <label className="block space-y-2 text-sm font-medium">
              Periode pendaftaran
              <NativeSelect
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={periodId}
                onChange={(event) => { setPeriodId(event.target.value); setStep(1); }}
              >
                <option value="">Pilih periode</option>
                {periods.map((item) => <option key={item.id} value={item.id}>{item.name} {item.year}</option>)}
              </NativeSelect>
            </label>
            {period && (
              <div className="mt-4 space-y-2 text-sm">
                <p>Kuota {period._count.applicants}/{period.quota} · {new Date(period.openAt).toLocaleDateString("id-ID")}–{new Date(period.closeAt).toLocaleDateString("id-ID")}</p>
                {period.terms && <p className="whitespace-pre-wrap text-muted-foreground">{period.terms}</p>}
                {!open && <p role="status" className="font-medium text-destructive">Pendaftaran periode ini sedang tutup atau kuotanya terpenuhi.</p>}
              </div>
            )}
          </Card>

          {open && (
            <Card className="p-5 sm:p-6">
              <form onSubmit={submit} className="space-y-4">
                {step === 1 ? (
                  <>
                    <h2 className="text-lg font-semibold">Langkah 1: Biodata</h2>
                    {([
                      ["name", "Nama calon murid"], ["nik", "NIK (16 digit)"], ["email", "Email"],
                      ["phone", "Nomor telepon"], ["origin", "Asal sekolah"], ["parentName", "Nama orang tua/wali"],
                    ] as const).map(([key, label]) => (
                      <label key={key} className="block space-y-1.5 text-sm font-medium">
                        {label}
                        <Input
                          required
                          name={key}
                          value={form[key]}
                          onChange={(event) => updateField(key, event.target.value)}
                          type={key === "email" ? "email" : "text"}
                          inputMode={key === "nik" || key === "phone" ? "numeric" : undefined}
                          maxLength={key === "nik" ? 16 : undefined}
                        />
                      </label>
                    ))}
                    <Button type="button" onClick={(event) => { if (event.currentTarget.closest("form")?.reportValidity()) setStep(2); }}>
                      Lanjut ke berkas
                    </Button>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold">Langkah 2: Berkas</h2>
                    <p className="text-sm text-muted-foreground">Unggah berkas yang tersedia (PDF/JPG, maks. 8 MB per berkas). Berkas yang kurang dapat dilengkapi melalui operator.</p>
                    {(["document1", "document2", "document3"] as const).map((key, index) => (
                      <label key={key} className="block space-y-1.5 text-sm font-medium">
                        Berkas {index + 1}
                        <Input name={key} type="file" accept="application/pdf,image/jpeg" />
                      </label>
                    ))}
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" onClick={() => setStep(1)}>Kembali</Button>
                      <Button disabled={busy}>{busy ? "Mengirim…" : "Kirim Pendaftaran"}</Button>
                    </div>
                  </>
                )}
              </form>
            </Card>
          )}
        </>
      )}
    </section>
  );
}
