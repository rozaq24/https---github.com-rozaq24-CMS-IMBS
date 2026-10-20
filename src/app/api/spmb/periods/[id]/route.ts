import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { spmbPeriodUpdateSchema } from "@/lib/validators";

const ROLES = ["SUPERADMIN", "OPERATOR_SPMB"];
type Ctx = { params: { id: string } };
export async function PATCH(req: Request, { params }: Ctx) {
  const { error, session } = await requireRole(ROLES); if (error) return error;
  const parsed = spmbPeriodUpdateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success || !Object.keys(parsed.data || {}).length) return NextResponse.json({ error: "Data periode tidak valid" }, { status: 400 });
  try {
    const current = await db.sPMBPeriod.findUnique({ where: { id: params.id } });
    if (!current) return NextResponse.json({ error: "Periode tidak ditemukan" }, { status: 404 });
    const openAt = parsed.data.openAt ?? current.openAt; const closeAt = parsed.data.closeAt ?? current.closeAt;
    if (closeAt < openAt) return NextResponse.json({ error: "Tanggal penutupan harus setelah pembukaan" }, { status: 400 });
    const period = await db.sPMBPeriod.update({ where: { id: params.id }, data: parsed.data });
    await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "SPMB_PERIOD_UPDATE", detail: period.name });
    return NextResponse.json(period);
  } catch { return NextResponse.json({ error: "Periode tidak ditemukan atau tanggal tidak valid" }, { status: 404 }); }
}
export async function DELETE(req: Request, { params }: Ctx) {
  const { error, session } = await requireRole(["SUPERADMIN"]); if (error) return error;
  try {
    const period = await db.sPMBPeriod.delete({ where: { id: params.id } });
    await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "SPMB_PERIOD_DELETE", detail: period.name });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Periode berisi pendaftar dan tidak dapat dihapus. Tutup periode saja." }, { status: 409 }); }
}
