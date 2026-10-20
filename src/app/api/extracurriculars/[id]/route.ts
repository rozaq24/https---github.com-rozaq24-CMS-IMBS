import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { extracurricularSchema } from "@/lib/validators";
const ROLES = ["SUPERADMIN", "OPERATOR_BERITA"];
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES); if (error) return error;
  const parsed = extracurricularSchema.partial().safeParse(await req.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Data ekskul tidak valid" }, { status: 400 });
  try { const item = await db.extracurricular.update({ where: { id: params.id }, data: parsed.data }); await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "EXTRA_UPDATE", detail: item.name }); return NextResponse.json(item); }
  catch (e) { const code = (e as { code?: string })?.code; return NextResponse.json({ error: code === "P2002" ? "Nama ekskul sudah digunakan" : "Ekskul tidak ditemukan" }, { status: code === "P2002" ? 409 : 404 }); }
}
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES); if (error) return error;
  const item = await db.extracurricular.findUnique({ where: { id: params.id } }); if (!item) return NextResponse.json({ error: "Ekskul tidak ditemukan" }, { status: 404 });
  await db.extracurricular.delete({ where: { id: params.id } }); await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "EXTRA_DELETE", detail: item.name }); return NextResponse.json({ ok: true });
}
