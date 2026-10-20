import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { achievementSchema } from "@/lib/validators";
const ROLES = ["SUPERADMIN", "OPERATOR_BERITA", "OPERATOR_SPMB"];
export async function GET() { const { error } = await requireRole(ROLES); if (error) return error; const [data, students, teachers] = await Promise.all([db.achievement.findMany({ include: { student: { select: { name: true } }, teacher: { select: { name: true } } }, orderBy: [{ year: "desc" }, { createdAt: "desc" }] }), db.student.findMany({ where: { status: "AKTIF" }, select: { id: true, name: true }, orderBy: { name: "asc" } }), db.teacher.findMany({ where: { active: true }, select: { id: true, name: true }, orderBy: { name: "asc" } })]); return NextResponse.json({ data, students, teachers }); }
export async function POST(req: Request) {
  const { error, session } = await requireRole(ROLES); if (error) return error;
  const parsed = achievementSchema.safeParse(await req.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Pilih siswa atau guru dan isi data prestasi", issues: parsed.error.flatten() }, { status: 400 });
  const item = await db.achievement.create({ data: parsed.data }); await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "ACHIEVEMENT_CREATE", detail: item.title }); return NextResponse.json(item, { status: 201 });
}
