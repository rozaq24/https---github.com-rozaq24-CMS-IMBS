import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(["SUPERADMIN", "OPERATOR_BERITA"]);
  if (error) return error;
  const photo = await db.photo.findUnique({ where: { id: params.id } });
  if (!photo) return NextResponse.json({ error: "Foto tidak ditemukan" }, { status: 404 });
  await db.photo.delete({ where: { id: params.id } });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "PHOTO_DELETE", detail: photo.url });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(["SUPERADMIN", "OPERATOR_BERITA"]);
  if (error) return error;
  const body = await req.json().catch(() => null);
  if (typeof body?.caption !== "string" || body.caption.length > 250) return NextResponse.json({ error: "Keterangan maksimal 250 karakter" }, { status: 400 });
  const photo = await db.photo.update({ where: { id: params.id }, data: { caption: body.caption.trim() || null } }).catch(() => null);
  if (!photo) return NextResponse.json({ error: "Foto tidak ditemukan" }, { status: 404 });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "PHOTO_UPDATE", detail: photo.url });
  return NextResponse.json(photo);
}
