"use client";
import { useEffect, useState } from "react";

type Log = { id: string; ip: string | null; mac: string | null; action: string; detail: string | null; createdAt: string; user: { name: string; email: string; role: string } | null };

export function LogsClient() {
  const [data, setData] = useState<Log[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [action, setAction] = useState("");
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  async function load() {
    const p = new URLSearchParams({ action, q, from, to });
    const r = await fetch(`/api/logs?${p.toString()}`);
    const j = await r.json();
    if (r.ok) { setData(j.data); setTotal(j.total); setActions(j.actions); }
  }
  useEffect(() => { load(); }, []);

  return (
    <div className="card">
      <div className="flex gap-[13px] flex-wrap mb-[13px]">
        <select className="border rounded-[13px] px-[13px] py-[8px]" value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="">Semua aksi</option>{actions.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <input className="border rounded-[13px] px-[13px] py-[8px]" placeholder="Cari aksi/detail/IP..." value={q} onChange={(e) => setQ(e.target.value)} />
        <input className="border rounded-[13px] px-[13px] py-[8px]" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input className="border rounded-[13px] px-[13px] py-[8px]" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <button className="btn-outline !py-[8px]" onClick={load}>Filter</button>
        <span className="text-[13px] text-slate-500 self-center">Total: {total}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="tbl">
          <thead><tr><th>Waktu</th><th>User</th><th>Aksi</th><th>IP</th><th>MAC/Device</th><th>Detail</th></tr></thead>
          <tbody>
            {data.map((l) => (
              <tr key={l.id}>
                <td className="text-[13px] whitespace-nowrap">{new Date(l.createdAt).toLocaleString("id-ID")}</td>
                <td>{l.user ? `${l.user.name} (${l.user.role})` : "-"}</td>
                <td><span className="text-[13px] font-bold bg-slate-100 rounded-[8px] px-[8px] py-[4px]">{l.action}</span></td>
                <td className="text-[13px]">{l.ip || "-"}</td>
                <td className="text-[13px]">{l.mac || "-"}</td>
                <td className="text-[13px]">{l.detail || "-"}</td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={6} className="text-center text-slate-500">Belum ada log.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
