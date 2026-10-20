import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { agendaSchema } from "@/lib/validators";
const ROLES = ["SUPERADMIN", "OPERATOR_BERITA"];
export async function GET() { const { error } = await requireRole(ROLES); if (error) return error; return NextResponse.json({ data: await db.agenda.findMany({ orderBy: { startAt: "asc" } }) }); }
export async function POST(req: Request) {
  const { error, session } = await requireRole(ROLES); if (error) return error;
  const parsed = agendaSchema.safeParse(await req.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Periksa judul dan waktu agenda", issues: parsed.error.flatten() }, { status: 400 });
  const v = parsed.data; const item = await db.agenda.create({ data: { ...v, startAt: new Date(v.startAt), endAt: v.endAt ? new Date(v.endAt) : null } });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "AGENDA_CREATE", detail: item.title }); return NextResponse.json(item, { status: 201 });
}
