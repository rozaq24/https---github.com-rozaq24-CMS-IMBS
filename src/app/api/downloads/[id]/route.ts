import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { join } from "path";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { downloadSchema } from "@/lib/validators";
const ROLES = ["SUPERADMIN", "OPERATOR_BERITA", "OPERATOR_SPMB"];
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES); if (error) return error;
  const parsed = downloadSchema.partial().safeParse(await req.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Data file tidak valid" }, { status: 400 });
  const item = await db.downloadFile.update({ where: { id: params.id }, data: parsed.data }).catch(() => null); if (!item) return NextResponse.json({ error: "File tidak ditemukan" }, { status: 404 });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "DOWNLOAD_UPDATE", detail: item.title }); return NextResponse.json(item);
}
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES); if (error) return error;
  const item = await db.downloadFile.findUnique({ where: { id: params.id } }); if (!item) return NextResponse.json({ error: "File tidak ditemukan" }, { status: 404 });
  await db.downloadFile.delete({ where: { id: params.id } });
  if (item.fileUrl.startsWith("/uploads/downloads/")) await unlink(join(process.cwd(), "public", item.fileUrl.slice(1))).catch(() => {});
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "DOWNLOAD_DELETE", detail: item.title }); return NextResponse.json({ ok: true });
}
