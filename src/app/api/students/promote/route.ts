import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";

const ROLES = ["SUPERADMIN", "OPERATOR_SPMB"];

export async function POST(req: Request) {
  const { error, session } = await requireRole(ROLES);
  if (error) return error;
  const body = await req.json().catch(() => null);
  if (!body || typeof body.fromClassId !== "string" || !["PROMOTE", "GRADUATE", "TRANSFER"].includes(body.action)) return NextResponse.json({ error: "Kelas asal dan tindakan wajib dipilih" }, { status: 400 });
  const source = await db.classRoom.findUnique({ where: { id: body.fromClassId } });
  if (!source) return NextResponse.json({ error: "Kelas asal tidak ditemukan" }, { status: 404 });
  let data: { classId?: string | null; year?: string; status?: string };
  if (body.action === "PROMOTE") {
    if (typeof body.toClassId !== "string" || body.toClassId === source.id) return NextResponse.json({ error: "Pilih kelas tujuan yang berbeda" }, { status: 400 });
    const target = await db.classRoom.findUnique({ where: { id: body.toClassId } });
    if (!target) return NextResponse.json({ error: "Kelas tujuan tidak ditemukan" }, { status: 404 });
    data = { classId: target.id, year: target.year, status: "AKTIF" };
  } else if (body.action === "GRADUATE") {
    data = { classId: null, status: "LULUS", year: typeof body.year === "string" && body.year.trim() ? body.year.trim().slice(0, 20) : source.year };
  } else {
    if (body.status !== "PINDAH" && body.status !== "KELUAR") return NextResponse.json({ error: "Status mutasi harus PINDAH atau KELUAR" }, { status: 400 });
    data = { classId: null, status: body.status };
  }
  const result = await db.$transaction((tx) => tx.student.updateMany({ where: { classId: source.id, status: "AKTIF" }, data }));
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: `STUDENT_${body.action}`, detail: `${source.name}: ${result.count} siswa` });
  return NextResponse.json({ count: result.count, message: `${result.count} siswa diproses` });
}
