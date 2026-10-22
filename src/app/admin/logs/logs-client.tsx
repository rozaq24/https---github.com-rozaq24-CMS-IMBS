"use client";
import { useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Card } from "@/components/ui/card";

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
    <Card className="">
      <div className="flex gap-[13px] flex-wrap mb-[13px]">
        <NativeSelect className="border rounded-[13px] px-[13px] py-[8px]" value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="">Semua aksi</option>{actions.map((a) => <option key={a} value={a}>{a}</option>)}
        </NativeSelect>
        <Input className="border rounded-[13px] px-[13px] py-[8px]" placeholder="Cari aksi/detail/IP..." value={q} onChange={(e) => setQ(e.target.value)} />
        <Input className="border rounded-[13px] px-[13px] py-[8px]" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <Input className="border rounded-[13px] px-[13px] py-[8px]" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <Button className="!py-[8px]" onClick={load} variant="outline">Filter</Button>
        <span className="text-[13px] text-slate-500 self-center">Total: {total}</span>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Waktu</TableHead><TableHead>User</TableHead><TableHead>Aksi</TableHead><TableHead>IP</TableHead><TableHead>MAC/Device</TableHead><TableHead>Detail</TableHead></TableRow></TableHeader>
          <TableBody>
            {data.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="text-[13px] whitespace-nowrap">{new Date(l.createdAt).toLocaleString("id-ID")}</TableCell>
                <TableCell>{l.user ? `${l.user.name} (${l.user.role})` : "-"}</TableCell>
                <TableCell><span className="text-[13px] font-bold bg-slate-100 rounded-[8px] px-[8px] py-[4px]">{l.action}</span></TableCell>
                <TableCell className="text-[13px]">{l.ip || "-"}</TableCell>
                <TableCell className="text-[13px]">{l.mac || "-"}</TableCell>
                <TableCell className="text-[13px]">{l.detail || "-"}</TableCell>
              </TableRow>
            ))}
            {data.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-slate-500">Belum ada log.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
