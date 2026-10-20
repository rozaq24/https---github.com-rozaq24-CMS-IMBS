import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { studentSchema } from "@/lib/validators";

const ROLES = ["SUPERADMIN", "OPERATOR_SPMB"];
const PAGE_SIZE = 25;

export async function GET(req: Request) {
  const { error } = await requireRole(ROLES);
  if (error) return error;
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() || "";
  const classId = url.searchParams.get("classId") || undefined;
  const status = url.searchParams.get("status") || undefined;
  const page = Math.max(1, Number(url.searchParams.get("page") || 1) || 1);
  const where = { ...(classId ? { classId } : {}), ...(status ? { status } : {}), ...(q ? { OR: [{ name: { contains: q } }, { nis: { contains: q } }, { nisn: { contains: q } }] } : {}) };
  const [total, data, classes] = await Promise.all([
    db.student.count({ where }),
    db.student.findMany({ where, include: { class: { select: { id: true, name: true, year: true } } }, orderBy: { name: "asc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    db.classRoom.findMany({ select: { id: true, name: true, year: true }, orderBy: [{ year: "desc" }, { name: "asc" }] }),
  ]);
  return NextResponse.json({ data, total, page, pageSize: PAGE_SIZE, classes });
}

export async function POST(req: Request) {
  const { error, session } = await requireRole(ROLES);
  if (error) return error;
  const body = await req.json().catch(() => null);
  const parsed = studentSchema.safeParse(body);
  if (!parsed.success || (parsed.data?.status === "AKTIF" && !parsed.data.classId)) return NextResponse.json({ error: "NIS, nama, dan kelas siswa aktif wajib diisi", issues: parsed.success ? undefined : parsed.error.flatten() }, { status: 400 });
  try {
    const student = await db.student.create({ data: parsed.data });
    await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "STUDENT_CREATE", detail: student.nis });
    return NextResponse.json(student, { status: 201 });
  } catch (cause) {
    const duplicate = (cause as { code?: string })?.code === "P2002";
    return NextResponse.json({ error: duplicate ? "NIS sudah digunakan" : "Data siswa gagal disimpan" }, { status: duplicate ? 409 : 400 });
  }
}
