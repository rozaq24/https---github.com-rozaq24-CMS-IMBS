import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { spmbDecisionSchema } from "@/lib/validators";

const ROLES = ["SUPERADMIN", "OPERATOR_SPMB"];
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(ROLES); if (error) return error;
  const parsed = spmbDecisionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Keputusan pendaftaran tidak valid" }, { status: 400 });
  try {
    const applicant = await db.sPMBApplicant.update({ where: { id: params.id }, data: { ...parsed.data, verifiedBy: session!.user.id, verifiedAt: new Date() } });
    await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "SPMB_APPLICANT_DECISION", detail: `${applicant.code}:${applicant.status}` });
    return NextResponse.json({ id: applicant.id, code: applicant.code, status: applicant.status, note: applicant.note });
  } catch { return NextResponse.json({ error: "Pendaftar tidak ditemukan" }, { status: 404 }); }
}
