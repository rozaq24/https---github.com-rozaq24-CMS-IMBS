import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";

const ROLES = ["SUPERADMIN", "OPERATOR_BERITA"];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES);
  if (error) return error;
  const body = await req.json().catch(() => null);
  if (!body || (body.title !== undefined && (typeof body.title !== "string" || body.title.trim().length < 2 || body.title.length > 150)) || (body.category !== undefined && (typeof body.category !== "string" || body.category.length > 80))) {
    return NextResponse.json({ error: "Judul minimal 2 karakter; kategori maksimal 80 karakter" }, { status: 400 });
  }
  const album = await db.album.update({ where: { id: params.id }, data: { ...(body.title !== undefined ? { title: body.title.trim() } : {}), ...(body.category !== undefined ? { category: body.category.trim() } : {}) } }).catch(() => null);
  if (!album) return NextResponse.json({ error: "Album tidak ditemukan" }, { status: 404 });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "ALBUM_UPDATE", detail: album.title });
  return NextResponse.json(album);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES);
  if (error) return error;
  const album = await db.album.findUnique({ where: { id: params.id } });
  if (!album) return NextResponse.json({ error: "Album tidak ditemukan" }, { status: 404 });
  await db.album.delete({ where: { id: params.id } });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "ALBUM_DELETE", detail: album.title });
  return NextResponse.json({ ok: true });
}
