import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { teacherSchema } from "@/lib/validators";

const ROLES = ["SUPERADMIN", "OPERATOR_BERITA"];

export async function GET() {
  const { error } = await requireRole(ROLES);
  if (error) return error;
  const data = await db.teacher.findMany({ orderBy: [{ active: "desc" }, { name: "asc" }] });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const { error, session } = await requireRole(ROLES);
  if (error) return error;
  const body = await req.json().catch(() => null);
  const parsed = teacherSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validasi guru gagal", issues: parsed.error.flatten() }, { status: 400 });
  try {
    const teacher = await db.teacher.create({ data: parsed.data });
    await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "TEACHER_CREATE", detail: teacher.nip });
    return NextResponse.json(teacher, { status: 201 });
  } catch (cause) {
    const duplicate = (cause as { code?: string })?.code === "P2002";
    return NextResponse.json({ error: duplicate ? "NIP sudah digunakan" : "Data guru gagal disimpan" }, { status: duplicate ? 409 : 500 });
  }
}
