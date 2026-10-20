import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { studentSchema } from "@/lib/validators";

const ROLES = ["SUPERADMIN", "OPERATOR_SPMB"];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES);
  if (error) return error;
  const body = await req.json().catch(() => null);
  const parsed = studentSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Data siswa tidak valid", issues: parsed.error.flatten() }, { status: 400 });
  if ((parsed.data.status ?? "AKTIF") === "AKTIF" && parsed.data.classId === null) return NextResponse.json({ error: "Siswa aktif harus berada di kelas" }, { status: 400 });
  try {
    const student = await db.student.update({ where: { id: params.id }, data: parsed.data });
    await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "STUDENT_UPDATE", detail: student.nis });
    return NextResponse.json(student);
  } catch (cause) {
    const code = (cause as { code?: string })?.code;
    return NextResponse.json({ error: code === "P2002" ? "NIS sudah digunakan" : code === "P2025" ? "Siswa tidak ditemukan" : "Data siswa gagal diperbarui" }, { status: code === "P2002" ? 409 : code === "P2025" ? 404 : 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES);
  if (error) return error;
  const student = await db.student.findUnique({ where: { id: params.id } });
  if (!student) return NextResponse.json({ error: "Siswa tidak ditemukan" }, { status: 404 });
  await db.student.delete({ where: { id: params.id } });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "STUDENT_DELETE", detail: student.nis });
  return NextResponse.json({ ok: true });
}
