import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { classroomSchema } from "@/lib/validators";

const ROLES = ["SUPERADMIN", "OPERATOR_SPMB"];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES);
  if (error) return error;
  const body = await req.json().catch(() => null);
  const parsed = classroomSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Data kelas tidak valid", issues: parsed.error.flatten() }, { status: 400 });
  try {
    const classroom = await db.classRoom.update({ where: { id: params.id }, data: parsed.data });
    await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "CLASS_UPDATE", detail: classroom.name });
    return NextResponse.json(classroom);
  } catch (cause) {
    const code = (cause as { code?: string })?.code;
    return NextResponse.json({ error: code === "P2002" ? "Nama kelas sudah digunakan" : code === "P2025" ? "Kelas tidak ditemukan" : "Kelas gagal diperbarui" }, { status: code === "P2002" ? 409 : code === "P2025" ? 404 : 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES);
  if (error) return error;
  const classroom = await db.classRoom.findUnique({ where: { id: params.id } });
  if (!classroom) return NextResponse.json({ error: "Kelas tidak ditemukan" }, { status: 404 });
  try {
    await db.classRoom.delete({ where: { id: params.id } });
  } catch {
    return NextResponse.json({ error: "Kelas masih memiliki siswa; pindahkan siswa terlebih dahulu" }, { status: 409 });
  }
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "CLASS_DELETE", detail: classroom.name });
  return NextResponse.json({ ok: true });
}
