import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { teacherSchema } from "@/lib/validators";

const ROLES = ["SUPERADMIN", "OPERATOR_BERITA"];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES);
  if (error) return error;
  const body = await req.json().catch(() => null);
  const parsed = teacherSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validasi guru gagal", issues: parsed.error.flatten() }, { status: 400 });
  const target = await db.teacher.findUnique({ where: { id: params.id }, select: { id: true } });
  if (!target) return NextResponse.json({ error: "Guru tidak ditemukan" }, { status: 404 });
  try {
    const teacher = await db.teacher.update({ where: { id: params.id }, data: parsed.data });
    await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "TEACHER_UPDATE", detail: teacher.nip });
    return NextResponse.json(teacher);
  } catch (cause) {
    const duplicate = (cause as { code?: string })?.code === "P2002";
    return NextResponse.json({ error: duplicate ? "NIP sudah digunakan" : "Data guru gagal diperbarui" }, { status: duplicate ? 409 : 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES);
  if (error) return error;
  const teacher = await db.teacher.findUnique({ where: { id: params.id } });
  if (!teacher) return NextResponse.json({ error: "Guru tidak ditemukan" }, { status: 404 });
  try {
    await db.teacher.delete({ where: { id: params.id } });
  } catch {
    return NextResponse.json({ error: "Guru masih terhubung ke data wali kelas; nonaktifkan bila tidak dipakai" }, { status: 409 });
  }
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "TEACHER_DELETE", detail: teacher.nip });
  return NextResponse.json({ ok: true });
}
