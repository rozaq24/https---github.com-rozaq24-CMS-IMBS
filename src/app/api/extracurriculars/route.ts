import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { extracurricularSchema } from "@/lib/validators";
const ROLES = ["SUPERADMIN", "OPERATOR_BERITA"];
export async function GET() { const { error } = await requireRole(ROLES); if (error) return error; return NextResponse.json({ data: await db.extracurricular.findMany({ orderBy: { name: "asc" } }) }); }
export async function POST(req: Request) {
  const { error, session } = await requireRole(ROLES); if (error) return error;
  const parsed = extracurricularSchema.safeParse(await req.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Nama ekskul wajib diisi", issues: parsed.error.flatten() }, { status: 400 });
  try { const item = await db.extracurricular.create({ data: parsed.data }); await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "EXTRA_CREATE", detail: item.name }); return NextResponse.json(item, { status: 201 }); }
  catch (e) { const duplicate = (e as { code?: string })?.code === "P2002"; return NextResponse.json({ error: duplicate ? "Nama ekskul sudah digunakan" : "Ekskul gagal disimpan" }, { status: duplicate ? 409 : 400 }); }
}
