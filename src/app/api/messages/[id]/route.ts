import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";

const ROLES = ["SUPERADMIN", "OPERATOR_BERITA"];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES);
  if (error) return error;
  const body = await req.json().catch(() => null);
  if (!body || (body.read !== undefined && typeof body.read !== "boolean") || (body.replied !== undefined && typeof body.replied !== "boolean") || (body.read === undefined && body.replied === undefined)) return NextResponse.json({ error: "Status pesan tidak valid" }, { status: 400 });
  const message = await db.message.update({ where: { id: params.id }, data: { ...(body.read !== undefined ? { read: body.read } : {}), ...(body.replied !== undefined ? { replied: body.replied } : {}) } }).catch(() => null);
  if (!message) return NextResponse.json({ error: "Pesan tidak ditemukan" }, { status: 404 });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "MESSAGE_UPDATE", detail: params.id });
  return NextResponse.json(message);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES);
  if (error) return error;
  const message = await db.message.findUnique({ where: { id: params.id } });
  if (!message) return NextResponse.json({ error: "Pesan tidak ditemukan" }, { status: 404 });
  await db.message.delete({ where: { id: params.id } });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "MESSAGE_DELETE", detail: params.id });
  return NextResponse.json({ ok: true });
}
