import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";

const ROLES = ["SUPERADMIN", "OPERATOR_BERITA"];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES);
  if (error) return error;
  const body = await req.json().catch(() => null);
  if (typeof body?.approved !== "boolean") return NextResponse.json({ error: "Status moderasi tidak valid" }, { status: 400 });
  const comment = await db.comment.update({ where: { id: params.id }, data: { approved: body.approved, moderatedBy: session!.user.id } }).catch(() => null);
  if (!comment) return NextResponse.json({ error: "Komentar tidak ditemukan" }, { status: 404 });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: body.approved ? "COMMENT_APPROVE" : "COMMENT_REJECT", detail: params.id });
  return NextResponse.json(comment);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES);
  if (error) return error;
  const comment = await db.comment.findUnique({ where: { id: params.id } });
  if (!comment) return NextResponse.json({ error: "Komentar tidak ditemukan" }, { status: 404 });
  await db.comment.delete({ where: { id: params.id } });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "COMMENT_DELETE", detail: params.id });
  return NextResponse.json({ ok: true });
}
