import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { spmbPeriodSchema } from "@/lib/validators";

const ROLES = ["SUPERADMIN", "OPERATOR_SPMB"];

export async function GET(req: Request) {
  const admin = new URL(req.url).searchParams.get("admin") === "1";
  if (admin) { const { error } = await requireRole(ROLES); if (error) return error; }
  const data = await db.sPMBPeriod.findMany({
    where: admin ? undefined : { active: true }, orderBy: [{ year: "desc" }, { openAt: "desc" }],
    include: { _count: { select: { applicants: true } } },
  });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const { error, session } = await requireRole(ROLES); if (error) return error;
  const parsed = spmbPeriodSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Data periode tidak valid", issues: parsed.error.flatten() }, { status: 400 });
  const period = await db.sPMBPeriod.create({ data: parsed.data });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "SPMB_PERIOD_CREATE", detail: period.name });
  return NextResponse.json(period, { status: 201 });
}
