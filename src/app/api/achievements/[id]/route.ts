import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { achievementSchema } from "@/lib/validators";
const ROLES = ["SUPERADMIN", "OPERATOR_BERITA", "OPERATOR_SPMB"];
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES); if (error) return error;
  const parsed = achievementSchema.safeParse(await req.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Pilih tepat satu siswa atau guru dan isi data prestasi" }, { status: 400 });
  const item = await db.achievement.update({ where: { id: params.id }, data: parsed.data }).catch(() => null); if (!item) return NextResponse.json({ error: "Prestasi tidak ditemukan" }, { status: 404 });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "ACHIEVEMENT_UPDATE", detail: item.title }); return NextResponse.json(item);
}
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES); if (error) return error;
  const item = await db.achievement.findUnique({ where: { id: params.id } }); if (!item) return NextResponse.json({ error: "Prestasi tidak ditemukan" }, { status: 404 });
  await db.achievement.delete({ where: { id: params.id } }); await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "ACHIEVEMENT_DELETE", detail: item.title }); return NextResponse.json({ ok: true });
}
