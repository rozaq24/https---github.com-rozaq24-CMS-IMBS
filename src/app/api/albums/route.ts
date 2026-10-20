import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";

const ROLES = ["SUPERADMIN", "OPERATOR_BERITA"];

export async function GET() {
  const { error } = await requireRole(ROLES);
  if (error) return error;
  const data = await db.album.findMany({ include: { photos: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const { error, session } = await requireRole(ROLES);
  if (error) return error;
  const body = await req.json().catch(() => null);
  if (!body || typeof body.title !== "string" || body.title.trim().length < 2 || body.title.length > 150 || (body.category !== undefined && (typeof body.category !== "string" || body.category.length > 80))) {
    return NextResponse.json({ error: "Judul album minimal 2 karakter; kategori maksimal 80 karakter" }, { status: 400 });
  }
  const album = await db.album.create({ data: { title: body.title.trim(), category: body.category?.trim() || "Kegiatan" } });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "ALBUM_CREATE", detail: album.title });
  return NextResponse.json(album, { status: 201 });
}
