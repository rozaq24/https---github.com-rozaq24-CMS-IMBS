import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { studentSchema } from "@/lib/validators";
import { parseStudentWorkbook } from "@/lib/excel";

const ROLES = ["SUPERADMIN", "OPERATOR_SPMB"];
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(req: Request) {
  const { error, session } = await requireRole(ROLES);
  if (error) return error;
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || file.size > MAX_BYTES || !/\.(xlsx|xls)$/i.test(file.name)) return NextResponse.json({ error: "Pilih file Excel .xlsx/.xls maksimal 10 MB" }, { status: 400 });
  const [classes, students] = await Promise.all([
    db.classRoom.findMany({ select: { id: true, name: true, year: true } }),
    db.student.findMany({ select: { nis: true } }),
  ]);
  try {
    const rows = parseStudentWorkbook(Buffer.from(await file.arrayBuffer()), classes, new Set(students.map((s) => s.nis)));
    return NextResponse.json({ rows, valid: rows.filter((r) => r.data).length, invalid: rows.filter((r) => !r.data).length });
  } catch (cause) {
    return NextResponse.json({ error: cause instanceof Error ? cause.message : "File Excel tidak dapat dibaca" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  const { error, session } = await requireRole(ROLES);
  if (error) return error;
  const body = await req.json().catch(() => null);
  if (!Array.isArray(body?.rows) || body.rows.length > 5000) return NextResponse.json({ error: "Preview impor tidak valid" }, { status: 400 });
  const classes = await db.classRoom.findMany({ select: { id: true } });
  const classIds = new Set(classes.map((c) => c.id));
  const existing = await db.student.findMany({ select: { nis: true } });
  const seen = new Set(existing.map((s) => s.nis));
  const data = [];
  const errors: { row: number; message: string }[] = [];
  for (const item of body.rows) {
    if (!item?.data) continue;
    const parsed = studentSchema.safeParse(item.data);
    if (!parsed.success) { errors.push({ row: Number(item.row) || 0, message: "Data baris tidak valid" }); continue; }
    if (!parsed.data.classId || !classIds.has(parsed.data.classId)) { errors.push({ row: Number(item.row) || 0, message: "Kelas tidak ditemukan" }); continue; }
    if (seen.has(parsed.data.nis)) { errors.push({ row: Number(item.row) || 0, message: `NIS ${parsed.data.nis} duplikat` }); continue; }
    seen.add(parsed.data.nis);
    data.push(parsed.data);
  }
  if (!data.length) return NextResponse.json({ error: "Tidak ada baris valid untuk disimpan", errors }, { status: 400 });
  try {
    const result = await db.student.createMany({ data });
    await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "STUDENT_IMPORT", detail: `${result.count} siswa` });
    return NextResponse.json({ count: result.count, errors }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Impor gagal; periksa duplikasi NIS lalu buat preview baru" }, { status: 409 });
  }
}
