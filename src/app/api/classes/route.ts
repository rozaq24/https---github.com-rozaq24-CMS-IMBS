import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { classroomSchema } from "@/lib/validators";

const ROLES = ["SUPERADMIN", "OPERATOR_SPMB"];

export async function GET() {
  const { error } = await requireRole(ROLES);
  if (error) return error;
  const [classes, teachers, majors] = await Promise.all([
    db.classRoom.findMany({ include: { major: true, homeroomTeacher: { select: { id: true, name: true } }, _count: { select: { students: true } } }, orderBy: [{ year: "desc" }, { name: "asc" }] }),
    db.teacher.findMany({ where: { active: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    db.major.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  return NextResponse.json({ data: classes, teachers, majors });
}

export async function POST(req: Request) {
  const { error, session } = await requireRole(ROLES);
  if (error) return error;
  const body = await req.json().catch(() => null);
  const parsed = classroomSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Nama kelas dan tahun wajib diisi", issues: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  try {
    const classroom = await db.classRoom.create({ data });
    await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "CLASS_CREATE", detail: classroom.name });
    return NextResponse.json(classroom, { status: 201 });
  } catch (cause) {
    const duplicate = (cause as { code?: string })?.code === "P2002";
    return NextResponse.json({ error: duplicate ? "Nama kelas sudah digunakan" : "Kelas gagal disimpan" }, { status: duplicate ? 409 : 400 });
  }
}
