import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";

const ROLES = ["SUPERADMIN", "OPERATOR_BERITA"];

export async function POST(req: Request) {
  const { error, session } = await requireRole(ROLES);
  if (error) return error;
  const body = await req.json().catch(() => null);
  if (!body || typeof body.albumId !== "string" || !Array.isArray(body.photos) || body.photos.length < 1 || body.photos.length > 20 || body.photos.some((p: any) => !p || typeof p.url !== "string" || !p.url.startsWith("/uploads/") || (p.caption !== undefined && typeof p.caption !== "string"))) {
    return NextResponse.json({ error: "Album dan 1–20 foto hasil upload wajib diisi" }, { status: 400 });
  }
  if (!(await db.album.findUnique({ where: { id: body.albumId }, select: { id: true } }))) return NextResponse.json({ error: "Album tidak ditemukan" }, { status: 404 });
  const photos = await db.photo.createMany({ data: body.photos.map((p: { url: string; caption?: string }) => ({ albumId: body.albumId, url: p.url, caption: p.caption?.slice(0, 250) || null })) });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "PHOTO_UPLOAD", detail: `${photos.count} foto ke album ${body.albumId}` });
  return NextResponse.json({ count: photos.count }, { status: 201 });
}
