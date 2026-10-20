import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { allowRequest } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/auth-helpers";

export async function POST(req: Request) {
  const ip = getClientIp(req); if (!allowRequest(`spmb-status:${ip}`, 10)) return NextResponse.json({ error: "Terlalu banyak percobaan. Coba lagi sebentar." }, { status: 429 });
  const body = await req.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code.trim().toUpperCase() : "";
  const nik = typeof body?.nik === "string" ? body.nik.replace(/\D/g, "") : "";
  if (!/^IMBS-\d{4}-[A-F0-9]{8}$/.test(code) || !/^\d{16}$/.test(nik)) return NextResponse.json({ error: "Kode dan NIK tidak sesuai." }, { status: 400 });
  const applicant = await db.sPMBApplicant.findFirst({ where: { code, nik }, select: { code: true, name: true, status: true, note: true, createdAt: true, period: { select: { name: true, year: true } } } });
  if (!applicant) return NextResponse.json({ error: "Kode atau NIK tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ data: applicant });
}
