"use client";
import { useEffect, useState } from "react";

type User = { id: string; name: string; email: string; role: string; active: boolean; lastLoginAt: string | null };
const ROLES = ["SUPERADMIN", "OPERATOR_BERITA", "OPERATOR_SPMB", "GURU", "WALI_READONLY"];

export function UsersClient() {
  const [data, setData] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "OPERATOR_BERITA" });

  async function load() {
    const r = await fetch(`/api/users?q=${encodeURIComponent(q)}&role=${role}`);
    const j = await r.json();
    if (r.ok) { setData(j.data); setTotal(j.total); } else setMsg(j.error || "Gagal memuat");
  }
  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault(); setMsg("");
    const r = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const j = await r.json();
    if (!r.ok) { setMsg(j.error || "Gagal membuat user"); return; }
    setForm({ name: "", email: "", password: "", role: "OPERATOR_BERITA" });
    setMsg(`Berhasil membuat ${j.email}`);
    load();
  }

  async function patch(id: string, body: object, label: string) {
    const r = await fetch(`/api/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json();
    if (!r.ok) { setMsg(j.error || "Gagal"); return; }
    setMsg(`${label} berhasil`);
    load();
  }

  return (
    <div className="space-y-[21px]">
      {msg && <p className="card text-[14px]">{msg}</p>}
      <form onSubmit={create} className="card grid md:grid-cols-5 gap-[13px]">
        <input className="border rounded-[13px] px-[13px] py-[13px]" placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="border rounded-[13px] px-[13px] py-[13px]" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="border rounded-[13px] px-[13px] py-[13px]" placeholder="Password min 6" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <select className="border rounded-[13px] px-[13px] py-[13px]" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <button className="btn-primary">+ Tambah User</button>
      </form>
      <div className="card">
        <div className="flex gap-[13px] flex-wrap mb-[13px]">
          <input className="border rounded-[13px] px-[13px] py-[8px]" placeholder="Cari nama/email..." value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="border rounded-[13px] px-[13px] py-[8px]" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Semua role</option>{ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <button className="btn-outline !py-[8px]" onClick={load}>Cari</button>
          <span className="text-[13px] text-slate-500 self-center">Total: {total}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead><tr><th>Nama</th><th>Email</th><th>Role</th><th>Status</th><th>Login Terakhir</th><th>Aksi</th></tr></thead>
            <tbody>
              {data.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td><td>{u.email}</td>
                  <td>
                    <select className="border rounded-[8px] px-[8px] py-[4px] text-[14px]" value={u.role} onChange={(e) => patch(u.id, { role: e.target.value }, "Ganti role")}>
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td>{u.active ? "✅ Aktif" : "⛔ Nonaktif"}</td>
                  <td className="text-[13px]">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString("id-ID") : "-"}</td>
                  <td className="whitespace-nowrap">
                    <button className="text-[14px] underline mr-[8px]" onClick={() => patch(u.id, { active: !u.active }, u.active ? "Nonaktifkan" : "Aktifkan")}>
                      {u.active ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && <tr><td colSpan={6} className="text-center text-slate-500">Belum ada data.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
