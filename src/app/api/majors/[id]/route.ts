import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { majorSchema } from "@/lib/validators";
const ROLES = ["SUPERADMIN", "OPERATOR_BERITA"];
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES); if (error) return error;
  const parsed = majorSchema.partial().safeParse(await req.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Data jurusan tidak valid" }, { status: 400 });
  try { const item = await db.major.update({ where: { id: params.id }, data: parsed.data }); await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "MAJOR_UPDATE", detail: item.code }); return NextResponse.json(item); }
  catch (e) { const code = (e as { code?: string })?.code; return NextResponse.json({ error: code === "P2002" ? "Kode atau nama jurusan sudah dipakai" : "Jurusan tidak ditemukan" }, { status: code === "P2002" ? 409 : 404 }); }
}
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES); if (error) return error;
  const item = await db.major.findUnique({ where: { id: params.id } }); if (!item) return NextResponse.json({ error: "Jurusan tidak ditemukan" }, { status: 404 });
  try { await db.major.delete({ where: { id: params.id } }); } catch { return NextResponse.json({ error: "Jurusan masih dipakai oleh kelas" }, { status: 409 }); }
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "MAJOR_DELETE", detail: item.code }); return NextResponse.json({ ok: true });
}
