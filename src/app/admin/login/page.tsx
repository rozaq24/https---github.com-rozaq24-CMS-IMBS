"use client";
import { signIn } from "next-auth/react";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("admin@sekolah.sch.id");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/admin";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    // MAC address: browser tidak bisa baca MAC asli; kirim penanda device sebagai gantinya
    let mac = localStorage.getItem("device-id");
    if (!mac) {
      mac = `web-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      localStorage.setItem("device-id", mac);
    }
    const res = await signIn("credentials", { email, password, mac, redirect: false, callbackUrl });
    setLoading(false);
    if (res?.error) {
      setErr("Email atau password salah, atau akun dinonaktifkan. Coba lagi.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card w-full max-w-[420px] space-y-[13px]">
      <p className="text-[13px] uppercase tracking-widest text-slate-500">CMS IMBS • Admin</p>
      <h1 className="h-gold-2">Masuk <span className="grad-text">Dashboard</span></h1>
      {params.get("callbackUrl") && <p className="text-[13px] text-slate-500">Silakan login dulu untuk membuka {params.get("callbackUrl")}</p>}
      <label className="block">
        <span className="text-[13px] font-semibold">Email</span>
        <input className="mt-[8px] w-full border rounded-[13px] px-[13px] py-[13px]" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
      </label>
      <label className="block">
        <span className="text-[13px] font-semibold">Password</span>
        <input className="mt-[8px] w-full border rounded-[13px] px-[13px] py-[13px]" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
      </label>
      {err && <p className="text-[14px] text-rose-600 bg-rose-50 border border-rose-200 rounded-[13px] p-[13px]">{err}</p>}
      <button className="btn-primary w-full" disabled={loading}>{loading ? "Memeriksa..." : "Masuk"}</button>
      <p className="text-[13px] text-slate-500">Demo: <b>admin@sekolah.sch.id / ImbsDemo!2026</b> (jalankan <code>npx prisma db seed</code> dulu).</p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-[21px]">
      <Suspense fallback={<p className="card">Memuat form login...</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}

