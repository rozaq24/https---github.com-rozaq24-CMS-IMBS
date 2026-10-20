import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { agendaSchema } from "@/lib/validators";
const ROLES = ["SUPERADMIN", "OPERATOR_BERITA"];
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES); if (error) return error;
  const parsed = agendaSchema.safeParse(await req.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Periksa judul dan waktu agenda", issues: parsed.error.flatten() }, { status: 400 });
  const v = parsed.data; const item = await db.agenda.update({ where: { id: params.id }, data: { ...v, startAt: new Date(v.startAt), endAt: v.endAt ? new Date(v.endAt) : null } }).catch(() => null);
  if (!item) return NextResponse.json({ error: "Agenda tidak ditemukan" }, { status: 404 }); await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "AGENDA_UPDATE", detail: item.title }); return NextResponse.json(item);
}
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES); if (error) return error;
  const item = await db.agenda.findUnique({ where: { id: params.id } }); if (!item) return NextResponse.json({ error: "Agenda tidak ditemukan" }, { status: 404 });
  await db.agenda.delete({ where: { id: params.id } }); await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "AGENDA_DELETE", detail: item.title }); return NextResponse.json({ ok: true });
}
